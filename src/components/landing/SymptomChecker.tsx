"use client";

import React, { useState } from "react";
import { useWorkshop } from "@/context/WorkshopContext";
import {
  Activity,
  AlertTriangle,
  Disc,
  Flame,
  Gauge,
  Thermometer,
  Wind,
  Wrench,
  CheckCircle,
  Phone,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface Symptom {
  id: string;
  category: string;
  icon: any;
  title: string;
  frequency: "Común" | "Frecuente" | "Muy Común" | "Crítico";
  severity: "Baja" | "Media" | "Alta" | "Crítica";
  cause: string;
  action: string;
  estimatedFixTime: string;
  badgeColor: string;
}

const SYMPTOMS: Symptom[] = [
  {
    id: "frenos-chillido",
    category: "Frenos & Seguridad",
    icon: Disc,
    title: "Chillido agudo o raspado metálico al frenar",
    frequency: "Muy Común",
    severity: "Media",
    cause:
      "Pastillas desgastadas al límite del testigo acústico o cristalizadas por fricción excesiva. Riesgo de rayar los discos de freno.",
    action: "Recambio de juego de pastillas y rectificado preventivo de discos.",
    estimatedFixTime: "1 a 2 horas",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/40",
  },
  {
    id: "check-engine",
    category: "Inyección & Motor",
    icon: AlertTriangle,
    title: "Luz 'Check Engine' parpadea al acelerar o tironea",
    frequency: "Frecuente",
    severity: "Alta",
    cause:
      "Falla de combustión ('misfire') en uno de los cilindros, provocada por bobina averiada, bujía con carbón o sonda lambda sucia.",
    action: "Escaneo computarizado OBD2, prueba de bobinas en osciloscopio y recambio de bujías.",
    estimatedFixTime: "2 a 3 horas",
    badgeColor: "bg-orange-500/20 text-orange-400 border-orange-500/40",
  },
  {
    id: "vibracion-volante",
    category: "Tren Delantero",
    icon: Gauge,
    title: "Vibración en el volante a más de 80 km/h",
    frequency: "Muy Común",
    severity: "Media",
    cause:
      "Desbalanceo dinámico de ruedas delanteras, cubierta deformada o deformación por golpe en la llanta.",
    action: "Balanceo computarizado de 4 ruedas y chequeo de extremos de dirección.",
    estimatedFixTime: "45 minutos",
    badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/40",
  },
  {
    id: "temperatura-alta",
    category: "Refrigeración",
    icon: Thermometer,
    title: "La aguja de temperatura sube del medio en tráfico",
    frequency: "Frecuente",
    severity: "Crítica",
    cause:
      "Termostato trabado cerrado, electroventilador no enciende en 1ra velocidad, o líquido refrigerante degradado con aire en el circuito.",
    action: "Revisión de bulbo, purgado con refrigerante orgánico y prueba de presurización.",
    estimatedFixTime: "2 a 4 horas",
    badgeColor: "bg-red-500/20 text-red-400 border-red-500/40",
  },
  {
    id: "aire-tibio",
    category: "Climatización",
    icon: Wind,
    title: "El aire acondicionado sale tibio o huele a humedad",
    frequency: "Común",
    severity: "Baja",
    cause:
      "Microfuga de gas refrigerante R134a por retén de compresor y saturación de bacterias en el evaporador.",
    action: "Prueba de estanqueidad con nitrógeno, carga de gas ecológica y desinfección de conductos.",
    estimatedFixTime: "1 hora",
    badgeColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/40",
  },
  {
    id: "ruido-tren-delantero",
    category: "Suspensión",
    icon: Wrench,
    title: "Golpe seco 'clac-clac' al agarrar lomos de burro o baches",
    frequency: "Muy Común",
    severity: "Media",
    cause:
      "Bieletas de barra estabilizadora con holgura o bujes de parrilla rajados por desgaste.",
    action: "Recambio de bieletas y bujes reforzados con posterior alineación láser.",
    estimatedFixTime: "2 horas",
    badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/40",
  },
];

export function SymptomChecker() {
  const { settings } = useWorkshop();
  const [selectedSymptom, setSelectedSymptom] = useState<Symptom>(SYMPTOMS[0]);

  const handleConsultWa = (symptom: Symptom) => {
    const text = `Hola ${settings.name}, estuve viendo el diagnosticador visual en su web. Mi auto tiene el siguiente síntoma: *${symptom.title}* (${symptom.category}). ¿Podría acercarlo para que lo revisen?`;
    window.open(
      `https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  return (
    <section className="py-20 bg-slate-900/50 border-t border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Herramienta Exclusiva para Conductores
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Diagnosticador Interactivo de Fallas
          </h2>
          <p className="text-sm text-slate-400">
            ¿Tu auto hace un ruido extraño o se prendió un testigo? Seleccioná el síntoma para conocer la causa técnica probable y el plan de solución recomendado.
          </p>
        </div>

        {/* Interactive layout: left list + right interactive diagnosis card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Symptoms selector list */}
          <div className="lg:col-span-6 space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Seleccioná lo que le pasa a tu auto:
            </span>

            {SYMPTOMS.map((s) => {
              const Icon = s.icon;
              const isSelected = selectedSymptom.id === s.id;

              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedSymptom(s)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? "bg-slate-900 border-amber-500/60 shadow-lg shadow-amber-500/10 scale-[1.01]"
                      : "bg-slate-950/70 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? "bg-amber-500 text-slate-950 font-bold"
                          : "bg-slate-900 text-slate-400 border border-slate-800"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
                        {s.category}
                      </span>
                      <h4
                        className={`text-xs sm:text-sm font-bold leading-snug ${
                          isSelected ? "text-white" : "text-slate-300"
                        }`}
                      >
                        {s.title}
                      </h4>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 hidden sm:inline-block ${s.badgeColor}`}
                  >
                    {s.severity}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Diagnosis Details Card */}
          <div className="lg:col-span-6 bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest">
                  Pre-Diagnóstico Técnico
                </span>
                <h3 className="text-xl font-black text-white mt-1">
                  {selectedSymptom.title}
                </h3>
              </div>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border ${selectedSymptom.badgeColor}`}
              >
                Urgencia {selectedSymptom.severity}
              </span>
            </div>

            {/* Explanation box */}
            <div className="space-y-4 text-xs">
              <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-1.5">
                <span className="text-slate-400 font-semibold uppercase tracking-wider block text-[11px]">
                  🔍 Causa más probable:
                </span>
                <p className="text-slate-200 text-sm leading-relaxed">
                  {selectedSymptom.cause}
                </p>
              </div>

              <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-1.5">
                <span className="text-amber-400 font-semibold uppercase tracking-wider block text-[11px]">
                  🛠️ Solución recomendada en taller:
                </span>
                <p className="text-slate-200 text-sm leading-relaxed">
                  {selectedSymptom.action}
                </p>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-900/50 rounded-xl border border-slate-800/80 text-slate-300">
                <span>Tiempo estimado de resolución:</span>
                <strong className="text-white font-mono">{selectedSymptom.estimatedFixTime}</strong>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => handleConsultWa(selectedSymptom)}
                className="flex-1 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition-all hover:scale-102 cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                Pedir Turno para este Problema
              </button>

              <a
                href="#cotizador"
                className="px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                Ver Precios Orientativos
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
