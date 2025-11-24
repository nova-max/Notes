import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDbI5vndQaAzo0UETHb6ZJVeWaAy2YrceY",
    authDomain: "reservas-f34a0.firebaseapp.com",
    projectId: "reservas-f34a0",
    storageBucket: "reservas-f34a0.firebasestorage.app",
    messagingSenderId: "827449642714",
    appId: "1:827449642714:web:273216fa7c6b8423679fe3",
    measurementId: "G-GBMM2PLNVC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };
