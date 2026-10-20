"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: "USER" | "ADMIN";
  createdAt: string;
  orderCount: number;
  totalSpend: number;
}

interface Props {
  initialUsers: User[];
  initialTotal: number;
  initialPages: number;
  currentUserId: string;
}

export function UserManagement({
  initialUsers,
  initialTotal,
  initialPages,
  currentUserId,
}: Props) {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [total, setTotal] = useState(initialTotal);
  const [pages, setPages] = useState(initialPages);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  // ── Search / paginate ────────────────────────────────────────────────────────
  const fetchUsers = useCallback(async (query: string, p: number) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `/api/admin/users?q=${encodeURIComponent(query)}&page=${p}&limit=20`
      );
      const data = await res.json();
      setUsers(data.users);
      setTotal(data.total);
      setPages(data.pages);
      setPage(p);
    } catch {
      setError("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  }, []);

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    fetchUsers(q, 1);
  }

  // ── Role toggle ──────────────────────────────────────────────────────────────
  async function toggleRole(user: User) {
    const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";
    const label = newRole === "ADMIN" ? "promote to Admin" : "demote to User";
    if (!confirm(`${label} ${user.email}?`)) return;

    setActionLoading(user.id + "-role");
    setError("");
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, role: data.role } : u))
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  }

  // ── Delete ───────────────────────────────────────────────────────────────────
  async function deleteUser(user: User) {
    if (
      !confirm(
        `Permanently delete ${user.email}? This will also delete all their orders and reviews.`
      )
    )
      return;

    setActionLoading(user.id + "-delete");
    setError("");
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      setTotal((t) => t - 1);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div>
      {/* Header + search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl tracking-widest uppercase">Users</h1>
          <p className="text-xs font-sans-clean text-[#6b6b6b] mt-1">
            {total} total user{total !== 1 ? "s" : ""}
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name or email…"
            className="input-luxury text-sm w-64"
          />
          <button type="submit" className="btn-gold px-5 py-2 text-xs">
            Search
          </button>
          {q && (
            <button
              type="button"
              onClick={() => { setQ(""); fetchUsers("", 1); }}
              className="btn-outline px-4 py-2 text-xs"
            >
              Clear
            </button>
          )}
        </form>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-sans-clean p-3 mb-6">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-[#e8e4de] relative">
        {loading && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
            <div className="w-6 h-6 border-2 border-[#c9a96e] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        <table className="w-full">
          <thead>
            <tr className="border-b border-[#e8e4de]">
              {["User", "Role", "Orders", "Total Spend", "Joined", "Actions"].map((h) => (
                <th
                  key={h}
                  className="text-left text-xs tracking-widest uppercase font-sans-clean text-[#6b6b6b] p-4"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const isSelf = user.id === currentUserId;
              const roleLoading = actionLoading === user.id + "-role";
              const deleteLoading = actionLoading === user.id + "-delete";

              return (
                <tr
                  key={user.id}
                  className="border-b border-[#f5f3ef] last:border-0 hover:bg-[#faf9f7]"
                >
                  {/* User */}
                  <td className="p-4">
                    <p className="text-sm font-sans-clean font-medium text-[#1a1a1a]">
                      {user.name || <span className="text-[#9a9a9a] italic">No name</span>}
                      {isSelf && (
                        <span className="ml-2 text-xs font-sans-clean text-[#9a9a9a]">(you)</span>
                      )}
                    </p>
                    <p className="text-xs font-sans-clean text-[#6b6b6b] mt-0.5">{user.email}</p>
                  </td>

                  {/* Role badge */}
                  <td className="p-4">
                    <span
                      className={`text-xs border px-2 py-0.5 font-sans-clean tracking-wider ${
                        user.role === "ADMIN"
                          ? "bg-[#c9a96e]/10 text-[#c9a96e] border-[#c9a96e]/30"
                          : "bg-[#f5f3ef] text-[#6b6b6b] border-[#e8e4de]"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  {/* Orders */}
                  <td className="p-4 text-xs font-sans-clean text-center text-[#1a1a1a]">
                    {user.orderCount}
                  </td>

                  {/* Total spend */}
                  <td className="p-4 text-xs font-sans-clean text-[#1a1a1a]">
                    {user.totalSpend > 0 ? formatPrice(user.totalSpend) : "—"}
                  </td>

                  {/* Joined */}
                  <td className="p-4 text-xs font-sans-clean text-[#6b6b6b]">
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>

                  {/* Actions */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {/* Promote / Demote */}
                      <button
                        onClick={() => toggleRole(user)}
                        disabled={isSelf || roleLoading}
                        title={isSelf ? "Cannot change your own role" : undefined}
                        className="text-xs font-sans-clean text-[#6b6b6b] hover:text-[#c9a96e] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        {roleLoading
                          ? "…"
                          : user.role === "ADMIN"
                          ? "Demote"
                          : "Promote"}
                      </button>

                      <span className="text-[#e8e4de]">|</span>

                      {/* Delete */}
                      <button
                        onClick={() => deleteUser(user)}
                        disabled={isSelf || deleteLoading}
                        title={isSelf ? "Cannot delete your own account" : undefined}
                        className="text-xs font-sans-clean text-[#6b6b6b] hover:text-red-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        {deleteLoading ? "…" : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {users.length === 0 && !loading && (
          <div className="text-center py-16">
            <p className="text-[#6b6b6b] font-sans-clean text-sm">
              {q ? `No users found for "${q}".` : "No users yet."}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-xs font-sans-clean text-[#6b6b6b]">
            Page {page} of {pages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => fetchUsers(q, page - 1)}
              disabled={page === 1 || loading}
              className="btn-outline px-4 py-2 text-xs disabled:opacity-30"
            >
              ← Prev
            </button>
            <button
              onClick={() => fetchUsers(q, page + 1)}
              disabled={page === pages || loading}
              className="btn-outline px-4 py-2 text-xs disabled:opacity-30"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
