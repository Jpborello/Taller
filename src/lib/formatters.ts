import { OrderStatus, AppointmentStatus } from "@/types";

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString?: string): string {
  if (!dateString) return "—";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString?: string): string {
  if (!dateString) return "—";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatPlate(plate: string): string {
  if (!plate) return "";
  const clean = plate.toUpperCase().replace(/[^A-Z0-9]/g, "");
  // Formato nuevo mercosur: AA 123 BB
  if (/^[A-Z]{2}[0-9]{3}[A-Z]{2}$/.test(clean)) {
    return `${clean.slice(0, 2)} ${clean.slice(2, 5)} ${clean.slice(5)}`;
  }
  // Formato viejo: ABC 123
  if (/^[A-Z]{3}[0-9]{3}$/.test(clean)) {
    return `${clean.slice(0, 3)} ${clean.slice(3)}`;
  }
  return clean;
}

export const ORDER_STATUS_MAP: Record<
  OrderStatus,
  {
    label: string;
    step: number;
    color: string;
    bgColor: string;
    textColor: string;
    borderColor: string;
    description: string;
  }
> = {
  received: {
    label: "Recepcionado",
    step: 1,
    color: "bg-slate-500",
    bgColor: "bg-slate-500/10",
    textColor: "text-slate-400",
    borderColor: "border-slate-500/30",
    description: "Vehículo ingresado al taller, esperando asignación técnica.",
  },
  in_diagnosis: {
    label: "En Diagnóstico",
    step: 2,
    color: "bg-amber-500",
    bgColor: "bg-amber-500/10",
    textColor: "text-amber-400",
    borderColor: "border-amber-500/30",
    description: "Escaneo computarizado y chequeo exhaustivo en bahía.",
  },
  waiting_parts: {
    label: "Esperando Repuestos",
    step: 3,
    color: "bg-orange-500",
    bgColor: "bg-orange-500/10",
    textColor: "text-orange-400",
    borderColor: "border-orange-500/30",
    description: "Presupuesto aprobado. Repuestos originales solicitados al proveedor.",
  },
  in_repair: {
    label: "En Reparación",
    step: 4,
    color: "bg-blue-500",
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-400",
    borderColor: "border-blue-500/30",
    description: "Mecánicos trabajando en el desarme, recambio y puesta a punto.",
  },
  quality_control: {
    label: "Control de Calidad",
    step: 5,
    color: "bg-purple-500",
    bgColor: "bg-purple-500/10",
    textColor: "text-purple-400",
    borderColor: "border-purple-500/30",
    description: "Pruebas de ruta, chequeo electrónico final y limpieza de cortesía.",
  },
  ready: {
    label: "Listo para Retirar",
    step: 6,
    color: "bg-emerald-500",
    bgColor: "bg-emerald-500/10",
    textColor: "text-emerald-400",
    borderColor: "border-emerald-500/30",
    description: "Trabajo finalizado y verificado. Vehículo listo para entrega.",
  },
  delivered: {
    label: "Entregado",
    step: 7,
    color: "bg-zinc-600",
    bgColor: "bg-zinc-800/50",
    textColor: "text-zinc-400",
    borderColor: "border-zinc-700",
    description: "Vehículo entregado al cliente con garantía vigente.",
  },
};

export const APPOINTMENT_STATUS_MAP: Record<
  AppointmentStatus,
  { label: string; badgeClass: string }
> = {
  pending: {
    label: "Pendiente",
    badgeClass: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  },
  confirmed: {
    label: "Confirmado",
    badgeClass: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  },
  completed: {
    label: "Completado",
    badgeClass: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  },
  cancelled: {
    label: "Cancelado",
    badgeClass: "bg-red-500/15 text-red-400 border-red-500/30",
  },
};

