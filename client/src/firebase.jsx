// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estase.firebaseapp.com",
  projectId: "mern-estase",
  storageBucket: "mern-estase.appspot.com",
  messagingSenderId: "548004620250",
  appId: "1:548004620250:web:a381e9b3d9b628117d02e3",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
