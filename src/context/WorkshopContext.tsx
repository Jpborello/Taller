"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import {
  Client,
  Vehicle,
  WorkOrder,
  InventoryItem,
  Appointment,
  WorkshopSettings,
  OrderStatus,
  AppointmentStatus,
} from "@/types";
import {
  SEED_WORKSHOP_SETTINGS,
  SEED_CLIENTS,
  SEED_VEHICLES,
  SEED_INVENTORY,
  SEED_WORK_ORDERS,
  SEED_APPOINTMENTS,
} from "@/data/seedData";

interface WorkshopContextType {
  settings: WorkshopSettings;
  clients: Client[];
  vehicles: Vehicle[];
  orders: WorkOrder[];
  inventory: InventoryItem[];
  appointments: Appointment[];
  isLoaded: boolean;

  // Clientes
  addClient: (client: Omit<Client, "id" | "createdAt">) => Client;
  updateClient: (client: Client) => void;
  deleteClient: (id: string) => void;

  // Vehículos
  addVehicle: (vehicle: Omit<Vehicle, "id">) => Vehicle;
  updateVehicle: (vehicle: Vehicle) => void;
  deleteVehicle: (id: string) => void;

  // Órdenes de Trabajo & Presupuestos
  addWorkOrder: (order: Omit<WorkOrder, "id" | "orderNumber">) => WorkOrder;
  updateWorkOrder: (order: WorkOrder) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  deleteWorkOrder: (id: string) => void;

  // Inventario & Stock
  addInventoryItem: (item: Omit<InventoryItem, "id">) => InventoryItem;
  updateInventoryItem: (item: InventoryItem) => void;
  adjustStock: (itemId: string, delta: number) => void;
  deleteInventoryItem: (id: string) => void;

  // Turnos
  addAppointment: (appointment: Omit<Appointment, "id" | "createdAt">) => Appointment;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  deleteAppointment: (id: string) => void;

  // Helpers de consulta
  getVehicleByPlate: (plate: string) => { vehicle?: Vehicle; client?: Client; orders: WorkOrder[] };
  getClientVehicles: (clientId: string) => Vehicle[];
  getVehicleOrders: (vehicleId: string) => WorkOrder[];
  getClientById: (clientId: string) => Client | undefined;
  getVehicleById: (vehicleId: string) => Vehicle | undefined;

  // Reseteo demo
  resetToDemoDefaults: () => void;
}

const STORAGE_KEYS = {
  SETTINGS: "protech_workshop_settings_v2",
  CLIENTS: "protech_clients_v1",
  VEHICLES: "protech_vehicles_v1",
  ORDERS: "protech_orders_v1",
  INVENTORY: "protech_inventory_v1",
  APPOINTMENTS: "protech_appointments_v1",
};

const WorkshopContext = createContext<WorkshopContextType | undefined>(undefined);

