import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAnalytics } from "firebase/analytics";
import { getAuth, isSignInWithEmailLink, signInWithEmailLink } from "firebase/auth";

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCzK6VLDNzk-bRmGEoLhJqGI2m_tN1GgIg",
    authDomain: "timetracker-a161a.firebaseapp.com",
    databaseURL: "https://timetracker-a161a-default-rtdb.firebaseio.com",
    projectId: "timetracker-a161a",
    storageBucket: "timetracker-a161a.appspot.com",
    messagingSenderId: "616521413698",
    appId: "1:616521413698:web:9215880f22ad8f1785e9db",
    measurementId: "G-FXEF1C2SC1"
  };
  
  const app = initializeApp(firebaseConfig);
  //const analytics = getAnalytics(app);
  export const auth = getAuth();
  export const database = getDatabase(app);