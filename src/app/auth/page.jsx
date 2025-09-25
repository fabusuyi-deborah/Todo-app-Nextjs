"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLogin, setIsLogin] = useState(true); // start with login view
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        const userName = data.user.user_metadata?.name || "User";
        localStorage.setItem("username", userName);
        router.push("/todos");
      } else {
        setLoading(false);
      }
    };
    checkUser();
  }, [router]);

  const handleAuth = async () => {
    setError("");
    if (!email || !password || (!isLogin && !name)) {
      setError("Please fill all required fields");
      return;
    }

    setBtnLoading(true);

    if (isLogin) {
      // LOGIN
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        console.error("Login Error:", error);
        setError(error.message);
        setBtnLoading(false);
        return;
      }

      const userName = data.user.user_metadata?.name || email;
      localStorage.setItem("username", userName);
      router.push("/todos");

    } else {
      // SIGN UP
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });

      if (error) {
        console.error("Signup Error:", error);
        setError(error.message);
        setBtnLoading(false);
        return;
      }

      alert("Signup successful! Please confirm your email before logging in.");
      setIsLogin(true); // switch to login after signup
      setPassword("");
      setName("");
    }

    setBtnLoading(false);
  };

  if (loading) return <p className="text-center mt-8">Checking authentication...</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f5f5f7]">
      <h1 className="text-3xl font-bold mb-6">{isLogin ? "Hey, Log In to Your Account" : "Hey, Sign Up for an Account"}</h1>

      {!isLogin && (
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-2 p-2 border rounded w-64"
        />
      )}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-2 p-2 border rounded w-64"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-2 p-2 border rounded w-64"
      />

      <button
        onClick={handleAuth}
        disabled={btnLoading}
        className="px-6 py-2 bg-slate-900 text-white rounded mt-2 disabled:opacity-50"
      >
        {btnLoading ? "Processing..." : isLogin ? "Log In" : "Sign Up"}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      <p className="mt-4 text-slate-600">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-600 underline"
        >
          {isLogin ? "Sign Up" : "Log In"}
        </button>
      </p>
    </div>
  );
}
