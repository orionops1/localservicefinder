"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { LeadRecord, LeadStatus, LeadStatusEventRecord } from "@/types/database";

function ProviderLeadsContent() {
  const searchParams = useSearchParams();
  const businessIdParam = searchParams.get("businessId") || "biz-sample-01";

  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [selectedLead, setSelectedLead] = useState<LeadRecord | null>(null);
  const [history, setHistory] = useState<LeadStatusEventRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [actionNote, setActionNote] = useState("");

  useEffect(() => {
    let isMounted = true;
    async function fetchLeads() {
      try {
        const res = await fetch(`/api/v1/leads?role=provider&businessId=${businessIdParam}`);
        const data = await res.json();
        if (isMounted && data.leads) {
          setLeads(data.leads);
          if (data.leads.length > 0) {
            setSelectedLead((prev) => prev ?? data.leads[0]);
          }
        }
      } catch (err) {
        console.error("Failed to load leads", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchLeads();
    return () => {
      isMounted = false;
    };
  }, [businessIdParam]);

  useEffect(() => {
    if (!selectedLead?.id) return;
    let isMounted = true;
    async function fetchHistory() {
      try {
        const res = await fetch(`/api/v1/leads/${selectedLead?.id}`);
        const data = await res.json();
        if (isMounted && data.history) {
          setHistory(data.history);
        }
      } catch {
        // Fallback
      }
    }
    fetchHistory();
    return () => {
      isMounted = false;
    };
  }, [selectedLead?.id]);

  const handleRefresh = async () => {
    try {
      const res = await fetch(`/api/v1/leads?role=provider&businessId=${businessIdParam}`);
      const data = await res.json();
      if (data.leads) {
        setLeads(data.leads);
      }
    } catch (err) {
      console.error("Failed to refresh leads", err);
    }
  };

  const handleSelectLead = (lead: LeadRecord) => {
    setSelectedLead(lead);
    setActionNote("");
    setErrorMsg(null);
  };

  const handleStatusTransition = async (newStatus: LeadStatus) => {
    if (!selectedLead) return;
    setErrorMsg(null);
    setUpdating(true);

    try {
      const res = await fetch(`/api/v1/leads/${selectedLead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          changedBy: "provider-member",
          note: actionNote.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update lead status.");
      }

      // Update local states
      const updated = data.lead;
      setSelectedLead(updated);
      setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
      if (data.history) {
        setHistory(data.history);
      }
      setActionNote("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update status";
      setErrorMsg(msg);
    } finally {
      setUpdating(false);
    }
  };

  const filteredLeads = leads.filter((l) => {
    if (statusFilter === "all") return true;
    return l.status === statusFilter;
  });

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header Breadcrumbs */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Provider Lead Inbox</h1>
            <p className="text-xs text-slate-600 mt-1">
              Review customer service enquiries, advance job status, and manage active trade contracts.
            </p>
          </div>
          <Link
            href="/provider/dashboard"
            className="text-xs font-bold text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 mb-6">
          {[
            { id: "all", label: "All Leads" },
            { id: "new", label: "New Requests" },
            { id: "contacted", label: "Contacted" },
            { id: "quoted", label: "Quoted" },
            { id: "in_progress", label: "In Progress" },
            { id: "completed", label: "Completed" },
            { id: "declined", label: "Declined" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                statusFilter === tab.id
                  ? "bg-emerald-700 text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 2-Column Lead Management Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Leads List */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Inquiries ({filteredLeads.length})
              </span>
              <button
                onClick={handleRefresh}
                className="text-xs text-emerald-700 font-bold hover:underline"
              >
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="p-8 text-center text-xs text-slate-400 animate-pulse">
                Loading leads...
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No inquiries matching this status.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                {filteredLeads.map((lead) => {
                  const isSelected = selectedLead?.id === lead.id;
                  return (
                    <button
                      key={lead.id}
                      onClick={() => handleSelectLead(lead)}
                      className={`w-full text-left p-4 transition-colors flex flex-col space-y-1.5 ${
                        isSelected
                          ? "bg-emerald-50/70 border-l-4 border-emerald-600"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">
                          {lead.customer_name_snapshot}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                            lead.status === "new"
                              ? "bg-blue-100 text-blue-800"
                              : lead.status === "completed"
                              ? "bg-emerald-100 text-emerald-800"
                              : lead.status === "declined"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {lead.status.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-2">{lead.message}</p>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                        <span>📞 {lead.customer_contact_snapshot}</span>
                        <span>{lead.created_at.slice(0, 10)}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Active Lead Details & Status Actions */}
          <div className="lg:col-span-2 space-y-6">
            {selectedLead ? (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h2 className="text-lg font-black text-slate-900">
                      Job Request: {selectedLead.customer_name_snapshot}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Lead ID: <code className="text-slate-700">{selectedLead.id}</code> • Received:{" "}
                      {selectedLead.created_at.slice(0, 16).replace("T", " ")}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-black px-3 py-1 rounded-full uppercase self-start ${
                      selectedLead.status === "new"
                        ? "bg-blue-100 text-blue-800 border border-blue-200"
                        : selectedLead.status === "completed"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        : selectedLead.status === "declined"
                        ? "bg-rose-100 text-rose-800 border border-rose-200"
                        : "bg-amber-100 text-amber-800 border border-amber-200"
                    }`}
                  >
                    Status: {selectedLead.status.replace("_", " ")}
                  </span>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-medium">
                    {errorMsg}
                  </div>
                )}

                {/* Contact & Job Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <span className="font-bold text-slate-500">Customer Contact:</span>
                    <p className="font-extrabold text-slate-900 text-sm mt-0.5">
                      {selectedLead.customer_contact_snapshot}
                    </p>
                    <div className="mt-2 flex gap-2">
                      <a
                        href={`tel:${selectedLead.customer_contact_snapshot}`}
                        className="px-2.5 py-1 bg-zinc-900 text-white rounded font-bold text-[11px]"
                      >
                        📞 Call Customer
                      </a>
                      <a
                        href={`https://wa.me/${selectedLead.customer_contact_snapshot.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 bg-emerald-600 text-white rounded font-bold text-[11px]"
                      >
                        💬 WhatsApp
                      </a>
                    </div>
                  </div>

                  <div>
                    <span className="font-bold text-slate-500">Preferred Service Date:</span>
                    <p className="font-extrabold text-slate-900 mt-0.5">
                      {selectedLead.preferred_date || "Flexible / Not specified"}
                    </p>
                    {selectedLead.service?.title && (
                      <div className="mt-2">
                        <span className="font-bold text-slate-500">Service Category:</span>
                        <p className="text-slate-800 font-semibold">{selectedLead.service.title}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Full Message */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Customer Message & Scope
                  </h3>
                  <div className="p-4 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed bg-white">
                    {selectedLead.message}
                  </div>
                </div>

                {/* Status Transition Actions (Finite State Machine) */}
                <div className="border-t border-slate-100 pt-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Advance Job Status
                  </h3>

                  <div className="mb-3">
                    <input
                      type="text"
                      placeholder="Add an internal note or communication summary (optional)..."
                      value={actionNote}
                      onChange={(e) => setActionNote(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {selectedLead.status === "new" && (
                      <>
                        <button
                          disabled={updating}
                          onClick={() => handleStatusTransition("contacted")}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition"
                        >
                          Mark Contacted
                        </button>
                        <button
                          disabled={updating}
                          onClick={() => handleStatusTransition("quoted")}
                          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg transition"
                        >
                          Provide Quote
                        </button>
                        <button
                          disabled={updating}
                          onClick={() => handleStatusTransition("declined")}
                          className="px-4 py-2 border border-rose-300 text-rose-700 hover:bg-rose-50 font-bold text-xs rounded-lg transition"
                        >
                          Decline Request
                        </button>
                      </>
                    )}

                    {selectedLead.status === "contacted" && (
                      <>
                        <button
                          disabled={updating}
                          onClick={() => handleStatusTransition("quoted")}
                          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg transition"
                        >
                          Submit Quotation
                        </button>
                        <button
                          disabled={updating}
                          onClick={() => handleStatusTransition("accepted")}
                          className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-lg transition"
                        >
                          Accept Job Directly
                        </button>
                        <button
                          disabled={updating}
                          onClick={() => handleStatusTransition("declined")}
                          className="px-4 py-2 border border-rose-300 text-rose-700 hover:bg-rose-50 font-bold text-xs rounded-lg transition"
                        >
                          Decline
                        </button>
                      </>
                    )}

                    {selectedLead.status === "quoted" && (
                      <>
                        <button
                          disabled={updating}
                          onClick={() => handleStatusTransition("accepted")}
                          className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-lg transition"
                        >
                          Customer Accepted Quote
                        </button>
                        <button
                          disabled={updating}
                          onClick={() => handleStatusTransition("declined")}
                          className="px-4 py-2 border border-rose-300 text-rose-700 hover:bg-rose-50 font-bold text-xs rounded-lg transition"
                        >
                          Decline / Expire
                        </button>
                      </>
                    )}

                    {selectedLead.status === "accepted" && (
                      <>
                        <button
                          disabled={updating}
                          onClick={() => handleStatusTransition("in_progress")}
                          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg transition"
                        >
                          Begin Work (In Progress)
                        </button>
                        <button
                          disabled={updating}
                          onClick={() => handleStatusTransition("completed")}
                          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg transition"
                        >
                          Complete Job
                        </button>
                      </>
                    )}

                    {selectedLead.status === "in_progress" && (
                      <>
                        <button
                          disabled={updating}
                          onClick={() => handleStatusTransition("completed")}
                          className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-lg shadow-sm transition"
                        >
                          ✅ Mark Job Completed
                        </button>
                        <button
                          disabled={updating}
                          onClick={() => handleStatusTransition("disputed")}
                          className="px-3 py-2 border border-amber-300 text-amber-800 hover:bg-amber-50 font-bold text-xs rounded-lg transition"
                        >
                          Report Issue
                        </button>
                      </>
                    )}

                    {["completed", "declined", "cancelled"].includes(selectedLead.status) && (
                      <p className="text-xs text-slate-500 italic">
                        This inquiry has reached terminal status ({selectedLead.status}).
                      </p>
                    )}
                  </div>
                </div>

                {/* Audit History Trail */}
                <div className="border-t border-slate-100 pt-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Audit & Status Event Trail ({history.length})
                  </h3>
                  <div className="space-y-2">
                    {history.map((evt) => (
                      <div
                        key={evt.id}
                        className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs flex items-center justify-between"
                      >
                        <div>
                          <p className="font-semibold text-slate-800">
                            Transition: <span className="text-slate-500">{evt.from_status}</span> →{" "}
                            <span className="font-bold text-emerald-800">{evt.to_status}</span>
                          </p>
                          {evt.note && <p className="text-slate-500 text-[11px] mt-0.5">{evt.note}</p>}
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {evt.created_at.slice(0, 16).replace("T", " ")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-sm">
                Select a lead from the left to view details and update job status.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProviderLeadsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <p className="text-sm font-semibold text-slate-500 animate-pulse">
            Loading lead inbox...
          </p>
        </div>
      }
    >
      <ProviderLeadsContent />
    </Suspense>
  );
}
