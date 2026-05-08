"use client";

import { useState } from "react";
import { Download, Printer, Loader2, Link, Check } from "lucide-react";
import { InvoiceData } from "@/types/invoice";
import { useLanguage } from "@/context/LanguageContext";
import Button from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";
import TemplateSimple  from "@/components/templates/TemplateSimple";
import TemplateModern  from "@/components/templates/TemplateModern";
import TemplateMinimal from "@/components/templates/TemplateMinimal";

interface Props {
  data: InvoiceData;
  onShare: () => Promise<void>;
}

export default function InvoicePreview({ data, onShare }: Props) {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { t, language } = useLanguage();

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

  const template = data.template ?? "simple";

  return (
    <div className="flex flex-col gap-4">
      {/* Action bar */}
      <div className="flex items-center gap-2 no-print">
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
      </div>

      {/* Invoice preview — captured by html2canvas */}
      <div
        id="invoice-preview"
        className="rounded-2xl shadow-2xl overflow-hidden"
        style={{
          fontFamily:      "Arial, Helvetica, sans-serif",
          backgroundColor: "#ffffff",
          boxShadow:       "0 25px 50px -12px rgba(0,0,0,0.5)",
        }}
      >
        {template === "modern"  && <TemplateModern  data={data} t={t} language={language} />}
        {template === "minimal" && <TemplateMinimal data={data} t={t} language={language} />}
        {template === "simple"  && <TemplateSimple  data={data} t={t} language={language} />}
      </div>
    </div>
  );
}
