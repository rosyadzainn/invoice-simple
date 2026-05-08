import { InvoiceData } from "@/types/invoice";

export function encodeInvoice(data: InvoiceData): string {
  const { logoUrl: _logo, ...rest } = data;
  const json = JSON.stringify(rest);
  const bytes = new TextEncoder().encode(json);
  const binStr = Array.from(bytes, (b) => String.fromCharCode(b)).join("");
  return btoa(binStr).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

export function decodeInvoice(encoded: string): Partial<InvoiceData> | null {
  try {
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const binStr = atob(base64);
    const bytes = Uint8Array.from(binStr, (c) => c.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function getShareUrl(data: InvoiceData): string {
  return `${window.location.origin}${window.location.pathname}?i=${encodeInvoice(data)}`;
}
