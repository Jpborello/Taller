"use client";

import React from "react";
import { useWorkshop } from "@/context/WorkshopContext";
import { MapPin, Clock, Phone } from "lucide-react";

export function WorkshopInfo() {
  const { settings } = useWorkshop();

  return (
    <section id="contacto" className="py-20 bg-slate-950 relative border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Info Side */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-amber-400">
                Dónde estamos
              </span>
              <h2 className="text-5xl sm:text-6xl font-black text-white mt-4">
                Pellegrini al 3800, <span className="text-amber-500">te esperamos.</span>
              </h2>
              <p className="text-sm text-slate-400 mt-2">
                Instalaciones de 800 m² equipadas con 6 elevadores electromecánicos, banco de prueba de inyectores y fosa de alineación láser.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3 p-3.5 border-l-4 border-amber-500 bg-slate-900">
                <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold text-sm">Dirección Taller:</strong>
                  <span className="text-slate-300">{settings.address}, {settings.city}</span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">Zona Macrocentro / Acceso rápido desde Av. Circunvalación</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 border-l-4 border-amber-500 bg-slate-900">
                <Clock className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold text-sm">Horarios de Atención:</strong>
                  <span className="text-slate-300">{settings.openingHours}</span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">Recepción de vehículos a partir de las 08:00 hs puntual</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 border-l-4 border-amber-500 bg-slate-900">
                <Phone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold text-sm">Teléfono & WhatsApp:</strong>
                  <span className="text-slate-300 font-mono text-sm">{settings.phone}</span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">Atención comercial y asesoramiento técnico</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/30 transition-all hover:scale-102"
              >
                <Phone className="w-4 h-4" />
                Consultar por WhatsApp Directo
              </a>
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-6 relative">
            <div className="relative h-96 border-2 border-slate-700 overflow-hidden">
              <iframe
                title="Ubicación del taller"
                src="https://www.openstreetmap.org/export/embed.html?bbox=-60.6818%2C-32.9625%2C-60.6578%2C-32.9485&layer=mapnik&marker=-32.9555%2C-60.6698"
                className="absolute inset-0 w-full h-full [filter:grayscale(1)_invert(0.92)_contrast(0.9)_sepia(0.15)]"
                loading="lazy"
              />
              <div className="absolute top-0 left-0 right-0 h-3 hazard" />
            </div>
            <div className="absolute -bottom-5 left-4 sm:left-6 bg-amber-500 text-slate-950 px-4 py-3 shadow-xl">
              <span className="font-display font-black uppercase text-xl leading-none block">{settings.name}</span>
              <span className="text-xs font-semibold">{settings.address} · Estacionamiento para clientes</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

