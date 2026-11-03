"use client";

import React from "react";
import { useWorkshop } from "@/context/WorkshopContext";
import { formatPlate, ORDER_STATUS_MAP } from "@/lib/formatters";
import { Activity, Car, Wrench, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";

export function LiveTelemetry() {
  const { orders, getVehicleById } = useWorkshop();

  // Pick 4 active vehicles to simulate the live workshop bays
  const activeOrders = orders.filter((o) => o.status !== "delivered").slice(0, 4);

  return (
    <section className="py-16 bg-slate-950 border-t border-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
                <Activity className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white tracking-wide">
                    Telemetría & Actividad en Bahías de Trabajo
                  </h3>
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Monitoreo operativo en tiempo real de las estaciones de servicio del taller
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Recepción Activa
              </span>
              <span className="text-slate-400 hidden sm:inline">6 Elevadores Operativos</span>
            </div>
          </div>

          {/* Bays grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((bayNumber, idx) => {
              const order = activeOrders[idx];
              const vehicle = order ? getVehicleById(order.vehicleId) : null;
              const statusInfo = order ? ORDER_STATUS_MAP[order.status] : null;

              return (
                <div
                  key={bayNumber}
                  className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3 relative group hover:border-slate-700 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-mono text-slate-400 font-bold uppercase text-[10px]">
                        Bahía {bayNumber}
                      </span>
                      {order ? (
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${statusInfo?.bgColor} ${statusInfo?.textColor} border ${statusInfo?.borderColor}`}
                        >
                          {statusInfo?.label}
                        </span>
                      ) : (
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold uppercase border border-emerald-500/20">
                          Disponible
                        </span>
                      )}
                    </div>

                    {order && vehicle ? (
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-white leading-tight">
                          {vehicle.brand} {vehicle.model}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700 text-slate-300 font-bold">
                            {formatPlate(vehicle.licensePlate)}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-1 pt-1">
                          {order.problemDescription}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1 text-xs text-slate-500 py-2">
                        <p className="font-semibold text-slate-400">Puesto Libre</p>
                        <p className="text-[11px]">Listo para ingreso express de service o scanner</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                    <span>
                      {order ? `Técnico: ${order.technicianName.split(" ")[0]}` : "Turnos inmediatos"}
                    </span>
                    <Wrench className="w-3 h-3 text-slate-600" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

