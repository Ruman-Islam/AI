// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA_yk4XCMI73CdeDiFCu9PBGYYV6rhabxI",
  authDomain: "ai-dashboard-dc00d.firebaseapp.com",
  projectId: "ai-dashboard-dc00d",
  storageBucket: "ai-dashboard-dc00d.appspot.com",
  messagingSenderId: "368791741245",
  appId: "1:368791741245:web:637b24523cf1a821b79b54",
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth();

export { app, auth };
