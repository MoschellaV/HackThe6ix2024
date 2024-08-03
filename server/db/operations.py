import os
import base64
import xml.etree.ElementTree as ET
import uuid
import datetime

def upload_audio( file_path, bucket):
    unique_filename = str(uuid.uuid4()) + "-" + file_path

    blob = bucket.blob(unique_filename)
    blob.upload_from_filename(file_path)

    blob.metadata = {
        "firebaseStorageDownloadTokens": str(uuid.uuid4())
    }
    blob.content_type = 'audio/mpeg'
    blob.patch()

    blob.make_public()

    url = blob.generate_signed_url(
        version="v4",
        expiration=datetime.timedelta(hours=3),
        method="GET"
    )

    return url