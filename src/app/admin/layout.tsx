import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Admin Header */}
      <header className="bg-[#1a1a1a] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="font-display text-sm tracking-widest uppercase">
              Mo Style Hub — Admin
            </span>
            <nav className="flex items-center gap-4">
              <Link href="/admin" className="text-xs tracking-widest uppercase font-sans-clean text-[#9a9a9a] hover:text-white transition-colors">
                Dashboard
              </Link>
              <Link href="/admin/products" className="text-xs tracking-widest uppercase font-sans-clean text-[#9a9a9a] hover:text-white transition-colors">
                Products
              </Link>
              <Link href="/admin/orders" className="text-xs tracking-widest uppercase font-sans-clean text-[#9a9a9a] hover:text-white transition-colors">
                Orders
              </Link>
              <Link href="/admin/users" className="text-xs tracking-widest uppercase font-sans-clean text-[#9a9a9a] hover:text-white transition-colors">
                Users
              </Link>
            </nav>
          </div>
          <Link href="/" className="text-xs tracking-widest uppercase font-sans-clean text-[#c9a96e] hover:text-[#e8d5b0]">
            ← View Store
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
