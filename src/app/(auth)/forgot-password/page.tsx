"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");

      setSent(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
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
            Password Recovery
          </p>
        </div>

        <div className="bg-white border border-[#e8e4de] p-8">
          {sent ? (
            <div className="text-center space-y-4">
              {/* Envelope icon */}
              <div className="w-14 h-14 rounded-full bg-[#faf9f7] border border-[#e8e4de] flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-[#c9a96e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <h1 className="font-display text-xl tracking-widest uppercase">Check Your Email</h1>
              <p className="text-sm font-sans-clean text-[#6b6b6b] leading-relaxed">
                If an account exists for <strong className="text-[#1a1a1a]">{email}</strong>,
                you&apos;ll receive a password reset link shortly.
              </p>
              <p className="text-xs font-sans-clean text-[#9a9a9a]">
                The link expires in 1 hour. Check your spam folder if you don&apos;t see it.
              </p>
            </div>
          ) : (
            <>
              <h1 className="font-display text-xl tracking-widest uppercase mb-2 text-center">
                Forgot Password
              </h1>
              <p className="text-xs font-sans-clean text-[#6b6b6b] text-center mb-8">
                Enter your email and we&apos;ll send you a reset link.
              </p>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-sans-clean p-3 mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs tracking-widest uppercase font-sans-clean text-[#6b6b6b] mb-2">
                    Email Address
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

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gold w-full py-3.5 mt-2 disabled:opacity-50"
                >
                  {loading ? "Sending…" : "Send Reset Link"}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center mt-6">
          <Link href="/login" className="text-xs font-sans-clean text-[#6b6b6b] hover:text-[#1a1a1a]">
            ← Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
