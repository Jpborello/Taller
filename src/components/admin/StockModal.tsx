"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { InventoryItem, ProductCategory } from "@/types";
import { useWorkshop } from "@/context/WorkshopContext";
import { Package, Tag, DollarSign, Layers, MapPin, Building2 } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";

interface StockModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemToEdit?: InventoryItem | null;
}

const CATEGORIES: ProductCategory[] = [
  "Aceites y Lubricantes",
  "Filtros",
  "Frenos y Pastillas",
  "Suspensión y Dirección",
  "Encendido y Baterías",
  "Distribución",
  "Refrigeración",
  "Mecánica General",
];

export function StockModal({ isOpen, onClose, itemToEdit }: StockModalProps) {
  const { addInventoryItem, updateInventoryItem } = useWorkshop();

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState<ProductCategory>("Aceites y Lubricantes");
  const [brand, setBrand] = useState("");
  const [costPrice, setCostPrice] = useState<number>(0);
  const [salePrice, setSalePrice] = useState<number>(0);
  const [currentStock, setCurrentStock] = useState<number>(1);
  const [minStock, setMinStock] = useState<number>(3);
  const [location, setLocation] = useState("");
  const [supplier, setSupplier] = useState("");

  useEffect(() => {
    if (itemToEdit) {
      setCode(itemToEdit.code);
      setName(itemToEdit.name);
      setCategory(itemToEdit.category);
      setBrand(itemToEdit.brand);
      setCostPrice(itemToEdit.costPrice);
      setSalePrice(itemToEdit.salePrice);
      setCurrentStock(itemToEdit.currentStock);
      setMinStock(itemToEdit.minStock);
      setLocation(itemToEdit.location || "");
      setSupplier(itemToEdit.supplier || "");
    } else {
      setCode("");
      setName("");
      setCategory("Aceites y Lubricantes");
      setBrand("");
      setCostPrice(0);
      setSalePrice(0);
      setCurrentStock(5);
      setMinStock(3);
      setLocation("Estante A-1");
      setSupplier("");
    }
  }, [itemToEdit, isOpen]);

  const marginPercentage =
    costPrice > 0 ? (((salePrice - costPrice) / costPrice) * 100).toFixed(0) : "0";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !brand.trim()) {
      alert("Por favor ingrese el nombre del repuesto y la marca.");
      return;
    }

    const payload = {
      code: code.trim() || `ART-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      category,
      brand: brand.trim(),
      costPrice: Number(costPrice),
      salePrice: Number(salePrice),
      currentStock: Number(currentStock),
      minStock: Number(minStock),
      location: location.trim(),
      supplier: supplier.trim(),
    };

    if (itemToEdit) {
      updateInventoryItem({
        ...payload,
        id: itemToEdit.id,
      });
    } else {
      addInventoryItem(payload);
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={itemToEdit ? "Editar Artículo / Repuesto" : "Nuevo Artículo en Inventario"}
      subtitle="Control de stock, alertas de reposición y márgenes de ganancia"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Código / SKU
            </label>
            <input
              type="text"
              placeholder="Ej: MOT-5W30"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 placeholder-slate-500 uppercase"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Categoría
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ProductCategory)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
            Nombre / Descripción del Repuesto *
          </label>
          <div className="relative">
            <Package className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              required
              placeholder="Ej: Filtro de Aceite Mann W 712/94"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-100 placeholder-slate-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Marca o Fabricante *
            </label>
            <div className="relative">
              <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                placeholder="Ej: Mann Filter / Bosch / Brembo"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-100 placeholder-slate-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Proveedor Principal
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Ej: Distribuidora Warnes"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-100 placeholder-slate-500"
              />
            </div>
          </div>
        </div>

        {/* Prices and margin */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Precio de Costo (Taller) $
              </label>
              <input
                type="number"
                min={0}
                value={costPrice}
                onChange={(e) => setCostPrice(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-slate-100 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-400 mb-1">
                Precio de Venta (Cliente) $
              </label>
              <input
                type="number"
                min={0}
                value={salePrice}
                onChange={(e) => setSalePrice(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-sm text-emerald-300 font-mono font-bold"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-800/80">
            <span>Margen de Ganancia estimado:</span>
            <span className="font-semibold text-emerald-400">
              +{marginPercentage}% ({formatCurrency(Math.max(0, salePrice - costPrice))})
            </span>
          </div>
        </div>

        {/* Quantities and location */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Stock Actual
            </label>
            <input
              type="number"
              min={0}
              value={currentStock}
              onChange={(e) => setCurrentStock(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono font-bold text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Mínimo (Alerta)
            </label>
            <input
              type="number"
              min={0}
              value={minStock}
              onChange={(e) => setMinStock(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono text-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Ubicación Física
            </label>
            <input
              type="text"
              placeholder="Ej: Estante B-2"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
            />
          </div>
        </div>

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
            {itemToEdit ? "Guardar Cambios" : "Guardar en Inventario"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

