// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBXWJCcVHu_gHNn7ec1ILqhlK5TUGPMiLw",
    authDomain: "ragllm-chatbot-vc4h.firebaseapp.com",
    projectId: "ragllm-chatbot-vc4h",
    storageBucket: "ragllm-chatbot-vc4h.appspot.com",
    messagingSenderId: "726311774821",
    appId: "1:726311774821:web:2691818fc20923c715b48c"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  'hd': 'ashoka.edu.in'  // Restricts to your educational domain
});

export { auth, provider };
