// add apis here
import axiosInstance from "./axiosInstance";

export const postData = async (text, tone) => {
  try {
    await axiosInstance.post(process.env.NEXT_PUBLIC_START_CALL_ROUTE, { text: text, tone: tone });
  } catch (error) {
    throw error;
  }
};
