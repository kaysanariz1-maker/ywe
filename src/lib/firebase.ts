import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Injected configuration from the platform provisioning
const firebaseConfig = {
  apiKey: "AIzaSyCrjr9KR0pxLd2FKOyj5A2fwmRvJV_toN4",
  authDomain: "dev-bongo-bwjrd.firebaseapp.com",
  projectId: "dev-bongo-bwjrd",
  storageBucket: "dev-bongo-bwjrd.firebasestorage.app",
  messagingSenderId: "1016669711249",
  appId: "1:1016669711249:web:d58983e528fdf2a4110830"
};

const app = initializeApp(firebaseConfig);

// Initialize Firestore with the custom databaseId provided in our config
export const db = getFirestore(app, "ai-studio-believersignecom-77e430be-43d9-4be0-9b59-126639f1fa4b");

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Standard scopes for user profile details
googleProvider.addScope('email');
googleProvider.addScope('profile');
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export { signInWithPopup, signInWithRedirect, getRedirectResult, signOut, GoogleAuthProvider };
