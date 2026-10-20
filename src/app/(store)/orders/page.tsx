import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Orders" };

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
  CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
  PROCESSING: "bg-purple-50 text-purple-700 border-purple-200",
  SHIPPED: "bg-indigo-50 text-indigo-700 border-indigo-200",
  DELIVERED: "bg-green-50 text-green-700 border-green-200",
  CANCELLED: "bg-red-50 text-red-700 border-red-200",
  REFUNDED: "bg-gray-50 text-gray-700 border-gray-200",
};

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; order?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const params = await searchParams;

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-2xl tracking-widest uppercase mb-10">My Orders</h1>

      {/* Success message */}
      {params.success && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 mb-8 font-sans-clean text-sm">
          ✓ Order <strong>{params.order}</strong> placed successfully! We&apos;ll send you a confirmation shortly.
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-[#6b6b6b] font-sans-clean text-sm mb-6">You haven&apos;t placed any orders yet.</p>
          <Link href="/shop" className="btn-gold px-8 py-3 inline-block">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block bg-white border border-[#e8e4de] p-6 hover:border-[#c9a96e] transition-colors group"
            >
              {/* Order header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <p className="font-sans-clean text-sm font-medium group-hover:text-[#c9a96e] transition-colors">
                    {order.orderNumber}
                  </p>
                  <p className="text-xs text-[#6b6b6b] font-sans-clean mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs border px-2 py-1 font-sans-clean tracking-wider ${
                      STATUS_COLORS[order.status] || STATUS_COLORS.PENDING
                    }`}
                  >
                    {order.status}
                  </span>
                  <span className="font-display text-base">{formatPrice(order.total)}</span>
                  <span className="text-[#9a9a9a] text-xs font-sans-clean group-hover:text-[#c9a96e] transition-colors">
                    View →
                  </span>
                </div>
              </div>

              {/* Item thumbnails */}
              <div className="flex gap-3 overflow-x-auto pb-1">
                {order.items.map((item) => (
                  <div key={item.id} className="flex-shrink-0 text-center w-16">
                    <div className="w-16 h-20 bg-[#f0ede8] mb-1 flex items-center justify-center text-xs text-[#6b6b6b] overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        "—"
                      )}
                    </div>
                    <p className="text-xs font-sans-clean text-[#6b6b6b]">×{item.quantity}</p>
                  </div>
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
