"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { BrandMark } from "@/components/landing/Brand";
import { usePathname } from "next/navigation";
import { useWorkshop } from "@/context/WorkshopContext";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Boxes,
  CalendarCheck,
  ArrowUpRight,
  RotateCcw,
} from "lucide-react";

export function AdminSidebar({
  isMobileOpen,
  setIsMobileOpen,
}: {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}) {
  const pathname = usePathname();
  const { inventory, appointments, orders, resetToDemoDefaults } = useWorkshop();

  // Low stock count
  const lowStockCount = inventory.filter((i) => i.currentStock <= i.minStock).length;
  // Pending appointments
  const pendingAppointments = appointments.filter((a) => a.status === "pending").length;
  // Active in workshop
  const activeOrders = orders.filter((o) => o.status !== "delivered").length;

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      badge: activeOrders > 0 ? `${activeOrders} activos` : undefined,
      badgeColor: "bg-slate-800 text-slate-300",
    },
    {
      name: "Clientes",
      href: "/admin/clientes",
      icon: Users,
    },
    {
      name: "Órdenes de trabajo",
      href: "/admin/ordenes",
      icon: ClipboardList,
    },
    {
      name: "Stock",
      href: "/admin/stock",
      icon: Boxes,
      badge: lowStockCount > 0 ? `${lowStockCount} alertas` : undefined,
      badgeColor: "bg-amber-500 text-slate-950",
    },
    {
      name: "Turnos",
      href: "/admin/turnos",
      icon: CalendarCheck,
      badge: pendingAppointments > 0 ? `${pendingAppointments} nuevos` : undefined,
      badgeColor: "bg-emerald-500/20 text-emerald-300",
    },
  ];

  const handleResetDemo = () => {
    if (
      confirm(
        "¿Deseas reiniciar los datos de la demo a los valores predeterminados de fábrica?"
      )
    ) {
      resetToDemoDefaults();
      alert("¡Datos restablecidos con éxito para una nueva demostración!");
    }
  };

  const content = (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 text-slate-300">
      <div className="hazard h-1.5 shrink-0" />

      {/* Workshop Brand Header */}
      <div className="px-5 py-5 border-b border-slate-800">
        <Link href="/admin" className="flex items-center gap-3 group">
          <BrandMark className="w-10 h-10 group-hover:rotate-[30deg] transition-transform duration-500" />
          <div>
            <span className="font-display font-extrabold uppercase text-white text-xl leading-none tracking-wide block">
              ProTech <span className="text-amber-500">Taller</span>
            </span>
            <span className="text-[10px] text-slate-400 uppercase tracking-[0.25em] block font-semibold mt-1">
              Tablero de gestión
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation list */}
      <div className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        <div className="px-3 pb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500 flex items-center gap-2">
          <span className="h-px w-4 bg-amber-500" />
          Módulos
        </div>

        {navItems.map((item, idx) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={`relative flex items-center justify-between pl-4 pr-3 py-2.5 rounded-sm text-[13px] font-semibold transition-colors group ${
                isActive
                  ? "bg-slate-950 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <span
                className={`absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-sm transition-colors ${
                  isActive ? "bg-amber-500" : "bg-transparent group-hover:bg-slate-600"
                }`}
              />
              <div className="flex items-center gap-3">
                <span
                  className={`font-display font-bold text-xs w-5 ${isActive ? "text-amber-500" : "text-slate-600"}`}
                >
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? "text-amber-500" : "text-slate-500 group-hover:text-slate-300"
                  }`}
                />
                <span>{item.name}</span>
              </div>

              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-sm font-mono font-bold whitespace-nowrap ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Demo Controls & Footer */}
      <div className="p-3 border-t border-slate-800 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="relative block h-24 overflow-hidden rounded-sm group grain"
        >
          <Image
            src="/img/taller-elevadores.jpg"
            alt=""
            fill
            sizes="240px"
            className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/50 to-transparent" />
          <div className="absolute inset-x-3 bottom-2.5 flex items-end justify-between">
            <span>
              <span className="block text-[9px] font-bold uppercase tracking-[0.2em] text-amber-400">
                En vivo
              </span>
              <span className="font-display font-bold uppercase text-white text-base leading-none">
                Ver landing pública
              </span>
            </span>
            <ArrowUpRight className="w-4 h-4 text-white" />
          </div>
        </Link>

        <button
          type="button"
          onClick={handleResetDemo}
          className="w-full flex items-center justify-center gap-2 px-3.5 py-2 rounded-sm text-xs font-medium text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          title="Restaura la base de datos de ejemplo si se modificaron datos durante la presentación"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reiniciar datos demo
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop static sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 z-30">
        {content}
      </aside>

      {/* Mobile drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-slate-900 z-10 animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
}

