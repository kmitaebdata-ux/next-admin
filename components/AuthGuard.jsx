"use client";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebaseClient";

import { useEffect, useState } from "react";

export default function AuthGuard({ children, role }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        window.location.replace("/login");
        return;
      }

      const token = await user.getIdTokenResult();
      if (role && !token.claims[role]) {
        window.location.replace("/login");
        return;
      }

      setLoading(false);
    });

    return () => unsub();
  }, [role]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Checking session…
      </div>
    );
  }

  return children;
}
