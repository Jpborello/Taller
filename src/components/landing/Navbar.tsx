"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useWorkshop } from "@/context/WorkshopContext";
import { Phone, Menu, X, LayoutDashboard } from "lucide-react";
import { BrandMark } from "@/components/landing/Brand";

export function LandingNavbar() {
  const { settings } = useWorkshop();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <BrandMark className="group-hover:rotate-[30deg] transition-transform duration-500" />
          <div>
            <span className="font-display font-extrabold uppercase text-2xl text-white leading-none tracking-wide block">
              Mecánica <span className="text-amber-500">ProTech</span>
            </span>
            <span className="text-[10px] text-slate-400 uppercase tracking-[0.25em] font-semibold block mt-1">
              Rosario · desde 1998
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#seguimiento" className="hover:text-amber-400 transition-colors flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Estado de mi Auto
          </a>
          <a href="#servicios" className="hover:text-amber-400 transition-colors">
            Servicios
          </a>
          <a href="#cotizador" className="hover:text-amber-400 transition-colors">
            Cotizador
          </a>
          <a href="#turnos" className="hover:text-amber-400 transition-colors">
            Sacar Turno
          </a>
          <a href="#contacto" className="hover:text-amber-400 transition-colors">
            Contacto
          </a>
        </nav>

        {/* Right CTA */}
        <div className="hidden sm:flex items-center gap-3">
          {/* WhatsApp Direct */}
          <a
            href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 hover:text-emerald-300 hover:border-emerald-500/30 transition-all"
            title="Escribir por WhatsApp"
          >
            <Phone className="w-4 h-4" />
          </a>

          {/* Admin Panel Access Button */}
          <Link
            href="/admin"
            className="px-4 py-2.5 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Panel Administrador</span>
            <span className="text-[9px] bg-slate-950 text-amber-300 px-1.5 py-0.5 rounded-sm font-bold uppercase tracking-wider">
              DEMO
            </span>
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 py-4 space-y-3 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-2 text-sm font-medium text-slate-300">
            <a
              href="#seguimiento"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 hover:text-amber-400 flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Estado de mi Auto en Vivo
            </a>
            <a
              href="#servicios"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 hover:text-amber-400"
            >
              Servicios
            </a>
            <a
              href="#cotizador"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 hover:text-amber-400"
            >
              Cotizador Express
            </a>
            <a
              href="#turnos"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 hover:text-amber-400"
            >
              Sacar Turno Online
            </a>
            <a
              href="#contacto"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 hover:text-amber-400"
            >
              Contacto & Ubicación
            </a>
          </nav>

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            <Link
              href="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-3 rounded-xl bg-amber-500 text-slate-950 font-bold text-center text-sm flex items-center justify-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              Entrar al Panel de Admin (Demo)
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

