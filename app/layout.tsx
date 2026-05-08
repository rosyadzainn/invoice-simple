import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const BASE = "https://zainogen.com";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: "Invoice Simple — Free Invoice Generator",
    template: "%s | Invoice Simple",
  },
  description:
    "Create, preview, and download professional invoices in seconds. Free invoice generator — no sign-up, no watermarks, instant PDF. Supports 3 templates, multi-currency, and multi-language.",
  keywords: [
    "invoice generator",
    "free invoice maker",
    "invoice template",
    "pdf invoice",
    "online invoice",
    "buat invoice online",
    "invoice gratis",
    "generator invoice",
    "invoice maker",
    "professional invoice",
  ],
  authors: [{ name: "Invoice Simple" }],
  creator: "Invoice Simple",
  openGraph: {
    type: "website",
    url: BASE,
    siteName: "Invoice Simple",
    title: "Invoice Simple — Free Invoice Generator",
    description:
      "Create professional invoices in seconds. Free, no sign-up, instant PDF download. Beautiful templates included.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Invoice Simple — Free Invoice Generator",
    description:
      "Create professional invoices in seconds. Free, no sign-up, instant PDF download.",
    images: ["/opengraph-image"],
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "InvoiceSimple",
  },
  verification: {
    google: "lB3jd9e1s7cSANk2SC2mtl4hfQuYLUqIizYI9HuOGWI",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#10b981",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
