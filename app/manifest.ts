import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Invoice Simple",
    short_name: "InvoiceSimple",
    description: "Create professional invoices in seconds. Free, fast, beautifully designed.",
    start_url: "/app",
    display: "standalone",
    background_color: "#080808",
    theme_color: "#10b981",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
