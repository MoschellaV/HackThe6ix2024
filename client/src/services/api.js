// add apis here
import axios from "axios";

export const saveCallData = async (prompt, tone, phoneNumber, purpose, voice, lengthOfCall) => {
  try {
    const response = await axios.post(`/api/create-call-data`, {
      prompt: prompt,
      tone: tone,
      phoneNumber: phoneNumber,
      purpose: purpose,
      voice: voice,
      lengthOfCall: lengthOfCall
    });

    return response;
  } catch (error) {
    throw error;
  }
};

export const postData = async (id, prompt, tone, phoneNumber, purpose, voice, lengthOfCall) => {
  try {
    await axios.post(process.env.NEXT_PUBLIC_START_CALL_ROUTE, {
      id: id,
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
