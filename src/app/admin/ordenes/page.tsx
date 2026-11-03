"use client";

import React, { useState } from "react";
import { useWorkshop } from "@/context/WorkshopContext";
import { WorkOrder, OrderStatus, Client, Vehicle } from "@/types";
import { formatCurrency, formatDate, formatPlate, ORDER_STATUS_MAP } from "@/lib/formatters";
import { WorkOrderModal } from "@/components/admin/WorkOrderModal";
import { WorkOrderPrint } from "@/components/admin/WorkOrderPrint";
import { WhatsAppModal } from "@/components/admin/WhatsAppModal";
import { VehicleHistoryModal } from "@/components/admin/VehicleHistoryModal";
import {
  ClipboardList,
  Search,
  Plus,
  Phone,
  Printer,
  Wrench,
  Trash2,
  Filter,
  CheckCircle2,
  Clock,
  Car,
  FileText,
} from "lucide-react";

export default function WorkOrdersPage() {
  const {
    orders,
    clients,
    vehicles,
    updateOrderStatus,
    deleteWorkOrder,
    getClientById,
    getVehicleById,
  } = useWorkshop();

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Modals
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

  const filteredOrders = orders.filter((order) => {
    const client = getClientById(order.clientId);
    const vehicle = getVehicleById(order.vehicleId);
    const q = searchTerm.toLowerCase();

    const matchesSearch =
      order.orderNumber.toLowerCase().includes(q) ||
      (client && client.fullName.toLowerCase().includes(q)) ||
      (vehicle && vehicle.licensePlate.toLowerCase().includes(q)) ||
      (vehicle && vehicle.model.toLowerCase().includes(q)) ||
      order.problemDescription.toLowerCase().includes(q);

    const matchesStatus = statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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

  const handleDelete = (id: string, num: string) => {
    if (confirm(`¿Seguro que deseas eliminar la orden ${num}?`)) {
      deleteWorkOrder(id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-amber-400" />
            Órdenes de Trabajo & Presupuestos
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Genere presupuestos técnicos, controle el estado de la reparación e imprima comprobantes con membrete
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedOrderForEdit(null);
            setIsOrderModalOpen(true);
          }}
          className="self-start sm:self-center px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md transition-all hover:scale-102"
        >
          <Plus className="w-4 h-4" />
          Nueva Orden / Presupuesto
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por N° de orden, cliente, modelo, patente o problema..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-hidden"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="text-xs text-slate-400 hover:text-white px-2 py-0.5 rounded-md bg-slate-800"
            >
              Limpiar
            </button>
          )}
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: "all", label: "Todas las Órdenes" },
            { id: "received", label: "Recepcionadas" },
            { id: "in_diagnosis", label: "En Diagnóstico" },
            { id: "waiting_parts", label: "Esperando Repuestos" },
            { id: "in_repair", label: "En Reparación" },
            { id: "quality_control", label: "Control Calidad" },
            { id: "ready", label: "Listas para Retiro" },
            { id: "delivered", label: "Entregadas" },
          ].map((pill) => {
            const isSelected = statusFilter === pill.id;
            const count =
              pill.id === "all"
                ? orders.length
                : orders.filter((o) => o.status === pill.id).length;

            return (
              <button
                key={pill.id}
                onClick={() => setStatusFilter(pill.id)}
                className={`px-3 py-1.5 rounded-xl font-medium whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                  isSelected
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-xs"
                    : "bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200"
                }`}
              >
                <span>{pill.label}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950 font-mono font-bold">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl bg-slate-900/40">
            <ClipboardList className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-300 font-semibold">No se encontraron órdenes</p>
            <p className="text-xs text-slate-500 mt-1">Pruebe cambiando los filtros de búsqueda</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const client = getClientById(order.clientId);
            const vehicle = getVehicleById(order.vehicleId);
            const statusInfo = ORDER_STATUS_MAP[order.status] || ORDER_STATUS_MAP.received;

            return (
              <div
                key={order.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 transition-all shadow-md space-y-4"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-base font-black text-amber-400 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
                      {order.orderNumber}
                    </span>
                    <div>
                      <div className="text-xs text-slate-400">
                        Fecha Ingreso: <strong className="text-slate-200">{formatDate(order.entryDate)}</strong>
                        {order.technicianName && (
                          <span> • Mecánico: <strong className="text-slate-200">{order.technicianName}</strong></span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <label className="text-[11px] text-slate-400 hidden sm:inline">Estado:</label>
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                      className={`text-xs font-semibold px-2.5 py-1.5 rounded-xl border cursor-pointer focus:outline-hidden ${statusInfo.bgColor} ${statusInfo.textColor} ${statusInfo.borderColor} bg-slate-950`}
                    >
                      <option value="received">Recepcionado</option>
                      <option value="in_diagnosis">En Diagnóstico</option>
                      <option value="waiting_parts">Esperando Repuestos</option>
                      <option value="in_repair">En Reparación</option>
                      <option value="quality_control">Control de Calidad</option>
                      <option value="ready">Listo para Retirar</option>
                      <option value="delivered">Entregado</option>
                    </select>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Client & Car info */}
                  <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/60 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Vehículo & Titular
                      </span>
                      {vehicle && (
                        <button
                          type="button"
                          onClick={() => handleOpenHistory(order)}
                          className="text-amber-400 hover:underline text-[11px] flex items-center gap-1 font-medium"
                          title="Ver Ficha Técnica"
                        >
                          <FileText className="w-3 h-3" />
                          Ficha
                        </button>
                      )}
                    </div>

                    <div className="font-bold text-white text-sm">
                      {vehicle ? `${vehicle.brand} ${vehicle.model}` : "Vehículo"}
                    </div>

                    <div className="flex items-center gap-2">
                      {vehicle && (
                        <span className="px-2 py-0.5 rounded font-mono font-bold bg-slate-900 text-slate-200 border border-slate-700">
                          {formatPlate(vehicle.licensePlate)}
                        </span>
                      )}
                      <span className="text-slate-400 font-mono">
                        {order.mileageAtEntry.toLocaleString()} km
                      </span>
                    </div>

                    <div className="pt-1 text-slate-400 border-t border-slate-800/60 flex items-center justify-between">
                      <span>Titular: <strong className="text-slate-200">{client?.fullName || "—"}</strong></span>
                      <span className="font-mono text-emerald-400 font-medium">{client?.phone}</span>
                    </div>
                  </div>

                  {/* Problem & Diagnosis */}
                  <div className="md:col-span-2 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/60 space-y-2">
                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
                        Motivo de Ingreso:
                      </span>
                      <p className="text-slate-200">{order.problemDescription}</p>
                    </div>

                    {order.diagnosisNotes && (
                      <div className="pt-2 border-t border-slate-800/60">
                        <span className="text-[11px] font-semibold text-amber-400/90 uppercase tracking-wider block mb-0.5">
                          Diagnóstico Técnico:
                        </span>
                        <p className="text-slate-300">{order.diagnosisNotes}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Items preview & Total bar */}
                <div className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                      Resumen de Repuestos y Trabajos ({order.items.length} ítems):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {order.items.map((it) => (
                        <span
                          key={it.id}
                          className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[11px] text-slate-300"
                        >
                          {it.description} <span className="text-slate-500 font-mono">({formatCurrency(it.subtotal)})</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-left md:text-right shrink-0">
                    <span className="text-[11px] text-slate-400 block">Total Final:</span>
                    <span className="font-mono text-lg font-black text-emerald-400">
                      {formatCurrency(order.total)}
                    </span>
                  </div>
                </div>

                {/* Action Buttons Bar */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => handleOpenWa(order)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    WhatsApp
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenPrint(order)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <Printer className="w-3.5 h-3.5 text-amber-400" />
                    Imprimir / PDF
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedOrderForEdit(order);
                      setIsOrderModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(order.id, order.orderNumber)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Eliminar orden"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
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

