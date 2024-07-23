// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBRdMUPXq_tBGfHJbaiUyY4GCR3YCbzV3s",
  authDomain: "zapcards-73879.firebaseapp.com",
  projectId: "zapcards-73879",
  storageBucket: "zapcards-73879.appspot.com",
  messagingSenderId: "539764479921",
  appId: "1:539764479921:web:cb0b088e374268f9250f90",
  measurementId: "G-5N7XT0K0QX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Google Sign-In function
const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

export { auth, db, signInWithGoogle };
