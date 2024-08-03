import { auth } from "@/firebase/firebaseConfig";
import { sendPasswordResetEmail } from "firebase/auth";

export const resetPasswordEmail = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        return { message: "success" };
    } catch (error) {
        if (error.code === "auth/invalid-email") {
            return { message: "Email address is invalid" };
        }

        if (error.code === "auth/user-not-found") {
            return { message: "No user found with that email address" };
        }

        return { message: "Unknown error occurred." };
    }
};
