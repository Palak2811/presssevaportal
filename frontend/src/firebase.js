import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCx9nx0DeIdZORtXhERTBV0Q-n9W7bNm1s",
  authDomain: "presssevaportal.firebaseapp.com",
  projectId: "presssevaportal",
  storageBucket: "presssevaportal.firebasestorage.app",
  messagingSenderId: "913924759341",
  appId:"1:913924759341:web:ffc01114ba71202e7bfda4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
