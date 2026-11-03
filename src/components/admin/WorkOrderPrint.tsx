"use client";

import React from "react";
import { Modal } from "@/components/ui/Modal";
import { WorkOrder } from "@/types";
import { useWorkshop } from "@/context/WorkshopContext";
import { formatCurrency, formatDate, formatPlate, ORDER_STATUS_MAP } from "@/lib/formatters";
import { Printer, Download, CheckCircle2, ShieldCheck, Wrench } from "lucide-react";

interface WorkOrderPrintProps {
  isOpen: boolean;
  onClose: () => void;
  order: WorkOrder | null;
}

export function WorkOrderPrint({ isOpen, onClose, order }: WorkOrderPrintProps) {
  const { settings, getClientById, getVehicleById } = useWorkshop();

  if (!order) return null;

  const client = getClientById(order.clientId);
  const vehicle = getVehicleById(order.vehicleId);
  const statusInfo = ORDER_STATUS_MAP[order.status] || ORDER_STATUS_MAP.received;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Orden de Trabajo / Presupuesto #${order.orderNumber}`}
      subtitle="Comprobante con membrete oficial listo para imprimir o guardar como PDF"
      maxWidth="3xl"
    >
      <div className="space-y-4">
        {/* Action bar */}
        <div className="flex items-center justify-between bg-slate-800/80 p-3 rounded-xl no-print">
          <span className="text-xs text-slate-300">
            Utilice el botón de impresión para entregar en papel al cliente o guardar en PDF.
          </span>
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md transition-all"
          >
            <Printer className="w-4 h-4" />
            Imprimir Comprobante (Ctrl + P)
          </button>
        </div>

        {/* Printable Area - styled cleanly both for dark modal and crisp white paper print */}
        <div className="printable-order bg-white text-slate-900 p-8 rounded-xl shadow-xl font-sans border border-slate-200">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-slate-900 pb-5 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-slate-900 text-amber-400 rounded-md">
                  <Wrench className="w-5 h-5" />
                </div>
                <h1 className="text-2xl font-black uppercase tracking-wider text-slate-950">
                  {settings.name}
                </h1>
              </div>
              <p className="text-xs text-slate-600 mt-1">{settings.legalName} • CUIT: {settings.cuit}</p>
              <p className="text-xs text-slate-600">{settings.address} - {settings.city}</p>
              <p className="text-xs text-slate-600 font-medium">WhatsApp / Tel: {settings.phone}</p>
            </div>

            <div className="text-left sm:text-right">
              <span className="inline-block bg-slate-900 text-white font-mono text-sm px-3 py-1 rounded-md font-bold">
                {order.orderNumber}
              </span>
              <p className="text-xs text-slate-600 mt-1.5">
                <strong>Fecha de Emisión:</strong> {formatDate(order.entryDate)}
              </p>
              <p className="text-xs text-slate-600">
                <strong>Estado:</strong> {statusInfo.label}
              </p>
              <p className="text-xs text-slate-600">
                <strong>Técnico Asignado:</strong> {order.technicianName}
              </p>
            </div>
          </div>

          {/* Client & Vehicle grid */}
          <div className="grid grid-cols-2 gap-6 my-6 p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs">
            <div>
              <h3 className="font-bold text-slate-900 uppercase tracking-wider mb-1.5 border-b border-slate-200 pb-1">
                Datos del Cliente
              </h3>
              <p className="text-sm font-bold text-slate-900">{client?.fullName || "Cliente Ocasional"}</p>
              <p className="text-slate-600">Teléfono: {client?.phone || "—"}</p>
              <p className="text-slate-600">DNI / CUIT: {client?.dni || "—"}</p>
              <p className="text-slate-600">Dirección: {client?.address || "—"}</p>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 uppercase tracking-wider mb-1.5 border-b border-slate-200 pb-1">
                Datos del Vehículo
              </h3>
              <p className="text-sm font-bold text-slate-900">
                {vehicle?.brand} {vehicle?.model} ({vehicle?.year})
              </p>
              <p className="text-slate-700 font-mono font-bold">
                Patente: {vehicle ? formatPlate(vehicle.licensePlate) : "—"}
              </p>
              <p className="text-slate-600">Km de Ingreso: {order.mileageAtEntry.toLocaleString()} km</p>
              {vehicle?.vin && <p className="text-slate-600 font-mono text-[10px]">Chasis: {vehicle.vin}</p>}
            </div>
          </div>

          {/* Diagnosis & Motivo */}
          <div className="mb-6 space-y-2 text-xs">
            <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-lg">
              <strong className="text-amber-950 block">Motivo de ingreso:</strong>
              <p className="text-slate-800">{order.problemDescription}</p>
            </div>
            {order.diagnosisNotes && (
              <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-lg">
                <strong className="text-blue-950 block">Diagnóstico técnico:</strong>
                <p className="text-slate-800">{order.diagnosisNotes}</p>
              </div>
            )}
          </div>

          {/* Itemized Table */}
          <div className="mb-6">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white text-left font-semibold">
                  <th className="p-2.5 rounded-l-md">Tipo</th>
                  <th className="p-2.5">Descripción de Trabajos / Repuestos</th>
                  <th className="p-2.5 text-center">Cant.</th>
                  <th className="p-2.5 text-right">Precio Unit.</th>
                  <th className="p-2.5 text-right rounded-r-md">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-2.5 font-medium text-slate-500 uppercase text-[10px]">
                      {item.type === "part" ? "Repuesto" : "Mano de Obra"}
                    </td>
                    <td className="p-2.5 font-semibold text-slate-900">{item.description}</td>
                    <td className="p-2.5 text-center font-mono">{item.quantity}</td>
                    <td className="p-2.5 text-right font-mono text-slate-600">{formatCurrency(item.unitPrice)}</td>
                    <td className="p-2.5 text-right font-mono font-bold text-slate-900">{formatCurrency(item.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-64 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono">{formatCurrency(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Descuento aplicado:</span>
                  <span className="font-mono">-{formatCurrency(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-slate-900 border-t-2 border-slate-900 pt-2">
                <span>TOTAL FINAL:</span>
                <span className="font-mono text-amber-600">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Guarantee & Terms */}
          <div className="border border-slate-200 rounded-lg p-3 text-[11px] text-slate-600 mb-8 bg-slate-50">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Garantía y Condiciones del Servicio
            </div>
            <p>
              Este trabajo cuenta con <strong>{order.warrantyMonths} meses de garantía escrita</strong> sobre la mano de obra realizada y repuestos nuevos colocados. No cubre desgastes por mal uso, competencia o falta de mantenimiento preventivo.
            </p>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-2 gap-12 pt-8 text-center text-xs">
            <div className="border-t border-slate-400 pt-2">
              <p className="font-bold text-slate-900">Firma Responsable Taller</p>
              <p className="text-slate-500 text-[10px]">{order.technicianName} - {settings.name}</p>
            </div>
            <div className="border-t border-slate-400 pt-2">
              <p className="font-bold text-slate-900">Conformidad del Cliente</p>
              <p className="text-slate-500 text-[10px]">Aceptación de trabajo y presupuesto</p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

