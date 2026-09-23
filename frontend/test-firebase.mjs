import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

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
const auth = getAuth(app);

async function testAuth() {
  try {
    // We expect this to fail with user-not-found or invalid-credential, NOT configuration-not-found
    await signInWithEmailAndPassword(auth, "test@test.com", "password123");
  } catch (error) {
    if (error.code === 'auth/configuration-not-found') {
      console.log("FAIL: Auth is still not configured.");
    } else if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found') {
      console.log("SUCCESS: Auth is configured correctly! (Expected login failure due to fake user)");
    } else {
      console.log("OTHER ERROR:", error.code);
    }
    process.exit(0);
  }
}

testAuth();
