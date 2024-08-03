'''
Activate virtual environment: source env/bin/activate
To run server: uvicorn main:app --reload       
'''

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import openai
from dotenv import load_dotenv
import os
from twilio.rest import Client

from generate_text import generate_text
from generate_speech import text_to_speech

load_dotenv()

account_sid = os.getenv('TWILIO_ACCOUNT_SID')
auth_token = os.getenv('TWILIO_AUTH_TOKEN')
twilio_number = os.getenv('TWILIO_PHONE_NUMBER')

openai.api_key = os.getenv('OPENAI_API_KEY')

eleven_labs_api_key = os.getenv('ELEVEN_LABS_API_KEY')

client = Client(account_sid, auth_token)

class RequestModel(BaseModel):
    prompt: str
    tone: str
    phoneNumber: str
    purpose: str


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
async def root(req: RequestModel):

    data = req.dict()
    # response = generate_text(data["prompt"], data["tone"], data["purpose"])
    # print(response)

    response = text_to_speech("This is just a test", "onwK4e9ZLuTAKqWW03F9")
    return {"message": response}
