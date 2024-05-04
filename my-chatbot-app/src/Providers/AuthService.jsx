import { auth, provider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

export const signInWithGoogle = (signIn, handleToast) => {
  provider.setCustomParameters({
    hd: 'ashoka.edu.in'
  });

  signInWithPopup(auth, provider)
    .then((result) => {
      const { user } = result;
      const { email, uid, displayName, photoURL } = user;
      if (email && email.endsWith('@ashoka.edu.in')) {
        console.log("Authentication successful", result);
        const userData = { email, uid, displayName, photoURL };
        signIn(userData);
        handleToast({
          title: "Login Successful",
          description: "Welcome to VC4H RAG LLM ChatBot!",
          status: "success"
        });
        setTimeout(() => {
          window.location = "/chat";
        }, 3000);
      } else {
        auth.signOut();
        handleToast({
          title: "Login Failed",
          description: "Access restricted to Ashoka University accounts only.",
          status: "error"
        });
      }
    })
    .catch((error) => {
      console.error("Authentication error", error);
      handleToast({
        title: "Authentication Error",
        description: `Failed to sign in: ${error.message}`,
        status: "error"
      });
    });
};
