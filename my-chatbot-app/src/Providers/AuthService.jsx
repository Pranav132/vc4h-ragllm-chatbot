// src/Providers/AuthService.js
import { auth, provider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

export const signInWithGoogle = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access Google APIs.
      console.log(result);
      window.location = "/chat" // Redirect to chat screen on success
    })
    .catch((error) => {
      // Handle Errors here.
      console.error("Authentication error", error);
    });
};
