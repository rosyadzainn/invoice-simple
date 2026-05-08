import { InvoiceItem } from "@/types/invoice";

export function calcLineTotal(item: InvoiceItem): number {
  return item.quantity * item.rate;
}

export function calcSubtotal(items: InvoiceItem[]): number {
  return items.reduce((sum, item) => sum + calcLineTotal(item), 0);
}

export function calcDiscount(subtotal: number, discountRate: number): number {
  return subtotal * (discountRate / 100);
}

export function calcTax(subtotal: number, taxRate: number): number {
  return subtotal * (taxRate / 100);
}

export function calcTotal(subtotal: number, discount: number, tax: number): number {
  return subtotal - discount + tax;
}

export function formatCurrency(amount: number, symbol: string): string {
  return `${symbol}${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
