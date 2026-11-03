import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBr4X5VhryqYjyCtYEdzBOhJIgG0F4zoNA",
  authDomain: "portfolio-841d7.firebaseapp.com",
  projectId: "portfolio-841d7",
  storageBucket: "portfolio-841d7.firebasestorage.app",
  messagingSenderId: "379304345091",
  appId: "1:379304345091:web:91a7855989eb4c858a1836",
  measurementId: "G-WHR5JSEHY7",
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
