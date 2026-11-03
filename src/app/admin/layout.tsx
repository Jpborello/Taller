"use client";

import React, { useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { MobileBottomNav } from "@/components/admin/MobileBottomNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="shop min-h-screen bg-slate-950 bg-grid-pattern text-slate-100 flex flex-col lg:flex-row selection:bg-amber-500 selection:text-slate-950">
      {/* Sidebar for Desktop & Drawer for Mobile */}
      <AdminSidebar
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <AdminHeader onOpenMobileSidebar={() => setIsMobileOpen(true)} />
        <main className="flex-1 p-3 sm:p-6 lg:p-8 pb-24 lg:pb-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Native-style Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}
