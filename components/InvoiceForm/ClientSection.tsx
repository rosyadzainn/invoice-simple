"use client";

import { InvoiceData } from "@/types/invoice";
import { useLanguage } from "@/context/LanguageContext";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";

interface Props {
  data: InvoiceData;
  onChange: (updates: Partial<InvoiceData>) => void;
}

export default function ClientSection({ data, onChange }: Props) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xs font-semibold text-emerald-400/70 uppercase tracking-widest pl-3 border-l-2 border-emerald-500/50">
        {t.billTo}
      </h3>

      <Input
        label={t.clientName}
        placeholder={t.phClientName}
        value={data.clientName}
        onChange={(e) => onChange({ clientName: e.target.value })}
      />

      <Input
        label={t.email}
        type="email"
        placeholder={t.phClientEmail}
        value={data.clientEmail}
        onChange={(e) => onChange({ clientEmail: e.target.value })}
      />

      <Textarea
        label={t.address}
        placeholder={t.phClientAddress}
        value={data.clientAddress}
        onChange={(e) => onChange({ clientAddress: e.target.value })}
        rows={3}
      />
    </div>
  );
}
