"use client";

import { useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../lib/firebaseClient";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Refresh token to get latest custom claims
      await result.user.getIdToken(true);
      const token = await result.user.getIdTokenResult();

      if (token.claims.admin) {
        window.location.replace("/admin");
      } else if (token.claims.faculty) {
        window.location.replace("/faculty");
      } else {
        alert("No role assigned. Contact admin.");
        await auth.signOut();
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg min-h-screen flex items-center justify-center px-4">
      <div className="glass-card">
        {/* Logo */}
        <div className="mb-4">
          <div className="logo-circle">KMIT</div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-semibold text-white mb-1">
          KMIT Marks Portal
        </h1>

        <p className="text-white/70 mb-8">
          Admin / Faculty Login
        </p>

        {/* Login Button */}
        <button
          onClick={login}
          disabled={loading}
          className="google-btn w-full max-w-xs"
        >
          {loading ? "Signing in…" : "Login with Google"}
        </button>
      </div>
    </div>
  );
}
