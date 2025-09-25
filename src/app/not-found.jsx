"use client"; // only needed if you plan to use client-side hooks

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f5f7]">
      <h1 className="text-5xl font-bold text-slate-900 mb-4">404</h1>
      <p className="text-lg text-slate-700 mb-6">Oops! Page not found.</p>
      <Link
        href="/"
        className="px-6 py-3 bg-slate-900 text-white rounded hover:bg-slate-800 transition"
      >
        Go Home
      </Link>
    </div>
  );
}
