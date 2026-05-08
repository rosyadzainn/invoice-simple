export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

export interface InvoiceData {
  // Sender
  senderName: string;
  senderEmail: string;
  senderAddress: string;
  senderPhone: string;
  logoUrl: string | null;

  // Client
  clientName: string;
  clientEmail: string;
  clientAddress: string;

  // Invoice meta
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  currency: string;

  // Line items
  items: InvoiceItem[];

  // Style
  accentColor: string;

  // Totals
  discount: number;
  taxRate: number;
  notes: string;
}

export const CURRENCIES = [
  { code: "USD", symbol: "$", label: "USD — US Dollar" },
  { code: "EUR", symbol: "€", label: "EUR — Euro" },
  { code: "GBP", symbol: "£", label: "GBP — British Pound" },
  { code: "IDR", symbol: "Rp", label: "IDR — Indonesian Rupiah" },
  { code: "JPY", symbol: "¥", label: "JPY — Japanese Yen" },
  { code: "CAD", symbol: "CA$", label: "CAD — Canadian Dollar" },
  { code: "AUD", symbol: "A$", label: "AUD — Australian Dollar" },
  { code: "SGD", symbol: "S$", label: "SGD — Singapore Dollar" },
] as const;

export type CurrencyCode = (typeof CURRENCIES)[number]["code"];
