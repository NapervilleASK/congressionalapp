// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAzbjFNG3dFJudB4PweV3_ChlI367RGL84",
  authDomain: "ecosense-5aae1.firebaseapp.com",
  projectId: "ecosense-5aae1",
  storageBucket: "ecosense-5aae1.appspot.com",
  messagingSenderId: "670437735508",
  appId: "1:670437735508:web:3440ca630ba188c2e9c1c1"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app);