"use client";

import { useState } from "react";

interface Props {
  initialName: string;
  initialEmail: string;
}

export function ProfileForm({ initialName, initialEmail }: Props) {
  // ── Name section ────────────────────────────────────────────────────────────
  const [name, setName] = useState(initialName);
  const [nameLoading, setNameLoading] = useState(false);
  const [nameMsg, setNameMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // ── Password section ────────────────────────────────────────────────────────
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // ── Update name ─────────────────────────────────────────────────────────────
  async function handleNameSubmit(e: React.FormEvent) {
    e.preventDefault();
    setNameLoading(true);
    setNameMsg(null);

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed.");
      setNameMsg({ type: "success", text: "Name updated successfully." });
    } catch (err: any) {
      setNameMsg({ type: "error", text: err.message });
    } finally {
      setNameLoading(false);
    }
  }

  // ── Update password ─────────────────────────────────────────────────────────
  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPwMsg(null);

    if (newPassword !== confirmPassword) {
      setPwMsg({ type: "error", text: "New passwords do not match." });
      return;
    }
    if (newPassword.length < 6) {
      setPwMsg({ type: "error", text: "Password must be at least 6 characters." });
      return;
    }

    setPwLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed.");
      setPwMsg({ type: "success", text: "Password updated successfully." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setPwMsg({ type: "error", text: err.message });
    } finally {
      setPwLoading(false);
    }
  }

  return (
    <div className="space-y-10">
      {/* ── Account Info ────────────────────────────────────────────────────── */}
      <div className="bg-white border border-[#e8e4de] p-6">
        <h2 className="text-xs tracking-widest uppercase font-sans-clean text-[#c9a96e] mb-6">
          Account Information
        </h2>

        <form onSubmit={handleNameSubmit} className="space-y-4">
          <div>
            <label className="block text-xs tracking-widest uppercase font-sans-clean text-[#6b6b6b] mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="input-luxury w-full"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="block text-xs tracking-widest uppercase font-sans-clean text-[#6b6b6b] mb-2">
              Email Address
            </label>
            {/* Email is read-only — changing it would require re-auth */}
            <input
              type="email"
              value={initialEmail}
              readOnly
              className="input-luxury w-full bg-[#faf9f7] text-[#9a9a9a] cursor-not-allowed"
            />
            <p className="text-xs font-sans-clean text-[#9a9a9a] mt-1">
              Email cannot be changed.
            </p>
          </div>

          {nameMsg && (
            <div
              className={`text-xs font-sans-clean p-3 border ${
                nameMsg.type === "success"
                  ? "bg-green-50 border-green-200 text-green-700"
                  : "bg-red-50 border-red-200 text-red-600"
              }`}
            >
              {nameMsg.text}
            </div>
          )}

          <button
            type="submit"
            disabled={nameLoading}
            className="btn-gold px-8 py-3 disabled:opacity-50"
          >
            {nameLoading ? "Saving…" : "Save Changes"}
          </button>
        </form>
      </div>

      {/* ── Change Password ──────────────────────────────────────────────────── */}
      <div className="bg-white border border-[#e8e4de] p-6">
        <h2 className="text-xs tracking-widest uppercase font-sans-clean text-[#c9a96e] mb-6">
          Change Password
        </h2>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-xs tracking-widest uppercase font-sans-clean text-[#6b6b6b] mb-2">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="input-luxury w-full"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-xs tracking-widest uppercase font-sans-clean text-[#6b6b6b] mb-2">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              className="input-luxury w-full"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-xs tracking-widest uppercase font-sans-clean text-[#6b6b6b] mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="input-luxury w-full"
              placeholder="••••••••"
            />
          </div>

          {pwMsg && (
            <div
              className={`text-xs font-sans-clean p-3 border ${
                pwMsg.type === "success"
                  ? "bg-green-50 border-green-200 text-green-700"
                  : "bg-red-50 border-red-200 text-red-600"
              }`}
            >
              {pwMsg.text}
            </div>
          )}

          <button
            type="submit"
            disabled={pwLoading}
            className="btn-gold px-8 py-3 disabled:opacity-50"
          >
            {pwLoading ? "Updating…" : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
