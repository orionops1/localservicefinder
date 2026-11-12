"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function ProviderProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    id: "",
    name: "Lanka Precision Works",
    description: "Experienced residential and commercial mechanical & electrical trade services.",
    contactEmail: "support@lankaprecision.lk",
    contactPhone: "0771234567",
    whatsappNumber: "0771234567",
    addressLine1: "142 Galle Road, Colombo 03",
    businessType: "sole_proprietor",
    registrationNumber: "W/98765/SP",
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/v1/provider/businesses");
        const data = await res.json();
        if (data.business) {
          setFormData({
            id: data.business.id,
            name: data.business.name || "",
            description: data.business.description || "",
            contactEmail: data.business.contact_email || "",
            contactPhone: data.business.contact_phone || "",
            whatsappNumber: data.business.whatsapp_number || "",
            addressLine1: data.business.address_line1 || "",
            businessType: data.business.business_type || "sole_proprietor",
            registrationNumber: data.business.registration_number || "",
          });
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSavedSuccess(false);

    try {
      // In production calls PATCH or PUT to update business details
      await new Promise((r) => setTimeout(r, 600));
      setSavedSuccess(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save profile changes.";
      setErrorMsg(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-sm font-semibold text-slate-500 animate-pulse">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Edit Business Profile</h1>
            <p className="text-xs text-slate-600 mt-1">
              Keep your contact details, operational address, and public description updated.
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
            <span>Business profile details saved successfully!</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-sm font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1">Business Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1">Public Description</label>
            <textarea
              rows={4}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1">Direct Phone</label>
              <input
                type="tel"
                required
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1">WhatsApp Number</label>
              <input
                type="tel"
                value={formData.whatsappNumber}
                onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1">Contact Email</label>
            <input
              type="email"
              required
              value={formData.contactEmail}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-800 mb-1">Office / Workshop Address</label>
            <input
              type="text"
              value={formData.addressLine1}
              onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
            <Link
              href="/provider/dashboard"
              className="px-5 py-2.5 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-sm transition-colors disabled:opacity-50"
            >
              {saving ? "Saving Changes..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
