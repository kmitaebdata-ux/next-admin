
import { useEffect, useState } from "react";
import { auth } from "../lib/firebaseClient";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebaseClient";
import { useRouter } from "next/router";

export function useAdminGuard(requiredRole = "ADMIN") {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (!u) {
        setRole(null);
        setLoading(false);
        return;
      }
      const snap = await getDoc(doc(db, "roles", u.uid));
      const r = snap.exists() ? snap.data().role : null;
      setRole(r);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!loading) {
      if (!user) router.replace("/login");
      else if (requiredRole && role !== requiredRole)
        router.replace("/unauthorized");
    }
  }, [loading, user, role]);

  return { user, role, loading };
}
