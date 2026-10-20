import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — New Product" };

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return (
    <div>
      <h1 className="font-display text-2xl tracking-widest uppercase mb-8">New Product</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
