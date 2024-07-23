// LoginScreen.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithGoogle } from "../firebase";

function LoginScreen() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      setError(null);
      const result = await signInWithGoogle();
      console.log("User signed in:", result.user);
      // Redirect to dashboard or profile setup
      navigate.push("/dashboard");
    } catch (error) {
      console.error("Error signing in: ", error);
      setError("Failed to sign in. Please try again.");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <button onClick={handleSignIn}>Sign in with Google</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default LoginScreen;
