// Shared server-side validation for product create/update payloads.
// Returns an array of error strings — empty means valid.

const MAX_NAME_LEN = 200;
const MAX_DESC_LEN = 5000;
const MAX_IMAGES = 10;
const MAX_VARIANTS = 50;
// Allowlist for image hostnames — extend as needed
const ALLOWED_IMAGE_HOSTS = [
  "res.cloudinary.com",
  "images.unsplash.com",
  "cdn.shopify.com",
  "lh3.googleusercontent.com",
];

export interface ProductPayload {
  name?: unknown;
  slug?: unknown;
  description?: unknown;
  price?: unknown;
  comparePrice?: unknown;
  categoryId?: unknown;
  images?: unknown;
  featured?: unknown;
  isActive?: unknown;
  variants?: unknown;
}

export function validateProductBody(body: ProductPayload): string[] {
  const errors: string[] = [];

  // ── name ──────────────────────────────────────────────────────────────────
  if (!body.name || typeof body.name !== "string" || !body.name.trim()) {
    errors.push("Name is required.");
  } else if (body.name.trim().length > MAX_NAME_LEN) {
    errors.push(`Name must be ${MAX_NAME_LEN} characters or fewer.`);
  }

  // ── slug ──────────────────────────────────────────────────────────────────
  if (!body.slug || typeof body.slug !== "string" || !body.slug.trim()) {
    errors.push("Slug is required.");
  } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(body.slug.trim())) {
    errors.push("Slug must be lowercase letters, numbers, and hyphens only (e.g. my-product).");
  }

  // ── description ───────────────────────────────────────────────────────────
  if (!body.description || typeof body.description !== "string" || !body.description.trim()) {
    errors.push("Description is required.");
  } else if (body.description.trim().length > MAX_DESC_LEN) {
    errors.push(`Description must be ${MAX_DESC_LEN} characters or fewer.`);
  }

  // ── price ─────────────────────────────────────────────────────────────────
  const price = Number(body.price);
  if (body.price === undefined || body.price === null || body.price === "") {
    errors.push("Price is required.");
  } else if (isNaN(price) || price < 0) {
    errors.push("Price must be a non-negative number.");
  } else if (price > 999_999) {
    errors.push("Price must be less than $1,000,000.");
  }

  // ── comparePrice (optional) ───────────────────────────────────────────────
  if (body.comparePrice !== undefined && body.comparePrice !== null && body.comparePrice !== "") {
    const cp = Number(body.comparePrice);
    if (isNaN(cp) || cp < 0) {
      errors.push("Compare price must be a non-negative number.");
    } else if (!isNaN(price) && cp <= price) {
      errors.push("Compare price must be greater than the selling price.");
    }
  }

  // ── categoryId ────────────────────────────────────────────────────────────
  if (!body.categoryId || typeof body.categoryId !== "string" || !body.categoryId.trim()) {
    errors.push("Category is required.");
  }

  // ── images ────────────────────────────────────────────────────────────────
  if (!Array.isArray(body.images)) {
    errors.push("Images must be an array.");
  } else {
    if (body.images.length > MAX_IMAGES) {
      errors.push(`Maximum ${MAX_IMAGES} images allowed.`);
    }
    for (const img of body.images) {
      if (typeof img !== "string") {
        errors.push("Each image must be a URL string.");
        break;
      }
      try {
        const url = new URL(img);
        if (!["http:", "https:"].includes(url.protocol)) {
          errors.push(`Image URL must use http or https: "${img.substring(0, 60)}"`);
          break;
        }
        if (!ALLOWED_IMAGE_HOSTS.some((h) => url.hostname === h || url.hostname.endsWith("." + h))) {
          errors.push(
            `Image host "${url.hostname}" is not allowed. Upload via Cloudinary or use an approved host.`
          );
          break;
        }
      } catch {
        errors.push(`Invalid image URL: "${img.substring(0, 60)}"`);
        break;
      }
    }
  }

  // ── variants ──────────────────────────────────────────────────────────────
  if (!Array.isArray(body.variants) || body.variants.length === 0) {
    errors.push("At least one variant is required.");
  } else {
    if (body.variants.length > MAX_VARIANTS) {
      errors.push(`Maximum ${MAX_VARIANTS} variants allowed.`);
    }
    const skus = new Set<string>();
    body.variants.forEach((v: any, i: number) => {
      const idx = i + 1;
      if (!v.size || typeof v.size !== "string" || !v.size.trim()) {
        errors.push(`Variant ${idx}: size is required.`);
      }
      if (!v.color || typeof v.color !== "string" || !v.color.trim()) {
        errors.push(`Variant ${idx}: color is required.`);
      }
      if (v.stock === undefined || v.stock === null || isNaN(Number(v.stock)) || Number(v.stock) < 0) {
        errors.push(`Variant ${idx}: stock must be a non-negative integer.`);
      }
      if (!v.sku || typeof v.sku !== "string" || !v.sku.trim()) {
        errors.push(`Variant ${idx}: SKU is required.`);
      } else if (skus.has(v.sku.trim())) {
        errors.push(`Variant ${idx}: SKU "${v.sku.trim()}" is duplicated.`);
      } else {
        skus.add(v.sku.trim());
      }
    });
  }

  return errors;
}
