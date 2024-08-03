import { auth } from "@/firebase/firebaseAdmin";

const verifyIdToken = async token => {
  try {
    const decodedToken = await auth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error("Error verifying ID token:", error);
    throw error;
  }
};

export const authenticateRequest = async request => {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { error: "Invalid Authorization", status: 401 };
  }

  const idToken = authHeader.split(" ")[1];
  try {
    const decodedToken = await verifyIdToken(idToken);
    return { userId: decodedToken.uid };
  } catch (error) {
    return { error: "Unauthorized", status: 401 };
  }
};
