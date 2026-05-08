export type Language = "en" | "id" | "es" | "fr" | "ja";

export interface Translations {
  // App shell
  ready: string;
  invoiceDetails: string;
  livePreview: string;

  // Form section headings
  from: string;
  billTo: string;
  meta: string;

  // Field labels
  businessName: string;
  email: string;
  phone: string;
  address: string;
  clientName: string;
  invoiceNumber: string;
  currency: string;
  issueDate: string;
  dueDate: string;

  // Items table
  lineItems: string;
  description: string;
  qty: string;
  rate: string;
  amount: string;
  addItem: string;

  // Totals
  discount: string;
  taxRate: string;
  subtotal: string;
  totalDue: string;

  // Notes
  notesPaymentTerms: string;
  notes: string;

  // Preview meta labels
  number: string;

  // Action buttons
  downloadPDF: string;
  generating: string;
  print: string;

  // Preview misc
  noDescription: string;
  thankYou: string;

  // Placeholders
  phBusinessName: string;
  phEmail: string;
  phSenderEmail: string;
  phPhone: string;
  phSenderAddress: string;
  phClientName: string;
  phClientEmail: string;
  phClientAddress: string;
  phInvoiceNumber: string;
  phItemDescription: string;
  phNotes: string;
}

export const LOCALE_MAP: Record<Language, string> = {
  en: "en-US",
  id: "id-ID",
  es: "es-ES",
  fr: "fr-FR",
  ja: "ja-JP",
};

export const LANGUAGE_LABELS: Record<Language, string> = {
  en: "English",
  id: "Bahasa Indonesia",
  es: "Español",
  fr: "Français",
  ja: "日本語",
};

