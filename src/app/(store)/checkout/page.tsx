"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface ShippingForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export default function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<ShippingForm>({
    firstName: "",
    lastName: "",
    email: session?.user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
  });

  const shipping = totalPrice() > 150 ? 0 : 15;
  const total = totalPrice() + shipping;

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <h1 className="font-display text-2xl tracking-widest uppercase mb-4">Your cart is empty</h1>
        <Link href="/shop" className="btn-gold px-8 py-3 inline-block mt-4">
          Continue Shopping
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!session) {
      router.push("/login?callbackUrl=/checkout");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/stripe/checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            quantity: i.quantity,
            price: i.price,
            name: i.name,
            image: i.image,
            size: i.size,
            color: i.color,
          })),
          shippingAddress: form,
          subtotal: totalPrice(),
          shippingCost: shipping,
          total,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to start checkout.");

      // Clear cart before redirecting to Stripe — the webhook will create the order
      clearCart();
      // Redirect to Stripe hosted checkout
      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  const field = (key: keyof ShippingForm) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm({ ...form, [key]: e.target.value }),
    className: "input-luxury w-full",
    required: true,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-2xl tracking-widest uppercase mb-10">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-8">
          {!session && (
            <div className="bg-[#faf9f7] border border-[#e8e4de] p-4 text-sm font-sans-clean">
              <Link href="/login?callbackUrl=/checkout" className="text-[#c9a96e] hover:underline">Sign in</Link>{" "}
              to continue. An account is required to place an order.
            </div>
          )}

          <div>
            <h2 className="text-xs tracking-widest uppercase font-sans-clean text-[#c9a96e] mb-4">
              Shipping Information
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs tracking-widest uppercase font-sans-clean text-[#6b6b6b] block mb-2">First Name</label>
                <input type="text" placeholder="First name" {...field("firstName")} />
              </div>
              <div>
                <label className="text-xs tracking-widest uppercase font-sans-clean text-[#6b6b6b] block mb-2">Last Name</label>
                <input type="text" placeholder="Last name" {...field("lastName")} />
              </div>
              <div>
                <label className="text-xs tracking-widest uppercase font-sans-clean text-[#6b6b6b] block mb-2">Email</label>
                <input type="email" placeholder="Email" {...field("email")} />
              </div>
              <div>
                <label className="text-xs tracking-widest uppercase font-sans-clean text-[#6b6b6b] block mb-2">Phone</label>
                <input type="tel" placeholder="Phone" {...field("phone")} />
              </div>
              <div className="col-span-2">
                <label className="text-xs tracking-widest uppercase font-sans-clean text-[#6b6b6b] block mb-2">Address</label>
                <input type="text" placeholder="Street address" {...field("address")} />
              </div>
              <div>
                <label className="text-xs tracking-widest uppercase font-sans-clean text-[#6b6b6b] block mb-2">City</label>
                <input type="text" placeholder="City" {...field("city")} />
              </div>
              <div>
                <label className="text-xs tracking-widest uppercase font-sans-clean text-[#6b6b6b] block mb-2">State</label>
                <input type="text" placeholder="State" {...field("state")} />
              </div>
              <div>
                <label className="text-xs tracking-widest uppercase font-sans-clean text-[#6b6b6b] block mb-2">Zip Code</label>
                <input type="text" placeholder="Zip code" {...field("zipCode")} />
              </div>
              <div>
                <label className="text-xs tracking-widest uppercase font-sans-clean text-[#6b6b6b] block mb-2">Country</label>
                <input type="text" placeholder="Country" {...field("country")} />
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-sans-clean p-3">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <button
              type="submit"
              disabled={loading || !session}
              className="btn-gold w-full py-4 text-sm disabled:opacity-50"
            >
              {loading ? "Redirecting to payment..." : `Proceed to Payment — ${formatPrice(total)}`}
            </button>
            <p className="text-center text-xs font-sans-clean text-[#6b6b6b]">
              You&apos;ll be securely redirected to Stripe to complete payment.
            </p>
          </div>
        </form>

        {/* Order summary */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-[#e8e4de] p-6 sticky top-24">
            <h2 className="text-xs tracking-widest uppercase font-sans-clean text-[#c9a96e] mb-6">
              Order Summary
            </h2>
            <ul className="space-y-4 mb-6">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3">
                  <div className="relative w-14 h-16 bg-[#f0ede8] flex-shrink-0">
                    {item.image && (
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    )}
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#c9a96e] text-white text-xs rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-sans-clean font-medium">{item.name}</p>
                    <p className="text-xs text-[#6b6b6b] font-sans-clean">{item.size} · {item.color}</p>
                  </div>
                  <p className="text-xs font-sans-clean">{formatPrice(item.price * item.quantity)}</p>
                </li>
              ))}
            </ul>
            <div className="space-y-2 pt-4 border-t border-[#e8e4de]">
              <div className="flex justify-between text-xs font-sans-clean text-[#6b6b6b]">
                <span>Subtotal</span>
                <span>{formatPrice(totalPrice())}</span>
              </div>
              <div className="flex justify-between text-xs font-sans-clean text-[#6b6b6b]">
                <span>Shipping</span>
                <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between font-display text-base pt-2 border-t border-[#e8e4de]">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
