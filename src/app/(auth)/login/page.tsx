"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password.");
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="font-display text-2xl tracking-widest uppercase">
            Mo Style Hub
          </Link>
          <p className="text-xs tracking-widest uppercase font-sans-clean text-[#c9a96e] mt-2">
            Welcome Back
          </p>
        </div>

        <div className="bg-white border border-[#e8e4de] p-8">
          <h1 className="font-display text-xl tracking-widest uppercase mb-8 text-center">
            Sign In
          </h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-sans-clean p-3 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs tracking-widest uppercase font-sans-clean text-[#6b6b6b] mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="flex items-center justify-between mt-4">
            <Link
              href="/forgot-password"
              className="text-xs font-sans-clean text-[#6b6b6b] hover:text-[#c9a96e] transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <p className="text-center text-xs font-sans-clean text-[#6b6b6b] mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-[#c9a96e] hover:underline">
              Create one
            </Link>
          </p>
        </div>

        <p className="text-center mt-6">
          <Link href="/" className="text-xs font-sans-clean text-[#6b6b6b] hover:text-[#1a1a1a]">
            ← Back to Store
          </Link>
        </p>
      </div>
    </div>
  );
}
