import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDUuW10TA2jJ_WcUPxV8MV0o6HZ3ACo1HM",
  authDomain: "safenest-dcffb.firebaseapp.com",
  projectId: "safenest-dcffb",
  storageBucket: "safenest-dcffb.firebasestorage.app",
  messagingSenderId: "560733713258",
  appId: "1:560733713258:web:9efc486848e2a32208ab13",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);