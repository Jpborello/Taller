import { Client, Vehicle, WorkOrder, Appointment } from "@/types";
import { formatCurrency, formatPlate } from "./formatters";

export interface WhatsAppTemplateData {
  client: Client;
  vehicle?: Vehicle;
  workOrder?: WorkOrder;
  appointment?: Appointment;
  workshopName?: string;
  workshopPhone?: string;
  trackingUrl?: string; // Landing tracker where the customer can approve the budget
}

export function cleanPhone(phone: string): string {
  // Elimina espacios, guiones, paréntesis y signos salvo el número
  let clean = phone.replace(/[^0-9]/g, "");
  // Si empieza con 0 (código interurbano argentino, ej: 011 -> 11)
  if (clean.startsWith("0")) {
    clean = clean.substring(1);
  }
  // Si no tiene código de país y parece número argentino de 10 dígitos (ej: 1144556677)
  if (clean.length === 10) {
    clean = "549" + clean;
  }
  return clean;
}

export const WHATSAPP_TEMPLATES = {
  READY_FOR_PICKUP: (data: WhatsAppTemplateData) => {
    const vName = data.vehicle ? `${data.vehicle.brand} ${data.vehicle.model} (${formatPlate(data.vehicle.licensePlate)})` : "tu vehículo";
    const total = data.workOrder ? formatCurrency(data.workOrder.total) : "";
    const workshop = data.workshopName || "Mecánica ProTech";
    
    return `¡Hola ${data.client.fullName}! 🚗💨\n\nTe avisamos desde *${workshop}* que tu *${vName}* ya se encuentra listo para retirar.\n\n` +
      `📋 *Orden N°:* ${data.workOrder?.orderNumber || "OT"}\n` +
      (total ? `💰 *Total abonar:* ${total}\n` : "") +
      `🛡️ *Garantía:* ${data.workOrder?.warrantyMonths || 6} meses en mano de obra y repuestos instalados.\n\n` +
      `📍 Podés pasar a retirarlo hoy hasta las 18:30 hs. ¡Muchas gracias por tu confianza!`;
  },

  BUDGET_APPROVAL: (data: WhatsAppTemplateData) => {
    const vName = data.vehicle ? `${data.vehicle.brand} ${data.vehicle.model} (${formatPlate(data.vehicle.licensePlate)})` : "tu vehículo";
    const total = data.workOrder ? formatCurrency(data.workOrder.total) : "";
    const workshop = data.workshopName || "Mecánica ProTech";
    
    let itemsDetail = "";
    if (data.workOrder?.items && data.workOrder.items.length > 0) {
      itemsDetail = "\n*Detalle presupuestado:*\n" + 
        data.workOrder.items.map(it => `• ${it.description} x${it.quantity}: ${formatCurrency(it.subtotal)}`).join("\n") + "\n";
    }

    return `Hola ${data.client.fullName}, ¿cómo estás? Te escribimos de *${workshop}*.\n\n` +
      `Ya finalizamos el diagnóstico de tu *${vName}*.\n` +
      `🔍 *Diagnóstico:* ${data.workOrder?.diagnosisNotes || data.workOrder?.problemDescription || "Revisión general"}\n` +
      itemsDetail +
      (total ? `\n💵 *Total estimado:* *${total}* (incluye mano de obra y repuestos)\n` : "") +
      `\n¿Nos das el visto bueno para dar inicio a la reparación? Respondé este mensaje con un *OK*` +
      (data.trackingUrl
        ? ` o aprobalo vos mismo desde la web con tu patente:\n${data.trackingUrl}`
        : ".") +
      `\n\n¡Aguardamos tu confirmación!`;
  },

  APPOINTMENT_CONFIRMED: (data: WhatsAppTemplateData) => {
    const workshop = data.workshopName || "Mecánica ProTech";
    const date = data.appointment?.preferredDate || "la fecha acordada";
    const time = data.appointment?.preferredTimeSlot || "el horario pactado";
    const service = data.appointment?.serviceType || "revisión general";

    return `¡Hola ${data.client.fullName}! 👋\n\n` +
      `Confirmamos tu turno en *${workshop}*:\n` +
      `📅 *Fecha:* ${date}\n` +
      `⏰ *Horario:* ${time}\n` +
      `🔧 *Servicio:* ${service}\n` +
      (data.vehicle ? `🚗 *Vehículo:* ${data.vehicle.brand} ${data.vehicle.model} (${formatPlate(data.vehicle.licensePlate)})\n` : "") +
      `\nTe pedimos acercar el vehículo unos 5 minutos antes. ¡Te esperamos!`;
  },

  SERVICE_REMINDER: (data: WhatsAppTemplateData) => {
    const vName = data.vehicle ? `${data.vehicle.brand} ${data.vehicle.model}` : "tu vehículo";
    const workshop = data.workshopName || "Mecánica ProTech";

    return `¡Hola ${data.client.fullName}! 🔧 Recordatorio de mantenimiento de *${workshop}*.\n\n` +
      `De acuerdo a nuestro registro técnico, tu *${vName}* ya está próximo al cumplimiento de kilometraje/tiempo para el próximo service preventivo (cambio de aceite, filtros y chequeo de frenos).\n\n` +
      `¿Te gustaría que te reservemos un turno para esta semana?`;
  },

  STATUS_UPDATE: (data: WhatsAppTemplateData, customNote?: string) => {
    const vName = data.vehicle ? `${data.vehicle.brand} ${data.vehicle.model}` : "tu vehículo";
    const workshop = data.workshopName || "Mecánica ProTech";

    return `Hola ${data.client.fullName}, te saludamos de *${workshop}*.\n\n` +
      `Te enviamos una actualización del estado de tu *${vName}*:\n` +
      `📌 *Estado actual:* ${data.workOrder ? data.workOrder.status : "En proceso"}\n` +
      (customNote ? `📝 *Observación:* ${customNote}\n` : "") +
      `\nCualquier duda quedamos a disposición.`;
  }
};

export function buildWhatsAppUrl(phone: string, message: string): string {
  const clean = cleanPhone(phone);
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${clean}?text=${encoded}`;
}

