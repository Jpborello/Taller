"use client";

import React, { useEffect, useState } from "react";
import { useWorkshop } from "@/context/WorkshopContext";
import { Menu, Plus, Phone, UserPlus } from "lucide-react";
import { WorkOrderModal } from "./WorkOrderModal";
import { ClientModal } from "./ClientModal";
import { WhatsAppModal } from "./WhatsAppModal";

export function AdminHeader({
  onOpenMobileSidebar,
}: {
  onOpenMobileSidebar: () => void;
}) {
  const { settings, clients } = useWorkshop();
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);

  // Read the clock only on the client (Next prerenders this component)
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    const first = setTimeout(tick, 0);
    const interval = setInterval(tick, 60_000);
    return () => {
      clearTimeout(first);
      clearInterval(interval);
    };
  }, []);

  const dateLabel = now?.toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long" }) ?? "";
  const today = dateLabel.charAt(0).toUpperCase() + dateLabel.slice(1);
  const hour = now ? now.getHours() + now.getMinutes() / 60 : 0;
  const day = now?.getDay() ?? 0;
  // Mon–Fri 08:00–18:30, Sat 08:00–13:00 (matches settings.openingHours)
  const isOpen = day >= 1 && day <= 5 ? hour >= 8 && hour < 18.5 : day === 6 ? hour >= 8 && hour < 13 : false;

  return (
    <>
      <header className="sticky top-0 z-20 bg-slate-950/85 backdrop-blur-md border-b border-slate-800 px-3 sm:px-6 py-3.5">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Mobile hamburger & Workshop title */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onOpenMobileSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="font-display font-extrabold uppercase text-lg sm:text-xl text-white leading-none tracking-wide whitespace-nowrap">
                  {settings.name}
                </h1>
                {now && (
                  <span
                    className={`hidden sm:inline-flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm ${
                      isOpen ? "bg-emerald-500/15 text-emerald-300" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? "bg-emerald-400 animate-pulse" : "bg-slate-500"}`} />
                    {isOpen ? "Portón abierto" : "Taller cerrado"}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block mt-1">
                {today && `${today} · `}{settings.address}
              </p>
            </div>
          </div>

          {/* Right: Quick Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsClientModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700/80 transition-all"
            >
              <UserPlus className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Nuevo Cliente</span>
            </button>

            <button
              type="button"
              onClick={() => setIsOrderModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="sm:hidden whitespace-nowrap">Nueva orden</span>
              <span className="hidden sm:inline">Nueva Orden / Presupuesto</span>
            </button>

            {clients.length > 0 && (
              <button
                type="button"
                onClick={() => setIsWhatsAppOpen(true)}
                className="hidden sm:block p-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 transition-colors"
                title="Mensaje Rápido de WhatsApp"
              >
                <Phone className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Global Modals */}
      <WorkOrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
      />

      <ClientModal
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
      />

      {clients.length > 0 && (
        <WhatsAppModal
          isOpen={isWhatsAppOpen}
          onClose={() => setIsWhatsAppOpen(false)}
          client={clients[0]}
          defaultTemplate="ready"
        />
      )}
    </>
  );
}

