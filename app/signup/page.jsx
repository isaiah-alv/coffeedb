"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Sign up failed");
      }
      // Auto sign in
      await signIn("credentials", { email: form.email, password: form.password, redirect: false });
      router.push("/profile");
    } catch (err) {
      setError(err.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 coffee-card">
      <h1 className="text-2xl heading-serif mb-4">Create an account</h1>
      {error && <div className="mb-3 text-red-600 text-sm">{error}</div>}
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Name</label>
          <input className="w-full border rounded-lg px-3 py-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input type="email" className="w-full border rounded-lg px-3 py-2" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input type="password" className="w-full border rounded-lg px-3 py-2" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <button className="coffee-btn w-full" disabled={loading}>{loading ? "Creating…" : "Sign up"}</button>
      </form>
    </div>
  );
}

