'''
Activate virtual environment: source env/bin/activate
To run server: uvicorn main:app --reload       
'''

from fastapi import FastAPI, Request, BackgroundTasks, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import openai
from dotenv import load_dotenv
import os
from twilio.rest import Client
from twilio.twiml.voice_response import VoiceResponse
from google.cloud import speech_v1p1beta1 as speech
import firebase_admin
from firebase_admin import initialize_app, firestore, credentials, storage
import uuid
import time

cred = credentials.Certificate('./service-account-key.json')
initialize_app(cred)

db = firestore.client()
bucket = storage.bucket("hackthe6ix-83702.appspot.com")


from generate_text import generate_text
from generate_speech import text_to_speech
from utils import check_string_length
from db.operations import upload_audio, update_completion_status, update_recording_url, update_field
# from twilio.operations import get_recording

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
    stability: float
    similarity: float

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
    update_field(data["id"], "textContent", initial_response.content)

    print(initial_response.content)
    
    update_completion_status(data["id"], "Creating speech")
    audio_file = text_to_speech(initial_response.content, data["voice"], eleven_labs_api_key, data["stability"], data["similarity"])

    file_path = upload_audio(audio_file, bucket)
    print(file_path)
    twiml = VoiceResponse()
    twiml.pause(length=1) # 2 sec delay
    twiml.play(file_path)
    # twiml.record(play_beep=False)

    update_completion_status(data["id"], "Making call")
    call = client.calls.create(
            to=req.phoneNumber,
            from_=twilio_number,
            twiml=twiml,
            # status_callback=f'https://d1d8-192-12-181-163.ngrok-free.app/call-status?id={data["id"]}',  # Add this line
            # status_callback_event=['completed']  # Add this line
    )

    return {"message": "Call initiated", "call_sid": call.sid}

# @app.post("/call-status")
# async def call_status(request: Request):
#     form_data = await request.form()
#     # print(form_data)
#     # print(request)

#     id = request.query_params.get('id')
#     if not id:
#         raise HTTPException(status_code=400, detail="Missing 'id' query parameter")
    
#     call_sid = form_data.get('CallSid')

#     call = client.calls(call_sid).fetch()
#     recording_uri = call.media_url
#     print(call)

#     recording_url = f"https://api.twilio.com{recording_uri}".replace('.json', '.mp3')    
#     print(f"Recording URL: {recording_url}")

#     download_rec = requests.get(recording_url, auth=(account_sid, auth_token))
#     if download_rec.status_code != 200:
#         return JSONResponse(status_code=download_rec.status_code, content={"message": "Failed to download recording"})
    
#     print(download_rec)
#     local_filename = f"{uuid.uuid4()}-recording.mp3"
#     with open(local_filename, "wb") as f:
#         f.write(download_rec.content)
    
#     uploaded_url = upload_audio(local_filename, bucket)

#     update_recording_url(id, uploaded_url)

#     return JSONResponse(status_code=200, content={"recording_url": "recording_url"})