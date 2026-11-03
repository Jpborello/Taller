"use client";

import React, { useEffect, useState } from "react";
import { useWorkshop } from "@/context/WorkshopContext";
import { formatCurrency, formatDate, formatPlate, ORDER_STATUS_MAP } from "@/lib/formatters";
import { OrderStatus } from "@/types";
import { TRACK_PLATE_EVENT } from "@/components/landing/Hero";
import confetti from "canvas-confetti";
import {
  Search,
  Car,
  CheckCircle2,
  Clock,
  Wrench,
  ShieldCheck,
  Phone,
  AlertCircle,
  FileCheck,
  Sparkles,
} from "lucide-react";

export function VehicleTracker() {
  const { getVehicleByPlate, approveBudget, settings } = useWorkshop();
  const [plateInput, setPlateInput] = useState("AF452CD");
  const [searched, setSearched] = useState(true);
  // Derived on every render so the demo plate resolves once the context hydrates from localStorage
  const [searchedPlate, setSearchedPlate] = useState("AF452CD");
  const result = getVehicleByPlate(searchedPlate);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plateInput.trim()) return;
    setSearchedPlate(plateInput);
    setSearched(true);
  };

  // Plate typed in the hero form
  useEffect(() => {
    const onTrack = (e: Event) => {
      const plate = (e as CustomEvent<string>).detail;
      setPlateInput(plate);
      setSearchedPlate(plate);
      setSearched(true);
    };
    window.addEventListener(TRACK_PLATE_EVENT, onTrack);
    return () => window.removeEventListener(TRACK_PLATE_EVENT, onTrack);
  }, []);

  const handleQuickDemoClick = (plate: string) => {
    setPlateInput(plate);
    setSearchedPlate(plate);
    setSearched(true);
  };

  const STEPS: { key: string; statuses: OrderStatus[]; label: string; desc: string }[] = [
    { key: "received", statuses: ["received"], label: "Recepción", desc: "Ingreso verificado" },
    { key: "diagnosis", statuses: ["in_diagnosis"], label: "Diagnóstico", desc: "Escaneo computarizado" },
    { key: "budget", statuses: ["budget_sent", "approved"], label: "Presupuesto", desc: "Tu aprobación" },
    { key: "parts", statuses: ["waiting_parts"], label: "Repuestos", desc: "Piezas originales" },
    { key: "repair", statuses: ["in_repair"], label: "En Bahía", desc: "Reparación activa" },
    { key: "qc", statuses: ["quality_control"], label: "C. Calidad", desc: "Pruebas de ruta" },
    { key: "ready", statuses: ["ready", "delivered"], label: "Listo", desc: "Disponible p/ retiro" },
  ];

  const activeOrder = result.orders[0];
  const currentStepIndex = activeOrder
    ? STEPS.findIndex((s) => s.statuses.includes(activeOrder.status))
    : -1;
  const awaitingApproval = activeOrder?.status === "budget_sent";

  const handleApprove = () => {
    if (!activeOrder) return;
    approveBudget(activeOrder.id, "Web");
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.7 }, colors: ["#ff6a13", "#ffffff", "#84cc16"] });
  };
  const statusInfo = activeOrder
    ? ORDER_STATUS_MAP[activeOrder.status] || ORDER_STATUS_MAP.received
    : null;

  return (
    <section id="seguimiento" className="py-16 bg-slate-900/60 border-y border-slate-800 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Portal de Seguimiento 24/7
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Consultá el Estado de tu Vehículo en Vivo
          </h2>
          <p className="text-sm text-slate-400">
            Ingresá la patente de tu auto para conocer el avance de la reparación, el diagnóstico y el momento exacto en que está listo para retirar.
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <form onSubmit={handleSearch} className="max-w-xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <span className="text-[11px] font-black font-mono text-blue-400 uppercase tracking-widest">
                    ARG
                  </span>
                </div>
                <input
                  type="text"
                  value={plateInput}
                  onChange={(e) => setPlateInput(e.target.value.toUpperCase())}
                  placeholder="Ej: AF 452 CD o AC 891 ZK"
                  className="w-full pl-14 pr-4 py-3.5 bg-slate-900 border-2 border-slate-700 rounded-2xl text-base font-mono font-black text-white placeholder-slate-500 uppercase tracking-widest focus:outline-hidden focus:border-amber-500 shadow-inner"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-102 shrink-0 cursor-pointer"
              >
                <Search className="w-4 h-4 stroke-[2.5]" />
                Buscar
              </button>
            </div>

            {/* Quick Demo Click Pills */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
              <span className="text-[11px] text-slate-500">Ejemplos para probar:</span>
              <button
                type="button"
                onClick={() => handleQuickDemoClick("AF452CD")}
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-slate-300 font-mono transition-colors"
              >
                AF 452 CD (Hilux - Listo)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoClick("AG119ZX")}
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-slate-300 font-mono transition-colors"
              >
                AG 119 ZX (208 - Reparación)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoClick("AD902KL")}
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-slate-300 font-mono transition-colors"
              >
                AD 902 KL (Cruze - Presupuesto)
              </button>
            </div>
          </form>

          {/* Results Area */}
          {searched && (
            <div className="pt-6 border-t border-slate-800/80 animate-in fade-in duration-300">
              {!result.vehicle ? (
                <div className="text-center py-8 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mx-auto">
                    <Car className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-white">No encontramos la patente buscada</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Si acabás de ingresar tu auto al taller, recordá que la recepción puede demorar unos minutos en procesarse. También podés consultarnos directamente.
                  </p>
                  <a
                    href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                      `Hola, quería consultar sobre el estado de mi auto patente ${plateInput}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold hover:bg-emerald-600/30 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Consultar por WhatsApp a Recepción
                  </a>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Vehicle Header & Current Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-5 rounded-2xl">
                    <div className="flex items-center gap-4">
                      {/* Mercosur plate mockup */}
                      <div className="px-3.5 py-2 bg-slate-950 border-2 border-slate-700 rounded-xl shadow-inner text-center">
                        <span className="text-[9px] uppercase font-bold tracking-widest text-blue-400 block">
                          ARGENTINA
                        </span>
                        <span className="font-mono text-lg font-black tracking-widest text-white block">
                          {formatPlate(result.vehicle.licensePlate)}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-black text-white">
                            {result.vehicle.brand} {result.vehicle.model}
                          </h3>
                          <span className="text-xs text-slate-400 font-medium">({result.vehicle.year})</span>
                        </div>
                        <p className="text-xs text-slate-400">
                          Titular registrado: <strong className="text-slate-200">{result.client?.fullName}</strong> • Km de ingreso:{" "}
                          <span className="font-mono text-slate-300 font-bold">
                            {activeOrder ? activeOrder.mileageAtEntry.toLocaleString() : result.vehicle.mileage.toLocaleString()} km
                          </span>
                        </p>
                      </div>
                    </div>

                    {statusInfo && (
                      <div className="flex items-center gap-2 self-start sm:self-center">
                        <div
                          className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${statusInfo.bgColor} ${statusInfo.textColor} ${statusInfo.borderColor}`}
                        >
                          <span className={`w-2.5 h-2.5 rounded-full ${statusInfo.color} animate-pulse`} />
                          <span>{statusInfo.label}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Interactive Visual Stepper Progress Bar */}
                  {activeOrder && (
                    <div className="space-y-4">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                        <span>Línea de Avance en Taller</span>
                        <span className="text-emerald-400 font-medium flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          Actualizado en tiempo real
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                        {STEPS.map((step, idx) => {
                          const isCompleted = idx <= currentStepIndex;
                          const isCurrent = idx === currentStepIndex;

                          return (
                            <div
                              key={step.key}
                              className={`p-3 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                                isCurrent
                                  ? "bg-amber-500/10 border-amber-500/50 shadow-md shadow-amber-500/10"
                                  : isCompleted
                                  ? "bg-slate-900 border-emerald-500/30 text-slate-300"
                                  : "bg-slate-950/40 border-slate-800/80 text-slate-500 opacity-60"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="font-mono text-[10px] font-bold text-slate-500">
                                  0{idx + 1}
                                </span>
                                {isCompleted ? (
                                  <CheckCircle2
                                    className={`w-4 h-4 ${
                                      isCurrent ? "text-amber-400 animate-pulse" : "text-emerald-400"
                                    }`}
                                  />
                                ) : (
                                  <div className="w-3.5 h-3.5 rounded-full border border-slate-700" />
                                )}
                              </div>
                              <span
                                className={`font-bold text-xs ${
                                  isCurrent ? "text-amber-300" : isCompleted ? "text-white" : "text-slate-500"
                                }`}
                              >
                                {step.label}
                              </span>
                              <span className="text-[10px] text-slate-400 mt-0.5">{step.desc}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Budget approval by the customer */}
                      {awaitingApproval && (
                        <div className="rounded-xl border-2 border-amber-500 bg-amber-500/5 overflow-hidden">
                          <div className="px-4 py-3 bg-amber-500 text-slate-950 flex items-center justify-between gap-3">
                            <span className="font-display font-extrabold uppercase text-lg leading-none">
                              Tu presupuesto está listo
                            </span>
                            {activeOrder.budgetSentDate && (
                              <span className="text-[11px] font-semibold">
                                Enviado el {formatDate(activeOrder.budgetSentDate)}
                              </span>
                            )}
                          </div>
                          <div className="p-4 space-y-4">
                            <ul className="divide-y divide-slate-800 text-xs">
                              {activeOrder.items.map((it) => (
                                <li key={it.id} className="py-2 flex items-start justify-between gap-4">
                                  <span className="text-slate-300">
                                    {it.description}
                                    {it.quantity > 1 && <span className="text-slate-500"> x{it.quantity}</span>}
                                  </span>
                                  <span className="font-mono text-white shrink-0">{formatCurrency(it.subtotal)}</span>
                                </li>
                              ))}
                            </ul>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-700">
                              <div>
                                <span className="text-[11px] uppercase tracking-wider text-slate-400 block">
                                  Total con mano de obra y repuestos
                                </span>
                                <span className="font-display font-black text-4xl text-white leading-none">
                                  {formatCurrency(activeOrder.total)}
                                </span>
                              </div>
                              <div className="flex flex-col sm:flex-row gap-2">
                                <a
                                  href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                                    `Hola, tengo una consulta sobre el presupuesto de la orden ${activeOrder.orderNumber} (patente ${result.vehicle.licensePlate})`
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-4 py-3 rounded-md border border-slate-600 text-slate-200 hover:bg-slate-800 text-xs font-semibold flex items-center justify-center gap-2"
                                >
                                  <Phone className="w-4 h-4" />
                                  Tengo una consulta
                                </a>
                                <button
                                  type="button"
                                  onClick={handleApprove}
                                  className="px-5 py-3 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-bold uppercase tracking-wider text-base flex items-center justify-center gap-2"
                                >
                                  <CheckCircle2 className="w-5 h-5" />
                                  Aprobar presupuesto
                                </button>
                              </div>
                            </div>
                            <p className="text-[11px] text-slate-500">
                              No arrancamos ningún trabajo sin tu aprobación. Si aprobás, te avisamos por WhatsApp
                              cuando lleguen los repuestos.
                            </p>
                          </div>
                        </div>
                      )}

                      {activeOrder.approvedDate && (
                        <div className="px-4 py-3 rounded-xl bg-lime-500/10 border border-lime-500/30 text-xs text-lime-300 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>
                            Presupuesto aprobado el <strong>{formatDate(activeOrder.approvedDate)}</strong>
                            {activeOrder.approvedVia && <> vía {activeOrder.approvedVia}</>}.
                          </span>
                        </div>
                      )}

                      {/* Status explanation alert box */}
                      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-start gap-3">
                        <Wrench className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-white block font-semibold mb-0.5">
                            {statusInfo?.label}: {statusInfo?.description}
                          </strong>
                          {activeOrder.problemDescription && (
                            <p className="text-slate-400">
                              <strong>Motivo ingresado:</strong> {activeOrder.problemDescription}
                            </p>
                          )}
                          {activeOrder.diagnosisNotes && (
                            <p className="text-slate-300 mt-1">
                              <strong>Diagnóstico técnico:</strong> {activeOrder.diagnosisNotes}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Summary card & WhatsApp CTA */}
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-xs">
                        <div className="space-y-1 text-center sm:text-left">
                          <span className="text-slate-400 block">
                            Orden: <strong className="text-white font-mono">{activeOrder.orderNumber}</strong> • Técnico:{" "}
                            <strong className="text-slate-200">{activeOrder.technicianName}</strong>
                          </span>
                          <span className="text-slate-400 block">
                            Presupuesto total:{" "}
                            <strong className="text-emerald-400 font-mono text-sm">
                              {formatCurrency(activeOrder.total)}
                            </strong>{" "}
                            (Garantía: {activeOrder.warrantyMonths} meses)
                          </span>
                        </div>

                        <a
                          href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                            `Hola, consulto por mi orden ${activeOrder.orderNumber} del vehículo patente ${result.vehicle.licensePlate}`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all hover:scale-102 shrink-0"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          Consultar al Taller vía WhatsApp
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

