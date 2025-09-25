"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) router.push("/todos");
    };
    checkUser();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f5f7]">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-lg text-slate-700 mb-6">Oops! Page not found.</p>
      <a
        href="/"
        className="px-6 py-3 bg-slate-900 text-white rounded hover:bg-slate-800 transition"
      >
        Go Home
      </a>
    </div>
  );
}
