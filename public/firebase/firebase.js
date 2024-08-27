// src/firebase.js
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-analytics.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-storage.js";
import { getMessaging } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC4sYKSXuf6m1dxExPCHqLYGtn131qpaJU",
  authDomain: "atp-security.firebaseapp.com",
  projectId: "atp-security",
  storageBucket: "atp-security.appspot.com",
  messagingSenderId: "733169945155",
  appId: "1:733169945155:web:337c411cbd4387b3eea2f6",
  measurementId: "G-TKHNPM29PZ",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const storage = getStorage(app);
const messaging = getMessaging(app);

// Set authentication state persistence
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Auth state persistence set to LOCAL");
  })
  .catch((error) => {
    console.error("Error setting auth state persistence:", error);
  });

export { app, db, auth, analytics, storage, messaging };
