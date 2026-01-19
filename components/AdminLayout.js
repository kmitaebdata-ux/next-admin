import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Sidebar from "./Sidebar.js";

export default function AdminLayout({ title, subtitle, children }) {
  const router = useRouter();
  const auth = getAuth();

  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
        return;
      }

      const token = await user.getIdTokenResult();

      // CHECK ADMIN CLAIM
      if (!token.claims.admin) {
        router.push("/login");
        return;
      }

      setAllowed(true);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // STILL CHECKING AUTH → Render nothing
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If not allowed (redirect happened)
  if (!allowed) return null;

  // ✔ ADMIN AUTH SUCCESS → Now render the layout
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200">
      <Sidebar />

      <main className="flex-1 p-10">
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-slate-100">{title}</h2>
          {subtitle && (
            <p className="text-slate-400 text-sm mt-1">{subtitle}</p>
          )}
        </div>

        {children}
      </main>
    </div>
  );
}
