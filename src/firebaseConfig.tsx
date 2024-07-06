// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAmq8e1CtC2PaFQVIx3YN0UB15FG7yhlpo",
  authDomain: "chuong-thong-minh-v1.firebaseapp.com",
  projectId: "chuong-thong-minh-v1",
  storageBucket: "chuong-thong-minh-v1.appspot.com",
  messagingSenderId: "445984597810",
  appId: "1:445984597810:web:472c9fec3121a26845592b",
  measurementId: "G-81DVN9T1J0",
  databaseURL: "https://chuong-thong-minh-v1-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const analytics = getAnalytics(app);
const auth = getAuth(app);
const storage = getStorage(app);
const firestore = getFirestore(app);
firebase.initializeApp(firebaseConfig);

export { app, analytics, auth, storage, firestore };
