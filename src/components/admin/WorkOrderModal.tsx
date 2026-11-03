"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { WorkOrder, OrderItem, OrderStatus, Client, Vehicle } from "@/types";
import { useWorkshop } from "@/context/WorkshopContext";
import { formatCurrency, formatPlate } from "@/lib/formatters";
import { Plus, Trash2, Package, Wrench, ShieldCheck, AlertCircle } from "lucide-react";

interface WorkOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderToEdit?: WorkOrder | null;
  initialVehicle?: Vehicle | null;
  initialClient?: Client | null;
}

export function WorkOrderModal({
  isOpen,
  onClose,
  orderToEdit,
  initialVehicle,
  initialClient,
}: WorkOrderModalProps) {
  const { clients, vehicles, inventory, addWorkOrder, updateWorkOrder } = useWorkshop();

  const [clientId, setClientId] = useState<string>("");
  const [vehicleId, setVehicleId] = useState<string>("");
  const [status, setStatus] = useState<OrderStatus>("received");
  const [entryDate, setEntryDate] = useState<string>("");
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState<string>("");
  const [mileageAtEntry, setMileageAtEntry] = useState<number>(0);
  const [problemDescription, setProblemDescription] = useState<string>("");
  const [diagnosisNotes, setDiagnosisNotes] = useState<string>("");
  const [internalNotes, setInternalNotes] = useState<string>("");
  const [technicianName, setTechnicianName] = useState<string>("Técnico de Turno");
  const [warrantyMonths, setWarrantyMonths] = useState<number>(6);
  const [paymentStatus, setPaymentStatus] = useState<"Pendiente" | "Parcial" | "Pagado">("Pendiente");
  const [paymentMethod, setPaymentMethod] = useState<WorkOrder["paymentMethod"]>("Transferencia");

  // Items
  const [items, setItems] = useState<OrderItem[]>([]);
  const [discount, setDiscount] = useState<number>(0);

  // New item draft states
  const [selectedInventoryId, setSelectedInventoryId] = useState<string>("");
  const [laborDescription, setLaborDescription] = useState<string>("");
  const [laborPrice, setLaborPrice] = useState<number>(0);

  useEffect(() => {
    if (!isOpen) return;

    if (orderToEdit) {
      setClientId(orderToEdit.clientId);
      setVehicleId(orderToEdit.vehicleId);
      setStatus(orderToEdit.status);
      setEntryDate(orderToEdit.entryDate ? orderToEdit.entryDate.split("T")[0] : "");
      setEstimatedDeliveryDate(
        orderToEdit.estimatedDeliveryDate ? orderToEdit.estimatedDeliveryDate.split("T")[0] : ""
      );
      setMileageAtEntry(orderToEdit.mileageAtEntry || 0);
      setProblemDescription(orderToEdit.problemDescription || "");
      setDiagnosisNotes(orderToEdit.diagnosisNotes || "");
      setInternalNotes(orderToEdit.internalNotes || "");
      setTechnicianName(orderToEdit.technicianName || "Roberto 'Tito' Gómez");
      setItems(orderToEdit.items || []);
      setDiscount(orderToEdit.discount || 0);
      setWarrantyMonths(orderToEdit.warrantyMonths || 6);
      setPaymentStatus(orderToEdit.paymentStatus || "Pendiente");
      setPaymentMethod(orderToEdit.paymentMethod || "Transferencia");
    } else {
      // New order
      const defaultClientId = initialClient ? initialClient.id : clients[0]?.id || "";
      const clientVehicles = vehicles.filter((v) => v.clientId === defaultClientId);
      const defaultVehicle = initialVehicle || clientVehicles[0];

      setClientId(defaultClientId);
      setVehicleId(defaultVehicle ? defaultVehicle.id : "");
      setStatus("received");
      setEntryDate(new Date().toISOString().split("T")[0]);
      setEstimatedDeliveryDate("");
      setMileageAtEntry(defaultVehicle ? defaultVehicle.mileage : 0);
      setProblemDescription("");
      setDiagnosisNotes("");
      setInternalNotes("");
      setTechnicianName("Roberto 'Tito' Gómez");
      setItems([]);
      setDiscount(0);
      setWarrantyMonths(6);
      setPaymentStatus("Pendiente");
      setPaymentMethod("Transferencia");
    }
  }, [isOpen, orderToEdit, initialVehicle, initialClient, clients, vehicles]);

  // When client changes, auto select their first vehicle
  const handleClientChange = (cId: string) => {
    setClientId(cId);
    const clientVehs = vehicles.filter((v) => v.clientId === cId);
    if (clientVehs.length > 0) {
      setVehicleId(clientVehs[0].id);
      setMileageAtEntry(clientVehs[0].mileage);
    } else {
      setVehicleId("");
      setMileageAtEntry(0);
    }
  };

  const handleVehicleChange = (vId: string) => {
    setVehicleId(vId);
    const selectedVeh = vehicles.find((v) => v.id === vId);
    if (selectedVeh) {
      setMileageAtEntry(selectedVeh.mileage);
    }
  };

  // Add item from inventory
  const handleAddInventoryItem = () => {
    if (!selectedInventoryId) return;
    const invItem = inventory.find((i) => i.id === selectedInventoryId);
    if (!invItem) return;

    const newItem: OrderItem = {
      id: "item-" + Date.now(),
      type: "part",
      description: `${invItem.name} (${invItem.brand})`,
      quantity: 1,
      unitPrice: invItem.salePrice,
      subtotal: invItem.salePrice,
      inventoryItemId: invItem.id,
    };

    setItems([...items, newItem]);
    setSelectedInventoryId("");
  };

  // Add custom labor
  const handleAddLabor = () => {
    if (!laborDescription.trim() || laborPrice <= 0) return;

    const newItem: OrderItem = {
      id: "item-" + Date.now(),
      type: "labor",
      description: laborDescription.trim(),
      quantity: 1,
      unitPrice: Number(laborPrice),
      subtotal: Number(laborPrice),
    };

    setItems([...items, newItem]);
    setLaborDescription("");
    setLaborPrice(0);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((it) => it.id !== id));
  };

  const handleQuantityChange = (id: string, delta: number) => {
    setItems(
      items.map((it) => {
        if (it.id === id) {
          const nextQty = Math.max(0.5, it.quantity + delta);
          return {
            ...it,
            quantity: nextQty,
            subtotal: nextQty * it.unitPrice,
          };
        }
        return it;
      })
    );
  };

  // Totals
  const subtotal = items.reduce((sum, it) => sum + it.subtotal, 0);
  const total = Math.max(0, subtotal - discount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || !vehicleId) {
      alert("Por favor selecciona un cliente y un vehículo.");
      return;
    }

    if (orderToEdit) {
      updateWorkOrder({
        ...orderToEdit,
        clientId,
        vehicleId,
        status,
        entryDate: new Date(entryDate).toISOString(),
        estimatedDeliveryDate: estimatedDeliveryDate
          ? new Date(estimatedDeliveryDate).toISOString()
          : undefined,
        mileageAtEntry: Number(mileageAtEntry),
        problemDescription,
        diagnosisNotes,
        internalNotes,
        technicianName,
        items,
        subtotal,
        discount: Number(discount),
        tax: 0,
        total,
        warrantyMonths,
        paymentStatus,
        paymentMethod,
      });
    } else {
      addWorkOrder({
        clientId,
        vehicleId,
        status,
        entryDate: new Date(entryDate).toISOString(),
        estimatedDeliveryDate: estimatedDeliveryDate
          ? new Date(estimatedDeliveryDate).toISOString()
          : undefined,
        mileageAtEntry: Number(mileageAtEntry),
        problemDescription: problemDescription || "Revisión general y diagnóstico",
        diagnosisNotes,
        internalNotes,
        technicianName,
        items,
        subtotal,
        discount: Number(discount),
        tax: 0,
        total,
        warrantyMonths,
        paymentStatus,
        paymentMethod,
      });
    }

    onClose();
  };

  const availableVehicles = vehicles.filter((v) => v.clientId === clientId);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={orderToEdit ? `Editar Orden / Presupuesto #${orderToEdit.orderNumber}` : "Nueva Orden de Trabajo / Presupuesto"}
      subtitle="Complete los detalles técnicos, asocie repuestos del stock y defina la mano de obra"
      maxWidth="3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Client & Vehicle selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Cliente
            </label>
            <select
              value={clientId}
              onChange={(e) => handleClientChange(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500/50"
            >
              <option value="" disabled>
                Seleccionar cliente...
              </option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.fullName} ({c.phone})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Vehículo Asignado
            </label>
            <select
              value={vehicleId}
              onChange={(e) => handleVehicleChange(e.target.value)}
              required
              disabled={availableVehicles.length === 0}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500/50 disabled:opacity-50"
            >
              {availableVehicles.length === 0 ? (
                <option value="">Este cliente no tiene vehículos cargados</option>
              ) : (
                availableVehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.brand} {v.model} ({formatPlate(v.licensePlate)}) - {v.mileage.toLocaleString()} km
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        {/* State, Mileage, Technician */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Estado de la Orden
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as OrderStatus)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500/50 font-semibold"
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

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Kilometraje de Entrada
            </label>
            <input
              type="number"
              value={mileageAtEntry}
              onChange={(e) => setMileageAtEntry(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500/50 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Mecánico Responsable
            </label>
            <input
              type="text"
              value={technicianName}
              onChange={(e) => setTechnicianName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-amber-500/50"
            />
          </div>
        </div>

        {/* Motivo & Diagnóstico */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Motivo de Ingreso / Falla Reportada
            </label>
            <textarea
              rows={2}
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              placeholder="Ej: Ruido en tren delantero, service 60.000km, check engine..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Diagnóstico Técnico Realizado
            </label>
            <textarea
              rows={2}
              value={diagnosisNotes}
              onChange={(e) => setDiagnosisNotes(e.target.value)}
              placeholder="Ej: Discos alabeados, código scanner P0301, bobina fatigada..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-amber-500/50"
            />
          </div>
        </div>

        {/* Items Section: Stock parts & Labor */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Wrench className="w-4 h-4 text-amber-400" />
              Desglose de Repuestos y Mano de Obra
            </span>
            <span className="text-xs text-slate-400">{items.length} ítems agregados</span>
          </div>

          {/* Quick add inputs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 pt-1 border-t border-slate-800/80">
            {/* Add stock part */}
            <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 space-y-2">
              <span className="text-[11px] font-semibold text-blue-400 flex items-center gap-1">
                <Package className="w-3.5 h-3.5" />
                Agregar Repuesto del Inventario (descuenta stock)
              </span>
              <div className="flex gap-2">
                <select
                  value={selectedInventoryId}
                  onChange={(e) => setSelectedInventoryId(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 focus:outline-hidden"
                >
                  <option value="">Seleccionar del catálogo...</option>
                  {inventory.map((inv) => (
                    <option key={inv.id} value={inv.id} disabled={inv.currentStock <= 0}>
                      {inv.name} - Stock: {inv.currentStock} - {formatCurrency(inv.salePrice)}
                      {inv.currentStock <= 0 ? " (AGOTADO)" : ""}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddInventoryItem}
                  disabled={!selectedInventoryId}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-semibold"
                >
                  Agregar
                </button>
              </div>
            </div>

            {/* Add custom labor */}
            <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 space-y-2">
              <span className="text-[11px] font-semibold text-amber-400 flex items-center gap-1">
                <Wrench className="w-3.5 h-3.5" />
                Agregar Mano de Obra / Servicio
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Descripción de la tarea"
                  value={laborDescription}
                  onChange={(e) => setLaborDescription(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100"
                />
                <input
                  type="number"
                  placeholder="Monto $"
                  value={laborPrice || ""}
                  onChange={(e) => setLaborPrice(Number(e.target.value))}
                  className="w-24 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-100 font-mono"
                />
                <button
                  type="button"
                  onClick={handleAddLabor}
                  disabled={!laborDescription.trim() || laborPrice <= 0}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 text-xs font-semibold"
                >
                  Agregar
                </button>
              </div>
            </div>
          </div>

          {/* Items table */}
          {items.length === 0 ? (
            <div className="text-center py-4 text-xs text-slate-500">
              No hay ítems cargados en esta orden todavía.
            </div>
          ) : (
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {items.map((it) => (
                <div
                  key={it.id}
                  className="flex items-center justify-between p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-xs"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                        it.type === "part" ? "bg-blue-500/20 text-blue-400" : "bg-amber-500/20 text-amber-400"
                      }`}
                    >
                      {it.type === "part" ? "REPUESTO" : "MANO DE OBRA"}
                    </span>
                    <span className="text-slate-200 font-medium">{it.description}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Quantity controls */}
                    <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-700 rounded-md px-1.5 py-0.5">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(it.id, -1)}
                        className="text-slate-400 hover:text-white px-1 font-bold"
                      >
                        -
                      </button>
                      <span className="font-mono text-white text-xs w-6 text-center">{it.quantity}</span>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(it.id, 1)}
                        className="text-slate-400 hover:text-white px-1 font-bold"
                      >
                        +
                      </button>
                    </div>

                    <div className="w-24 text-right font-mono font-bold text-white">
                      {formatCurrency(it.subtotal)}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveItem(it.id)}
                      className="text-slate-500 hover:text-red-400 transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Totals Summary */}
          <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-end gap-3 text-xs">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <label className="text-slate-400">Descuento aplicado ($):</label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="w-28 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-slate-100 font-mono"
              />
            </div>

            <div className="text-right space-y-1">
              <div className="text-slate-400">
                Subtotal: <span className="font-mono text-slate-200">{formatCurrency(subtotal)}</span>
              </div>
              <div className="text-base font-bold text-white">
                Total Final: <span className="font-mono text-emerald-400">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-102"
          >
            {orderToEdit ? "Guardar Cambios" : "Crear Orden de Trabajo"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
