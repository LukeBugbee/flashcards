// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

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

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { auth, db };
