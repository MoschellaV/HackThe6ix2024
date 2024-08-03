// add apis here
import axiosInstance from "./axiosInstance";

export const postData = async text => {
  try {
    await axiosInstance.post("api/generate-text", { text: text });
  } catch (error) {
    throw error;
  }
};
