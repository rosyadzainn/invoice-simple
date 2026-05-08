"use client";

import { useState, useEffect } from "react";
import { FileText, Users, Download, Printer, FilePlus, Clock } from "lucide-react";
import { InvoiceData } from "@/types/invoice";
import { LanguageProvider, useLanguage } from "@/context/LanguageContext";
import InvoiceForm from "@/components/InvoiceForm";
import InvoicePreview from "@/components/InvoicePreview";
import InvoiceHistory from "@/components/InvoiceHistory";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { useOnlineCount } from "@/hooks/useOnlineCount";
import { useStats } from "@/hooks/useStats";
import { useInvoiceHistory } from "@/hooks/useInvoiceHistory";
import { decodeInvoice, getShareUrl } from "@/lib/share";

const today = new Date().toISOString().split("T")[0];

const defaultInvoice: InvoiceData = {
  senderName: "",
  senderEmail: "",
  senderAddress: "",
  senderPhone: "",
  logoUrl: null,
  clientName: "",
  clientEmail: "",
  clientAddress: "",
  invoiceNumber: "INV-001",
  issueDate: today,
  dueDate: "",
  currency: "USD",
  accentColor: "#10b981",
  items: [{ id: "item-1", description: "", quantity: 1, rate: 0 }],
  discount: 0,
  taxRate: 0,
  paymentDetails: "",
  notes: "",
};


function InvoiceApp() {
  const { t } = useLanguage();
  const { list, activeId, activeData, ready, update, createNew, loadEntry, removeEntry } =
    useInvoiceHistory(defaultInvoice);
  const [invoice, setInvoice] = useState<InvoiceData>(defaultInvoice);
  const [historyOpen, setHistoryOpen] = useState(false);
  const onlineCount = useOnlineCount();
  const { pdfCount, printCount } = useStats();

  // Sync local invoice state when switching active entry
  useEffect(() => {
    if (ready) setInvoice(activeData);
  }, [activeId, ready]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle shared URL param after history is ready
  useEffect(() => {
    if (!ready) return;
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get("i");
    if (encoded) {
      const decoded = decodeInvoice(encoded);
      if (decoded) {
        const merged = { ...defaultInvoice, ...decoded };
        setInvoice(merged);
        update(merged);
      }
    }
  }, [ready]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (updates: Partial<InvoiceData>) => {
    const next = { ...invoice, ...updates };
    setInvoice(next);
    update(next);
  };

  const handleShare = async () => {
    const url = getShareUrl(invoice);
    await navigator.clipboard.writeText(url);
  };

  const handleNew = () => {
    if (confirm("Start a new invoice? Your current invoice will be saved to history.")) {
      const fresh = { ...defaultInvoice, issueDate: new Date().toISOString().split("T")[0] };
      createNew(fresh);
      setInvoice(fresh);
    }
  };

  const handleLoad = (id: string) => {
    const data = loadEntry(id);
    if (data) setInvoice(data);
    setHistoryOpen(false);
  };

  const handleDelete = (id: string) => {
    removeEntry(id);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--background)" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-50 px-5 py-3.5 flex items-center justify-between no-print"
        style={{
          background: "rgba(8,8,8,0.88)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.09)",
        }}
      >
        {/* Logo + wordmark */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <FileText size={15} className="text-white" />
          </div>
          <span className="font-semibold text-white text-lg tracking-tight">
            Invoice<span className="gradient-text">Simple</span>
          </span>
          <button
            onClick={handleNew}
            className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors ml-2"
          >
            <FilePlus size={13} />
            <span>New</span>
          </button>
          <button
            onClick={() => setHistoryOpen(true)}
            className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors"
          >
            <Clock size={13} />
            <span>History</span>
            {list.length > 1 && (
              <span className="text-[10px] text-white/30 bg-white/8 rounded-full px-1.5 py-0.5 tabular-nums">
                {list.length}
              </span>
            )}
          </button>
        </div>

        {/* Right side: online count + language switcher */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
            <Users size={12} className="text-emerald-400" />
            <span className="text-emerald-400 font-semibold">{onlineCount}</span>
            <span className="text-white/35">online</span>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      {/* Two-panel layout */}
      <main className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Left — Form */}
        <section
          className="lg:w-[52%] overflow-y-auto p-6 lg:p-8 no-print"
          style={{ borderRight: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="max-w-2xl mx-auto">
            <p className="text-xs font-semibold text-white/35 uppercase tracking-widest mb-5">
              {t.invoiceDetails}
            </p>
            <InvoiceForm data={invoice} onChange={handleChange} />
            <div className="h-12" />
          </div>
        </section>

        {/* Right — Live Preview */}
        <section
          className="lg:w-[48%] overflow-y-auto p-6 lg:p-8 print-section"
          style={{ background: "rgba(255,255,255,0.012)" }}
        >
          <div className="max-w-xl mx-auto">
            <p className="text-xs font-semibold text-white/35 uppercase tracking-widest mb-5 no-print">
              {t.livePreview}
            </p>
            <InvoicePreview data={invoice} onShare={handleShare} />
            <div className="h-12 no-print" />
          </div>
        </section>
      </main>

      {/* Invoice History drawer */}
      {historyOpen && (
        <InvoiceHistory
          list={list}
          activeId={activeId}
          onLoad={handleLoad}
          onDelete={handleDelete}
          onClose={() => setHistoryOpen(false)}
        />
      )}

      {/* Subtle stats widget — bottom right */}
      <div className="fixed bottom-4 right-4 flex items-center gap-3 text-[10px] text-white/20 no-print select-none">
        <div className="flex items-center gap-1">
          <Download size={10} />
          <span>{pdfCount.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-1">
          <Printer size={10} />
          <span>{printCount.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

// Root export wraps everything in the language context.
export default function Home() {
  return (
    <LanguageProvider>
      <InvoiceApp />
    </LanguageProvider>
  );
}
