'''
Activate virtual environment: source env/bin/activate
To run server: uvicorn main:app --reload       
'''

from fastapi import FastAPI, Request, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import openai
from dotenv import load_dotenv
import os
from twilio.rest import Client
from twilio.twiml.voice_response import VoiceResponse
from google.cloud import speech_v1p1beta1 as speech
import firebase_admin
from firebase_admin import initialize_app, firestore, credentials, storage

cred = credentials.Certificate('./service-account-key.json')
initialize_app(cred)

db = firestore.client()
bucket = storage.bucket("hackthe6ix-83702.appspot.com")


from generate_text import generate_text
from generate_speech import text_to_speech
from utils import check_string_length
from db.operations import upload_audio, update_completion_status

load_dotenv()

account_sid = os.getenv('TWILIO_ACCOUNT_SID')
auth_token = os.getenv('TWILIO_AUTH_TOKEN')
twilio_number = os.getenv('TWILIO_PHONE_NUMBER')

openai.api_key = os.getenv('OPENAI_API_KEY')

eleven_labs_api_key = os.getenv('ELEVEN_LABS_API_KEY')

client = Client(account_sid, auth_token)

class RequestModel(BaseModel):
    id: str
    prompt: str
    tone: str
    phoneNumber: str
    purpose: str
    voice: str
    lengthOfCall: str

app = FastAPI()

origins = [
    "http://localhost:3000",  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/start-call")
async def start_call(req: RequestModel, background_tasks: BackgroundTasks):
    data = req.dict()
    update_completion_status(data["id"], "Generating custom message")
    initial_response = generate_text(data["prompt"], data["tone"], data["purpose"], data["lengthOfCall"])
    check_string_length(initial_response.content, 10000)

    print(initial_response.content)
    update_completion_status(data["id"], "Creating speech")
    audio_file = text_to_speech(initial_response.content, data["voice"], eleven_labs_api_key)

    file_path = upload_audio(audio_file, bucket)
    print(file_path)
    twiml = VoiceResponse()
    twiml.play(file_path)

    update_completion_status(data["id"], "Making call")
    call = client.calls.create(
            to=req.phoneNumber,
            from_=twilio_number,
            twiml=twiml
    )
    print(call.sid)
    return {"message": "Call initiated", "call_sid": call.sid}
    