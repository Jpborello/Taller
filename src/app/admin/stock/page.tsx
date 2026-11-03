"use client";

import React, { useState } from "react";
import { useWorkshop } from "@/context/WorkshopContext";
import { InventoryItem, ProductCategory } from "@/types";
import { formatCurrency } from "@/lib/formatters";
import { StockModal } from "@/components/admin/StockModal";
import {
  Boxes,
  Search,
  Plus,
  AlertTriangle,
  Package,
  Layers,
  TrendingUp,
  Tag,
  Pencil,
  Trash2,
  CheckCircle,
  MapPin,
  Building2,
} from "lucide-react";

export default function StockPage() {
  const { inventory, adjustStock, deleteInventoryItem } = useWorkshop();

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [onlyLowStock, setOnlyLowStock] = useState(false);

  // Modals
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<InventoryItem | null>(null);

  // Metrics
  const totalStockCount = inventory.reduce((sum, i) => sum + i.currentStock, 0);
  const totalCostValuation = inventory.reduce((sum, i) => sum + i.costPrice * i.currentStock, 0);
  const totalSaleValuation = inventory.reduce((sum, i) => sum + i.salePrice * i.currentStock, 0);
  const lowStockCount = inventory.filter((i) => i.currentStock <= i.minStock).length;

  const filteredItems = inventory.filter((item) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(q) ||
      item.code.toLowerCase().includes(q) ||
      item.brand.toLowerCase().includes(q) ||
      (item.supplier && item.supplier.toLowerCase().includes(q));

    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    const matchesLowStock = !onlyLowStock || item.currentStock <= item.minStock;

    return matchesSearch && matchesCategory && matchesLowStock;
  });

  const categories: ProductCategory[] = [
    "Aceites y Lubricantes",
    "Filtros",
    "Frenos y Pastillas",
    "Suspensión y Dirección",
    "Encendido y Baterías",
    "Distribución",
    "Refrigeración",
    "Mecánica General",
  ];

  const handleDelete = (id: string, name: string) => {
    if (confirm(`¿Deseas eliminar "${name}" del inventario?`)) {
      deleteInventoryItem(id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Boxes className="w-5 h-5 text-amber-400" />
            Control de Stock & Repuestos
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Gestión de inventario de piezas, lubricantes, filtros y alertas de reposición automática
          </p>
        </div>

        <button
          onClick={() => {
            setItemToEdit(null);
            setIsStockModalOpen(true);
          }}
          className="self-start sm:self-center px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md transition-all hover:scale-102"
        >
          <Plus className="w-4 h-4" />
          Nuevo Artículo / Repuesto
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400">Total de Artículos Únicos</span>
          <div className="text-2xl font-black text-white font-mono mt-1">{inventory.length}</div>
          <span className="text-[11px] text-slate-500">{totalStockCount} unidades físicas en taller</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400">Valuación a Costo</span>
          <div className="text-2xl font-black text-slate-300 font-mono mt-1">
            {formatCurrency(totalCostValuation)}
          </div>
          <span className="text-[11px] text-slate-500">Capital invertido en almacén</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400">Valuación a Precio Venta</span>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
            {formatCurrency(totalSaleValuation)}
          </div>
          <span className="text-[11px] text-emerald-500/80 font-medium">
            +{formatCurrency(Math.max(0, totalSaleValuation - totalCostValuation))} margen potencial
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <span className="text-xs text-slate-400">Alertas de Reposición</span>
          <div className="text-2xl font-black text-amber-400 font-mono mt-1">{lowStockCount}</div>
          <button
            onClick={() => setOnlyLowStock(!onlyLowStock)}
            className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 font-medium mt-0.5"
          >
            {onlyLowStock ? "Ver todos los repuestos" : "Filtrar solo críticos"}
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por código SKU, descripción, marca o proveedor..."
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

          <div className="flex items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-hidden"
            >
              <option value="all">Todas las categorías</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <button
              onClick={() => setOnlyLowStock(!onlyLowStock)}
              className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                onlyLowStock
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/50"
                  : "bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200"
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Solo Críticos
            </button>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Código / Marca</th>
                <th className="py-3.5 px-4 font-semibold">Descripción del Repuesto</th>
                <th className="py-3.5 px-4 font-semibold">Categoría / Ubicación</th>
                <th className="py-3.5 px-4 font-semibold text-right">P. Costo</th>
                <th className="py-3.5 px-4 font-semibold text-right">P. Venta</th>
                <th className="py-3.5 px-4 font-semibold text-center">Stock Actual</th>
                <th className="py-3.5 px-4 font-semibold text-center">Ajuste Rápido</th>
                <th className="py-3.5 px-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No se encontraron repuestos con los criterios actuales.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const isOut = item.currentStock === 0;
                  const isLow = item.currentStock <= item.minStock && !isOut;

                  return (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                      {/* Código / Marca */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-white text-[11px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800 inline-block">
                          {item.code}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">{item.brand}</div>
                      </td>

                      {/* Nombre */}
                      <td className="py-3.5 px-4 font-medium text-slate-100 max-w-xs">
                        <div className="text-xs font-semibold">{item.name}</div>
                        {item.supplier && (
                          <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <Building2 className="w-3 h-3" />
                            {item.supplier}
                          </div>
                        )}
                      </td>

                      {/* Categoría / Ubicación */}
                      <td className="py-3.5 px-4">
                        <div className="text-slate-300 text-[11px]">{item.category}</div>
                        {item.location && (
                          <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-amber-500/70" />
                            {item.location}
                          </div>
                        )}
                      </td>

                      {/* Costo */}
                      <td className="py-3.5 px-4 text-right font-mono text-slate-400">
                        {formatCurrency(item.costPrice)}
                      </td>

                      {/* Venta */}
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400">
                        {formatCurrency(item.salePrice)}
                      </td>

                      {/* Stock y Alerta */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex flex-col items-center">
                          <span
                            className={`font-mono text-sm font-black ${
                              isOut ? "text-red-400" : isLow ? "text-amber-400" : "text-white"
                            }`}
                          >
                            {item.currentStock} un.
                          </span>
                          <span
                            className={`text-[9px] uppercase px-1.5 py-0.2 rounded-full font-bold mt-0.5 ${
                              isOut
                                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                : isLow
                                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                : "bg-emerald-500/10 text-emerald-400"
                            }`}
                          >
                            {isOut ? "Agotado" : isLow ? `Bajo (Mín ${item.minStock})` : "Normal"}
                          </span>
                        </div>
                      </td>

                      {/* Ajuste rápido */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                          <button
                            type="button"
                            onClick={() => adjustStock(item.id, -1)}
                            disabled={item.currentStock <= 0}
                            className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white font-bold flex items-center justify-center transition-colors"
                            title="Descontar 1 unidad"
                          >
                            -
                          </button>
                          <button
                            type="button"
                            onClick={() => adjustStock(item.id, 1)}
                            className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center transition-colors"
                            title="Ingresar 1 unidad"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      {/* Acciones */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setItemToEdit(item);
                              setIsStockModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                            title="Editar repuesto"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(item.id, item.name)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Eliminar repuesto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Modal */}
      <StockModal
        isOpen={isStockModalOpen}
        onClose={() => setIsStockModalOpen(false)}
        itemToEdit={itemToEdit}
      />
    </div>
  );
}

