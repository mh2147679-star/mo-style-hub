import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { AdminProductActions } from "@/components/admin/AdminProductActions";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Products" };

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true, variants: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl tracking-widest uppercase">Products</h1>
        <Link href="/admin/products/new" className="btn-gold px-6 py-2.5 inline-block text-xs">
          + Add Product
        </Link>
      </div>

      <div className="bg-white border border-[#e8e4de]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#e8e4de]">
              {["Product", "Category", "Price", "Variants", "Status", "Actions"].map((h) => (
                <th key={h} className="text-left text-xs tracking-widest uppercase font-sans-clean text-[#6b6b6b] p-4">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-[#f5f3ef] last:border-0 hover:bg-[#faf9f7]">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {product.images[0] && (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-10 h-12 object-cover bg-[#f0ede8]"
                      />
                    )}
                    <div>
                      <p className="text-sm font-sans-clean font-medium">{product.name}</p>
                      <p className="text-xs text-[#6b6b6b] font-sans-clean">{product.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-xs font-sans-clean text-[#6b6b6b]">{product.category.name}</td>
                <td className="p-4 text-xs font-sans-clean">${Number(product.price).toFixed(2)}</td>
                <td className="p-4 text-xs font-sans-clean text-center">{product.variants.length}</td>
                <td className="p-4">
                  <span className={`text-xs border px-2 py-0.5 font-sans-clean ${
                    product.isActive
                      ? "border-green-200 text-green-700 bg-green-50"
                      : "border-red-200 text-red-700 bg-red-50"
                  }`}>
                    {product.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="p-4">
                  <AdminProductActions productId={product.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[#6b6b6b] font-sans-clean text-sm mb-4">No products yet.</p>
            <Link href="/admin/products/new" className="btn-gold px-6 py-2.5 inline-block text-xs">
              Add Your First Product
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
