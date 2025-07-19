// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics"
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBDUMsUUi4XZERRGOG17bbYMrF8EZcbe4Y",
  authDomain: "farmer-market-israel.firebaseapp.com",
  projectId: "farmer-market-israel",
  storageBucket: "farmer-market-israel.firebasestorage.app",
  messagingSenderId: "154609091887",
  appId: "1:154609091887:web:8f90ec224337f282c00dda",
  measurementId: "G-BJNHH9N1PN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Инициализируем Analytics только в браузере
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}