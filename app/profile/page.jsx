"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import RemoveBtn from "@/components/RemoveBtn";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [cafes, setCafes] = useState([]);
  const [toTry, setToTry] = useState([]);
  const [theme, setTheme] = useState('iced');

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/cafes?ownerId=${encodeURIComponent(session.user.id)}`);
      const data = await res.json();
      setCafes(data?.cafes || []);
      const tt = await fetch(`/api/to-try?ownerId=${encodeURIComponent(session.user.id)}`);
      const ttData = await tt.json();
      setToTry(ttData?.items || []);
    };
    if (status === 'authenticated' && session?.user?.id) load();
  }, [status, session?.user?.id]);

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
    <div className="max-w-3xl mx-auto p-6 coffee-card">
      <h1 className="text-2xl heading-serif mb-4">Your Profile</h1>
      {status === "loading" && (
        <p className="text-gray-600">Checking session…</p>
      )}
      {status === "unauthenticated" && (
        <div className="space-y-3">
          <p className="text-gray-700">You are not signed in.</p>
          <button className="coffee-btn" onClick={() => signIn()}>Sign in</button>
        </div>
      )}
      {status === "authenticated" && (
        <div className="space-y-6">
          <div>
            <p style={{color:'var(--text)'}}><span className="font-medium">Name:</span> {session.user?.name || "—"}</p>
            <p style={{color:'var(--text)'}}><span className="font-medium">Email:</span> {session.user?.email || "—"}</p>
          </div>
          <button className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50" onClick={() => signOut()}>Sign out</button>


          {/* Theme Picker */}
          <div className="border-t border-gray-100 pt-4">
            <h2 className="text-xl heading-serif mb-3">Theme</h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => applyTheme('iced')}
                className={`px-3 py-2 rounded-lg border ${theme==='iced' ? 'bg-amber-50 border-amber-300 text-amber-800' : 'border-gray-200'}`}
                title="Iced Lattes (default)"
              >Iced Lattes</button>
              <button
                onClick={() => applyTheme('matcha')}
                className={`px-3 py-2 rounded-lg border ${theme==='matcha' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'border-gray-200'}`}
                title="Matcha (green)"
              >Matcha</button>
              <button
                onClick={() => applyTheme('espresso')}
                className={`px-3 py-2 rounded-lg border ${theme==='espresso' ? 'bg-gray-800 border-gray-600 text-gray-100' : 'border-gray-200'}`}
                title="Espresso (dark)"
              >Espresso</button>
            </div>
          </div>

          <div>
            <h2 className="text-xl heading-serif mb-3">My Cafes</h2>
            {cafes.length === 0 ? (
              <p className="text-gray-600">You haven’t added any cafes yet. <Link href="/addCafe" className="text-amber-700 underline">Add one</Link>.</p>
            ) : (
              <ul className="space-y-2">
                {cafes.map((c) => (
                  <li key={c._id} className="flex items-center justify-between bg-white/80 border border-amber-200 rounded-lg px-3 py-2">
                    <div>
                      <div className="font-medium text-gray-800">{c.name}</div>
                      <div className="text-xs text-gray-500">Added {new Date(c.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <RemoveBtn id={c._id} />
                      <Link href={`/editCafe/${c._id}`} className="text-sm text-amber-700 hover:underline">Edit</Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h2 className="text-xl heading-serif mb-3">To-Try List</h2>
            {toTry.length === 0 ? (
              <p className="text-gray-600">Your to-try list is empty. Save cafes from the Search page.</p>
            ) : (
              <ul className="space-y-2">
                {toTry.map((t) => (
                  <li key={t._id} className="flex items-center justify-between bg-white/80 border border-amber-200 rounded-lg px-3 py-2">
                    <div>
                      <div className="font-medium text-gray-800">{t.name}</div>
                      <div className="text-xs text-gray-500">{t.address}</div>
                      <div className="text-xs text-gray-500">Saved {new Date(t.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        className="text-sm text-amber-700 hover:underline"
                        href={`/addCafe?prefillName=${encodeURIComponent(t.name)}&address=${encodeURIComponent(t.address || '')}&toTryId=${t._id}`}
                        title="Rate this cafe"
                      >Rate</Link>
                      <button
                        className="text-sm text-red-600 hover:underline"
                        onClick={async () => {
                          await fetch(`/api/to-try/${t._id}`, { method: 'DELETE' });
                          setToTry((prev) => prev.filter((x) => x._id !== t._id));
                        }}
                      >Remove</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
