"use client";

import React, { useState } from "react";
import { useWorkshop } from "@/context/WorkshopContext";
import { Client, Vehicle } from "@/types";
import { formatPlate } from "@/lib/formatters";
import { ClientModal } from "@/components/admin/ClientModal";
import { VehicleHistoryModal } from "@/components/admin/VehicleHistoryModal";
import { WhatsAppModal } from "@/components/admin/WhatsAppModal";
import { WorkOrderModal } from "@/components/admin/WorkOrderModal";
import {
  Users,
  Search,
  UserPlus,
  Car,
  Phone,
  FileText,
  Plus,
  Wrench,
  Pencil,
  Trash2,
  Calendar,
  Sparkles,
} from "lucide-react";

export default function ClientsPage() {
  const { clients, vehicles, getClientVehicles, deleteClient, addVehicle } = useWorkshop();

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState("");

  // Modals
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);

  const [historyVehicle, setHistoryVehicle] = useState<Vehicle | null>(null);
  const [historyClient, setHistoryClient] = useState<Client | null>(null);

  const [waClient, setWaClient] = useState<Client | null>(null);
  const [waVehicle, setWaVehicle] = useState<Vehicle | undefined>(undefined);

  const [orderModalClient, setOrderModalClient] = useState<Client | null>(null);
  const [orderModalVehicle, setOrderModalVehicle] = useState<Vehicle | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // New vehicle modal quick state
  const [quickVehicleClient, setQuickVehicleClient] = useState<Client | null>(null);
  const [quickBrand, setQuickBrand] = useState("");
  const [quickModel, setQuickModel] = useState("");
  const [quickYear, setQuickYear] = useState(2022);
  const [quickPlate, setQuickPlate] = useState("");
  const [quickKm, setQuickKm] = useState(50000);

  // Filter clients
  const filteredClients = clients.filter((c) => {
    const q = searchTerm.toLowerCase();
    const clientVehicles = getClientVehicles(c.id);
    const matchesPlate = clientVehicles.some((v) =>
      v.licensePlate.toLowerCase().includes(q)
    );
    return (
      c.fullName.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      (c.dni && c.dni.includes(q)) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      matchesPlate
    );
  });

  const handleOpenHistory = (vehicle: Vehicle, client: Client) => {
    setHistoryVehicle(vehicle);
    setHistoryClient(client);
  };

  const handleOpenWa = (client: Client, vehicle?: Vehicle) => {
    setWaClient(client);
    setWaVehicle(vehicle);
  };

  const handleNewOrder = (client: Client, vehicle?: Vehicle) => {
    setOrderModalClient(client);
    setOrderModalVehicle(vehicle || null);
    setIsOrderModalOpen(true);
  };

  const handleAddQuickVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickVehicleClient || !quickBrand || !quickModel || !quickPlate) return;

    addVehicle({
      clientId: quickVehicleClient.id,
      brand: quickBrand.trim(),
      model: quickModel.trim(),
      year: Number(quickYear),
      licensePlate: quickPlate.trim(),
      mileage: Number(quickKm),
    });

    setQuickVehicleClient(null);
    setQuickBrand("");
    setQuickModel("");
    setQuickPlate("");
    setQuickKm(50000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            Directorio de Clientes & Fichas Técnicas
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Gestione clientes, flotas de vehículos, historial clínico de reparaciones y contacto por WhatsApp
          </p>
        </div>

        <button
          onClick={() => {
            setClientToEdit(null);
            setIsClientModalOpen(true);
          }}
          className="self-start sm:self-center px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md transition-all hover:scale-102"
        >
          <UserPlus className="w-4 h-4" />
          Nuevo Cliente
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar por nombre, patente, DNI o número de teléfono..."
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

      {/* Client List */}
      <div className="space-y-4">
        {filteredClients.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl bg-slate-900/40">
            <Users className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-300 font-semibold">No se encontraron clientes</p>
            <p className="text-xs text-slate-500 mt-1">
              Pruebe con otro término de búsqueda o cree un nuevo cliente
            </p>
          </div>
        ) : (
          filteredClients.map((client) => {
            const clientVehicles = getClientVehicles(client.id);

            return (
              <div
                key={client.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 transition-all shadow-md space-y-4"
              >
                {/* Client row header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-base">{client.fullName}</span>
                      {client.dni && (
                        <span className="text-[11px] text-slate-400 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          DNI/CUIT: {client.dni}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                      <span className="font-mono text-emerald-400 font-medium">
                        📞 {client.phone}
                      </span>
                      {client.email && <span>✉️ {client.email}</span>}
                      {client.address && <span>📍 {client.address}</span>}
                    </div>
                  </div>

                  {/* Top Client Action Buttons */}
                  <div className="flex items-center gap-2">
                    {/* WhatsApp */}
                    <button
                      onClick={() => handleOpenWa(client, clientVehicles[0])}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-semibold flex items-center gap-1.5 transition-all"
                      title="Enviar mensaje por WhatsApp"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      WhatsApp
                    </button>

                    {/* Nueva Orden */}
                    <button
                      onClick={() => handleNewOrder(client, clientVehicles[0])}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 text-xs font-semibold flex items-center gap-1.5 transition-all"
                      title="Crear nueva orden para este cliente"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Nueva Orden
                    </button>

                    {/* Editar */}
                    <button
                      onClick={() => {
                        setClientToEdit(client);
                        setIsClientModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                      title="Editar datos del cliente"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Client notes if any */}
                {client.notes && (
                  <div className="text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60">
                    <strong className="text-slate-300">Nota interna:</strong> {client.notes}
                  </div>
                )}

                {/* Vehicles list for this client */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <Car className="w-4 h-4 text-blue-400" />
                      Vehículos Registrados ({clientVehicles.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuickVehicleClient(client)}
                      className="text-amber-400 hover:underline flex items-center gap-1 text-[11px] font-medium"
                    >
                      <Plus className="w-3 h-3" />
                      Asociar otro auto
                    </button>
                  </div>

                  {clientVehicles.length === 0 ? (
                    <div className="p-3 bg-slate-950/40 border border-dashed border-slate-800 rounded-xl text-center text-xs text-slate-500">
                      Este cliente aún no tiene vehículos asociados.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {clientVehicles.map((vehicle) => (
                        <div
                          key={vehicle.id}
                          className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between gap-3 hover:border-slate-700 transition-all"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                              <span className="font-bold text-white text-sm">
                                {vehicle.brand} {vehicle.model}
                              </span>
                              {/* Plate badge */}
                              <div className="px-2 py-0.5 bg-slate-900 border border-slate-700 rounded text-[11px] font-mono font-bold text-slate-200">
                                {formatPlate(vehicle.licensePlate)}
                              </div>
                            </div>

                            <div className="text-xs text-slate-400 space-y-0.5">
                              <div>
                                Año {vehicle.year} • {vehicle.mileage.toLocaleString()} km
                                {vehicle.fuelType && ` • ${vehicle.fuelType}`}
                              </div>
                              {vehicle.engine && <div>Motor: {vehicle.engine}</div>}
                            </div>
                          </div>

                          {/* Action to open Ficha Técnica & Anotador */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                            <button
                              type="button"
                              onClick={() => handleOpenHistory(vehicle, client)}
                              className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-all"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              Ver Ficha Técnica & Anotador
                            </button>

                            <button
                              type="button"
                              onClick={() => handleNewOrder(client, vehicle)}
                              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-medium"
                              title="Crear orden para este auto"
                            >
                              <Wrench className="w-3.5 h-3.5 text-blue-400" />
                              Reparación
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Quick Add Vehicle Modal for existing client */}
      {quickVehicleClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">
              Asociar Auto a {quickVehicleClient.fullName}
            </h3>
            <form onSubmit={handleAddQuickVehicle} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">Marca *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Toyota"
                  value={quickBrand}
                  onChange={(e) => setQuickBrand(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100"
                />
              </div>
              <div>
                <label className="text-slate-300 block mb-1">Modelo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Hilux SRX"
                  value={quickModel}
                  onChange={(e) => setQuickModel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">Patente *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: AF 123 CD"
                    value={quickPlate}
                    onChange={(e) => setQuickPlate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100 font-mono uppercase font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Año</label>
                  <input
                    type="number"
                    value={quickYear}
                    onChange={(e) => setQuickYear(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100"
                  />
                </div>
              </div>
              <div>
                <label className="text-slate-300 block mb-1">Kilometraje actual</label>
                <input
                  type="number"
                  value={quickKm}
                  onChange={(e) => setQuickKm(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100 font-mono"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setQuickVehicleClient(null)}
                  className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Guardar Vehículo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modals */}
      <ClientModal
        isOpen={isClientModalOpen}
        onClose={() => setIsClientModalOpen(false)}
        clientToEdit={clientToEdit}
      />

      {historyVehicle && historyClient && (
        <VehicleHistoryModal
          isOpen={true}
          onClose={() => {
            setHistoryVehicle(null);
            setHistoryClient(null);
          }}
          vehicle={historyVehicle}
          client={historyClient}
          onNewOrderForVehicle={(veh, cli) => {
            setHistoryVehicle(null);
            setHistoryClient(null);
            handleNewOrder(cli, veh);
          }}
        />
      )}

      {waClient && (
        <WhatsAppModal
          isOpen={true}
          onClose={() => setWaClient(null)}
          client={waClient}
          vehicle={waVehicle}
          defaultTemplate="reminder"
        />
      )}

      <WorkOrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        initialClient={orderModalClient}
        initialVehicle={orderModalVehicle}
      />
    </div>
  );
}

