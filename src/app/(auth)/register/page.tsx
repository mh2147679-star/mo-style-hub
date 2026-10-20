"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Something went wrong.");
      setLoading(false);
      return;
    }

    // Auto sign in after registration
    await signIn("credentials", { email: form.email, password: form.password, redirect: false });
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="font-display text-2xl tracking-widest uppercase">
            Mo Style Hub
          </Link>
          <p className="text-xs tracking-widest uppercase font-sans-clean text-[#c9a96e] mt-2">
            Join Us
          </p>
        </div>

        <div className="bg-white border border-[#e8e4de] p-8">
          <h1 className="font-display text-xl tracking-widest uppercase mb-8 text-center">
            Create Account
          </h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-sans-clean p-3 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs tracking-widest uppercase font-sans-clean text-[#6b6b6b] mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="input-luxury w-full"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase font-sans-clean text-[#6b6b6b] mb-2">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="input-luxury w-full"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase font-sans-clean text-[#6b6b6b] mb-2">
                Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                className="input-luxury w-full"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase font-sans-clean text-[#6b6b6b] mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                required
                className="input-luxury w-full"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-3.5 mt-2 disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-xs font-sans-clean text-[#6b6b6b] mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-[#c9a96e] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
