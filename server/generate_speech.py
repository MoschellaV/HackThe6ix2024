import requests
import os

CHUNK_SIZE = 1024
eleven_labs_api_key = os.getenv('ELEVEN_LABS_API_KEY')

def text_to_speech(input_text, voice_id):
        url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"

        headers = {
            "Accept": "audio/mpeg",
            "Content-Type": "application/json",
            "xi-api-key": eleven_labs_api_key
        }

        data = {
            "text": input_text,
            "model_id": "eleven_monolingual_v1",
            "voice_settings": {
                "stability": 0.5,
                "similarity_boost": 0.5
            }
        }

        response = requests.post(url, json=data, headers=headers)
        with open('output.mp3', 'wb') as f:
                for chunk in response.iter_content(chunk_size=CHUNK_SIZE):
                        if chunk:
                                f.write(chunk)