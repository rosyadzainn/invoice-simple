import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["html2canvas", "jspdf"],
  turbopack: {
    resolveAlias: {
      // Turbopack picks the CJS build by default and fails to chunk it.
      // Pointing to the ESM build lets Turbopack handle it correctly.
      html2canvas: "html2canvas/dist/html2canvas.esm.js",
    },
  },
};

export default nextConfig;
