"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useWorkshop } from "@/context/WorkshopContext";
import { formatCurrency, formatDate, formatPlate, ORDER_STATUS_MAP } from "@/lib/formatters";
import { WorkOrder, Vehicle, Client } from "@/types";
import { WorkOrderModal } from "@/components/admin/WorkOrderModal";
import { WorkOrderPrint } from "@/components/admin/WorkOrderPrint";
import { WhatsAppModal } from "@/components/admin/WhatsAppModal";
import { VehicleHistoryModal } from "@/components/admin/VehicleHistoryModal";
import {
  Car,
  Wrench,
  DollarSign,
  AlertTriangle,
  CalendarCheck,
  TrendingUp,
  Clock,
  ArrowRight,
  Phone,
  Printer,
  ChevronRight,
  Plus,
  Package,
} from "lucide-react";

export default function AdminDashboardPage() {
  const {
    orders,
    clients,
    vehicles,
    inventory,
    appointments,
    updateOrderStatus,
    getClientById,
    getVehicleById,
  } = useWorkshop();

  // Modals state
  const [selectedOrderForEdit, setSelectedOrderForEdit] = useState<WorkOrder | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedOrderForPrint, setSelectedOrderForPrint] = useState<WorkOrder | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [waModalData, setWaModalData] = useState<{
    client: Client;
    vehicle?: Vehicle;
    order?: WorkOrder;
  } | null>(null);
  const [historyModalData, setHistoryModalData] = useState<{
    vehicle: Vehicle;
    client: Client;
  } | null>(null);

  // Calculations
  const activeOrders = orders.filter((o) => o.status !== "delivered");
  const readyOrders = orders.filter((o) => o.status === "ready");
  const lowStockItems = inventory.filter((i) => i.currentStock <= i.minStock);
  const pendingAppointments = appointments.filter((a) => a.status === "pending");

  const totalMonthlyBilling = orders.reduce((sum, o) => sum + o.total, 0);

  const handleOpenPrint = (order: WorkOrder) => {
    setSelectedOrderForPrint(order);
    setIsPrintModalOpen(true);
  };

  const handleOpenWa = (order: WorkOrder) => {
    const client = getClientById(order.clientId);
    const vehicle = getVehicleById(order.vehicleId);
    if (client) {
      setWaModalData({ client, vehicle, order });
    }
  };

  const handleOpenHistory = (order: WorkOrder) => {
    const client = getClientById(order.clientId);
    const vehicle = getVehicleById(order.vehicleId);
    if (client && vehicle) {
      setHistoryModalData({ vehicle, client });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 min-h-[190px] flex items-end grain">
        <Image
          src="/img/taller-elevadores.jpg"
          alt="Nave del taller con autos en los elevadores"
          fill
          preload
          sizes="(min-width: 1024px) 1100px, 100vw"
          className="object-cover object-[center_40%]"
        />
        <div className="absolute inset-0 bg-linear-to-r from-slate-950 via-slate-950/70 to-transparent" />
        <div className="absolute top-0 inset-x-0 h-1.5 hazard" />

        <div className="relative z-10 w-full p-6 sm:p-8 flex flex-col sm:flex-row sm:items-end justify-between gap-5">
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-amber-400 flex items-center gap-2">
              <span className="h-px w-6 bg-amber-500" />
              Parte diario
            </span>
            <p className="font-display font-black uppercase text-4xl sm:text-5xl text-white leading-[0.9]">
              {activeOrders.length} {activeOrders.length === 1 ? "auto" : "autos"} en la nave,
              <span className="block text-amber-500">
                {readyOrders.length} {readyOrders.length === 1 ? "listo" : "listos"} para entregar.
              </span>
            </p>
            <p className="text-xs text-slate-300 max-w-xl">
              Reparaciones, stock de repuestos y avisos por WhatsApp, todo en un solo tablero.
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedOrderForEdit(null);
              setIsOrderModalOpen(true);
            }}
            className="self-start sm:self-end shrink-0 px-5 py-3 rounded-sm bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-bold uppercase tracking-wider text-base flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            Nueva orden de trabajo
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Autos en Taller */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Autos en Reparación</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Car className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono">{activeOrders.length}</span>
            <span className="text-xs text-slate-400">en taller</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-400 font-medium flex items-center gap-1">
            <span>
              {readyOrders.length} {readyOrders.length === 1 ? "listo" : "listos"} para entrega inmediata
            </span>
          </div>
        </div>

        {/* Facturación estimada */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Facturación Acumulada</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-400 font-mono">
              {formatCurrency(totalMonthlyBilling)}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>{orders.length} órdenes registradas</span>
          </div>
        </div>

        {/* Alerta de Stock Crítico */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Stock Crítico</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-400 font-mono">
              {lowStockItems.length}
            </span>
            <span className="text-xs text-slate-400">artículos</span>
          </div>
          <Link
            href="/admin/stock"
            className="mt-2 text-[11px] text-amber-400/90 hover:underline flex items-center gap-1 font-medium"
          >
            <span>Ver repuestos a reponer</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Turnos pendientes */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Turnos Solicitados</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-purple-400 font-mono">
              {pendingAppointments.length}
            </span>
            <span className="text-xs text-slate-400">pendientes</span>
          </div>
          <Link
            href="/admin/turnos"
            className="mt-2 text-[11px] text-purple-400 hover:underline flex items-center gap-1 font-medium"
          >
            <span>Confirmar en agenda</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Visual Pipeline / Kanban Strip */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Wrench className="w-4 h-4 text-amber-400" />
            Pipeline Visual de Reparaciones
          </h3>
          <span className="text-xs text-slate-400">
            {activeOrders.length} vehículos en proceso activo
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { key: "received", label: "Recepcionados" },
            { key: "in_diagnosis", label: "En Diagnóstico" },
            { key: "waiting_parts", label: "Esperando Repuestos" },
            { key: "in_repair", label: "En Reparación" },
            { key: "quality_control", label: "Control Calidad" },
            { key: "ready", label: "Listos p/ Retiro" },
          ].map((col) => {
            const count = orders.filter((o) => o.status === col.key).length;
            const statusConfig = ORDER_STATUS_MAP[col.key as keyof typeof ORDER_STATUS_MAP];
            return (
              <div
                key={col.key}
                className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`w-2 h-2 rounded-full ${statusConfig.color}`} />
                  <span className="font-mono text-xs font-bold text-white bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                    {count}
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-slate-300 leading-tight">
                  {col.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Orders List Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white">Órdenes de Trabajo en el Taller</h3>
            <p className="text-xs text-slate-400">
              Seguimiento de reparaciones, cambios de estado en vivo y avisos por WhatsApp
            </p>
          </div>
          <Link
            href="/admin/ordenes"
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            Ver todas las órdenes
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Orden / Fecha</th>
                <th className="py-3.5 px-4 font-semibold">Vehículo & Patente</th>
                <th className="py-3.5 px-4 font-semibold">Cliente</th>
                <th className="py-3.5 px-4 font-semibold">Motivo / Falla</th>
                <th className="py-3.5 px-4 font-semibold">Estado Actual</th>
                <th className="py-3.5 px-4 font-semibold text-right">Total Presupuestado</th>
                <th className="py-3.5 px-4 font-semibold text-center">Acciones Demo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {orders.slice(0, 6).map((order) => {
                const client = getClientById(order.clientId);
                const vehicle = getVehicleById(order.vehicleId);
                const statusInfo = ORDER_STATUS_MAP[order.status] || ORDER_STATUS_MAP.received;

                return (
                  <tr key={order.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Orden / Fecha */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-white">{order.orderNumber}</div>
                      <div className="text-[10px] text-slate-500">{formatDate(order.entryDate)}</div>
                    </td>

                    {/* Vehículo */}
                    <td className="py-3.5 px-4">
                      {vehicle ? (
                        <div>
                          <button
                            type="button"
                            onClick={() => handleOpenHistory(order)}
                            className="font-semibold text-white hover:text-amber-400 text-left transition-colors flex items-center gap-1.5"
                            title="Ver ficha técnica y anotador"
                          >
                            <span>{vehicle.brand} {vehicle.model}</span>
                          </button>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="font-mono text-[10px] bg-slate-950 px-1.5 py-0.5 rounded border border-slate-700 text-slate-300">
                              {formatPlate(vehicle.licensePlate)}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {order.mileageAtEntry.toLocaleString()} km
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-500">Vehículo eliminado</span>
                      )}
                    </td>

                    {/* Cliente */}
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-200">{client?.fullName || "—"}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{client?.phone}</div>
                    </td>

                    {/* Motivo */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="line-clamp-2 text-slate-300 text-[11px]">
                        {order.problemDescription}
                      </p>
                    </td>

                    {/* Estado con Selector en Tiempo Real */}
                    <td className="py-3.5 px-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                        className={`text-[11px] font-semibold px-2 py-1 rounded-lg border cursor-pointer focus:outline-hidden ${statusInfo.bgColor} ${statusInfo.textColor} ${statusInfo.borderColor} bg-slate-900`}
                      >
                        <option value="received">Recepcionado</option>
                        <option value="in_diagnosis">En Diagnóstico</option>
                        <option value="waiting_parts">Esperando Repuestos</option>
                        <option value="in_repair">En Reparación</option>
                        <option value="quality_control">Control Calidad</option>
                        <option value="ready">Listo para Retirar</option>
                        <option value="delivered">Entregado</option>
                      </select>
                    </td>

                    {/* Total */}
                    <td className="py-3.5 px-4 text-right">
                      <span className="font-mono font-bold text-white text-sm">
                        {formatCurrency(order.total)}
                      </span>
                      <div className="text-[10px] text-slate-500">
                        {order.items.length} ítems
                      </div>
                    </td>

                    {/* Acciones */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* WhatsApp direct */}
                        <button
                          type="button"
                          onClick={() => handleOpenWa(order)}
                          className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-all hover:scale-105"
                          title="Enviar aviso por WhatsApp"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </button>

                        {/* Print / PDF view */}
                        <button
                          type="button"
                          onClick={() => handleOpenPrint(order)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all hover:scale-105"
                          title="Imprimir Comprobante / Presupuesto"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>

                        {/* Edit order */}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedOrderForEdit(order);
                            setIsOrderModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 transition-all hover:scale-105"
                          title="Editar Orden / Desglose"
                        >
                          <Wrench className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two Column Grid: Low Stock Alert & Recent Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Repuestos con Stock Bajo */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Package className="w-4 h-4 text-amber-400" />
                Alertas de Stock en Repuestos
              </h3>
              <p className="text-xs text-slate-400">
                Piezas que llegaron al punto de reorden mínimo
              </p>
            </div>
            <Link
              href="/admin/stock"
              className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-semibold"
            >
              Gestionar Inventario
            </Link>
          </div>

          <div className="space-y-2.5">
            {lowStockItems.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">
                Todo el stock se encuentra en niveles óptimos.
              </p>
            ) : (
              lowStockItems.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-semibold text-slate-200">{item.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Código: {item.code} • Proveedor: {item.supplier || "—"}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Stock actual:</span>
                      <span
                        className={`font-mono font-bold ${
                          item.currentStock === 0 ? "text-red-400" : "text-amber-400"
                        }`}
                      >
                        {item.currentStock} un. (Mín: {item.minStock})
                      </span>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        item.currentStock === 0
                          ? "bg-red-500/20 text-red-400 border border-red-500/30"
                          : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {item.currentStock === 0 ? "AGOTADO" : "REPONER"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Turnos Web Recientes */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-purple-400" />
                Turnos Solicitados desde la Web
              </h3>
              <p className="text-xs text-slate-400">
                Reservas automáticas recibidas desde la landing page
              </p>
            </div>
            <Link
              href="/admin/turnos"
              className="text-xs text-purple-400 hover:underline flex items-center gap-1 font-semibold"
            >
              Ver Agenda Completa
            </Link>
          </div>

          <div className="space-y-2.5">
            {appointments.slice(0, 4).map((app) => (
              <div
                key={app.id}
                className="flex items-center justify-between p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl text-xs"
              >
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-200">
                    {app.clientName} • <span className="text-slate-400">{app.vehicleBrand} {app.vehicleModel}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    📅 {formatDate(app.preferredDate)} a las {app.preferredTimeSlot} — {app.serviceType}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      app.status === "confirmed"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-amber-500/20 text-amber-400"
                    }`}
                  >
                    {app.status === "confirmed" ? "Confirmado" : "Pendiente"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      <WorkOrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        orderToEdit={selectedOrderForEdit}
      />

      <WorkOrderPrint
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        order={selectedOrderForPrint}
      />

      {waModalData && (
        <WhatsAppModal
          isOpen={true}
          onClose={() => setWaModalData(null)}
          client={waModalData.client}
          vehicle={waModalData.vehicle}
          workOrder={waModalData.order}
          defaultTemplate={waModalData.order?.status === "ready" ? "ready" : "budget"}
        />
      )}

      {historyModalData && (
        <VehicleHistoryModal
          isOpen={true}
          onClose={() => setHistoryModalData(null)}
          vehicle={historyModalData.vehicle}
          client={historyModalData.client}
          onNewOrderForVehicle={(veh, cli) => {
            setHistoryModalData(null);
            setSelectedOrderForEdit(null);
            setIsOrderModalOpen(true);
          }}
        />
      )}
    </div>
  );
}
