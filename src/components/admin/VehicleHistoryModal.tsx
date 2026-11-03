"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Vehicle, Client, WorkOrder } from "@/types";
import { useWorkshop } from "@/context/WorkshopContext";
import { formatCurrency, formatDate, formatPlate, ORDER_STATUS_MAP } from "@/lib/formatters";
import { WhatsAppModal } from "./WhatsAppModal";
import {
  Car,
  Wrench,
  Calendar,
  Gauge,
  User,
  Phone,
  FileText,
  Plus,
  ShieldCheck,
  Fuel,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";

interface VehicleHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle?: Vehicle;
  client?: Client;
  onNewOrderForVehicle?: (vehicle: Vehicle, client: Client) => void;
}

export function VehicleHistoryModal({
  isOpen,
  onClose,
  vehicle,
  client,
  onNewOrderForVehicle,
}: VehicleHistoryModalProps) {
  const { getVehicleOrders } = useWorkshop();
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [selectedOrderForWa, setSelectedOrderForWa] = useState<WorkOrder | undefined>(undefined);

  if (!vehicle || !client) return null;

  const orders = getVehicleOrders(vehicle.id);
  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);

  const handleOpenWa = (order?: WorkOrder) => {
    setSelectedOrderForWa(order);
    setIsWhatsAppOpen(true);
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Ficha Técnica & Anotador Histórico"
        subtitle={`${vehicle.brand} ${vehicle.model} • Patente ${formatPlate(vehicle.licensePlate)}`}
        maxWidth="3xl"
      >
        <div className="space-y-6">
          {/* Top Vehicle & Owner Header Card */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              {/* Patente & Car Main info */}
              <div className="md:col-span-2 space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  {/* Patente badge */}
                  <div className="px-3.5 py-1.5 bg-slate-900 border-2 border-slate-700 rounded-lg shadow-inner flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400">ARG</span>
                    <span className="font-mono text-base font-black tracking-widest text-white">
                      {formatPlate(vehicle.licensePlate)}
                    </span>
                  </div>

                  <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    Año {vehicle.year}
                  </span>

                  {vehicle.fuelType && (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                      <Fuel className="w-3 h-3" />
                      {vehicle.fuelType}
                    </span>
                  )}
                </div>

                <h2 className="text-xl font-bold text-white tracking-tight">
                  {vehicle.brand} {vehicle.model}
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 text-amber-400" />
                    <span>Km actual:</span>
                    <strong className="text-white font-mono">{vehicle.mileage.toLocaleString()} km</strong>
                  </div>
                  {vehicle.engine && (
                    <div className="flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5 text-blue-400" />
                      <span>Motor:</span>
                      <strong className="text-white">{vehicle.engine}</strong>
                    </div>
                  )}
                  {vehicle.color && (
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-400 border border-slate-300" />
                      <span>Color:</span>
                      <strong className="text-white">{vehicle.color}</strong>
                    </div>
                  )}
                  {vehicle.vin && (
                    <div className="col-span-2 text-[11px] text-slate-400">
                      <span>Chasis / VIN: </span>
                      <span className="font-mono text-slate-200">{vehicle.vin}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Owner card */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1 font-medium">
                    <User className="w-3.5 h-3.5 text-indigo-400" />
                    Titular
                  </span>
                  <button
                    onClick={() => handleOpenWa()}
                    className="p-1 rounded-md bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors flex items-center gap-1 text-[11px] px-2 font-medium"
                    title="Enviar WhatsApp"
                  >
                    <Phone className="w-3 h-3" />
                    WhatsApp
                  </button>
                </div>

                <div className="font-semibold text-white text-sm">{client.fullName}</div>
                <div className="text-slate-400 font-mono">{client.phone}</div>
                {client.dni && <div className="text-slate-500">DNI/CUIT: {client.dni}</div>}
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-3 text-center">
              <span className="text-xs text-slate-400">Servicios Realizados</span>
              <div className="text-lg font-bold text-white mt-0.5">{orders.length}</div>
            </div>
            <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-3 text-center">
              <span className="text-xs text-slate-400">Inversión Histórica</span>
              <div className="text-lg font-bold text-amber-400 mt-0.5">{formatCurrency(totalSpent)}</div>
            </div>
            <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-3 text-center">
              <span className="text-xs text-slate-400">Último Service</span>
              <div className="text-sm font-semibold text-slate-200 mt-1">
                {vehicle.lastServiceDate ? formatDate(vehicle.lastServiceDate) : "Sin registro"}
              </div>
            </div>
          </div>

          {/* Anotador de Intervenciones / Historial */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  Anotador Histórico de Trabajos & Reparaciones
                </h3>
                <p className="text-xs text-slate-400">
                  Registro cronológico detallado de lo que se le realizó al vehículo
                </p>
              </div>

              {onNewOrderForVehicle && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNewOrderForVehicle(vehicle, client);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs flex items-center gap-1.5 shadow-md transition-all hover:scale-102"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Nueva Orden
                </button>
              )}
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
                <Wrench className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-400">Aún no hay reparaciones registradas para este vehículo.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order, idx) => {
                  const statusInfo = ORDER_STATUS_MAP[order.status] || ORDER_STATUS_MAP.received;
                  return (
                    <div
                      key={order.id}
                      className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 transition-all hover:border-slate-700 relative"
                    >
                      {/* Timeline dot & line connector */}
                      {idx !== orders.length - 1 && (
                        <div className="absolute left-[27px] top-[50px] bottom-[-20px] w-0.5 bg-slate-800 hidden md:block" />
                      )}

                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800/80 pb-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-mono font-bold text-amber-400">
                            #{orders.length - idx}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm font-bold text-white">{order.orderNumber}</span>
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${statusInfo.bgColor} ${statusInfo.textColor} ${statusInfo.borderColor}`}
                              >
                                {statusInfo.label}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(order.entryDate)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Gauge className="w-3 h-3" />
                                {order.mileageAtEntry.toLocaleString()} km
                              </span>
                              {order.technicianName && (
                                <span className="text-slate-400">Técnico: {order.technicianName}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 self-end md:self-auto">
                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 block">Total Trabajo</span>
                            <span className="font-bold text-sm text-emerald-400 font-mono">
                              {formatCurrency(order.total)}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleOpenWa(order)}
                            className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-colors"
                            title="Enviar info por WhatsApp"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Motivo & Diagnóstico */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mb-3">
                        <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                          <span className="text-slate-400 font-semibold block mb-0.5">Motivo de ingreso:</span>
                          <p className="text-slate-200">{order.problemDescription}</p>
                        </div>
                        {order.diagnosisNotes && (
                          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                            <span className="text-amber-400/90 font-semibold block mb-0.5">Diagnóstico técnico:</span>
                            <p className="text-slate-200">{order.diagnosisNotes}</p>
                          </div>
                        )}
                      </div>

                      {/* Repuestos y tareas desglosadas */}
                      {order.items && order.items.length > 0 && (
                        <div className="bg-slate-900/40 rounded-lg p-3 border border-slate-800/60">
                          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                            Detalle de lo realizado y repuestos colocados:
                          </span>
                          <div className="space-y-1.5">
                            {order.items.map((it) => (
                              <div
                                key={it.id}
                                className="flex items-center justify-between text-xs py-1 border-b border-slate-800/40 last:border-0"
                              >
                                <div className="flex items-center gap-2">
                                  {it.type === "part" ? (
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                  ) : (
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                  )}
                                  <span className="text-slate-300">
                                    {it.description} <span className="text-slate-500">x{it.quantity}</span>
                                  </span>
                                </div>
                                <span className="text-slate-400 font-mono text-[11px]">
                                  {formatCurrency(it.subtotal)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {order.internalNotes && (
                        <div className="mt-2 text-[11px] text-slate-400 bg-amber-950/20 border border-amber-900/30 p-2 rounded-lg">
                          <strong className="text-amber-400">Nota técnica interna:</strong> {order.internalNotes}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* WhatsApp Modal Triggered from here */}
      <WhatsAppModal
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
        client={client}
        vehicle={vehicle}
        workOrder={selectedOrderForWa}
        defaultTemplate={selectedOrderForWa ? (selectedOrderForWa.status === "ready" ? "ready" : "budget") : "reminder"}
      />
    </>
  );
}

