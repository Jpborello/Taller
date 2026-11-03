"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Client } from "@/types";
import { useWorkshop } from "@/context/WorkshopContext";
import { Car, User, Phone, Mail, FileText, MapPin, Hash } from "lucide-react";

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientToEdit?: Client | null;
}

export function ClientModal({ isOpen, onClose, clientToEdit }: ClientModalProps) {
  const { addClient, updateClient, addVehicle } = useWorkshop();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [dni, setDni] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  // Optional first vehicle
  const [includeVehicle, setIncludeVehicle] = useState(false);
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState<number>(2024);
  const [licensePlate, setLicensePlate] = useState("");
  const [mileage, setMileage] = useState<number>(0);

  useEffect(() => {
    if (clientToEdit) {
      setFullName(clientToEdit.fullName);
      setPhone(clientToEdit.phone);
      setEmail(clientToEdit.email || "");
      setDni(clientToEdit.dni || "");
      setAddress(clientToEdit.address || "");
      setNotes(clientToEdit.notes || "");
      setIncludeVehicle(false);
    } else {
      setFullName("");
      setPhone("");
      setEmail("");
      setDni("");
      setAddress("");
      setNotes("");
      setIncludeVehicle(false);
      setBrand("");
      setModel("");
      setYear(2022);
      setLicensePlate("");
      setMileage(50000);
    }
  }, [clientToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) {
      alert("Por favor complete nombre y teléfono.");
      return;
    }

    if (clientToEdit) {
      updateClient({
        ...clientToEdit,
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        dni: dni.trim(),
        address: address.trim(),
        notes: notes.trim(),
      });
    } else {
      const created = addClient({
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        dni: dni.trim(),
        address: address.trim(),
        notes: notes.trim(),
      });

      if (includeVehicle && brand.trim() && model.trim() && licensePlate.trim()) {
        addVehicle({
          clientId: created.id,
          brand: brand.trim(),
          model: model.trim(),
          year: Number(year),
          licensePlate: licensePlate.trim(),
          mileage: Number(mileage),
        });
      }
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={clientToEdit ? "Editar Cliente" : "Nuevo Cliente"}
      subtitle="Complete los datos de contacto y antecedentes"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
            Nombre y Apellido / Razón Social *
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ej: Marcelo Gallardo"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-amber-500/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              WhatsApp / Teléfono *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-emerald-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ej: 11 5566 7788"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-emerald-500/50 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              DNI o CUIT
            </label>
            <div className="relative">
              <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                placeholder="Ej: 32.456.789"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-amber-500/50"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="cliente@ejemplo.com"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-amber-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Dirección / Localidad
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ej: San Martín 1234"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-amber-500/50"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
            Notas u Observaciones del Cliente
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Comentarios sobre trato comercial, facturación o preferencias..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-sm text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-amber-500/50"
          />
        </div>

        {/* Optional Vehicle Section for new client */}
        {!clientToEdit && (
          <div className="pt-2 border-t border-slate-800">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-amber-400">
              <input
                type="checkbox"
                checked={includeVehicle}
                onChange={(e) => setIncludeVehicle(e.target.checked)}
                className="rounded border-slate-700 text-amber-500 focus:ring-amber-400"
              />
              <Car className="w-4 h-4" />
              Asociar primer vehículo ahora mismo
            </label>

            {includeVehicle && (
              <div className="mt-3 p-3 bg-slate-950 border border-slate-800 rounded-xl grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Marca</label>
                  <input
                    type="text"
                    placeholder="Ej: Ford"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Modelo</label>
                  <input
                    type="text"
                    placeholder="Ej: Ranger"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Patente</label>
                  <input
                    type="text"
                    placeholder="Ej: AF 123 CD"
                    value={licensePlate}
                    onChange={(e) => setLicensePlate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 font-mono uppercase font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Kilometraje actual</label>
                  <input
                    type="number"
                    value={mileage}
                    onChange={(e) => setMileage(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 font-mono"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md transition-all hover:scale-102"
          >
            {clientToEdit ? "Guardar Cambios" : "Guardar Cliente"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
