"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { LeadRecord } from "@/types/database";

export default function CustomerEnquiriesPage() {
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // Review modal state
  const [reviewLead, setReviewLead] = useState<LeadRecord | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [qualityRating, setQualityRating] = useState(5);
  const [punctualityRating, setPunctualityRating] = useState(5);
  const [communicationRating, setCommunicationRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

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

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewLead) return;
    setReviewError(null);
    setSubmittingReview(true);

    try {
      const res = await fetch("/api/v1/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId: reviewLead.id,
          businessId: reviewLead.business_id,
          customerId: reviewLead.customer_id,
          rating: reviewRating,
          qualityRating,
          punctualityRating,
          communicationRating,
          comment: reviewComment,
          customerName: reviewLead.customer_name_snapshot,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit review.");
      }

      setReviewSuccess(true);
      setTimeout(() => {
        setReviewLead(null);
        setReviewSuccess(false);
        setReviewComment("");
      }, 2000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to submit review.";
      setReviewError(msg);
    } finally {
      setSubmittingReview(false);
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
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg transition shadow-sm"
                      onClick={() => {
                        setReviewLead(lead);
                        setReviewError(null);
                        setReviewSuccess(false);
                      }}
                    >
                      ⭐ Write Verified Review
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

      {/* Verified Review Submission Modal */}
      {reviewLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setReviewLead(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕
            </button>

            {reviewSuccess ? (
              <div className="py-8 text-center space-y-3">
                <span className="text-4xl">🌟</span>
                <h3 className="text-lg font-black text-slate-900">Thank You for Your Feedback!</h3>
                <p className="text-xs text-slate-600">
                  Your verified review has been published. Genuine customer reviews help maintain quality and trust across Sri Lanka.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Write Review for {reviewLead.business?.name || "Service Provider"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Job Reference: <code>{reviewLead.id.slice(0, 8)}...</code> (Completed)
                  </p>
                </div>

                {reviewError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-medium">
                    {reviewError}
                  </div>
                )}

                {/* Overall Rating */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Overall Satisfaction *
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className={`text-2xl transition-transform hover:scale-110 ${
                          star <= reviewRating ? "text-amber-400" : "text-slate-200"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sub-Ratings */}
                <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Work Quality</label>
                    <select
                      value={qualityRating}
                      onChange={(e) => setQualityRating(parseInt(e.target.value, 10))}
                      className="w-full text-xs p-1 rounded border border-slate-300 font-bold bg-white"
                    >
                      {[5, 4, 3, 2, 1].map((s) => (
                        <option key={s} value={s}>{s} Stars</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Punctuality</label>
                    <select
                      value={punctualityRating}
                      onChange={(e) => setPunctualityRating(parseInt(e.target.value, 10))}
                      className="w-full text-xs p-1 rounded border border-slate-300 font-bold bg-white"
                    >
                      {[5, 4, 3, 2, 1].map((s) => (
                        <option key={s} value={s}>{s} Stars</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Communication</label>
                    <select
                      value={communicationRating}
                      onChange={(e) => setCommunicationRating(parseInt(e.target.value, 10))}
                      className="w-full text-xs p-1 rounded border border-slate-300 font-bold bg-white"
                    >
                      {[5, 4, 3, 2, 1].map((s) => (
                        <option key={s} value={s}>{s} Stars</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Detailed Comment */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Detailed Review *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe the job performed, speed of completion, craftsmanship, and pricing fairness..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setReviewLead(null)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReview || reviewComment.trim().length < 5}
                    className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg transition disabled:opacity-50"
                  >
                    {submittingReview ? "Submitting Review..." : "Publish Verified Review"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
