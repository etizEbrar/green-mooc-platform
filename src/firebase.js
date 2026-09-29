import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

export const firebaseConfig = {
  apiKey: "AIzaSyDkg-BUxAMKZ57bC0GmgSKJOhSt-b7Da1Q",
  authDomain: "green-mooc.firebaseapp.com",
  projectId: "green-mooc",
  storageBucket: "green-mooc.firebasestorage.app",
  messagingSenderId: "1086106477321",
  appId: "1:1086106477321:web:fa121459a5a167c17a69d8",
  measurementId: "G-938TR6VB5Z"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// Callable Cloud Functions. The region must match setGlobalOptions() in
// functions/index.js — a mismatch fails at call time, not at build time.
export const functions = getFunctions(app, "europe-west1");

export default app;