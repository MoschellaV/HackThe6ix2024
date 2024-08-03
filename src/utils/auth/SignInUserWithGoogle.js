import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/firebase/firebaseConfig';

export const signInUserWithGoogle = async () => {
  /*
    signs in user and signs up user with google
    */

  const provider = new GoogleAuthProvider();

  try {
    const response = await signInWithPopup(auth, provider);

    return { data: response, message: 'success' };
  } catch (error) {
    console.error(error);
    return { message: 'Error' };
  }
};
