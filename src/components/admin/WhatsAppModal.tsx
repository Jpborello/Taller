"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Client, Vehicle, WorkOrder, Appointment } from "@/types";
import { WHATSAPP_TEMPLATES, buildWhatsAppUrl, cleanPhone } from "@/lib/whatsapp";
import { useWorkshop } from "@/context/WorkshopContext";
import { MessageSquare, Send, Copy, Check, Sparkles } from "lucide-react";

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  client?: Client;
  vehicle?: Vehicle;
  workOrder?: WorkOrder;
  appointment?: Appointment;
  defaultTemplate?: "ready" | "budget" | "appointment" | "reminder" | "custom";
}

export function WhatsAppModal({
  isOpen,
  onClose,
  client,
  vehicle,
  workOrder,
  appointment,
  defaultTemplate = "ready",
}: WhatsAppModalProps) {
  const { settings } = useWorkshop();
  const [templateType, setTemplateType] = useState<string>(defaultTemplate);
  const [message, setMessage] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen || !client) return;

    const data = {
      client,
      vehicle,
      workOrder,
      appointment,
      workshopName: settings.name,
      workshopPhone: settings.phone,
    };

    switch (templateType) {
      case "ready":
        setMessage(WHATSAPP_TEMPLATES.READY_FOR_PICKUP(data));
        break;
      case "budget":
        setMessage(WHATSAPP_TEMPLATES.BUDGET_APPROVAL(data));
        break;
      case "appointment":
        setMessage(WHATSAPP_TEMPLATES.APPOINTMENT_CONFIRMED(data));
        break;
      case "reminder":
        setMessage(WHATSAPP_TEMPLATES.SERVICE_REMINDER(data));
        break;
      case "custom":
        setMessage(`Hola ${client.fullName}, te contactamos desde ${settings.name}...`);
        break;
    }
  }, [isOpen, client, vehicle, workOrder, appointment, templateType, settings]);

  if (!client) return null;

  const handleOpenWhatsApp = () => {
    const url = buildWhatsAppUrl(client.phone, message);
    window.open(url, "_blank");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Enviar Mensaje por WhatsApp"
      subtitle={`Destinatario: ${client.fullName} (${client.phone})`}
      maxWidth="lg"
    >
      <div className="space-y-4">
        {/* Template Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Seleccionar Plantilla Rápida
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setTemplateType("ready")}
              className={`p-2.5 text-xs font-medium rounded-lg text-left transition-all border ${
                templateType === "ready"
                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50"
                  : "bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600"
              }`}
            >
              🚗 Auto Listo p/ Retiro
            </button>
            <button
              type="button"
              onClick={() => setTemplateType("budget")}
              className={`p-2.5 text-xs font-medium rounded-lg text-left transition-all border ${
                templateType === "budget"
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/50"
                  : "bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600"
              }`}
            >
              📋 Aprobación Presupuesto
            </button>
            <button
              type="button"
              onClick={() => setTemplateType("appointment")}
              className={`p-2.5 text-xs font-medium rounded-lg text-left transition-all border ${
                templateType === "appointment"
                  ? "bg-blue-500/20 text-blue-300 border-blue-500/50"
                  : "bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600"
              }`}
            >
              📅 Confirmación Turno
            </button>
            <button
              type="button"
              onClick={() => setTemplateType("reminder")}
              className={`p-2.5 text-xs font-medium rounded-lg text-left transition-all border ${
                templateType === "reminder"
                  ? "bg-purple-500/20 text-purple-300 border-purple-500/50"
                  : "bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600"
              }`}
            >
              🛢️ Recordatorio Service
            </button>
          </div>
        </div>

        {/* Message preview and editor */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Previsualización del Mensaje
            </label>
            <span className="text-[11px] text-slate-400">Podés editar el texto libremente</span>
          </div>
          <div className="relative">
            <textarea
              rows={8}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50 font-sans leading-relaxed"
            />
          </div>
        </div>

        {/* Phone info badge */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300">Número detectado:</span>
            <span className="font-mono text-emerald-300 font-semibold">{cleanPhone(client.phone)}</span>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copiado" : "Copiar"}
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleOpenWhatsApp}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm flex items-center gap-2 shadow-lg shadow-emerald-900/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Send className="w-4 h-4" />
            Abrir en WhatsApp Web / Móvil
          </button>
        </div>
      </div>
    </Modal>
  );
}

