"use client";

import { useState } from "react";
import { Download, Printer, Loader2, Link, Check, CheckCircle, Circle, AlertCircle } from "lucide-react";
import { InvoiceData, InvoiceStatus } from "@/types/invoice";
import { useLanguage } from "@/context/LanguageContext";
import Button from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";
import TemplateSimple  from "@/components/templates/TemplateSimple";
import TemplateModern  from "@/components/templates/TemplateModern";
import TemplateMinimal from "@/components/templates/TemplateMinimal";

interface Props {
  data: InvoiceData;
  onShare: () => Promise<void>;
  onChange: (updates: Partial<InvoiceData>) => void;
}

const STATUS_CYCLE: Record<InvoiceStatus, InvoiceStatus> = {
  unpaid: "paid",
  paid:   "overdue",
  overdue: "unpaid",
};

const STATUS_CONFIG: Record<InvoiceStatus, { label: string; color: string; bg: string }> = {
  unpaid:  { label: "Unpaid",  color: "#6b7280", bg: "rgba(107,114,128,0.12)" },
  paid:    { label: "Paid",    color: "#10b981", bg: "rgba(16,185,129,0.12)"  },
  overdue: { label: "Overdue", color: "#ef4444", bg: "rgba(239,68,68,0.12)"   },
};

export default function InvoicePreview({ data, onShare, onChange }: Props) {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { t, language } = useLanguage();

  const status = data.status ?? "unpaid";
  const statusCfg = STATUS_CONFIG[status];

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const { downloadInvoicePDF } = await import("@/lib/pdf");
      await downloadInvoicePDF("invoice-preview", `${data.invoiceNumber || "invoice"}.pdf`);
      supabase.rpc("increment_stat", { col: "pdf" });
    } catch (err) {
      console.error("PDF error:", err);
      alert(`PDF generation failed:\n${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    await onShare();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    import("@/lib/print").then(({ printInvoice }) => {
      printInvoice(data, t, language);
      supabase.rpc("increment_stat", { col: "print" });
    });
  };

  const cycleStatus = () => {
    onChange({ status: STATUS_CYCLE[status] });
  };

  const template = data.template ?? "simple";

  return (
    <div className="flex flex-col gap-4">
      {/* Action bar */}
      <div className="flex items-center gap-2 flex-wrap no-print">
        <Button variant="primary" size="sm" onClick={handleDownload} disabled={downloading}>
          {downloading ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
          {downloading ? t.generating : t.downloadPDF}
        </Button>
        <Button variant="ghost" size="sm" onClick={handlePrint}>
          <Printer size={13} />
          {t.print}
        </Button>
        <Button variant="ghost" size="sm" onClick={handleShare}>
          {copied ? <Check size={13} className="text-emerald-400" /> : <Link size={13} />}
          {copied ? "Copied!" : "Share"}
        </Button>

        {/* Status toggle */}
        <button
          onClick={cycleStatus}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ml-auto"
          style={{ background: statusCfg.bg, color: statusCfg.color }}
        >
          {status === "paid"    && <CheckCircle  size={12} />}
          {status === "overdue" && <AlertCircle  size={12} />}
          {status === "unpaid"  && <Circle       size={12} />}
          {statusCfg.label}
        </button>
      </div>

      {/* Invoice preview — captured by html2canvas */}
      <div
        id="invoice-preview"
        className="rounded-2xl shadow-2xl overflow-hidden"
        style={{
          fontFamily:      "Arial, Helvetica, sans-serif",
          backgroundColor: "#ffffff",
          boxShadow:       "0 25px 50px -12px rgba(0,0,0,0.5)",
          position:        "relative",
        }}
      >
        {/* Paid / Overdue stamp */}
        {status !== "unpaid" && (
          <div
            style={{
              position:       "absolute",
              inset:          0,
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              zIndex:         10,
              pointerEvents:  "none",
            }}
          >
            <div
              style={{
                transform:     "rotate(-22deg)",
                border:        `5px solid ${status === "paid" ? "#10b981" : "#ef4444"}`,
                borderRadius:  "8px",
                padding:       "10px 36px",
                color:          status === "paid" ? "#10b981" : "#ef4444",
                fontSize:      "52px",
                fontWeight:    "900",
                letterSpacing: "0.15em",
                opacity:       0.22,
                userSelect:    "none",
                fontFamily:    "Arial, Helvetica, sans-serif",
                whiteSpace:    "nowrap",
              }}
            >
              {status === "paid" ? "PAID" : "OVERDUE"}
            </div>
          </div>
        )}

        {template === "modern"  && <TemplateModern  data={data} t={t} language={language} />}
        {template === "minimal" && <TemplateMinimal data={data} t={t} language={language} />}
        {template === "simple"  && <TemplateSimple  data={data} t={t} language={language} />}
      </div>
    </div>
  );
}
