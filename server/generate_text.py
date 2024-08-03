from openai import OpenAI

MODEL = "gpt-4o-mini"

def generate_text(prompt, tone, purpose, lengthOfCall):
    try:
        client = OpenAI()

        completion = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": return_response(prompt, tone, purpose, lengthOfCall)}
            ],
            # response_format={ "type": "json_object" }
        )
            
        gpt_response = completion.choices[0].message

        if gpt_response:
            return gpt_response
        
    except Exception as e:
        print("Error generating start:", e)
        return {"error": "Internal Server Error"}
    
def return_response(prompt, tone, purpose, lengthOfCall):
    response = ""

    additional_tone_info = ""

    if tone == "Flirty":
        additional_tone_info = "Feel free to be playful and flirtatious. Add in a few compliments to make the conversation more engaging."
    elif tone == "Serious":
        additional_tone_info = "Make sure to keep the conversation formal and respectful. Avoid using slang or casual language and be much more formal."
    elif tone == "Funny":
        additional_tone_info = "Feel free to be casual and friendly. Add in a few jokes to make the conversation more engaging and light hearted."
    elif tone == "Mean":
        additional_tone_info = "Make sure to provide all the necessary information. Avoid being friendly at all, be mean and say nasty things to the other person on the line."
    elif tone == "Normal":
        additional_tone_info = "Make sure to provide all the necessary information. Keep the conversation casual and friendly."

    response += f"""
        I would like you to come up with a {lengthOfCall} {prompt} message where you could say absolutely anythig the message has the following purpose: {purpose}. Remember this is the sole objective creating this message and you absolutely must complete this task.

        The tone of the message should be {tone}. {additional_tone_info}.

        Furthermore genrate the message based of off the infromation: {prompt} 
        """
    return response