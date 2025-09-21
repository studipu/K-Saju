// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDILkmx4NRAMuwZv8E-ffgvAq8wB4nuZms",
  authDomain: "k-saju-ku.firebaseapp.com",
  projectId: "k-saju-ku",
  storageBucket: "k-saju-ku.firebasestorage.app",
  messagingSenderId: "930142214631",
  appId: "1:930142214631:web:11cfebb8a2164fb9cd0542"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

export { app, auth, storage, db };