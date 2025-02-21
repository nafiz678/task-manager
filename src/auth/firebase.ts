// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDgtVK_PaSCAh4SUmguhCXB8mRW0s1x9E4",
  authDomain: "task-manager-dnd-bc0a8.firebaseapp.com",
  projectId: "task-manager-dnd-bc0a8",
  storageBucket: "task-manager-dnd-bc0a8.firebasestorage.app",
  messagingSenderId: "425949665145",
  appId: "1:425949665145:web:a7e8873a9325feca8dc1a8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);