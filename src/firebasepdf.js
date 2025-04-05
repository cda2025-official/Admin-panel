import { initializeApp, getApp, getApps } from "firebase/app";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyCdnGkj2VH3qOBe46MQ-4DxA3cASYmcnuU",
    authDomain: "chintamani-decor.firebaseapp.com",
    projectId: "chintamani-decor",
    storageBucket: "chintamani-decor.firebasestorage.app",
    messagingSenderId: "229678419182",
    appId: "1:229678419182:web:8ef2c3fd0728bdbaeb77ff",
    measurementId: "G-38ZJT01Y0Z"
  };
  
// Check if there are any initialized apps
let app;
if (getApps().length === 0) {
    app = initializeApp(firebaseConfig); // Initialize app only if none exists
} else {
    app = getApp(); // Use the existing app
}

// Get a reference to Firestore and Firebase Storage
const storage = getStorage(app);
const db = getFirestore(app);

export { storage, db, ref, uploadBytes };

