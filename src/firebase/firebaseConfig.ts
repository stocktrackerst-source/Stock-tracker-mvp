import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDs1q0hGh15kQ8JvuuzZnVRJ3XZnIQBB9Q",
  authDomain: "stock-tracker-mvp-de099.firebaseapp.com",
  projectId: "stock-tracker-mvp-de099",
  storageBucket: "stock-tracker-mvp-de099.appspot.com",
  messagingSenderId: "309654323720",
  appId: "1:309654323720:web:3c8da6a81d61513ae8c7bd"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
