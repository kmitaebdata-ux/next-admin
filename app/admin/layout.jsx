"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../lib/firebaseClient";
import AdminSidebar from "../../components/AdminSidebar";

export default function AdminLayout({ children }) {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      if (!user) {
        window.location.href = "/login";
        return;
      }

      const token = await user.getIdTokenResult();
      if (!token.claims.admin) {
        window.location.href = "/login";
        return;
      }

      setAllowed(true);
    });
  }, []);

  if (!allowed) return null;

  return (
    <div className="flex min-h-screen bg-slate-900 text-white">
      <AdminSidebar />
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}
