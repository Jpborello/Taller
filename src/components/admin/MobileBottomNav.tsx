"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWorkshop } from "@/context/WorkshopContext";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Boxes,
  CalendarCheck,
} from "lucide-react";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { inventory, appointments, orders } = useWorkshop();

  const lowStockCount = inventory.filter((i) => i.currentStock <= i.minStock).length;
  const pendingAppointments = appointments.filter((a) => a.status === "pending").length;
  const activeOrders = orders.filter((o) => o.status !== "delivered").length;

  const items = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      badge: activeOrders > 0 ? activeOrders : null,
      badgeColor: "bg-blue-500",
    },
    {
      name: "Clientes",
      href: "/admin/clientes",
      icon: Users,
    },
    {
      name: "Órdenes",
      href: "/admin/ordenes",
      icon: ClipboardList,
    },
    {
      name: "Stock",
      href: "/admin/stock",
      icon: Boxes,
      badge: lowStockCount > 0 ? lowStockCount : null,
      badgeColor: "bg-amber-500",
    },
    {
      name: "Turnos",
      href: "/admin/turnos",
      icon: CalendarCheck,
      badge: pendingAppointments > 0 ? pendingAppointments : null,
      badgeColor: "bg-emerald-500",
    },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-2 py-2 flex items-center justify-around shadow-2xl safe-area-bottom">
      {items.map((it) => {
        const isActive = pathname === it.href;
        const Icon = it.icon;

        return (
          <Link
            key={it.href}
            href={it.href}
            className={`flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-xl transition-all relative ${
              isActive
                ? "text-amber-400 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? "text-amber-400 stroke-[2.5]" : "text-slate-400"}`} />
              {it.badge && (
                <span
                  className={`absolute -top-1.5 -right-2 w-4 h-4 rounded-full ${it.badgeColor} text-slate-950 font-bold text-[9px] flex items-center justify-center font-mono`}
                >
                  {it.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-1 tracking-tight truncate max-w-[60px] text-center">
              {it.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