export function WorkshopProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<WorkshopSettings>(SEED_WORKSHOP_SETTINGS);
  const [clients, setClients] = useState<Client[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [orders, setOrders] = useState<WorkOrder[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Inicializar desde localStorage o con datos semilla
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      const savedClients = localStorage.getItem(STORAGE_KEYS.CLIENTS);
      const savedVehicles = localStorage.getItem(STORAGE_KEYS.VEHICLES);
      const savedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS);
      const savedInventory = localStorage.getItem(STORAGE_KEYS.INVENTORY);
      const savedAppointments = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);

      setSettings(
        savedSettings
          ? {
              ...JSON.parse(savedSettings),
              phone: SEED_WORKSHOP_SETTINGS.phone,
              whatsapp: SEED_WORKSHOP_SETTINGS.whatsapp,
            }
          : SEED_WORKSHOP_SETTINGS
      );
      setClients(savedClients ? JSON.parse(savedClients) : SEED_CLIENTS);
      setVehicles(savedVehicles ? JSON.parse(savedVehicles) : SEED_VEHICLES);
      setOrders(savedOrders ? JSON.parse(savedOrders) : SEED_WORK_ORDERS);
      setInventory(savedInventory ? JSON.parse(savedInventory) : SEED_INVENTORY);
      setAppointments(savedAppointments ? JSON.parse(savedAppointments) : SEED_APPOINTMENTS);
    } catch (e) {
      console.error("Error reading localStorage, using defaults", e);
      setSettings(SEED_WORKSHOP_SETTINGS);
      setClients(SEED_CLIENTS);
      setVehicles(SEED_VEHICLES);
      setOrders(SEED_WORK_ORDERS);
      setInventory(SEED_INVENTORY);
      setAppointments(SEED_APPOINTMENTS);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Guardar en localStorage ante cambios
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
      localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
      localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
    } catch (e) {
      console.error("Error persisting to localStorage", e);
    }
  }, [settings, clients, vehicles, orders, inventory, appointments, isLoaded]);

  // CRUD Clientes
  const addClient = (data: Omit<Client, "id" | "createdAt">): Client => {
    const newClient: Client = {
      ...data,
      id: "cli-" + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setClients((prev) => [newClient, ...prev]);
    return newClient;
  };

  const updateClient = (updated: Client) => {
    setClients((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const deleteClient = (id: string) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
  };

  // CRUD Vehículos
  const addVehicle = (data: Omit<Vehicle, "id">): Vehicle => {
    const newVehicle: Vehicle = {
      ...data,
      id: "veh-" + Date.now(),
      licensePlate: data.licensePlate.toUpperCase().trim(),
    };
    setVehicles((prev) => [newVehicle, ...prev]);
    return newVehicle;
  };

  const updateVehicle = (updated: Vehicle) => {
    setVehicles((prev) =>
      prev.map((v) =>
        v.id === updated.id
          ? { ...updated, licensePlate: updated.licensePlate.toUpperCase().trim() }
          : v
      )
    );
  };

  const deleteVehicle = (id: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));
  };

  // CRUD Órdenes de Trabajo & Presupuestos
  const addWorkOrder = (data: Omit<WorkOrder, "id" | "orderNumber">): WorkOrder => {
    const count = orders.length + 101;
    const year = new Date().getFullYear();
    const orderNumber = `OT-${year}-${String(count).padStart(4, "0")}`;

    const newOrder: WorkOrder = {
      ...data,
      id: "ord-" + Date.now(),
      orderNumber,
    };

    // Descontar del inventario los ítems que provengan del stock
    if (newOrder.items && newOrder.items.length > 0) {
      setInventory((prev) =>
        prev.map((item) => {
          const used = newOrder.items.find((it) => it.inventoryItemId === item.id);
          if (used) {
            const nextStock = Math.max(0, item.currentStock - used.quantity);
            return { ...item, currentStock: nextStock };
          }
          return item;
        })
      );
    }

    setOrders((prev) => [newOrder, ...prev]);

    // Actualizar kilometraje del vehículo si es mayor
    if (newOrder.vehicleId && newOrder.mileageAtEntry) {
      setVehicles((prev) =>
        prev.map((v) =>
          v.id === newOrder.vehicleId
            ? {
                ...v,
                mileage: Math.max(v.mileage, newOrder.mileageAtEntry),
                lastServiceDate: new Date().toISOString().split("T")[0],
              }
            : v
        )
      );
    }

    return newOrder;
  };

  const updateWorkOrder = (updated: WorkOrder) => {
    setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const updates: Partial<WorkOrder> = { status };
          if (status === "delivered" && !o.deliveryDate) {
            updates.deliveryDate = new Date().toISOString();
          }
          return { ...o, ...updates };
        }
        return o;
      })
    );
  };

  const deleteWorkOrder = (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
  };

  // CRUD Inventario
  const addInventoryItem = (data: Omit<InventoryItem, "id">): InventoryItem => {
    const newItem: InventoryItem = {
      ...data,
      id: "inv-" + Date.now(),
    };
    setInventory((prev) => [newItem, ...prev]);
    return newItem;
  };

  const updateInventoryItem = (updated: InventoryItem) => {
    setInventory((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
  };

  const adjustStock = (itemId: string, delta: number) => {
    setInventory((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, currentStock: Math.max(0, i.currentStock + delta) } : i))
    );
  };

  const deleteInventoryItem = (id: string) => {
    setInventory((prev) => prev.filter((i) => i.id !== id));
  };

  // CRUD Turnos
  const addAppointment = (data: Omit<Appointment, "id" | "createdAt">): Appointment => {
    const newAppointment: Appointment = {
      ...data,
      id: "app-" + Date.now(),
      createdAt: new Date().toISOString(),
    };
    setAppointments((prev) => [newAppointment, ...prev]);
    return newAppointment;
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  const deleteAppointment = (id: string) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  };

  // Consultas y búsquedas
  const getVehicleByPlate = (plateInput: string) => {
    const cleanInput = plateInput.toUpperCase().replace(/[^A-Z0-9]/g, "");
    const vehicle = vehicles.find(
      (v) => v.licensePlate.toUpperCase().replace(/[^A-Z0-9]/g, "") === cleanInput
    );
    if (!vehicle) {
      return { vehicle: undefined, client: undefined, orders: [] };
    }
    const client = clients.find((c) => c.id === vehicle.clientId);
    const vehicleOrders = orders
      .filter((o) => o.vehicleId === vehicle.id)
      .sort((a, b) => new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime());

    return { vehicle, client, orders: vehicleOrders };
  };

  const getClientVehicles = (clientId: string) => {
    return vehicles.filter((v) => v.clientId === clientId);
  };

  const getVehicleOrders = (vehicleId: string) => {
    return orders
      .filter((o) => o.vehicleId === vehicleId)
      .sort((a, b) => new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime());
  };

  const getClientById = (clientId: string) => {
    return clients.find((c) => c.id === clientId);
  };

  const getVehicleById = (vehicleId: string) => {
    return vehicles.find((v) => v.id === vehicleId);
  };

  const resetToDemoDefaults = () => {
    setSettings(SEED_WORKSHOP_SETTINGS);
    setClients(SEED_CLIENTS);
    setVehicles(SEED_VEHICLES);
    setOrders(SEED_WORK_ORDERS);
    setInventory(SEED_INVENTORY);
    setAppointments(SEED_APPOINTMENTS);
    localStorage.clear();
  };

  const value = useMemo(
    () => ({
      settings,
      clients,
      vehicles,
      orders,
      inventory,
      appointments,
      isLoaded,
      addClient,
      updateClient,
      deleteClient,
      addVehicle,
      updateVehicle,
      deleteVehicle,
      addWorkOrder,
      updateWorkOrder,
      updateOrderStatus,
      deleteWorkOrder,
      addInventoryItem,
      updateInventoryItem,
      adjustStock,
      deleteInventoryItem,
      addAppointment,
      updateAppointmentStatus,
      deleteAppointment,
      getVehicleByPlate,
      getClientVehicles,
      getVehicleOrders,
      getClientById,
      getVehicleById,
      resetToDemoDefaults,
    }),
    [settings, clients, vehicles, orders, inventory, appointments, isLoaded]
  );

  return <WorkshopContext.Provider value={value}>{children}</WorkshopContext.Provider>;
}

export function useWorkshop() {
  const context = useContext(WorkshopContext);
  if (!context) {
    throw new Error("useWorkshop debe utilizarse dentro de un WorkshopProvider");
  }
  return context;
}

