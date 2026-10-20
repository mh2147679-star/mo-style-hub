import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { CancelOrderButton } from "@/components/store/CancelOrderButton";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    select: { orderNumber: true },
  });
  return { title: order ? `Order ${order.orderNumber}` : "Order Not Found" };
}

// ── Status timeline config ─────────────────────────────────────────────────────
const STATUS_STEPS = [
  { key: "PENDING",    label: "Order Placed" },
  { key: "CONFIRMED",  label: "Confirmed" },
  { key: "PROCESSING", label: "Processing" },
  { key: "SHIPPED",    label: "Shipped" },
  { key: "DELIVERED",  label: "Delivered" },
] as const;

const STATUS_COLORS: Record<string, string> = {
  PENDING:    "bg-yellow-50 text-yellow-700 border-yellow-200",
  CONFIRMED:  "bg-blue-50 text-blue-700 border-blue-200",
  PROCESSING: "bg-purple-50 text-purple-700 border-purple-200",
  SHIPPED:    "bg-indigo-50 text-indigo-700 border-indigo-200",
  DELIVERED:  "bg-green-50 text-green-700 border-green-200",
  CANCELLED:  "bg-red-50 text-red-700 border-red-200",
  REFUNDED:   "bg-gray-50 text-gray-700 border-gray-200",
};

const PAYMENT_COLORS: Record<string, string> = {
  PAID:     "bg-green-50 text-green-700 border-green-200",
  UNPAID:   "bg-yellow-50 text-yellow-700 border-yellow-200",
  REFUNDED: "bg-gray-50 text-gray-700 border-gray-200",
};

export default async function OrderDetailPage({ params }: Props) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: { select: { slug: true, name: true } },
          variant: { select: { size: true, color: true } },
        },
      },
      user: { select: { name: true, email: true } },
    },
  });

  if (!order) notFound();

  // Only owner or admin
  const isOwner = order.userId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";
  if (!isOwner && !isAdmin) notFound();

  const shippingAddress = order.shippingAddress as Record<string, string>;

  // Determine current step index for the timeline
  const cancelledOrRefunded = ["CANCELLED", "REFUNDED"].includes(order.status);
  const currentStepIndex = STATUS_STEPS.findIndex((s) => s.key === order.status);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back */}
      <Link
        href="/orders"
        className="inline-flex items-center gap-2 text-xs font-sans-clean text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors mb-8"
      >
        ← Back to Orders
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-10">
        <div>
          <h1 className="font-display text-2xl tracking-widest uppercase mb-1">
            {order.orderNumber}
          </h1>
          <p className="text-xs font-sans-clean text-[#6b6b6b]">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`text-xs border px-3 py-1 font-sans-clean tracking-wider ${
              PAYMENT_COLORS[order.paymentStatus] ?? PAYMENT_COLORS.UNPAID
            }`}
          >
            {order.paymentStatus}
          </span>
          <span
            className={`text-xs border px-3 py-1 font-sans-clean tracking-wider ${
              STATUS_COLORS[order.status] ?? STATUS_COLORS.PENDING
            }`}
          >
            {order.status}
          </span>
        </div>
      </div>

      {/* Cancel button — only for owner on cancellable orders */}
      {isOwner && ["PENDING", "CONFIRMED"].includes(order.status) && (
        <CancelOrderButton orderId={order.id} />
      )}

      {/* Status timeline — only for non-cancelled orders */}
      {!cancelledOrRefunded && (
        <div className="mb-10 bg-white border border-[#e8e4de] p-6">
          <h2 className="text-xs tracking-widest uppercase font-sans-clean text-[#c9a96e] mb-6">
            Order Progress
          </h2>
          <div className="flex items-center">
            {STATUS_STEPS.map((step, i) => {
              const done = i <= currentStepIndex;
              const isLast = i === STATUS_STEPS.length - 1;
              return (
                <div key={step.key} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors ${
                        done
                          ? "border-[#c9a96e] bg-[#c9a96e]"
                          : "border-[#e8e4de] bg-white"
                      }`}
                    >
                      {done && (
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span
                      className={`text-xs font-sans-clean mt-2 text-center w-16 leading-tight ${
                        done ? "text-[#1a1a1a]" : "text-[#9a9a9a]"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {!isLast && (
                    <div
                      className={`flex-1 h-px mx-1 mb-5 ${
                        i < currentStepIndex ? "bg-[#c9a96e]" : "bg-[#e8e4de]"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Items */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xs tracking-widest uppercase font-sans-clean text-[#c9a96e] mb-2">
            Items ({order.items.length})
          </h2>
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-4 bg-white border border-[#e8e4de] p-4">
              {/* Thumbnail */}
              <Link
                href={`/products/${item.product.slug}`}
                className="relative w-16 h-20 bg-[#f0ede8] flex-shrink-0 block"
              >
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                ) : null}
              </Link>
              {/* Details */}
              <div className="flex-1 min-w-0">
                <Link
                  href={`/products/${item.product.slug}`}
                  className="font-sans-clean text-sm font-medium hover:text-[#c9a96e] transition-colors"
                >
                  {item.name}
                </Link>
                <p className="text-xs text-[#6b6b6b] font-sans-clean mt-0.5">
                  {item.variant.size} · {item.variant.color}
                </p>
                <p className="text-xs font-sans-clean text-[#6b6b6b] mt-0.5">
                  Qty: {item.quantity}
                </p>
              </div>
              <p className="font-sans-clean text-sm whitespace-nowrap">
                {formatPrice(Number(item.price) * item.quantity)}
              </p>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order summary */}
          <div className="bg-white border border-[#e8e4de] p-5">
            <h2 className="text-xs tracking-widest uppercase font-sans-clean text-[#c9a96e] mb-4">
              Summary
            </h2>
            <div className="space-y-2 text-xs font-sans-clean">
              <div className="flex justify-between text-[#6b6b6b]">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-[#6b6b6b]">
                <span>Shipping</span>
                <span>
                  {Number(order.shippingCost) === 0
                    ? "Free"
                    : formatPrice(order.shippingCost)}
                </span>
              </div>
              <div className="flex justify-between font-display text-base pt-2 border-t border-[#e8e4de]">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Shipping address */}
          <div className="bg-white border border-[#e8e4de] p-5">
            <h2 className="text-xs tracking-widest uppercase font-sans-clean text-[#c9a96e] mb-4">
              Ship To
            </h2>
            <address className="not-italic text-xs font-sans-clean text-[#6b6b6b] space-y-1 leading-relaxed">
              <p className="text-[#1a1a1a] font-medium">
                {shippingAddress.firstName} {shippingAddress.lastName}
              </p>
              <p>{shippingAddress.address}</p>
              <p>
                {shippingAddress.city}, {shippingAddress.state}{" "}
                {shippingAddress.zipCode}
              </p>
              <p>{shippingAddress.country}</p>
              {shippingAddress.phone && <p>{shippingAddress.phone}</p>}
              {shippingAddress.email && <p>{shippingAddress.email}</p>}
            </address>
          </div>

          {/* Payment method */}
          {order.paymentMethod && (
            <div className="bg-white border border-[#e8e4de] p-5">
              <h2 className="text-xs tracking-widest uppercase font-sans-clean text-[#c9a96e] mb-4">
                Payment
              </h2>
              <p className="text-xs font-sans-clean text-[#6b6b6b] capitalize">
                {order.paymentMethod}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
