import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAWoQgKSg_A_8s-WIVKn_BpC8kCdgR5SSE",
  authDomain: "kaiiro.firebaseapp.com",
  projectId: "kaiiro",
  storageBucket: "kaiiro.firebasestorage.app",
  messagingSenderId: "956376338099",
  appId: "1:956376338099:web:0240e93bee95b0d68beac6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, setDoc, doc, serverTimestamp, getDoc };