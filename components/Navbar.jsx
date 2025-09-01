"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

export const Navbar = () => {
  const { status } = useSession();
  const [theme, setTheme] = useState('iced');

  useEffect(() => {
    try {
      const t = localStorage.getItem('theme') || 'iced';
      setTheme(t);
    } catch {}
  }, []);

  const applyTheme = (t) => {
    setTheme(t);
    try {
      localStorage.setItem('theme', t);
      document.documentElement.setAttribute('data-theme', t);
    } catch {}
  };
  return (
    <nav className="sticky top-0 z-40 nav-surface px-4 sm:px-8 py-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link
          className="text-2xl heading-serif transition-colors flex items-center gap-2 link-nav"
          href={"/"}
        >
          the coffee db
        </Link>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <Link className="link-nav font-medium" href={"/search"}>Search</Link>
          <Link className="link-nav font-medium" href={"/profile"}>Profile</Link>
          {status === "authenticated" && (
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm" style={{color:'var(--text)'}}>Theme:</span>
              <button
                className={`seg-btn text-sm ${theme==='iced' ? 'seg-btn-active' : ''}`}
                onClick={() => applyTheme('iced')}
                title="Iced Lattes (default)"
              >Iced</button>
              <button
                className={`seg-btn text-sm ${theme==='matcha' ? 'seg-btn-active' : ''}`}
                onClick={() => applyTheme('matcha')}
                title="Matcha (green)"
              >Matcha</button>
              <button
                className={`seg-btn text-sm ${theme==='espresso' ? 'seg-btn-active' : ''}`}
                onClick={() => applyTheme('espresso')}
                title="Espresso (dark)"
              >Espresso</button>
            </div>
          )}
          {status === "authenticated" ? (
            <button
              className="link-nav font-medium"
              onClick={() => {
                try {
                  localStorage.setItem('theme', 'iced');
                  document.documentElement.setAttribute('data-theme', 'iced');
                } catch {}
                signOut();
              }}
            >
              Sign out
            </button>
          ) : (
            <>
              <Link className="link-nav font-medium" href={"/signup"}>Sign up</Link>
              <button className="link-nav font-medium" onClick={() => signIn()}>Sign in</button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
