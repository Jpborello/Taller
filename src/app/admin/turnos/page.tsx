"use client";

import React, { useState } from "react";
import { useWorkshop } from "@/context/WorkshopContext";
import { Appointment, AppointmentStatus } from "@/types";
import { formatDate, formatPlate, APPOINTMENT_STATUS_MAP } from "@/lib/formatters";
import { WhatsAppModal } from "@/components/admin/WhatsAppModal";
import { WorkOrderModal } from "@/components/admin/WorkOrderModal";
import {
  CalendarCheck,
  Search,
  Plus,
  Phone,
  Wrench,
  Check,
  X,
  Clock,
  Car,
  Calendar,
  Sparkles,
  Trash2,
} from "lucide-react";

export default function AppointmentsPage() {
  const {
    appointments,
    updateAppointmentStatus,
    deleteAppointment,
    addAppointment,
    clients,
    vehicles,
    addClient,
    addVehicle,
  } = useWorkshop();

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // WhatsApp Modal
  const [selectedAppForWa, setSelectedAppForWa] = useState<Appointment | null>(null);

  // Conversion to Work Order modal
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderInitialData, setOrderInitialData] = useState<{
    clientId: string;
    vehicleId: string;
  } | null>(null);

  // Manual New Appointment Modal
  const [isNewAppModalOpen, setIsNewAppModalOpen] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [vehicleBrand, setVehicleBrand] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTimeSlot, setPreferredTimeSlot] = useState("09:00 - 10:00");
  const [serviceType, setServiceType] = useState("Service Completo de Aceite y Filtros");
  const [description, setDescription] = useState("");

  const filteredAppointments = appointments.filter((app) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      app.clientName.toLowerCase().includes(q) ||
      app.clientPhone.includes(q) ||
      app.licensePlate.toLowerCase().includes(q) ||
      app.vehicleBrand.toLowerCase().includes(q) ||
      app.serviceType.toLowerCase().includes(q);

    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenWa = (app: Appointment) => {
    setSelectedAppForWa(app);
  };

  const handleConvertToWorkOrder = (app: Appointment) => {
    // Check if client exists or create them
    let client = clients.find(
      (c) =>
        c.phone.replace(/[^0-9]/g, "") === app.clientPhone.replace(/[^0-9]/g, "") ||
        c.fullName.toLowerCase() === app.clientName.toLowerCase()
    );

    if (!client) {
      client = addClient({
        fullName: app.clientName,
        phone: app.clientPhone,
        email: app.clientEmail || "",
        dni: "",
        notes: `Cliente ingresado desde solicitud web de turno #${app.id}`,
      });
    }

    // Check if vehicle exists or create it
    let vehicle = vehicles.find(
      (v) =>
        v.licensePlate.toUpperCase().replace(/[^A-Z0-9]/g, "") ===
        app.licensePlate.toUpperCase().replace(/[^A-Z0-9]/g, "")
    );

    if (!vehicle) {
      vehicle = addVehicle({
        clientId: client.id,
        brand: app.vehicleBrand,
        model: app.vehicleModel,
        year: 2022,
        licensePlate: app.licensePlate,
        mileage: 50000,
        notes: "Registrado automáticamente desde agenda de turnos",
      });
    }

    // Mark appointment as confirmed
    updateAppointmentStatus(app.id, "confirmed");

    // Open work order modal
    setOrderInitialData({ clientId: client.id, vehicleId: vehicle.id });
    setIsOrderModalOpen(true);
  };

  const handleCreateManualAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone || !preferredDate) {
      alert("Por favor complete nombre, teléfono y fecha.");
      return;
    }

    addAppointment({
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      vehicleBrand: vehicleBrand.trim() || "Vehículo",
      vehicleModel: vehicleModel.trim() || "Particular",
      licensePlate: licensePlate.trim().toUpperCase() || "SIN PATENTE",
      preferredDate,
      preferredTimeSlot,
      serviceType,
      description,
      status: "confirmed",
    });

    setIsNewAppModalOpen(false);
    setClientName("");
    setClientPhone("");
    setVehicleBrand("");
    setVehicleModel("");
    setLicensePlate("");
    setDescription("");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-amber-400" />
            Agenda de Turnos & Solicitudes Web
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Recepcione turnos automáticos de la web, confirme por WhatsApp y transfórmelos en órdenes con un clic
          </p>
        </div>

        <button
          onClick={() => setIsNewAppModalOpen(true)}
          className="self-start sm:self-center px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md transition-all hover:scale-102"
        >
          <Plus className="w-4 h-4" />
          Nuevo Turno Manual
        </button>
      </div>

      {/* Filter and Search */}
      <div className="space-y-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por cliente, teléfono, patente, vehículo o servicio..."
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
            { id: "all", label: "Todos los turnos" },
            { id: "pending", label: "Pendientes de Confirmación" },
            { id: "confirmed", label: "Confirmados" },
            { id: "completed", label: "Completados" },
            { id: "cancelled", label: "Cancelados" },
          ].map((pill) => {
            const isSelected = statusFilter === pill.id;
            const count =
              pill.id === "all"
                ? appointments.length
                : appointments.filter((a) => a.status === pill.id).length;

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

      {/* Appointments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAppointments.length === 0 ? (
          <div className="col-span-2 text-center py-12 border border-dashed border-slate-800 rounded-2xl bg-slate-900/40">
            <CalendarCheck className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-300 font-semibold">No se encontraron turnos</p>
            <p className="text-xs text-slate-500 mt-1">
              Las reservas de clientes en la landing page aparecerán aquí inmediatamente
            </p>
          </div>
        ) : (
          filteredAppointments.map((app) => {
            const statusConfig = APPOINTMENT_STATUS_MAP[app.status];

            return (
              <div
                key={app.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 transition-all shadow-md space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top Status & Date */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${statusConfig.badgeClass}`}
                    >
                      {statusConfig.label}
                    </span>

                    <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{app.preferredTimeSlot}</span>
                    </div>
                  </div>

                  {/* Date & Service header */}
                  <div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                      <Calendar className="w-3.5 h-3.5 text-blue-400" />
                      <span>Turno: <strong className="text-white">{formatDate(app.preferredDate)}</strong></span>
                    </div>
                    <h3 className="text-base font-bold text-white">{app.serviceType}</h3>
                  </div>

                  {/* Vehicle & Client Info */}
                  <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200">
                        {app.vehicleBrand} {app.vehicleModel}
                      </span>
                      {app.licensePlate && (
                        <span className="font-mono text-[11px] bg-slate-900 px-2 py-0.5 rounded border border-slate-700 text-slate-300 font-bold">
                          {formatPlate(app.licensePlate)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-slate-800/60">
                      <span>Cliente: <strong className="text-slate-200">{app.clientName}</strong></span>
                      <span className="font-mono text-emerald-400 font-medium">{app.clientPhone}</span>
                    </div>

                    {app.description && (
                      <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
                        <strong className="text-slate-300">Detalle:</strong> {app.description}
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                  {/* WhatsApp button */}
                  <button
                    type="button"
                    onClick={() => handleOpenWa(app)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Confirmar por WhatsApp
                  </button>

                  <div className="flex items-center gap-1.5">
                    {/* Convert to Work Order */}
                    <button
                      type="button"
                      onClick={() => handleConvertToWorkOrder(app)}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold flex items-center gap-1.5 transition-all"
                      title="Convierte este turno en una Orden de Trabajo activa"
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      Crear OT
                    </button>

                    {/* Status Toggles */}
                    {app.status === "pending" && (
                      <button
                        type="button"
                        onClick={() => updateAppointmentStatus(app.id, "confirmed")}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 transition-colors"
                        title="Marcar Confirmado"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("¿Deseas eliminar este turno?")) {
                          deleteAppointment(app.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* New Appointment Modal */}
      {isNewAppModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Agendar Nuevo Turno en Taller</h3>
            <form onSubmit={handleCreateManualAppointment} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">Nombre del Cliente *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Daniel Gómez"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">WhatsApp / Teléfono *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: 11 4455 6677"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">Marca</label>
                  <input
                    type="text"
                    placeholder="Ej: VW"
                    value={vehicleBrand}
                    onChange={(e) => setVehicleBrand(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Modelo</label>
                  <input
                    type="text"
                    placeholder="Ej: Gol Trend"
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Patente</label>
                  <input
                    type="text"
                    placeholder="Ej: AA 123 BB"
                    value={licensePlate}
                    onChange={(e) => setLicensePlate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100 font-mono uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">Fecha Deseada *</label>
                  <input
                    type="date"
                    required
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Franja Horaria</label>
                  <select
                    value={preferredTimeSlot}
                    onChange={(e) => setPreferredTimeSlot(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100"
                  >
                    <option value="08:30 - 09:30">08:30 - 09:30</option>
                    <option value="09:30 - 10:30">09:30 - 10:30</option>
                    <option value="11:00 - 12:00">11:00 - 12:00</option>
                    <option value="14:00 - 15:00">14:00 - 15:00</option>
                    <option value="16:00 - 17:00">16:00 - 17:00</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Tipo de Servicio</label>
                <input
                  type="text"
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Notas u observaciones</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detalles de la falla o requerimientos..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsNewAppModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Guardar Turno
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WhatsApp Modal */}
      {selectedAppForWa && (
        <WhatsAppModal
          isOpen={true}
          onClose={() => setSelectedAppForWa(null)}
          client={{
            id: "tmp-cli",
            fullName: selectedAppForWa.clientName,
            phone: selectedAppForWa.clientPhone,
            email: selectedAppForWa.clientEmail || "",
            dni: "",
            createdAt: new Date().toISOString(),
          }}
          vehicle={{
            id: "tmp-veh",
            clientId: "tmp-cli",
            brand: selectedAppForWa.vehicleBrand,
            model: selectedAppForWa.vehicleModel,
            year: 2022,
            licensePlate: selectedAppForWa.licensePlate,
            mileage: 50000,
          }}
          appointment={selectedAppForWa}
          defaultTemplate="appointment"
        />
      )}

      {/* Work Order Modal triggered from appointment */}
      <WorkOrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        initialClient={clients.find((c) => c.id === orderInitialData?.clientId) || null}
        initialVehicle={vehicles.find((v) => v.id === orderInitialData?.vehicleId) || null}
      />
    </div>
  );
}

