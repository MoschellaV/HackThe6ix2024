from openai import OpenAI

MODEL = "gpt-4o-mini"

def generate_text(prompt, tone, purpose):
    try:
        client = OpenAI()

        completion = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": return_response(prompt, tone, purpose)}
            ],
            # response_format={ "type": "json_object" }
        )
            
        gpt_response = completion.choices[0].message

        if gpt_response:
            return gpt_response
        
    except Exception as e:
        print("Error generating start:", e)
        return {"error": "Internal Server Error"}
    
def return_response(prompt, tone, purpose):
    response = ""

    if tone:
        prompt += f"\nTone: {tone} "

    if purpose:
        prompt += f"\nPurpose: {purpose} "

    response += f"""

        {prompt}

        """
    return response