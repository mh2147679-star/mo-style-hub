"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/utils";
import { Category, Product, ProductVariant } from "@/types";
import { ImageUploader } from "./ImageUploader";

interface Props {
  categories: Category[];
  product?: Product & { variants: ProductVariant[] };
}

export function ProductForm({ categories, product }: Props) {
  const router = useRouter();
  const isEdit = !!product;

  const [form, setForm] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    price: product?.price?.toString() || "",
    comparePrice: product?.comparePrice?.toString() || "",
    categoryId: product?.categoryId || "",
    featured: product?.featured || false,
    isActive: product?.isActive ?? true,
  });

  const [images, setImages] = useState<string[]>(product?.images || []);

  const [variants, setVariants] = useState<Partial<ProductVariant>[]>(
    product?.variants || [{ size: "", color: "", stock: 0, sku: "" }]
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleNameChange(name: string) {
    setForm((f) => ({
      ...f,
      name,
      slug: isEdit ? f.slug : slugify(name),
    }));
  }

  function addVariant() {
    setVariants((v) => [...v, { size: "", color: "", stock: 0, sku: "" }]);
  }

  function updateVariant(i: number, key: string, value: string | number) {
    setVariants((v) => v.map((vt, idx) => (idx === i ? { ...vt, [key]: value } : vt)));
  }

  function removeVariant(i: number) {
    setVariants((v) => v.filter((_, idx) => idx !== i));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const body = {
      ...form,
      price: parseFloat(form.price),
      comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : null,
      images,
      variants: variants.filter((v) => v.size && v.color && v.sku),
    };

    const url = isEdit ? `/api/products/${product!.id}` : "/api/products";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to save product.");
      setSaving(false);
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  const input = "input-luxury w-full";
  const label = "block text-xs tracking-widest uppercase font-sans-clean text-[#6b6b6b] mb-2";

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-xs font-sans-clean p-3 mb-6">
          {error}
        </div>
      )}

      <div className="bg-white border border-[#e8e4de] p-6 mb-6">
        <h2 className="text-xs tracking-widest uppercase font-sans-clean text-[#c9a96e] mb-4">Basic Info</h2>
        <div className="space-y-4">
          <div>
            <label className={label}>Product Name</label>
            <input type="text" className={input} value={form.name} onChange={(e) => handleNameChange(e.target.value)} required />
          </div>
          <div>
            <label className={label}>Slug (URL)</label>
            <input type="text" className={input} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
          </div>
          <div>
            <label className={label}>Description</label>
            <textarea
              className="input-luxury w-full h-28 resize-none"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={label}>Price ($)</label>
              <input type="number" step="0.01" min="0" className={input} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            </div>
            <div>
              <label className={label}>Compare Price ($)</label>
              <input type="number" step="0.01" min="0" className={input} value={form.comparePrice} onChange={(e) => setForm({ ...form, comparePrice: e.target.value })} placeholder="Optional" />
            </div>
          </div>
          <div>
            <label className={label}>Category</label>
            <select className={input} value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} required>
              <option value="">Select category...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={label}>Product Images</label>
            <ImageUploader images={images} onChange={setImages} />
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm font-sans-clean cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-[#c9a96e]" />
              Featured product
            </label>
            <label className="flex items-center gap-2 text-sm font-sans-clean cursor-pointer">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="accent-[#c9a96e]" />
              Active (visible)
            </label>
          </div>
        </div>
      </div>

      {/* Variants */}
      <div className="bg-white border border-[#e8e4de] p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs tracking-widest uppercase font-sans-clean text-[#c9a96e]">Variants (Size / Color / Stock)</h2>
          <button type="button" onClick={addVariant} className="text-xs font-sans-clean text-[#c9a96e] hover:underline">
            + Add variant
          </button>
        </div>
        <div className="space-y-3">
          {variants.map((v, i) => (
            <div key={i} className="grid grid-cols-4 gap-2 items-center">
              <input type="text" placeholder="Size (e.g. M)" className="input-luxury text-xs" value={v.size || ""} onChange={(e) => updateVariant(i, "size", e.target.value)} />
              <input type="text" placeholder="Color" className="input-luxury text-xs" value={v.color || ""} onChange={(e) => updateVariant(i, "color", e.target.value)} />
              <input type="number" placeholder="Stock" min="0" className="input-luxury text-xs" value={v.stock || 0} onChange={(e) => updateVariant(i, "stock", parseInt(e.target.value))} />
              <div className="flex gap-2 items-center">
                <input type="text" placeholder="SKU" className="input-luxury text-xs flex-1" value={v.sku || ""} onChange={(e) => updateVariant(i, "sku", e.target.value)} />
                <button type="button" onClick={() => removeVariant(i)} className="text-red-400 hover:text-red-600 text-xs">✕</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <button type="submit" disabled={saving} className="btn-gold px-8 py-3 disabled:opacity-50">
          {saving ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-outline px-8 py-3">
          Cancel
        </button>
      </div>
    </form>
  );
}
