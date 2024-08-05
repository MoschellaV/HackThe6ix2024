import os
from firebase_functions import https_fn
from firebase_admin import initialize_app, firestore, credentials, storage
from twilio.rest import Client
from twilio.twiml.voice_response import VoiceResponse
from google.cloud import speech_v1p1beta1 as speech
import openai
from dotenv import load_dotenv
import requests
import json

load_dotenv()

cred = credentials.Certificate('./service-account-key.json')
initialize_app(cred)

from generate_text import generate_text
from generate_speech import text_to_speech
from utils import check_string_length
from db.operations import upload_audio, update_completion_status, update_recording_url, update_field

db = firestore.client()
bucket = storage.bucket("hackthe6ix-83702.appspot.com")

account_sid = os.getenv('TWILIO_ACCOUNT_SID')
auth_token = os.getenv('TWILIO_AUTH_TOKEN')
twilio_number = os.getenv('TWILIO_PHONE_NUMBER')

openai.api_key = os.getenv('OPENAI_API_KEY')

eleven_labs_api_key = os.getenv('ELEVEN_LABS_API_KEY')

client = Client(account_sid, auth_token)

@https_fn.on_request()
def start_call(req: https_fn.Request) -> https_fn.Response:
    if req.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',  
            'Access-Control-Allow-Methods': 'POST', 
            'Access-Control-Allow-Headers': 'Content-Type', 
            'Access-Control-Max-Age': '3600',
        }
        return ('', 204, headers)

    headers = {
        'Access-Control-Allow-Origin': '*',
    }

    try:
        data = req.get_json(silent=True)
        if data is None:
            return {"message": "No data provided"}
        phoneNumber = data.get('phoneNumber')
        if phoneNumber is None:
            return {"message": "No phoneNumber provided"}
    
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
        twiml.pause(length=1) # 1 sec delay
        twiml.play(file_path)

        update_completion_status(data["id"], "Making call")
        call = client.calls.create(
                to=phoneNumber,
                from_=twilio_number,
                twiml=twiml,
        )

        return https_fn.Response(
                json.dumps({"message": "Call initiated", "call_sid": str(call.sid)}),
                status=200,
                mimetype="application/json",
                headers=headers
            )
    except Exception as e:
        print("Error analyzing syllabus:", e)
        return https_fn.Response(
            json.dumps({"error": "Internal Server Error", "details": str(e)}),
            status=500,
            mimetype="application/json",
            headers=headers
        )
    