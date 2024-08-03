import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";

export const logOutUser = () => {
    signOut(auth)
        .then(() => {
            // success
            localStorage.clear();
        })
        .catch((error) => {
            console.error(error);
        });
};
