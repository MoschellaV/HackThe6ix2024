import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// initialize Firebase
let app;
if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp();
}

// db
const db = getFirestore(app);
export { db };

// use auth
const auth = getAuth();
export { auth };

// functions
const functions = getFunctions(app, "us-central1");
export { functions };

// analytics
let analytics;
if (typeof window != "undefined") {
    analytics = getAnalytics(app);
}
export { analytics };
