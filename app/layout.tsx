import React from "react"
import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: "Premium Lounge & Bar | Downtown Miami Nightlife",
  description:
    "Experience the best nightlife in Downtown Miami with smooth drinks, curated sound, and an exclusive atmosphere.",
  generator: "v0.app",
  keywords: [
    "Miami bar",
    "lounge Miami",
    "nightlife Miami",
    "cocktails Miami",
    "downtown Miami bar",
  ],
  openGraph: {
    title: "Premium Lounge & Bar | Downtown Miami Nightlife",
    description:
      "Experience the best nightlife in Downtown Miami with smooth drinks, curated sound, and an exclusive atmosphere.",
    type: "website",
  },
  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#070B1A",
  width: "device-width",
  initialScale: 1,
};

import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.className} ${playfair.variable} font-sans antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        {children}
        <Toaster position="top-center" richColors />
        <Analytics />
      </body>
    </html>
  );
}
