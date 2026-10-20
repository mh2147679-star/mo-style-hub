import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/layout/SessionProvider";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: {
    default: "Mo Style Hub — Premium Clothing Brand",
    template: "%s | Mo Style Hub",
  },
  description:
    "Discover timeless fashion at Mo Style Hub. Premium clothing crafted for the modern individual.",
  keywords: ["fashion", "clothing", "luxury", "style", "Mo Style Hub"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "Mo Style Hub",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  );
}
