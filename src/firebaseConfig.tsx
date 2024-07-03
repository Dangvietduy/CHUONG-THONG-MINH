// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import {getFirestore} from 'firebase/firestore';


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
// const storage = getStorage(app);
const analytics = getAnalytics(app);
const auth = getAuth(app);

const firebaseApp = initializeApp(firebaseConfig); 
export const projectFirestore = getFirestore();
export const storage = getStorage();
export const firebaseAuth = getAuth(firebaseApp);
export const firebaseAnalytics = getAnalytics(firebaseApp);




export { auth };