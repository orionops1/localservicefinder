"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DISTRICTS } from "@/lib/data/seed-data";

export default function ProviderServiceAreasPage() {
  const [selectedDistricts, setSelectedDistricts] = useState<number[]>([1, 2, 7]); // Colombo, Gampaha, Galle
  const [radiusKm, setRadiusKm] = useState(30);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const toggleDistrict = (id: number) => {
    setSavedSuccess(false);
    setSelectedDistricts((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev;
        return prev.filter((d) => d !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Service Area Coverage</h1>
            <p className="text-xs text-slate-600 mt-1">
              Specify the Sri Lankan administrative districts and travel radius where your team accepts jobs.
            </p>
          </div>
          <Link
            href="/provider/dashboard"
            className="text-xs font-bold text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {savedSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm font-semibold flex items-center space-x-2">
            <span>✅</span>
            <span>Coverage areas updated successfully!</span>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          {/* Radius setting */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-bold text-slate-800">
                Job Dispatch Radius from Workshop / Base
              </label>
              <span className="text-sm font-extrabold text-emerald-700">{radiusKm} km</span>
            </div>
            <input
              type="range"
              min="5"
              max="100"
              step="5"
              value={radiusKm}
              onChange={(e) => {
                setRadiusKm(parseInt(e.target.value, 10));
                setSavedSuccess(false);
              }}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-medium">
              <span>5 km (Local neighborhood)</span>
              <span>50 km (Regional)</span>
              <span>100 km (Multi-district)</span>
            </div>
          </div>

          {/* District Selector */}
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-3">
              Covered Sri Lankan Districts ({selectedDistricts.length} active)
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {DISTRICTS.map((d) => {
                const isSelected = selectedDistricts.includes(d.id);
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => toggleDistrict(d.id)}
                    className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between text-xs font-bold ${
                      isSelected
                        ? "border-emerald-600 bg-emerald-50 text-emerald-900 shadow-sm"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <div>
                      <p>{d.name_en}</p>
                      <p className="text-[10px] font-normal text-slate-400">{d.name_si}</p>
                    </div>
                    <span>{isSelected ? "✓" : "+"}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleSave}
              className="px-6 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-sm transition-colors"
            >
              Save Coverage Areas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
