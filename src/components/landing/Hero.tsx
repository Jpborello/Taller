"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowRight, Calendar, ShieldCheck, Star } from "lucide-react";
import { MercosurPlate } from "@/components/landing/Brand";

export const TRACK_PLATE_EVENT = "protech:track-plate";

export function Hero() {
  const [plate, setPlate] = useState("");

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    const value = plate.trim();
    if (value) {
      window.dispatchEvent(new CustomEvent(TRACK_PLATE_EVENT, { detail: value }));
    }
    document.getElementById("seguimiento")?.scrollIntoView({ behavior: "smooth" });
  };

  const stats = [
    { value: "1998", label: "Abrimos el portón en Av. Pellegrini" },
    { value: "14.200", label: "Autos que salieron andando" },
    { value: "6", label: "Elevadores y una fosa de alineación" },
    { value: "12 m", label: "Garantía escrita en repuestos" },
  ];

  return (
    <section className="relative bg-slate-950 overflow-hidden">
      {/* Full-bleed photo */}
      <div className="absolute inset-0 grain">
        <Image
          src="/img/hero-motor.jpg"
          alt="Mecánico revisando el vano motor de un auto en el taller"
          fill
          preload
          sizes="100vw"
          className="object-cover object-[70%_center]"
        />
        <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-slate-950/85 to-slate-950/20" />
        <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-slate-950/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-10">
        <div className="max-w-4xl">
          <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.25em] text-amber-400">
            <span className="h-px w-10 bg-amber-500" />
            Taller mecánico · Rosario
          </div>

          <h1 className="mt-6 text-[3.4rem] sm:text-7xl lg:text-[5.75rem] font-black text-white">
            Lo arreglamos bien.
            <span className="block text-amber-500">Y te mostramos cómo.</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
            Mecánica integral, inyección y frenos con tres generaciones de oficio. Te mandamos fotos
            del diagnóstico, te guardamos los repuestos viejos y podés seguir tu auto por patente,
            sin llamar a nadie.
          </p>

          {/* Plate tracker */}
          <form onSubmit={handleTrack} className="mt-10 flex flex-col sm:flex-row sm:items-end gap-4">
            <label className="block">
              <span className="block text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">
                ¿Tu auto está en el taller? Poné la patente
              </span>
              <MercosurPlate className="w-full sm:w-72">
                <input
                  value={plate}
                  onChange={(e) => setPlate(e.target.value.toUpperCase())}
                  placeholder="AF 452 CD"
                  maxLength={9}
                  aria-label="Patente del vehículo"
                  className="w-full bg-transparent outline-none text-4xl text-center placeholder:text-slate-300 uppercase"
                />
              </MercosurPlate>
            </label>
            <button
              type="submit"
              className="h-[62px] px-6 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-bold uppercase tracking-wider text-lg flex items-center justify-center gap-2 transition-colors"
            >
              Ver estado
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </form>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            <a
              href="#turnos"
              className="inline-flex items-center gap-2 font-semibold text-white underline decoration-amber-500 decoration-2 underline-offset-4 hover:text-amber-400"
            >
              <Calendar className="w-4 h-4 text-amber-500" />
              Sacar turno online
            </a>
            <span className="inline-flex items-center gap-1.5 text-slate-400">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              4,9 en Google · 320 reseñas
            </span>
            <span className="inline-flex items-center gap-1.5 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              Presupuesto antes de tocar nada
            </span>
          </div>
        </div>

        {/* Stats strip */}
        <dl className="mt-16 sm:mt-24 grid grid-cols-2 lg:grid-cols-4 border-t border-white/15">
          {stats.map((s, i) => (
            <div
              key={s.value}
              className={`pt-5 pb-2 pr-4 ${i > 0 ? "lg:pl-6 lg:border-l border-white/15" : ""} ${
                i % 2 === 1 ? "pl-4 border-l lg:border-l" : ""
              }`}
            >
              <dt className="font-display font-black text-4xl sm:text-5xl text-white leading-none">
                {s.value}
              </dt>
              <dd className="mt-2 text-xs text-slate-400 max-w-[14rem]">{s.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
