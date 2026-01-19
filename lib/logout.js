import { signOut } from "firebase/auth";
import { auth } from "./firebaseClient";

export async function logout() {
  try {
    await signOut(auth);
    window.location.replace("/login");
  } catch (e) {
    console.error("Logout failed:", e);
    alert("Logout failed");
  }
}
