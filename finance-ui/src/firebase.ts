import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: "AIzaSyBKIVcGGB-zgjnurXuYPm2DPISTVMHABuM",
    authDomain: "finance-app-b62c9.firebaseapp.com",
    projectId: "finance-app-b62c9",
    storageBucket: "finance-app-b62c9.firebasestorage.app",
    messagingSenderId: "714665007003",
    appId: "1:714665007003:web:bccc45a07a915e00cb733e",
    measurementId: "G-1RXG8TDQ84"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const messaging = getMessaging(app);
