"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { LeadRecord } from "@/types/database";

export default function CustomerEnquiriesPage() {
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchEnquiries() {
      try {
        const res = await fetch("/api/v1/leads?role=customer&customerId=cust-sample-01");
        const data = await res.json();
        if (isMounted && data.leads) {
          setLeads(data.leads);
        }
      } catch (err) {
        console.error("Failed to fetch customer enquiries", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchEnquiries();
    return () => {
      isMounted = false;
    };
  }, []);

  const refreshEnquiries = async () => {
    try {
      const res = await fetch("/api/v1/leads?role=customer&customerId=cust-sample-01");
      const data = await res.json();
      if (data.leads) {
        setLeads(data.leads);
      }
    } catch (err) {
      console.error("Failed to fetch customer enquiries", err);
    }
  };

  const handleCancel = async (leadId: string) => {
    setCancellingId(leadId);
    try {
      const res = await fetch(`/api/v1/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "cancelled",
          changedBy: "cust-sample-01",
          note: "Customer cancelled enquiry request.",
        }),
      });
      if (res.ok) {
        await refreshEnquiries();
      }
    } catch {
      // Fallback
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header Breadcrumbs */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900">My Service Enquiries</h1>
            <p className="text-xs text-slate-600 mt-1">
              Track active quotations, communicate with trade specialists, and inspect work progress.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              href="/customer/favourites"
              className="text-xs font-bold text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50"
            >
              ❤️ Saved Providers
            </Link>
            <Link
              href="/search"
              className="text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 px-3 py-1.5 rounded-lg"
            >
              + Find Providers
            </Link>
          </div>
        </div>

        {/* Enquiries List */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-400 animate-pulse">
            Loading your enquiries...
          </div>
        ) : leads.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <span className="text-3xl">📭</span>
            <p className="text-sm font-bold text-slate-800">No Service Enquiries Yet</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              When you submit requests on a provider profile, you can monitor quotes and manage your job orders here.
            </p>
            <Link
              href="/search"
              className="inline-block mt-2 px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-bold"
            >
              Search Trade Services
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {leads.map((lead) => (
              <div
                key={lead.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-black text-slate-900">
                      {lead.business?.name || "Service Provider"}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                        lead.status === "completed"
                          ? "bg-emerald-100 text-emerald-800"
                          : lead.status === "cancelled" || lead.status === "declined"
                          ? "bg-rose-100 text-rose-800"
                          : lead.status === "new"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {lead.status.replace("_", " ")}
                    </span>
                  </div>

                  {lead.service?.title && (
                    <p className="text-xs font-semibold text-emerald-800">{lead.service.title}</p>
                  )}

                  <p className="text-xs text-slate-600 line-clamp-2">{lead.message}</p>

                  <div className="flex items-center space-x-4 text-[11px] text-slate-400 pt-1">
                    <span>Submitted: {lead.created_at.slice(0, 10)}</span>
                    {lead.preferred_date && <span>Preferred Date: {lead.preferred_date}</span>}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  {lead.business?.slug && (
                    <Link
                      href={`/providers/${lead.business.slug}`}
                      className="px-3.5 py-2 text-center border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      View Profile
                    </Link>
                  )}

                  {lead.status === "completed" && (
                    <button
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg transition"
                      onClick={() => alert("Verified Review submission will open in M6.")}
                    >
                      ⭐ Write Review
                    </button>
                  )}

                  {["new", "viewed", "contacted", "quoted"].includes(lead.status) && (
                    <button
                      disabled={cancellingId === lead.id}
                      onClick={() => handleCancel(lead.id)}
                      className="px-3 py-2 text-center border border-rose-200 text-rose-700 hover:bg-rose-50 rounded-lg text-xs font-semibold transition"
                    >
                      {cancellingId === lead.id ? "Cancelling..." : "Cancel Enquiry"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
