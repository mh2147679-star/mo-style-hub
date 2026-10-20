import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Mo Style Hub database...");

  // ── Categories ──────────────────────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "women" },
      update: {},
      create: {
        name: "Women",
        slug: "women",
        description: "Elegant pieces for the modern woman",
        image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&q=80",
      },
    }),
    prisma.category.upsert({
      where: { slug: "men" },
      update: {},
      create: {
        name: "Men",
        slug: "men",
        description: "Refined essentials for the contemporary man",
        image: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=800&q=80",
      },
    }),
    prisma.category.upsert({
      where: { slug: "accessories" },
      update: {},
      create: {
        name: "Accessories",
        slug: "accessories",
        description: "Complete your look with our curated accessories",
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
      },
    }),
  ]);

  console.log(`✓ Created ${categories.length} categories`);

  // ── Admin user ───────────────────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@mostylehub.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@mostylehub.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  console.log(`✓ Admin user: admin@mostylehub.com / admin123`);

  // ── Products ─────────────────────────────────────────────────────────────────
  const womenCat = categories[0];
  const menCat = categories[1];
  const accCat = categories[2];

  const products = [
    {
      name: "Silk Wrap Dress",
      slug: "silk-wrap-dress",
      description: "A timeless wrap dress crafted from luxurious silk. The fluid silhouette drapes beautifully on every body type. Perfect for elegant evenings or refined daywear.",
      price: 285,
      comparePrice: 350,
      images: [
        "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80",
        "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80",
      ],
      categoryId: womenCat.id,
      featured: true,
      variants: [
        { size: "XS", color: "Ivory", stock: 5, sku: "SWD-XS-IVY" },
        { size: "S", color: "Ivory", stock: 8, sku: "SWD-S-IVY" },
        { size: "M", color: "Ivory", stock: 10, sku: "SWD-M-IVY" },
        { size: "L", color: "Ivory", stock: 6, sku: "SWD-L-IVY" },
        { size: "S", color: "Black", stock: 7, sku: "SWD-S-BLK" },
        { size: "M", color: "Black", stock: 9, sku: "SWD-M-BLK" },
        { size: "L", color: "Black", stock: 4, sku: "SWD-L-BLK" },
      ],
    },
    {
      name: "Tailored Linen Blazer",
      slug: "tailored-linen-blazer",
      description: "A masterfully tailored blazer in breathable linen. Structured shoulders with a relaxed fit make this the cornerstone of any sophisticated wardrobe.",
      price: 320,
      images: [
        "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80",
      ],
      categoryId: menCat.id,
      featured: true,
      variants: [
        { size: "S", color: "Sand", stock: 6, sku: "TLB-S-SND" },
        { size: "M", color: "Sand", stock: 10, sku: "TLB-M-SND" },
        { size: "L", color: "Sand", stock: 8, sku: "TLB-L-SND" },
        { size: "XL", color: "Sand", stock: 5, sku: "TLB-XL-SND" },
        { size: "M", color: "Charcoal", stock: 7, sku: "TLB-M-CHR" },
        { size: "L", color: "Charcoal", stock: 6, sku: "TLB-L-CHR" },
      ],
    },
    {
      name: "High-Waist Trousers",
      slug: "high-waist-trousers",
      description: "Impeccably cut high-waist trousers with a wide leg. Crafted from premium wool blend for a look that transitions seamlessly from boardroom to evening.",
      price: 195,
      comparePrice: 240,
      images: [
        "https://images.unsplash.com/photo-1594938298603-c8148c4b4571?w=600&q=80",
      ],
      categoryId: womenCat.id,
      featured: true,
      variants: [
        { size: "XS", color: "Camel", stock: 4, sku: "HWT-XS-CAM" },
        { size: "S", color: "Camel", stock: 8, sku: "HWT-S-CAM" },
        { size: "M", color: "Camel", stock: 10, sku: "HWT-M-CAM" },
        { size: "L", color: "Camel", stock: 6, sku: "HWT-L-CAM" },
        { size: "S", color: "Black", stock: 12, sku: "HWT-S-BLK" },
        { size: "M", color: "Black", stock: 11, sku: "HWT-M-BLK" },
      ],
    },
    {
      name: "Classic Crew Neck Tee",
      slug: "classic-crew-neck-tee",
      description: "The essential crew neck tee reimagined in Pima cotton. Exceptional softness, a perfect fit, and a weight that feels substantial yet breathable.",
      price: 65,
      images: [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
      ],
      categoryId: menCat.id,
      featured: false,
      variants: [
        { size: "S", color: "White", stock: 20, sku: "CCT-S-WHT" },
        { size: "M", color: "White", stock: 25, sku: "CCT-M-WHT" },
        { size: "L", color: "White", stock: 20, sku: "CCT-L-WHT" },
        { size: "XL", color: "White", stock: 15, sku: "CCT-XL-WHT" },
        { size: "S", color: "Black", stock: 18, sku: "CCT-S-BLK" },
        { size: "M", color: "Black", stock: 22, sku: "CCT-M-BLK" },
        { size: "L", color: "Black", stock: 20, sku: "CCT-L-BLK" },
      ],
    },
    {
      name: "Leather Mini Bag",
      slug: "leather-mini-bag",
      description: "A compact structured bag crafted from full-grain Italian leather. Features a gold chain strap and polished hardware. Fits your essentials in refined style.",
      price: 245,
      images: [
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
      ],
      categoryId: accCat.id,
      featured: true,
      variants: [
        { size: "One Size", color: "Black", stock: 10, sku: "LMB-OS-BLK" },
        { size: "One Size", color: "Tan", stock: 8, sku: "LMB-OS-TAN" },
        { size: "One Size", color: "Cream", stock: 6, sku: "LMB-OS-CRM" },
      ],
    },
    {
      name: "Cashmere Turtleneck",
      slug: "cashmere-turtleneck",
      description: "Pure Grade-A cashmere in a classic turtleneck silhouette. Unmatched softness and warmth, designed to last a lifetime. A true wardrobe investment.",
      price: 380,
      images: [
        "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80",
      ],
      categoryId: womenCat.id,
      featured: true,
      variants: [
        { size: "XS", color: "Camel", stock: 4, sku: "CTN-XS-CAM" },
        { size: "S", color: "Camel", stock: 6, sku: "CTN-S-CAM" },
        { size: "M", color: "Camel", stock: 8, sku: "CTN-M-CAM" },
        { size: "L", color: "Camel", stock: 5, sku: "CTN-L-CAM" },
        { size: "S", color: "Ivory", stock: 5, sku: "CTN-S-IVY" },
        { size: "M", color: "Ivory", stock: 7, sku: "CTN-M-IVY" },
      ],
    },
    {
      name: "Slim Chino Pants",
      slug: "slim-chino-pants",
      description: "Slim-fit chino pants in a stretch-cotton blend. Effortlessly versatile — pair with a blazer for the office or a t-shirt for the weekend.",
      price: 145,
      images: [
        "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80",
      ],
      categoryId: menCat.id,
      featured: true,
      variants: [
        { size: "S", color: "Khaki", stock: 10, sku: "SCP-S-KHK" },
        { size: "M", color: "Khaki", stock: 14, sku: "SCP-M-KHK" },
        { size: "L", color: "Khaki", stock: 12, sku: "SCP-L-KHK" },
        { size: "XL", color: "Khaki", stock: 8, sku: "SCP-XL-KHK" },
        { size: "M", color: "Navy", stock: 10, sku: "SCP-M-NVY" },
        { size: "L", color: "Navy", stock: 9, sku: "SCP-L-NVY" },
      ],
    },
    {
      name: "Silk Scarf",
      slug: "silk-scarf",
      description: "Hand-finished 100% silk scarf with an exclusive Mo Style Hub print. Wear as a headscarf, neck wrap, or bag accessory — the possibilities are endless.",
      price: 95,
      images: [
        "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&q=80",
      ],
      categoryId: accCat.id,
      featured: false,
      variants: [
        { size: "One Size", color: "Multi", stock: 20, sku: "SSC-OS-MLT" },
        { size: "One Size", color: "Ivory/Gold", stock: 15, sku: "SSC-OS-IVG" },
      ],
    },
  ];

  for (const prod of products) {
    const { variants, ...data } = prod;
    await prisma.product.upsert({
      where: { slug: data.slug },
      update: {},
      create: {
        ...data,
        variants: { create: variants },
      },
    });
  }

  console.log(`✓ Created ${products.length} products`);
  console.log("\n✅ Seeding complete!");
  console.log("─────────────────────────────────");
  console.log("Admin login:  admin@mostylehub.com");
  console.log("Password:     admin123");
  console.log("─────────────────────────────────");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
