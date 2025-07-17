// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB6dPPkjPQXng8Vyc-qLz67tv1RP2lJYWE",
    authDomain: "setscout-3e587.firebaseapp.com",
    projectId: "setscout-3e587",
    storageBucket: "setscout-3e587.firebasestorage.app",
    messagingSenderId: "384082948481",
    appId: "1:384082948481:web:aa6753ac4b75d07c3d3880",
    measurementId: "G-XCFC8HF4LK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);