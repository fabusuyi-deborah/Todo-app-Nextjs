"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function Home() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data.user) setUser(data.user)
    }
    fetchUser()
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f5f7]">
      <h1 className="text-4xl font-bold mb-4">Welcome to Task Buddy</h1>
      <p className="text-lg text-slate-700 mb-6">
        Organize your tasks, stay on track, and boost your productivity.
      </p>

      <div className="flex gap-4">
        {!user && (
          <Link
            href="/auth"
            className="px-6 py-3 bg-slate-900 text-white rounded"
          >
            Log In / Sign Up
          </Link>
        )}
        {user && (
          <Link
            href="/todos"
            className="px-6 py-3 border border-slate-900 rounded"
          >
            Go to Todos
          </Link>
        )}
      </div>
    </div>
  )
}
