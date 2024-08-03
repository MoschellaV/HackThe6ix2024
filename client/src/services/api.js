// add apis here
import axiosInstance from "./axiosInstance";

export const postData = async (prompt, tone, phoneNumber, purpose) => {
  try {
    await axiosInstance.post(process.env.NEXT_PUBLIC_START_CALL_ROUTE, {
      prompt: prompt,
      tone: tone,
      phoneNumber: phoneNumber,
      purpose: purpose
    });
  } catch (error) {
    throw error;
  }
};
