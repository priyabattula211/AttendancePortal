import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCrSv0fK_eE-vtini0DDs0d_azAzke0JyM",
  authDomain: "attendance-portal-b1c30.firebaseapp.com",
  projectId: "attendance-portal-b1c30",
  storageBucket: "attendance-portal-b1c30.firebasestorage.app",
  messagingSenderId: "381051757353",
  appId: "1:381051757353:web:65e4621cfc2a48a4558d38",
  measurementId: "G-8PQVE9EK51"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
