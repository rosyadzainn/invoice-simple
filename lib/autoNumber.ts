import type { SavedInvoice } from "@/hooks/useInvoiceHistory";

export function nextInvoiceNumber(list: SavedInvoice[]): string {
  let maxNum = 0;
  let prefix = "INV-";
  let padLen = 3;

  for (const entry of list) {
    const n = entry.data.invoiceNumber ?? "";
    const m = n.match(/^(.*?)(\d+)$/);
    if (m) {
      const num = parseInt(m[2], 10);
      if (num > maxNum) {
        maxNum = num;
        prefix = m[1];
        padLen = Math.max(m[2].length, 3);
      }
    }
  }

  return `${prefix}${String(maxNum + 1).padStart(padLen, "0")}`;
}
