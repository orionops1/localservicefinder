"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CATEGORIES } from "@/lib/data/seed-data";
import { ProviderServiceItem } from "@/types/database";

export default function ProviderServicesPage() {
  const [services, setServices] = useState<ProviderServiceItem[]>([
    {
      id: "s1",
      title: "Domestic Electrical Wiring & Troubleshooting",
      description: "Complete house rewiring, MCB trip diagnostics, and safety load balancing.",
      pricing_type: "starting_at",
      price_min: 3500,
      currency: "LKR",
      category_id: CATEGORIES[0].id,
    },
    {
      id: "s2",
      title: "Solar Inverter & Battery Storage Setup",
      description: "Installation and commissioning of hybrid off-grid solar inverters and battery packs.",
      pricing_type: "fixed",
      price_min: 18500,
      currency: "LKR",
      category_id: CATEGORIES[0].id,
    },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCategory, setNewCategory] = useState(CATEGORIES[0].id);
  const [newPricingType, setNewPricingType] = useState<"fixed" | "starting_at" | "hourly" | "quote">("starting_at");
  const [newPrice, setNewPrice] = useState(4000);

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: ProviderServiceItem = {
      id: crypto.randomUUID(),
      title: newTitle.trim(),
      description: newDesc.trim() || undefined,
      pricing_type: newPricingType,
      price_min: newPrice > 0 ? newPrice : undefined,
      currency: "LKR",
      category_id: newCategory,
    };

    setServices([...services, newItem]);
    setNewTitle("");
    setNewDesc("");
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    setServices(services.filter((s) => s.id !== id));
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Manage Service Catalog</h1>
            <p className="text-xs text-slate-600 mt-1">
              Configure the specific trade services, pricing models, and rates you offer to customers.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              href="/provider/dashboard"
              className="text-xs font-bold text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50"
            >
              ← Dashboard
            </Link>
            <button
              onClick={() => setIsAdding(!isAdding)}
              className="text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 px-4 py-1.5 rounded-lg transition-colors"
            >
              {isAdding ? "Close Form" : "+ Add Service"}
            </button>
          </div>
        </div>

        {/* Add Service Modal/Form */}
        {isAdding && (
          <form
            onSubmit={handleAddService}
            className="mb-8 bg-white p-6 rounded-2xl border border-emerald-300 shadow-sm space-y-4"
          >
            <h3 className="text-base font-bold text-emerald-950 border-b border-emerald-100 pb-2">
              Add New Service
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Service Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Distribution Box Overhaul"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name_en}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
              <textarea
                rows={2}
                placeholder="What is included in this service?"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pricing Model</label>
                <select
                  value={newPricingType}
                  onChange={(e) =>
                    setNewPricingType(
                      e.target.value as "fixed" | "starting_at" | "hourly" | "quote"
                    )
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="starting_at">Starting At</option>
                  <option value="fixed">Fixed Price</option>
                  <option value="hourly">Hourly Rate</option>
                  <option value="quote">Custom Quote Only</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Price (LKR)</label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={newPrice}
                  onChange={(e) => setNewPrice(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg transition-colors"
              >
                Save Service
              </button>
            </div>
          </form>
        )}

        {/* Services List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {services.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              No services currently added. Click &quot;+ Add Service&quot; above to build your catalogue.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {services.map((svc) => (
                <div key={svc.id} className="p-5 flex items-start justify-between hover:bg-slate-50 transition-colors">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-900">{svc.title}</h3>
                    {svc.description && (
                      <p className="text-xs text-slate-600 max-w-xl">{svc.description}</p>
                    )}
                    <div className="flex items-center space-x-3 text-xs pt-1">
                      <span className="font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                        {svc.pricing_type.replace("_", " ")}: {svc.currency} {svc.price_min?.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(svc.id)}
                    className="text-xs text-rose-600 hover:text-rose-800 font-semibold p-1.5 hover:bg-rose-50 rounded"
                    title="Remove service"
                  >
                    🗑️ Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
