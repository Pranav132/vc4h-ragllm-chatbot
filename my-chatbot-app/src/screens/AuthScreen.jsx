import { signInWithGoogle } from '../Providers/AuthService'; // Adjust path if necessary

function AuthScreen() {
  return (
    <div>
      <h1>Welcome to the Chat Bot App</h1>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
    </div>
  );
}

export default AuthScreen;
