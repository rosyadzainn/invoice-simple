"use client";

import { InvoiceData } from "@/types/invoice";
import Card from "@/components/ui/Card";
import SenderSection from "./SenderSection";
import ClientSection from "./ClientSection";
import MetaSection from "./MetaSection";
import ItemsTable from "./ItemsTable";
import TotalsSection from "./TotalsSection";

interface InvoiceFormProps {
  data: InvoiceData;
  onChange: (updates: Partial<InvoiceData>) => void;
}

export default function InvoiceForm({ data, onChange }: InvoiceFormProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Sender + Client — side by side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <SenderSection data={data} onChange={onChange} />
        </Card>
        <Card>
          <ClientSection data={data} onChange={onChange} />
        </Card>
      </div>

      {/* Invoice meta — number, dates, currency */}
      <Card>
        <MetaSection data={data} onChange={onChange} />
      </Card>

      {/* Line items */}
      <Card>
        <ItemsTable data={data} onChange={onChange} />
      </Card>

      {/* Tax, totals, notes */}
      <Card>
        <TotalsSection data={data} onChange={onChange} />
      </Card>
    </div>
  );
}
