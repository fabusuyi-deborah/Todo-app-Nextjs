"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { useEffect, useState } from "react"

const Navbar = () => {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data.user) setUser(data.user)
    }
    fetchUser()

    // Listen for auth changes (login/logout in other tabs)
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem("username")
    setUser(null)
    router.push("/")
  }

  return (
    <header className="w-full shadow-sm sticky top-0 bg-white z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-primary tracking-wide">
          Task Buddy
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            href="/"
            className={pathname === "/" ? "text-primary font-semibold" : "text-muted-foreground"}
          >
            Home
          </Link>

          {user && (
            <Link
              href="/todos"
              className={pathname.startsWith("/todos") ? "text-primary font-semibold" : "text-muted-foreground"}
            >
              Todos
            </Link>
          )}

          {user ? (
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 px-2 py-1 border border-red-600 rounded-md"
            >
              Logout
            </button>
          ) : (
            <Link href="/auth" className="px-4 py-2 bg-slate-900 text-white rounded">
              Log In / Sign Up
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar
