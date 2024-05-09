import { auth, provider, db } from '../firebase'; // Ensure db is imported if not already
import { signInWithPopup } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore'; // Make sure to import Firestore methods // For redirection

export const signInWithGoogle = async (signIn, handleToast) => {
  provider.setCustomParameters({
    hd: 'ashoka.edu.in'
  });

  try {
    const result = await signInWithPopup(auth, provider);
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

      // Creating new chat
      const newChat = {
        name: "New Chat",
        user: user.email,
        data: []
      };
      const docRef = await addDoc(collection(db, "chats"), newChat);
      
      // Redirect to the chat page with the new chat ID
      setTimeout(() => {
        window.location = `/chat/${docRef.id}`;
      }, 3000);
    } else {
      await auth.signOut();
      handleToast({
        title: "Login Failed",
        description: "Access restricted to Ashoka University accounts only.",
        status: "error"
      });
    }
  } catch (error) {
    console.error("Authentication error", error);
    handleToast({
      title: "Authentication Error",
      description: `Failed to sign in: ${error.message}`,
      status: "error"
    });
  }
};
