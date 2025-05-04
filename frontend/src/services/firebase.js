// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "workflo-37ed4.firebaseapp.com",
  projectId: "workflo-37ed4",
  storageBucket: "workflo-37ed4.firebasestorage.app",
  messagingSenderId: "930980181310",
  appId: "1:930980181310:web:9539731c520857e736686f"
};

// Initialize Firebase with popup settings
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
auth.useDeviceLanguage();

// Configure Google provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');