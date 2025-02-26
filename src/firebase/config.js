import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDPTwMtNIjBmtOyb6HVTYj4Yl34SFz_M9M",
  authDomain: "books-data-33012.firebaseapp.com",
  projectId: "books-data-33012",
  storageBucket: "books-data-33012.firebasestorage.app",
  messagingSenderId: "328994198662",
  appId: "1:328994198662:web:fd98ef092f8759a767ed07",
};

initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export { auth, db };
