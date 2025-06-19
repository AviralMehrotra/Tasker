import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.FIREBASE_API,
  authDomain: "tasker-2002.firebaseapp.com",
  projectId: "tasker-2002",
  storageBucket: "tasker-2002.firebasestorage.app",
  messagingSenderId: "376760771764",
  appId: "1:376760771764:web:e9b78e619662a0da73a3e1",
  measurementId: "G-HX43JWKRF7",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