export function formatDate(dateStr: string, language: Language): string {
  if (!dateStr) return "—";
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString(LOCALE_MAP[language], {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const en: Translations = {
  ready: "Ready",
  invoiceDetails: "Invoice Details",
  livePreview: "Live Preview",
  from: "From",
  billTo: "Bill To",
  meta: "Invoice Details",
  businessName: "Business Name",
  email: "Email",
  phone: "Phone",
  address: "Address",
  clientName: "Client Name",
  invoiceNumber: "Invoice Number",
  currency: "Currency",
  issueDate: "Issue Date",
  dueDate: "Due Date",
  lineItems: "Line Items",
  description: "Description",
  qty: "Qty",
  rate: "Rate",
  amount: "Amount",
  addItem: "Add Item",
  discount: "Discount",
  taxRate: "Tax Rate",
  subtotal: "Subtotal",
  totalDue: "Total Due",
  notesPaymentTerms: "Notes / Payment Terms",
  notes: "Notes",
  number: "Number",
  downloadPDF: "Download PDF",
  generating: "Generating...",
  print: "Print",
  noDescription: "No description",
  thankYou: "Thank you for your business.",
  phBusinessName: "Your Company",
  phEmail: "you@company.com",
  phSenderEmail: "you@company.com",
  phPhone: "+1 (555) 000-0000",
  phSenderAddress: "123 Main St\nCity, State 00000",
  phClientName: "Client Company",
  phClientEmail: "client@company.com",
  phClientAddress: "456 Client Ave\nCity, State 00000",
  phInvoiceNumber: "INV-001",
  phItemDescription: "Item description",
  phNotes: "Payment due within 30 days. Thank you for your business!",
};

const id: Translations = {
  ready: "Siap",
  invoiceDetails: "Detail Invoice",
  livePreview: "Pratinjau Langsung",
  from: "Dari",
  billTo: "Tagihan Kepada",
  meta: "Detail Invoice",
  businessName: "Nama Bisnis",
  email: "Email",
  phone: "Telepon",
  address: "Alamat",
  clientName: "Nama Klien",
  invoiceNumber: "Nomor Invoice",
  currency: "Mata Uang",
  issueDate: "Tanggal Dibuat",
  dueDate: "Tanggal Jatuh Tempo",
  lineItems: "Item Tagihan",
  description: "Deskripsi",
  qty: "Jml",
  rate: "Harga",
  amount: "Jumlah",
  addItem: "Tambah Item",
  discount: "Diskon",
  taxRate: "Tarif Pajak",
  subtotal: "Subtotal",
  totalDue: "Total Tagihan",
  notesPaymentTerms: "Catatan / Syarat Pembayaran",
  notes: "Catatan",
  number: "Nomor",
  downloadPDF: "Unduh PDF",
  generating: "Memproses...",
  print: "Cetak",
  noDescription: "Tidak ada deskripsi",
  thankYou: "Terima kasih atas kepercayaan Anda.",
  phBusinessName: "Perusahaan Anda",
  phEmail: "anda@perusahaan.com",
  phSenderEmail: "anda@perusahaan.com",
  phPhone: "+62 21 0000-0000",
  phSenderAddress: "Jl. Sudirman No.1\nJakarta, 10220",
  phClientName: "Perusahaan Klien",
  phClientEmail: "klien@perusahaan.com",
  phClientAddress: "Jl. Thamrin No.2\nJakarta, 10230",
  phInvoiceNumber: "INV-001",
  phItemDescription: "Deskripsi item",
  phNotes: "Pembayaran jatuh tempo dalam 30 hari. Terima kasih!",
};

const es: Translations = {
  ready: "Listo",
  invoiceDetails: "Detalles de factura",
  livePreview: "Vista previa",
  from: "De",
  billTo: "Facturar a",
  meta: "Detalles de factura",
  businessName: "Nombre del negocio",
  email: "Correo electrónico",
  phone: "Teléfono",
  address: "Dirección",
  clientName: "Nombre del cliente",
  invoiceNumber: "Número de factura",
  currency: "Moneda",
  issueDate: "Fecha de emisión",
  dueDate: "Fecha de vencimiento",
  lineItems: "Artículos",
  description: "Descripción",
  qty: "Cant.",
  rate: "Precio",
  amount: "Importe",
  addItem: "Agregar artículo",
  discount: "Descuento",
  taxRate: "Tasa de impuesto",
  subtotal: "Subtotal",
  totalDue: "Total a pagar",
  notesPaymentTerms: "Notas / Condiciones de pago",
  notes: "Notas",
  number: "Número",
  downloadPDF: "Descargar PDF",
  generating: "Generando...",
  print: "Imprimir",
  noDescription: "Sin descripción",
  thankYou: "Gracias por su negocio.",
  phBusinessName: "Tu empresa",
  phEmail: "tu@empresa.com",
  phSenderEmail: "tu@empresa.com",
  phPhone: "+34 91 000 00 00",
  phSenderAddress: "Calle Mayor 1\nMadrid, 28001",
  phClientName: "Empresa cliente",
  phClientEmail: "cliente@empresa.com",
  phClientAddress: "Calle Gran Vía 2\nMadrid, 28013",
  phInvoiceNumber: "FAC-001",
  phItemDescription: "Descripción del artículo",
  phNotes: "Pago a 30 días. ¡Gracias por su confianza!",
};

const fr: Translations = {
  ready: "Prêt",
  invoiceDetails: "Détails facture",
  livePreview: "Aperçu en direct",
  from: "De",
  billTo: "Facturer à",
  meta: "Détails de la facture",
  businessName: "Nom de l'entreprise",
  email: "E-mail",
  phone: "Téléphone",
  address: "Adresse",
  clientName: "Nom du client",
  invoiceNumber: "Numéro de facture",
  currency: "Devise",
  issueDate: "Date d'émission",
  dueDate: "Date d'échéance",
  lineItems: "Articles",
  description: "Description",
  qty: "Qté",
  rate: "Prix unitaire",
  amount: "Montant",
  addItem: "Ajouter un article",
  discount: "Remise",
  taxRate: "Taux de TVA",
  subtotal: "Sous-total",
  totalDue: "Total à payer",
  notesPaymentTerms: "Notes / Conditions de paiement",
  notes: "Notes",
  number: "Numéro",
  downloadPDF: "Télécharger PDF",
  generating: "Génération...",
  print: "Imprimer",
  noDescription: "Sans description",
  thankYou: "Merci pour votre confiance.",
  phBusinessName: "Votre entreprise",
  phEmail: "vous@entreprise.fr",
  phSenderEmail: "vous@entreprise.fr",
  phPhone: "+33 1 00 00 00 00",
  phSenderAddress: "1 Rue de la Paix\nParis, 75001",
  phClientName: "Entreprise cliente",
  phClientEmail: "client@entreprise.fr",
  phClientAddress: "2 Avenue des Champs\nParis, 75008",
  phInvoiceNumber: "FAC-001",
  phItemDescription: "Description de l'article",
  phNotes: "Paiement sous 30 jours. Merci pour votre confiance !",
};

const ja: Translations = {
  ready: "準備完了",
  invoiceDetails: "請求書詳細",
  livePreview: "プレビュー",
  from: "差出人",
  billTo: "請求先",
  meta: "請求書詳細",
  businessName: "会社名",
  email: "メール",
  phone: "電話番号",
  address: "住所",
  clientName: "顧客名",
  invoiceNumber: "請求書番号",
  currency: "通貨",
  issueDate: "発行日",
  dueDate: "支払期日",
  lineItems: "項目",
  description: "説明",
  qty: "数量",
  rate: "単価",
  amount: "金額",
  addItem: "項目追加",
  discount: "割引",
  taxRate: "税率",
  subtotal: "小計",
  totalDue: "合計金額",
  notesPaymentTerms: "備考・支払条件",
  notes: "備考",
  number: "番号",
  downloadPDF: "PDFダウンロード",
  generating: "生成中...",
  print: "印刷",
  noDescription: "説明なし",
  thankYou: "ご利用ありがとうございます。",
  phBusinessName: "株式会社サンプル",
  phEmail: "info@company.jp",
  phSenderEmail: "info@company.jp",
  phPhone: "03-0000-0000",
  phSenderAddress: "東京都千代田区丸の内1-1-1",
  phClientName: "株式会社クライアント",
  phClientEmail: "client@company.jp",
  phClientAddress: "東京都新宿区西新宿2-2-2",
  phInvoiceNumber: "INV-001",
  phItemDescription: "作業内容",
  phNotes: "お支払いは30日以内にお願いします。ご利用ありがとうございます。",
};

export const translations: Record<Language, Translations> = { en, id, es, fr, ja };
