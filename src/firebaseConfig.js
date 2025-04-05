import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// İleride kimlik doğrulama eklersek: import { getAuth } from "firebase/auth";

// Firebase yapılandırmasını .env dosyasından al
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Firebase'i başlat
const app = initializeApp(firebaseConfig);

// Firestore veritabanı örneğini al ve dışa aktar
const db = getFirestore(app);

// Authentication örneğini al ve dışa aktar
const auth = getAuth(app);

// İleride kimlik doğrulama eklersek: const auth = getAuth(app);

export { db, auth }; // auth'u dışa aktar
