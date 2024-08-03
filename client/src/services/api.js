// add apis here
import axios from "axios";

export const postData = async (prompt, tone, phoneNumber, purpose, voice, lengthOfCall) => {
  try {
    await axios.post(process.env.NEXT_PUBLIC_START_CALL_ROUTE, {
      prompt: prompt,
      tone: tone,
      phoneNumber: phoneNumber,
      purpose: purpose,
      voice: voice,
      lengthOfCall: lengthOfCall
    });
  } catch (error) {
    throw error;
  }
};
