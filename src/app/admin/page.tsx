import { prisma } from "@/lib/prisma";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin Dashboard" };

export default async function AdminDashboard() {
  const [totalProducts, totalOrders, totalUsers, recentOrders] =
    await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count(),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, email: true } } },
      }),
    ]);

  const revenue = await prisma.order.aggregate({
    _sum: { total: true },
    where: { paymentStatus: "PAID" },
  });

  const stats = [
    { label: "Total Products", value: totalProducts, href: "/admin/products", color: "text-[#c9a96e]" },
    { label: "Total Orders", value: totalOrders, href: "/admin/orders", color: "text-blue-600" },
    { label: "Total Users", value: totalUsers, href: "/admin/users", color: "text-purple-600" },
    {
      label: "Total Revenue",
      value: `$${Number(revenue._sum.total || 0).toFixed(2)}`,
      href: "/admin/orders",
      color: "text-green-600",
    },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl tracking-widest uppercase mb-8">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white border border-[#e8e4de] p-6 hover:border-[#c9a96e] transition-colors"
          >
            <p className="text-xs tracking-widest uppercase font-sans-clean text-[#6b6b6b] mb-2">
              {stat.label}
            </p>
            <p className={`font-display text-3xl ${stat.color}`}>{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white border border-[#e8e4de] p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xs tracking-widest uppercase font-sans-clean text-[#c9a96e]">
            Recent Orders
          </h2>
          <Link href="/admin/orders" className="text-xs font-sans-clean text-[#6b6b6b] hover:text-[#1a1a1a]">
            View all →
          </Link>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#e8e4de]">
              {["Order #", "Customer", "Status", "Total", "Date"].map((h) => (
                <th key={h} className="text-left text-xs tracking-widest uppercase font-sans-clean text-[#6b6b6b] pb-3 pr-4">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.id} className="border-b border-[#f5f3ef] last:border-0">
                <td className="py-3 pr-4 text-xs font-sans-clean font-medium">{order.orderNumber}</td>
                <td className="py-3 pr-4 text-xs font-sans-clean text-[#6b6b6b]">
                  {order.user.name || order.user.email}
                </td>
                <td className="py-3 pr-4">
                  <span className="text-xs font-sans-clean border px-2 py-0.5 border-[#e8e4de]">
                    {order.status}
                  </span>
                </td>
                <td className="py-3 pr-4 text-xs font-sans-clean">${Number(order.total).toFixed(2)}</td>
                <td className="py-3 text-xs font-sans-clean text-[#6b6b6b]">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {recentOrders.length === 0 && (
          <p className="text-center text-sm text-[#6b6b6b] font-sans-clean py-8">No orders yet.</p>
        )}
      </div>
    </div>
  );
}
