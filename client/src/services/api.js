// add apis here
import axiosInstance from "./axiosInstance";

export const postData = async (text, tone, phoneNumber, purpose) => {
  try {
    await axiosInstance.post(process.env.NEXT_PUBLIC_START_CALL_ROUTE, { 
      text: text, 
      tone: tone,
      phoneNumber: phoneNumber,
      purpose: purpose,
    });
  } catch (error) {
    throw error;
  }
};
