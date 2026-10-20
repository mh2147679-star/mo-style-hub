"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  // Bad link — missing params
  if (!token || !email) {
    return (
      <div className="text-center space-y-4">
        <p className="text-sm font-sans-clean text-red-600">
          This reset link is invalid or has expired.
        </p>
        <Link href="/forgot-password" className="text-xs font-sans-clean text-[#c9a96e] hover:underline">
          Request a new link
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setDone(true);
      // Redirect to login after 2s
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mx-auto">
          <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="font-display text-xl tracking-widest uppercase">Password Updated</h2>
        <p className="text-sm font-sans-clean text-[#6b6b6b]">
          Your password has been changed. Redirecting you to sign in…
        </p>
      </div>
    );
  }

  return (
    <>
      <h1 className="font-display text-xl tracking-widest uppercase mb-2 text-center">
        New Password
      </h1>
      <p className="text-xs font-sans-clean text-[#6b6b6b] text-center mb-8">
        Choose a new password for your account.
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-sans-clean p-3 mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs tracking-widest uppercase font-sans-clean text-[#6b6b6b] mb-2">
            New Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
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
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            minLength={6}
            className="input-luxury w-full"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-gold w-full py-3.5 mt-2 disabled:opacity-50"
        >
          {loading ? "Updating…" : "Update Password"}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="font-display text-2xl tracking-widest uppercase">
            Mo Style Hub
          </Link>
          <p className="text-xs tracking-widest uppercase font-sans-clean text-[#c9a96e] mt-2">
            Reset Password
          </p>
        </div>

        <div className="bg-white border border-[#e8e4de] p-8">
          <Suspense fallback={
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-[#c9a96e] border-t-transparent rounded-full animate-spin" />
            </div>
          }>
            <ResetPasswordForm />
          </Suspense>
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
