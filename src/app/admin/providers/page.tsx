"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BusinessRecord, BusinessStatus } from "@/types/database";

export default function AdminProvidersPage() {
  const [providers, setProviders] = useState<BusinessRecord[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<BusinessRecord | null>(null);
  const [statusFilter, setStatusFilter] = useState<BusinessStatus | "all">("pending_review");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadProviders() {
      try {
        const url =
          statusFilter === "all"
            ? "/api/v1/provider/businesses"
            : `/api/v1/provider/businesses`;
        const res = await fetch(url);
        const data = await res.json();
        if (isMounted) {
          // In dev/sandbox load sample pending and approved providers
          const defaultPending: BusinessRecord = {
            id: "biz-pending-01",
            owner_id: "user-owner-02",
            name: "Kelani Solar & Inverters",
            slug: "kelani-solar-inverters",
            description: "Residential rooftop solar PV solutions and hybrid battery storage across Gampaha.",
            business_type: "registered_company",
            registration_number: "PV/142998/GAMP",
            contact_email: "info@kelanisolar.lk",
            contact_phone: "0332211445",
            whatsapp_number: "0712345678",
            address_line1: "45 Kandy Road, Peliyagoda",
            status: "pending_review",
            created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
            updated_at: new Date(Date.now() - 3600000 * 5).toISOString(),
          };

          const defaultApproved: BusinessRecord = {
            id: "biz-sample-01",
            owner_id: "user-owner-01",
            name: "Galle Precision Electricals",
            slug: "galle-precision-electricals",
            description: "Licensed electricians specializing in domestic wiring, DB overhauls, and solar inverters.",
            business_type: "sole_proprietor",
            registration_number: "SP/GAL/2021/884",
            contact_email: "service@galleprecision.lk",
            contact_phone: "0771234567",
            whatsapp_number: "0771234567",
            address_line1: "142 Wakwella Road, Galle",
            status: "approved",
            created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
            updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
          };

          const loadedList = data.business ? [data.business] : [defaultPending, defaultApproved];
          setProviders(loadedList);
          setSelectedProvider(loadedList[0] || null);
        }
      } catch (err) {
        console.error("Failed to load providers", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadProviders();
    return () => {
      isMounted = false;
    };
  }, [statusFilter]);

  const handleReviewDecision = async (
    decision: "approved" | "rejected" | "suspended",
    reason?: string
  ) => {
    if (!selectedProvider) return;
    setErrorMsg(null);
    setSuccessMsg(null);
    setProcessing(true);

    try {
      const res = await fetch(`/api/v1/admin/providers/${selectedProvider.id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          decision,
          reason,
          reviewerId: "admin-staff-01",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit review decision.");
      }

      setSuccessMsg(`Provider ${decision} successfully.`);
      const updated = data.business;
      setSelectedProvider(updated);
      setProviders((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      setRejectionModalOpen(false);
      setRejectionReason("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to review provider";
      setErrorMsg(msg);
    } finally {
      setProcessing(false);
    }
  };

  const filteredProviders = providers.filter((p) => {
    if (statusFilter === "all") return true;
    return p.status === statusFilter;
  });

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Provider Moderation Queue</h1>
          <p className="text-xs text-slate-400 mt-1">
            Review new service provider applications, verify trade credentials, and control marketplace publishing.
          </p>
        </div>
        <Link
          href="/admin"
          className="text-xs font-bold text-slate-400 hover:text-white border border-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-800"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 pb-4 mb-6 border-b border-slate-800">
        {[
          { id: "pending_review" as const, label: "Pending Review" },
          { id: "approved" as const, label: "Approved" },
          { id: "rejected" as const, label: "Rejected" },
          { id: "all" as const, label: "All Providers" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              statusFilter === tab.id
                ? "bg-emerald-600 text-white"
                : "bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {successMsg && (
        <div className="mb-6 p-4 bg-emerald-950/60 border border-emerald-800 text-emerald-200 text-xs rounded-xl font-bold flex items-center space-x-2">
          <span>✅</span>
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 p-4 bg-rose-950/60 border border-rose-800 text-rose-200 text-xs rounded-xl font-bold">
          {errorMsg}
        </div>
      )}

      {/* 2-Column Review Console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Queue List */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center text-xs font-bold text-slate-400">
            <span>PROVIDERS ({filteredProviders.length})</span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-slate-500 animate-pulse">Loading...</div>
          ) : filteredProviders.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No providers in this queue.
            </div>
          ) : (
            <div className="divide-y divide-slate-800/80 max-h-[600px] overflow-y-auto">
              {filteredProviders.map((biz) => {
                const isSelected = selectedProvider?.id === biz.id;
                return (
                  <button
                    key={biz.id}
                    onClick={() => {
                      setSelectedProvider(biz);
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className={`w-full text-left p-4 transition flex flex-col space-y-1.5 ${
                      isSelected
                        ? "bg-emerald-950/40 border-l-4 border-emerald-500"
                        : "hover:bg-slate-800/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{biz.name}</span>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
                          biz.status === "approved"
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                            : biz.status === "rejected"
                            ? "bg-rose-950 text-rose-400 border border-rose-800"
                            : "bg-amber-950 text-amber-400 border border-amber-800"
                        }`}
                      >
                        {biz.status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1">{biz.description}</p>
                    <span className="text-[10px] text-slate-500">
                      ID: {biz.id.slice(0, 8)}... • Contact: {biz.contact_phone}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Detailed Inspection & Actions */}
        <div className="lg:col-span-2 space-y-6">
          {selectedProvider ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-black text-white">{selectedProvider.name}</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Slug: <code className="text-emerald-400">{selectedProvider.slug}</code> • Entity:{" "}
                    <span className="capitalize">{selectedProvider.business_type.replace("_", " ")}</span>
                  </p>
                </div>
                <span
                  className={`text-xs font-black px-3 py-1 rounded-full uppercase self-start ${
                    selectedProvider.status === "approved"
                      ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                      : selectedProvider.status === "rejected"
                      ? "bg-rose-950 text-rose-400 border border-rose-800"
                      : "bg-amber-950 text-amber-400 border border-amber-800"
                  }`}
                >
                  Status: {selectedProvider.status.replace("_", " ")}
                </span>
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <p className="font-bold text-slate-400 uppercase text-[10px]">Contact Information</p>
                  <p className="text-slate-200">
                    <span className="text-slate-400">Phone:</span> {selectedProvider.contact_phone}
                  </p>
                  <p className="text-slate-200">
                    <span className="text-slate-400">WhatsApp:</span>{" "}
                    {selectedProvider.whatsapp_number || "Not specified"}
                  </p>
                  <p className="text-slate-200">
                    <span className="text-slate-400">Email:</span> {selectedProvider.contact_email}
                  </p>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <p className="font-bold text-slate-400 uppercase text-[10px]">Location & Registration</p>
                  <p className="text-slate-200">
                    <span className="text-slate-400">Address:</span>{" "}
                    {selectedProvider.address_line1 || "Not specified"}
                  </p>
                  <p className="text-slate-200">
                    <span className="text-slate-400">BR Registration:</span>{" "}
                    {selectedProvider.registration_number || "None / Individual trade"}
                  </p>
                  <p className="text-slate-200">
                    <span className="text-slate-400">Registered:</span>{" "}
                    {selectedProvider.created_at.slice(0, 10)}
                  </p>
                </div>
              </div>

              {/* Business Description */}
              <div>
                <p className="font-bold text-slate-400 uppercase text-[10px] mb-2">Description</p>
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  {selectedProvider.description}
                </div>
              </div>

              {selectedProvider.rejection_reason && (
                <div className="p-4 bg-rose-950/40 border border-rose-800 rounded-xl text-xs text-rose-300">
                  <span className="font-bold block mb-1">Previous Rejection Reason:</span>
                  {selectedProvider.rejection_reason}
                </div>
              )}

              {/* Administrative Decision Controls */}
              <div className="pt-4 border-t border-slate-800 flex flex-wrap gap-3">
                {selectedProvider.status !== "approved" && (
                  <button
                    disabled={processing}
                    onClick={() => handleReviewDecision("approved")}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition disabled:opacity-50"
                  >
                    ✓ Approve Listing (Publish to Search)
                  </button>
                )}

                {selectedProvider.status !== "rejected" && (
                  <button
                    disabled={processing}
                    onClick={() => setRejectionModalOpen(true)}
                    className="px-4 py-2.5 bg-rose-900/60 hover:bg-rose-900 text-rose-200 border border-rose-700 font-bold text-xs rounded-xl transition disabled:opacity-50"
                  >
                    ✕ Reject Application
                  </button>
                )}

                {selectedProvider.status === "approved" && (
                  <button
                    disabled={processing}
                    onClick={() => handleReviewDecision("suspended", "Terms compliance review")}
                    className="px-4 py-2.5 bg-amber-900/50 hover:bg-amber-900 text-amber-300 border border-amber-700 font-bold text-xs rounded-xl transition disabled:opacity-50"
                  >
                    ⏸ Suspend Provider
                  </button>
                )}

                <Link
                  href={`/providers/${selectedProvider.slug}`}
                  target="_blank"
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-semibold text-xs rounded-xl transition"
                >
                  Preview Public Profile ↗
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500 text-xs">
              Select a provider from the list to review details.
            </div>
          )}
        </div>
      </div>

      {/* Rejection Reason Modal */}
      {rejectionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Reject Provider Application</h3>
            <p className="text-xs text-slate-400">
              Provide a clear reason explaining why this application was rejected. This reason will be
              visible to the provider so they can correct their listing.
            </p>
            <textarea
              rows={3}
              required
              placeholder="e.g. Phone number could not be reached, or description lacks specific trade experience details."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectionModalOpen(false)}
                className="px-3 py-1.5 border border-slate-700 text-xs text-slate-400 rounded-lg hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={processing || rejectionReason.trim().length < 5}
                onClick={() => handleReviewDecision("rejected", rejectionReason)}
                className="px-4 py-1.5 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs rounded-lg transition disabled:opacity-50"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
