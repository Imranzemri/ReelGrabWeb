"use client";

import { useEffect } from "react";

// Renders a Google AdSense unit. If no publisher ID / slot is set,
// it renders nothing (so dev and pre-approval builds stay clean).
export default function AdSlot({
  slot,
  className = "",
  format = "auto",
}: {
  slot?: string;
  className?: string;
  format?: string;
}) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  useEffect(() => {
    if (!client || !slot) return;
    try {
      // @ts-expect-error - adsbygoogle is injected by the AdSense script.
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* no-op */
    }
  }, [client, slot]);

  if (!client || !slot) {
    return (
      <div
        className={`flex items-center justify-center rounded-xl border border-dashed border-white/10 text-[11px] uppercase tracking-widest text-white/25 ${className}`}
        style={{ minHeight: 90 }}
        aria-hidden
      >
        ad space
      </div>
    );
  }

  return (
    <ins
      className={`adsbygoogle block ${className}`}
      style={{ display: "block" }}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}
