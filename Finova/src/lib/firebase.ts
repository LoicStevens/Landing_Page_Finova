import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBsEZ_wfvOfa2qyr-aaGunA0oJEwdZxwuc",
  authDomain: "finova-capital-d97aa.firebaseapp.com",
  projectId: "finova-capital-d97aa",
  storageBucket: "finova-capital-d97aa.firebasestorage.app",
  messagingSenderId: "11041119288",
  appId: "1:11041119288:web:1ca5751365be1184ecdacd",
  measurementId: "G-H90HH2TGKN"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
