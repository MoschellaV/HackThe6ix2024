def check_string_length(input_string, max_length):
    if len(input_string) > max_length:
        raise ValueError(f"The input string is too long. It should be no more than {max_length} characters.")
    
def get_recording(client, call_sid):
    recordings = client.recordings.list(call_sid=call_sid)

    # Get the first recording
    if recordings:
        recording = recordings[0]
        print(recording.uri)

        # The recording URI can be used to play back the recording
        return recording.uri
    else:
        print("No recordings found for this call.")
        return None