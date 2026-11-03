"use client";

import React from "react";
import Link from "next/link";
import { useWorkshop } from "@/context/WorkshopContext";
import { LayoutDashboard } from "lucide-react";
import { BrandMark } from "@/components/landing/Brand";

export function LandingFooter() {
  const { settings } = useWorkshop();

  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 text-xs overflow-hidden">
      <div className="hazard h-2" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <BrandMark className="w-9 h-9" />
              <span className="font-display font-extrabold uppercase text-white text-xl tracking-wide">
                {settings.name}
              </span>
            </div>
            <p className="text-slate-400 max-w-sm leading-relaxed">
              Taller mecánico integral y laboratorio de inyección electrónica. Servicio certificado para vehículos particulares y utilitarios con trazabilidad digital en cada reparación.
            </p>
            <p className="text-[11px] text-slate-500">
              {settings.legalName} • CUIT: {settings.cuit}
            </p>
          </div>

          {/* Quick links */}
          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">
              Acceso Rápido
            </h4>
            <ul className="space-y-1.5">
              <li>
                <a href="#seguimiento" className="hover:text-amber-400 transition-colors">
                  Seguimiento de Auto por Patente
                </a>
              </li>
              <li>
                <a href="#servicios" className="hover:text-amber-400 transition-colors">
                  Servicios y Mecánica Integral
                </a>
              </li>
              <li>
                <a href="#cotizador" className="hover:text-amber-400 transition-colors">
                  Cotizador Express de Services
                </a>
              </li>
              <li>
                <a href="#turnos" className="hover:text-amber-400 transition-colors">
                  Sacar Turno Online
                </a>
              </li>
            </ul>
          </div>

          {/* Admin demo */}
          <div className="space-y-3 bg-slate-900/60 p-4 border-l-4 border-amber-500">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider flex items-center gap-1.5">
              <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />
              Acceso para el Taller
            </h4>
            <p className="text-[11px] text-slate-400">
              Sistema de gestión interna con control de stock, fichas de clientes y turnos.
            </p>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
            >
              Abrir Panel Admin
            </Link>
          </div>
        </div>

        {/* Wordmark */}
        <div
          aria-hidden="true"
          className="font-display font-black uppercase text-slate-900 leading-[0.8] text-[22vw] lg:text-[15rem] tracking-tight select-none -mx-1 mb-6"
        >
          ProTech
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            © 2026 {settings.name}. Todos los derechos reservados.
          </div>
          <div>
            Desarrollado para demostración de sistema de gestión automotriz.
          </div>
        </div>
      </div>
    </footer>
  );
}
