export type OrderStatus =
  | 'received'         // Recepcionado
  | 'in_diagnosis'     // En diagnóstico
  | 'budget_sent'      // Presupuesto enviado, esperando aprobación del cliente
  | 'approved'         // Presupuesto aprobado por el cliente
  | 'waiting_parts'    // Esperando repuestos
  | 'in_repair'        // En reparación
  | 'quality_control'  // Control de calidad
  | 'ready'            // Listo para entrega
  | 'delivered';       // Entregado

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export type ProductCategory =
  | 'Aceites y Lubricantes'
  | 'Filtros'
  | 'Frenos y Pastillas'
  | 'Suspensión y Dirección'
  | 'Encendido y Baterías'
  | 'Distribución'
  | 'Refrigeración'
  | 'Mecánica General';

export interface Vehicle {
  id: string;
  clientId: string;
  brand: string;
  model: string;
  year: number;
  licensePlate: string; // Patente
  mileage: number;      // Kilometraje actual
  vin?: string;         // Número de chasis
  engine?: string;      // Motor (ej: 1.6 16v, 2.0 TDI)
  color?: string;
  transmission?: 'Manual' | 'Automática';
  fuelType?: 'Nafta' | 'Diesel' | 'GNC' | 'Híbrido' | 'Eléctrico';
  notes?: string;
  lastServiceDate?: string;
}

export interface Client {
  id: string;
  fullName: string;
  phone: string;        // WhatsApp principal
  email: string;
  dni: string;          // DNI / CUIT
  address?: string;
  notes?: string;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  type: 'part' | 'labor';
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  inventoryItemId?: string; // Para descontar stock si proviene del inventario
}

export interface WorkOrder {
  id: string;
  orderNumber: string; // ej: OT-2026-0042
  clientId: string;
  vehicleId: string;
  status: OrderStatus;
  entryDate: string;
  estimatedDeliveryDate?: string;
  deliveryDate?: string;
  mileageAtEntry: number;
  problemDescription: string;  // Motivo de ingreso reportado por el cliente
  diagnosisNotes?: string;     // Diagnóstico técnico
  internalNotes?: string;      // Notas privadas del taller
  technicianName: string;      // Mecánico asignado
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;                 // IVA opcional o neto
  total: number;
  paymentMethod?: 'Efectivo' | 'Transferencia' | 'Tarjeta Débito' | 'Tarjeta Crédito' | 'Cuenta Corriente';
  paymentStatus: 'Pendiente' | 'Parcial' | 'Pagado';
  warrantyMonths: number;
  customerSignature?: boolean;
  budgetSentDate?: string;     // Cuándo se le envió el presupuesto al cliente
  approvedDate?: string;       // Cuándo el cliente aprobó el presupuesto
  approvedVia?: BudgetApprovalChannel;
}

export type BudgetApprovalChannel = 'WhatsApp' | 'Web' | 'Teléfono' | 'En persona';

export interface InventoryItem {
  id: string;
  code: string;        // SKU / Código de pieza
  name: string;
  category: ProductCategory;
  brand: string;
  costPrice: number;   // Precio costo taller
  salePrice: number;   // Precio venta cliente
  currentStock: number;
  minStock: number;    // Alerta de reposición
  location?: string;   // Estante / Bahía / Gaveta
  supplier?: string;
  barcode?: string;
}

export interface Appointment {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  vehicleBrand: string;
  vehicleModel: string;
  licensePlate: string;
  preferredDate: string;
  preferredTimeSlot: string; // ej: "09:00 - 10:00"
  serviceType: string;       // ej: "Service Completo 10.000km", "Revisión Frenos", "Diagnóstico Scanner"
  description?: string;
  status: AppointmentStatus;
  createdAt: string;
}

export interface WorkshopSettings {
  name: string;
  legalName: string;
  cuit: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  openingHours: string;
  websiteUrl: string;
}

