"use client";

import { useEffect, useState } from "react";

export default function LoginPage() {
  const [notices, setNotices] = useState([]);
  const [loadingNotices, setLoadingNotices] = useState(true);

  useEffect(() => {
    async function fetchNotices() {
      try {
        // change this API route based on your project
        const res = await fetch("/api/notices", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch notices");
        const data = await res.json();
        setNotices(Array.isArray(data) ? data : []);
      } catch (e) {
        setNotices([]);
      } finally {
        setLoadingNotices(false);
      }
    }
    fetchNotices();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1740] via-[#2b2d7a] to-[#6a1b9a]">
      {/* split layout */}
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
        {/* LEFT SIDE */}
        <div className="relative flex flex-col justify-center px-8 py-12 md:px-14">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-wide text-white">
              KMIT Marks Portal
            </h1>
            <p className="mt-3 text-white/80">
              Single platform for Students, Faculty, and Exam Branch to manage
              marks, notices, and results.
            </p>

            {/* Notice Board */}
            <div className="mt-10 w-full max-w-md rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-xl">
              <div className="rounded-t-2xl bg-indigo-600/50 px-5 py-3 text-center font-semibold text-white">
                NOTICE BOARD
              </div>

              <div className="px-5 py-4">
                {loadingNotices ? (
                  <p className="text-white/70 text-sm">Loading notices...</p>
                ) : notices.length === 0 ? (
                  <p className="text-white/70 text-sm">
                    Unable to load notices. Please try again later.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {notices.slice(0, 4).map((n, idx) => (
                      <li
                        key={n?.id ?? idx}
                        className="rounded-xl bg-white/10 border border-white/10 px-4 py-3"
                      >
                        <p className="text-white font-medium">{n?.title}</p>
                        <p className="text-white/70 text-xs mt-1">
                          {n?.description}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="relative flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md rounded-3xl bg-white/10 backdrop-blur-xl border border-white/15 shadow-2xl px-7 py-8">
            {/* header row */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
                <p className="mt-1 text-sm text-white/70">
                  Login with your KMIT credentials to continue.
                </p>
              </div>

              <div className="rounded-full bg-white/10 border border-white/10 px-4 py-2 text-xs text-white/80">
                Exam Branch • KMIT
              </div>
            </div>

            {/* form */}
            <form className="mt-7 space-y-4">
              <div>
                <label className="text-sm text-white/80">User ID</label>
                <input
                  className="mt-2 w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-white/30"
                  placeholder="User ID (e.g., Hall Ticket)"
                />
              </div>

              <div>
                <label className="text-sm text-white/80">Password</label>
                <input
                  type="password"
                  className="mt-2 w-full rounded-xl bg-white/10 border border-white/10 px-4 py-3 text-white placeholder-white/50 outline-none focus:ring-2 focus:ring-white/30"
                  placeholder="Password"
                />
              </div>

              <button
                type="button"
                className="w-full rounded-xl bg-indigo-500 hover:bg-indigo-600 transition text-white font-semibold py-3"
              >
                Login
              </button>

              {/* divider */}
              <div className="flex items-center gap-3 py-2">
                <div className="h-px flex-1 bg-white/15" />
                <span className="text-xs text-white/60">or</span>
                <div className="h-px flex-1 bg-white/15" />
              </div>

              <button
                type="button"
                className="w-full rounded-xl bg-white text-gray-900 font-semibold py-3 flex items-center justify-center gap-3 hover:opacity-95 transition"
                onClick={() => alert("Google Login (connect Firebase Auth)")}
              >
                <GoogleIcon />
                Sign in with Google
              </button>

              <p className="pt-4 text-center text-xs text-white/60">
                Having trouble logging in ? Contact Exam Branch.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.194 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.963 3.037l5.657-5.657C34.047 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691l6.571 4.819C14.655 16.108 18.961 12 24 12c3.059 0 5.842 1.154 7.963 3.037l5.657-5.657C34.047 6.053 29.268 4 24 4c-7.682 0-14.344 4.334-17.694 10.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.189-5.238C29.191 35.091 26.715 36 24 36c-5.174 0-9.626-3.317-11.166-7.946l-6.518 5.02C9.597 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303c-.734 2.08-2.127 3.835-3.971 5.27l.002-.001 6.189 5.238C36.96 39.017 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
}
