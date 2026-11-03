import React from "react";
import { cn } from "@/lib/utils";

/** Hex-nut mark with a "PT" monogram — the workshop's own logo, not a stock icon. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={cn("w-11 h-11", className)} aria-hidden="true">
      <path d="M24 2 43 13v22L24 46 5 35V13z" fill="#ff6a13" />
      <path d="M24 9 37 16.5v15L24 39 11 31.5v-15z" fill="#100f0d" />
      <text
        x="24"
        y="29.5"
        textAnchor="middle"
        fontFamily="var(--font-display), sans-serif"
        fontWeight="800"
        fontSize="15"
        fill="#ff6a13"
        letterSpacing="-0.5"
      >
        PT
      </text>
    </svg>
  );
}

/** Argentine Mercosur license plate, used as a brand element and as the tracker CTA. */
export function MercosurPlate({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative inline-flex flex-col rounded-md bg-white border-[3px] border-slate-900 shadow-[0_8px_0_0_rgba(0,0,0,0.35)] overflow-hidden",
        className
      )}
    >
      <div className="h-5 bg-[#0b3fa8] flex items-center justify-between px-2 text-[9px] font-bold tracking-[0.2em] text-white">
        <span>MERCOSUR</span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-2 bg-sky-300 inline-block relative">
            <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[3px] bg-white" />
          </span>
          ARGENTINA
        </span>
      </div>
      <div className="px-4 py-1 font-display font-bold text-slate-950 tracking-[0.12em] leading-none">
        {children}
      </div>
    </div>
  );
}
