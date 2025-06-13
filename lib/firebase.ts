import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBsZIgtnMvjeNSCYWTJbJ5ewDTa1R5I6uE",
  authDomain: "unagi-51606.firebaseapp.com",
  projectId: "unagi-51606",
  storageBucket: "unagi-51606.firebasestorage.app",
  messagingSenderId: "920003928825",
  appId: "1:920003928825:web:a768179297b8141362b828"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

export { app, auth }; 