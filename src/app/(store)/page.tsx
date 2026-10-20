import { HeroSection } from "@/components/store/HeroSection";
import { FeaturedProducts } from "@/components/store/FeaturedProducts";
import { CategoriesSection } from "@/components/store/CategoriesSection";
import { BrandStory } from "@/components/store/BrandStory";
import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/utils";

// Revalidate homepage every 5 minutes — serves cached version instantly
export const revalidate = 300;

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    prisma.product.findMany({
      where: { featured: true, isActive: true },
      include: { category: true, variants: true },
      take: 8,
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div>
      <HeroSection />
      <CategoriesSection categories={categories} />
      <FeaturedProducts products={featuredProducts.map(serializeProduct) as any} />
      <BrandStory />
    </div>
  );
}
