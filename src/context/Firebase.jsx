import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Firebase Authentication
import { getFirestore } from "firebase/firestore"; // Firestore Database

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD5BVjVqD4DU7MRe5AiTw_koMPpw2Le-mA",
  authDomain: "bookstracking-57aa2.firebaseapp.com",
  projectId: "bookstracking-57aa2",
  storageBucket: "bookstracking-57aa2.appspot.com",
  messagingSenderId: "230116726509",
  appId: "1:230116726509:web:918cc28511d68e5af5dee4",
  measurementId: "G-PY9V4HHTNW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Initialize Firebase Auth
const db = getFirestore(app); // Initialize Firestore Database

export { app, auth, db };
