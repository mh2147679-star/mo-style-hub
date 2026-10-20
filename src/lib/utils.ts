import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return inputs.filter(Boolean).join(" ");
}

export function formatPrice(price: number | string | { toString(): string }): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(price));
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `MSH-${timestamp}-${random}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
}

// Converts Prisma Decimal fields to plain numbers so they can be
// safely passed from Server Components to Client Components.
export function serializeProduct(product: any) {
  return {
    ...product,
    price: Number(product.price),
    comparePrice: product.comparePrice ? Number(product.comparePrice) : null,
    createdAt: product.createdAt?.toISOString?.() ?? product.createdAt,
    updatedAt: product.updatedAt?.toISOString?.() ?? product.updatedAt,
    variants: product.variants?.map((v: any) => ({
      ...v,
      createdAt: v.createdAt?.toISOString?.() ?? v.createdAt,
      updatedAt: v.updatedAt?.toISOString?.() ?? v.updatedAt,
    })),
    reviews: product.reviews?.map((r: any) => ({
      ...r,
      createdAt: r.createdAt?.toISOString?.() ?? r.createdAt,
      updatedAt: r.updatedAt?.toISOString?.() ?? r.updatedAt,
    })),
  };
}
