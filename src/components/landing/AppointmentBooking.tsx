"use client";

import React, { useState } from "react";
import { useWorkshop } from "@/context/WorkshopContext";
import { formatPlate } from "@/lib/formatters";
import { Calendar, Clock, User, Phone, Car, CheckCircle2, Send, Sparkles } from "lucide-react";

export function AppointmentBooking() {
  const { addAppointment, settings } = useWorkshop();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [vehicleBrand, setVehicleBrand] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [licensePlate, setLicensePlate] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTimeSlot, setPreferredTimeSlot] = useState("08:30 - 09:30");
  const [serviceType, setServiceType] = useState("Service Completo de Aceite y Filtros");
  const [description, setDescription] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [lastAppointment, setLastAppointment] = useState<any>(null);
  const [minDateStr, setMinDateStr] = useState<string>("");

  React.useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setMinDateStr(tomorrow.toISOString().split("T")[0]);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !preferredDate) return;

    const created = addAppointment({
      clientName: fullName.trim(),
      clientPhone: phone.trim(),
      vehicleBrand: vehicleBrand.trim() || "Vehículo",
      vehicleModel: vehicleModel.trim() || "Particular",
      licensePlate: licensePlate.trim().toUpperCase() || "SIN PATENTE",
      preferredDate,
      preferredTimeSlot,
      serviceType,
      description: description.trim(),
      status: "pending",
    });

    setLastAppointment(created);
    setSubmitted(true);
  };

  const handleSendWa = () => {
    if (!lastAppointment) return;
    const text = `¡Hola ${settings.name}! Acabo de solicitar un turno desde su sitio web:\n\n` +
      `👤 *Nombre:* ${lastAppointment.clientName}\n` +
      `📱 *Teléfono:* ${lastAppointment.clientPhone}\n` +
      `🚗 *Auto:* ${lastAppointment.vehicleBrand} ${lastAppointment.vehicleModel} (${formatPlate(lastAppointment.licensePlate)})\n` +
      `📅 *Fecha solicitada:* ${lastAppointment.preferredDate} a las ${lastAppointment.preferredTimeSlot}\n` +
      `🔧 *Servicio:* ${lastAppointment.serviceType}\n` +
      (lastAppointment.description ? `📝 *Observaciones:* ${lastAppointment.description}\n` : "") +
      `\n¿Me confirman disponibilidad? ¡Muchas gracias!`;

    window.open(`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <section id="turnos" className="py-20 bg-slate-950 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            Reserva Online
          </span>
          <h2 className="text-3xl font-black text-white tracking-tight">
            Agendá tu Turno en Taller
          </h2>
          <p className="text-sm text-slate-400">
            Evitá esperas. Elegí el día y horario que mejor te convenga y recepcionamos tu vehículo sin demoras.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          {submitted ? (
            <div className="text-center py-10 space-y-5 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-white">¡Turno Solicitado con Éxito!</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto mt-1.5">
                  Registramos tu solicitud en nuestra agenda técnica para el día{" "}
                  <strong className="text-amber-400">{lastAppointment?.preferredDate}</strong> en el horario{" "}
                  <strong className="text-amber-400">{lastAppointment?.preferredTimeSlot}</strong>.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={handleSendWa}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition-all hover:scale-102"
                >
                  <Send className="w-4 h-4" />
                  Enviar Confirmación Inmediata por WhatsApp
                </button>

                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Sacar Otro Turno
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Tu Nombre y Apellido *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      required
                      placeholder="Ej: Marcelo Gallardo"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    WhatsApp de Contacto *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-emerald-400 absolute left-3 top-3.5" />
                    <input
                      type="text"
                      required
                      placeholder="Ej: 11 5566 7788"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Vehicle info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Marca del Auto *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Toyota / VW / Peugeot"
                    value={vehicleBrand}
                    onChange={(e) => setVehicleBrand(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Modelo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Hilux / 208 / Gol"
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Patente (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: AF 123 CD"
                    value={licensePlate}
                    onChange={(e) => setLicensePlate(e.target.value.toUpperCase())}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-amber-500 font-mono uppercase font-bold"
                  />
                </div>
              </div>

              {/* Date, Time & Service */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Fecha Deseada *
                  </label>
                  <input
                    type="date"
                    required
                    min={minDateStr}
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Franja Horaria
                  </label>
                  <select
                    value={preferredTimeSlot}
                    onChange={(e) => setPreferredTimeSlot(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-hidden focus:border-amber-500"
                  >
                    <option value="08:30 - 09:30">08:30 a 09:30 (Recepción 1)</option>
                    <option value="09:30 - 10:30">09:30 a 10:30 (Recepción 2)</option>
                    <option value="11:00 - 12:00">11:00 a 12:00 (Mediodía)</option>
                    <option value="14:00 - 15:00">14:00 a 15:00 (Tarde 1)</option>
                    <option value="16:00 - 17:00">16:00 a 17:00 (Tarde 2)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Motivo / Especialidad
                  </label>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-hidden focus:border-amber-500"
                  >
                    <option value="Service Completo de Aceite y Filtros">Service Aceite & Filtros</option>
                    <option value="Frenos y Pastillas">Frenos y Pastillas</option>
                    <option value="Diagnóstico Computarizado Scanner">Diagnóstico Scanner</option>
                    <option value="Cambio Kit Distribución">Kit de Distribución</option>
                    <option value="Tren Delantero y Suspensión">Tren Delantero & Amortiguación</option>
                    <option value="Aire Acondicionado">Aire Acondicionado</option>
                    <option value="Otro Motivo">Otro Motivo</option>
                  </select>
                </div>
              </div>

              {/* Observations */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Detalles de la falla o requerimiento (Opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ej: Hace un ruido al doblar a la izquierda, testigo de freno encendido..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition-all hover:scale-101 cursor-pointer"
                >
                  <Calendar className="w-4 h-4 stroke-[2.5]" />
                  Confirmar Reserva de Turno
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
