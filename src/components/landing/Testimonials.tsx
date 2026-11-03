"use client";

import React from "react";
import { Star, CheckCircle2 } from "lucide-react";

export function Testimonials() {
  const reviews = [
    {
      name: "Esteban Rinaldi",
      car: "Toyota Corolla 2.0",
      rating: 5,
      date: "Hace 1 semana",
      text: "La primera vez que voy a un taller mecánico y no me siento engañado. Me mandaron fotos del diagnóstico por WhatsApp, pude ver el avance por la web con la patente y me entregaron el auto a la hora pactada. Excelente atención.",
    },
    {
      name: "Mariana Costa",
      car: "Ford EcoSport",
      rating: 5,
      date: "Hace 3 semanas",
      text: "Le hicieron embrague y frenos. Lo mejor es la transparencia: me mostraron los repuestos viejos que sacaron en una caja y me dieron factura con garantía escrita de 6 meses. Super recomendables.",
    },
    {
      name: "Alejandro B. Vignolo",
      car: "Volkswagen Vento 2.0 TSI",
      rating: 5,
      date: "Hace 1 mes",
      text: "Tenía una falla intermitente de inyección que en dos talleres no daban pie con bola. El jefe de taller la escaneó, me explicó exactamente el sensor que fallaba y quedó impecable. Da gusto encontrar gente capacitada.",
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-[var(--paper)] text-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 mb-14 items-end">
          <div className="lg:col-span-7">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-amber-600">
              Lo que dicen en Google
            </span>
            <h2 className="mt-4 text-5xl sm:text-6xl font-black text-slate-950">
              “La primera vez que no me sentí engañado.”
            </h2>
          </div>
          <div className="lg:col-span-5 flex items-center gap-5 lg:justify-end">
            <span className="font-display font-black text-7xl leading-none">4,9</span>
            <div>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-500 text-amber-500" />
                ))}
              </div>
              <span className="text-xs text-slate-600 block mt-1">+320 reseñas verificadas</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <figure
              key={idx}
              className={`bg-white border-2 border-slate-950 p-6 flex flex-col justify-between gap-6 shadow-[6px_6px_0_0_var(--ink)] ${
                idx === 1 ? "md:translate-y-6" : ""
              }`}
            >
              <blockquote className="text-sm text-slate-800 leading-relaxed">
                {rev.text}
              </blockquote>
              <figcaption className="pt-4 border-t border-slate-200 flex items-end justify-between gap-3">
                <div>
                  <span className="font-display text-lg font-bold uppercase flex items-center gap-1.5">
                    {rev.name}
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </span>
                  <span className="text-xs text-slate-500">{rev.car}</span>
                </div>
                <span className="text-[10px] text-slate-500 whitespace-nowrap">{rev.date}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
