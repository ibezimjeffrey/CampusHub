
import { initializeApp, getApp,getApps } from "firebase/app";
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"




const firebaseConfig = {
  apiKey: "AIzaSyAFPWSwqm8T4Ie4fGDlCrPuUHFEz_9qCXI",
  authDomain: "campushub-a0853.firebaseapp.com",
  projectId: "campushub-a0853",
  storageBucket: "campushub-a0853.appspot.com",
  messagingSenderId: "705288717163",
  appId: "1:705288717163:web:7f0a2d5327d917709fc22e"
};

const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);

const firebaseAuth = getAuth(app);
const firestoreDB = getFirestore(app);

export {app, firebaseAuth, firestoreDB};