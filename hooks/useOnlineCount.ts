"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function useOnlineCount(): number {
  const [count, setCount] = useState(1);

  useEffect(() => {
    const sessionId = crypto.randomUUID();

    const channel = supabase.channel("online-users", {
      config: { presence: { key: sessionId } },
    });

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        setCount(Object.keys(state).length);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ online_at: new Date().toISOString() });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return count;
}
