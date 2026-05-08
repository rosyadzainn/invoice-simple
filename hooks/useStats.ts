"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Stats {
  pdfCount: number;
  printCount: number;
}

export function useStats(): Stats {
  const [stats, setStats] = useState<Stats>({ pdfCount: 0, printCount: 0 });

  useEffect(() => {
    supabase
      .from("stats")
      .select("pdf_count, print_count")
      .eq("id", 1)
      .single()
      .then(({ data }) => {
        if (data) setStats({ pdfCount: data.pdf_count, printCount: data.print_count });
      });

    const channel = supabase
      .channel("stats-changes")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "stats" },
        (payload) => {
          const row = payload.new as { pdf_count: number; print_count: number };
          setStats({ pdfCount: row.pdf_count, printCount: row.print_count });
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  return stats;
}
