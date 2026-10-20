import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="font-display text-xl tracking-widest uppercase mb-4">
              Mo Style Hub
            </h3>
            <p className="text-[#6b6b6b] text-sm leading-relaxed font-sans-clean">
              Timeless fashion for the modern individual. Quality craftsmanship
              meets contemporary design.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs tracking-widest uppercase font-sans-clean mb-4 text-[#c9a96e]">
              Shop
            </h4>
            <ul className="space-y-3">
              {[
                { label: "All Products", href: "/shop" },
                { label: "Women", href: "/shop?category=women" },
                { label: "Men", href: "/shop?category=men" },
                { label: "Accessories", href: "/shop?category=accessories" },
                { label: "New Arrivals", href: "/shop?sort=newest" },
                { label: "Sale", href: "/shop?sale=true" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#6b6b6b] text-sm font-sans-clean hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-xs tracking-widest uppercase font-sans-clean mb-4 text-[#c9a96e]">
              Help
            </h4>
            <ul className="space-y-3">
              {[
                { label: "My Orders", href: "/orders" },
                { label: "Shipping & Returns", href: "/shipping" },
                { label: "Size Guide", href: "/size-guide" },
                { label: "FAQ", href: "/faq" },
                { label: "Contact Us", href: "/contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#6b6b6b] text-sm font-sans-clean hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs tracking-widest uppercase font-sans-clean mb-4 text-[#c9a96e]">
              Stay in Style
            </h4>
            <p className="text-[#6b6b6b] text-sm font-sans-clean mb-4">
              Subscribe for exclusive offers and new arrivals.
            </p>
            <form className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="input-luxury bg-[#2a2a2a] border-[#3a3a3a] text-white placeholder:text-[#6b6b6b] text-sm w-full"
              />
              <button type="submit" className="btn-gold py-2.5 w-full">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#2a2a2a] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#6b6b6b] text-xs font-sans-clean">
            © {new Date().getFullYear()} Mo Style Hub. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-[#6b6b6b] text-xs font-sans-clean hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-[#6b6b6b] text-xs font-sans-clean hover:text-white">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
