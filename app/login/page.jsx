"use client";

import { useState } from "react";
import { GoogleAuthProvider, signInWithPopup, setPersistence, browserLocalPersistence } from "firebase/auth";
import { auth } from "../../lib/firebaseClient";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      
      // Ensures the session persists even after closing the browser
      await setPersistence(auth, browserLocalPersistence);
      
      const result = await signInWithPopup(auth, provider);

      // Refresh token to get latest custom claims (admin/faculty roles)
      await result.user.getIdToken(true);
      const token = await result.user.getIdTokenResult();

      // Redirect logic based on Firebase Custom Claims
      if (token.claims.admin) {
        window.location.replace("/admin");
      } else if (token.claims.faculty) {
        window.location.replace("/faculty");
      } else {
        alert("No role assigned. Please contact the administrator.");
        await auth.signOut();
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please check your internet or Firebase configuration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-900 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-2xl text-center max-w-sm w-full">
        
        {/* Logo / Icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20">
            KMIT
          </div>
        </div>

        {/* Text Content */}
        <h1 className="text-3xl font-bold text-white mb-2">
          KMIT Marks Portal
        </h1>
        <p className="text-slate-300 mb-8">
          Admin / Faculty Login
        </p>

        {/* Google Login Button */}
        <button
          onClick={login}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-900 font-semibold py-3 px-6 rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none shadow-xl"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-slate-400 border-t-slate-900 rounded-full animate-spin"></div>
              Signing in...
            </span>
          ) : (
            <>
              <img 
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/smartlock/google.svg" 
                className="w-5 h-5" 
                alt="Google Logo" 
              />
              Login with Google
            </>
          )}
        </button>

        {/* Footer Note */}
        <p className="mt-8 text-xs text-slate-500">
          Authorized personnel only.
        </p>
      </div>
    </div>
  );
}