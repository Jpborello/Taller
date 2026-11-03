"use client";

import React from "react";
import { XCircle, CheckCircle2, ShieldAlert, Sparkles, ArrowRight } from "lucide-react";

export function ComparisonSection() {
  const points = [
    {
      traditional: "Llamadas telefónicas constantes de clientes preguntando '¿cómo viene mi auto?'",
      protech: "Portal web de consulta en vivo por patente donde el cliente ve cada etapa del avance 24/7.",
    },
    {
      traditional: "Presupuestos anotados a mano en hojas sueltas que se pierden o generan dudas.",
      protech: "Órdenes de trabajo digitales con membrete oficial, desglose de mano de obra y repuestos en PDF.",
    },
    {
      traditional: "Mensajes manuales tipeados uno por uno cada vez que un vehículo está listo.",
      protech: "Botón directo de WhatsApp con plantillas prediseñadas personalizadas en un solo clic.",
    },
    {
      traditional: "Falta de control de inventario: repuestos que faltan a último momento o se vencen.",
      protech: "Gestión de stock inteligente que descuenta automáticamente piezas al agregarlas a la orden.",
    },
    {
      traditional: "Historial del vehículo inexistente: no se recuerda qué bujías o qué aceite se le puso hace 1 año.",
      protech: "Ficha técnica y anotador clínico digital de por vida con kilometraje e intervenciones previas.",
    },
  ];

  return (
    <section className="py-20 bg-slate-900/60 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            La Evolución Digital del Taller
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            ¿Por qué la experiencia ProTech es diferente?
          </h2>
          <p className="text-sm text-slate-400">
            Dejamos atrás la informalidad. Implementamos procesos estandarizados y trazabilidad en cada tornillo.
          </p>
        </div>

        {/* Comparison Table / Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Traditional Workshop Card */}
          <div className="bg-slate-950/80 border border-red-500/20 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center font-bold">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-200">El Taller Mecánico Tradicional</h3>
                <span className="text-xs text-red-400/80">Procesos manuales e informales</span>
              </div>
            </div>

            <ul className="space-y-4 text-xs text-slate-400">
              {points.map((pt, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{pt.traditional}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ProTech Digital System Card */}
          <div className="bg-slate-950 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 space-y-6 relative shadow-2xl shadow-emerald-500/5">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Mecánica ProTech Digital</h3>
                  <span className="text-xs text-emerald-400 font-medium">Gestión moderna & Trazabilidad</span>
                </div>
              </div>
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold uppercase tracking-wider border border-emerald-500/30">
                Líder en Confianza
              </span>
            </div>

            <ul className="space-y-4 text-xs text-slate-200">
              {points.map((pt, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="font-medium">{pt.protech}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

