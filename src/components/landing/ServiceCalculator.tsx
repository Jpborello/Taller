"use client";

import React, { useState } from "react";
import { formatCurrency } from "@/lib/formatters";
import { useWorkshop } from "@/context/WorkshopContext";
import { Calculator, CheckCircle2, Clock, ShieldCheck, Phone, Sparkles } from "lucide-react";

export function ServiceCalculator() {
  const { settings } = useWorkshop();

  const [vehicleType, setVehicleType] = useState<"compact" | "sedan" | "suv">("sedan");
  const [servicePackage, setServicePackage] = useState<"service" | "frenos" | "distribucion" | "scanner">("service");

  // Packages definition
  const PACKAGES = {
    service: {
      name: "Service Integral 10.000 km",
      time: "2 a 3 horas (Service Express)",
      description: "Aceite sintético homologado + filtro de aceite, filtro de aire y chequeo preventivo.",
      features: [
        "Aceite sintético 100% de primera línea (Motul o Castrol)",
        "Filtro de aceite y filtro de aire Mann Filter",
        "Inspección de 25 puntos de seguridad (frenos, tren delantero, fluidos)",
        "Reset de testigo de servicio en instrumental",
        "Garantía escrita de 6 meses",
      ],
      prices: {
        compact: 98000,
        sedan: 125000,
        suv: 185000,
      },
    },
    frenos: {
      name: "Frenos Delanteros Completos",
      time: "1 a 2 horas",
      description: "Pastillas de freno de alto rendimiento + rectificado o chequeo de discos y líquido.",
      features: [
        "Juego de pastillas delanteras Fras-le / Brembo",
        "Chequeo de alabeo y rectificado preventivo de discos",
        "Limpieza y lubricación de pernos de caliper con grasa de cobre",
        "Reposición de líquido de frenos DOT 4 presurizado",
        "Prueba de frenado y eficacia en calle",
      ],
      prices: {
        compact: 85000,
        sedan: 110000,
        suv: 145000,
      },
    },
    distribucion: {
      name: "Kit de Distribución + Bomba de Agua",
      time: "1 día hábil",
      description: "Correa dentada, tensores automáticos y bomba de agua para evitar roturas mayores de motor.",
      features: [
        "Correa dentada Gates / Continental original",
        "Tensores fijos y automáticos homologados",
        "Bomba de agua nueva con turbina metálica",
        "Recambio total de líquido refrigerante orgánico",
        "Puesta a punto con herramientas de calaje originales",
      ],
      prices: {
        compact: 195000,
        sedan: 245000,
        suv: 340000,
      },
    },
    scanner: {
      name: "Diagnóstico Computarizado & Escaneo",
      time: "45 minutos",
      description: "Diagnóstico con escáner profesional, lectura de parámetros en tiempo real y borrado de fallas.",
      features: [
        "Conexión con escáner multimarca oficial Bosch / Launch",
        "Lectura de todos los módulos (Motor, ABS, Airbag, BCM)",
        "Monitoreo de flujo de datos en vivo (sondas, inyección, presión)",
        "Informe técnico con diagnóstico exacto de la falla",
        "Sin costo adicional si la reparación se realiza en nuestro taller",
      ],
      prices: {
        compact: 35000,
        sedan: 35000,
        suv: 40000,
      },
    },
  };

  const selectedPkg = PACKAGES[servicePackage];
  const estimatedPrice = selectedPkg.prices[vehicleType];

  const vehicleLabels = {
    compact: "Auto Chico (Gol, 208, Sandero, Onix, Etios)",
    sedan: "Sedán Mediano (Cruze, Vento, Corolla, Focus)",
    suv: "SUV / Camioneta 4x4 (Hilux, Amarok, Ranger, Compass)",
  };

  const handleBookQuote = () => {
    const text = `Hola ${settings.name}, coticé en su web un presupuesto para: *${selectedPkg.name}* para un *${vehicleLabels[vehicleType]}*. Precio estimado: *${formatCurrency(estimatedPrice)}*. ¿Tendrían turno para coordinar?`;
    window.open(`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <section id="cotizador" className="py-20 bg-slate-900/40 border-t border-slate-800 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            Transparencia de Costos
          </span>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Cotizador Rápido de Servicios
          </h2>
          <p className="text-sm text-slate-400">
            Calculá al instante el costo aproximado de mano de obra y repuestos para tu modelo de auto sin sorpresas.
          </p>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Options */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Vehicle type */}
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-3">
                1. Seleccioná el tipo de vehículo
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  { id: "compact", label: "Compacto", sub: "Gol, 208, Onix" },
                  { id: "sedan", label: "Sedán / Mediano", sub: "Cruze, Corolla, Vento" },
                  { id: "suv", label: "SUV / Camioneta", sub: "Hilux, Ranger, SUV" },
                ].map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setVehicleType(v.id as any)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      vehicleType === v.id
                        ? "bg-amber-500/10 text-white border-amber-500 shadow-xs"
                        : "bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <span className="font-bold text-xs block text-white">{v.label}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5 block">{v.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Service type */}
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-3">
                2. Seleccioná el trabajo requerido
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { id: "service", label: "Service 10.000 km", icon: "🛢️" },
                  { id: "frenos", label: "Frenos Delanteros", icon: "🛑" },
                  { id: "distribucion", label: "Kit Distribución", icon: "⚙️" },
                  { id: "scanner", label: "Scanner & Diagnóstico", icon: "🔍" },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setServicePackage(s.id as any)}
                    className={`p-3.5 rounded-xl border text-left transition-all flex items-center gap-3 ${
                      servicePackage === s.id
                        ? "bg-amber-500/15 text-white border-amber-500 shadow-xs"
                        : "bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <span className="text-lg">{s.icon}</span>
                    <span className="font-bold text-xs text-white">{s.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Inclusions list */}
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 space-y-2">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                ¿Qué incluye este servicio?
              </span>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {selectedPkg.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Pricing Summary Card */}
          <div className="lg:col-span-5 bg-linear-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 mb-2">
                <Sparkles className="w-4 h-4" />
                Presupuesto Estimado
              </div>
              <h3 className="text-xl font-black text-white">{selectedPkg.name}</h3>
              <p className="text-xs text-slate-400 mt-1">{vehicleLabels[vehicleType]}</p>

              <div className="mt-6 pt-6 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    Tiempo estimado:
                  </span>
                  <span className="font-semibold text-slate-200">{selectedPkg.time}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Garantía escrita:
                  </span>
                  <span className="font-semibold text-emerald-400">6 meses</span>
                </div>
              </div>

              {/* Price display */}
              <div className="mt-6 pt-6 border-t border-slate-800">
                <span className="text-[11px] text-slate-400 block uppercase tracking-wider font-semibold">
                  Mano de obra + Repuestos incluidos
                </span>
                <div className="text-3xl font-black text-white font-mono mt-1">
                  {formatCurrency(estimatedPrice)}
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  * Precio final orientativo con repuestos de primeras marcas.
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleBookQuote}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition-all hover:scale-102 cursor-pointer"
            >
              <Phone className="w-4 h-4" />
              Reservar este Presupuesto por WhatsApp
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

