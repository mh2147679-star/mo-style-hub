import { prisma } from "@/lib/prisma";
import { OrderStatusUpdater } from "@/components/admin/OrderStatusUpdater";
import { formatPrice } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Orders" };

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      user: { select: { name: true, email: true } },
      items: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-display text-2xl tracking-widest uppercase mb-8">Orders</h1>

      <div className="bg-white border border-[#e8e4de]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#e8e4de]">
              {["Order #", "Customer", "Items", "Total", "Payment", "Status", "Date", "Update"].map((h) => (
                <th key={h} className="text-left text-xs tracking-widest uppercase font-sans-clean text-[#6b6b6b] p-4">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-[#f5f3ef] last:border-0 hover:bg-[#faf9f7]">
                <td className="p-4 text-xs font-sans-clean font-medium">{order.orderNumber}</td>
                <td className="p-4 text-xs font-sans-clean text-[#6b6b6b]">
                  <p>{order.user.name}</p>
                  <p className="text-[#9a9a9a]">{order.user.email}</p>
                </td>
                <td className="p-4 text-xs font-sans-clean text-center">{order.items.length}</td>
                <td className="p-4 text-xs font-sans-clean">{formatPrice(order.total)}</td>
                <td className="p-4">
                  <span className={`text-xs border px-2 py-0.5 font-sans-clean ${
                    order.paymentStatus === "PAID"
                      ? "border-green-200 text-green-700 bg-green-50"
                      : "border-yellow-200 text-yellow-700 bg-yellow-50"
                  }`}>
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="p-4">
                  <span className="text-xs border px-2 py-0.5 font-sans-clean border-[#e8e4de]">
                    {order.status}
                  </span>
                </td>
                <td className="p-4 text-xs font-sans-clean text-[#6b6b6b]">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="text-center text-sm text-[#6b6b6b] font-sans-clean py-16">No orders yet.</p>
        )}
      </div>
    </div>
  );
}
