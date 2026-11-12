"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ReviewRecord, ReviewStatus } from "@/types/database";

export default function AdminReviewsModerationPage() {
  const [reviews, setReviews] = useState<ReviewRecord[]>([]);
  const [statusFilter, setStatusFilter] = useState<ReviewStatus | "all">("all");
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadReviews() {
      try {
        const sampleReviews: ReviewRecord[] = [
          {
            id: "rev-sample-01",
            lead_id: "lead-completed-01",
            business_id: "biz-sample-01",
            customer_id: "cust-sample-01",
            rating: 5,
            quality_rating: 5,
            punctuality_rating: 5,
            communication_rating: 5,
            comment: "Excellent domestic wiring repair in Galle Fort. Found the short circuit quickly and replaced the damaged MCB within 2 hours. Very polite and fair pricing.",
            status: "published",
            published_at: new Date(Date.now() - 86400000 * 3).toISOString(),
            created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
            customer_name: "Rohan Dissanayake",
            business_name: "Galle Precision Electricals",
          },
          {
            id: "rev-sample-02",
            lead_id: "lead-completed-02",
            business_id: "biz-sample-01",
            customer_id: "cust-sample-02",
            rating: 4,
            quality_rating: 5,
            punctuality_rating: 4,
            communication_rating: 4,
            comment: "Setup our 5kVA hybrid solar backup system. Clean cabling and good explanation of battery cycles.",
            status: "published",
            published_at: new Date(Date.now() - 86400000 * 7).toISOString(),
            created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
            customer_name: "Anusha Weerasinghe",
            business_name: "Galle Precision Electricals",
          },
        ];

        if (isMounted) {
          setReviews(sampleReviews);
        }
      } catch (err) {
        console.error("Failed to load reviews", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadReviews();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleModerate = async (reviewId: string, decision: ReviewStatus) => {
    setProcessingId(reviewId);
    setSuccessMsg(null);
    try {
      const res = await fetch(`/api/v1/reviews/${reviewId}/moderate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          decision,
          moderatorId: "admin-staff-01",
        }),
      });

      if (res.ok) {
        setReviews((prev) =>
          prev.map((r) => (r.id === reviewId ? { ...r, status: decision } : r))
        );
        setSuccessMsg(`Review status updated to ${decision}.`);
      }
    } catch {
      // Fallback
    } finally {
      setProcessingId(null);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    if (statusFilter === "all") return true;
    return r.status === statusFilter;
  });

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Customer Review Moderation</h1>
          <p className="text-xs text-slate-400 mt-1">
            Ensure customer reviews adhere to marketplace community standards and represent authentic completed jobs.
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
          { id: "all" as const, label: "All Reviews" },
          { id: "published" as const, label: "Published" },
          { id: "pending_moderation" as const, label: "Pending" },
          { id: "flagged" as const, label: "Flagged" },
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

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-xs text-slate-500 animate-pulse">
            Loading reviews...
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-xs text-slate-500">
            No reviews matching this filter.
          </div>
        ) : (
          filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-start justify-between gap-4"
            >
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center space-x-3">
                  <div className="flex text-amber-400 text-sm">
                    {"★".repeat(rev.rating)}
                    {"☆".repeat(5 - rev.rating)}
                  </div>
                  <span className="font-bold text-white text-xs">{rev.customer_name}</span>
                  <span className="text-slate-400 text-xs">reviewed</span>
                  <span className="font-semibold text-emerald-400 text-xs">{rev.business_name}</span>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
                      rev.status === "published"
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                        : rev.status === "flagged"
                        ? "bg-amber-950 text-amber-400 border border-amber-800"
                        : "bg-rose-950 text-rose-400 border border-rose-800"
                    }`}
                  >
                    {rev.status.replace("_", " ")}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>

                <div className="flex flex-wrap gap-4 text-[11px] text-slate-500 pt-1">
                  <span>Quality: {rev.quality_rating || 5}/5</span>
                  <span>Punctuality: {rev.punctuality_rating || 5}/5</span>
                  <span>Communication: {rev.communication_rating || 5}/5</span>
                  <span>Submitted: {rev.created_at.slice(0, 10)}</span>
                </div>
              </div>

              <div className="flex sm:flex-col gap-2 self-start">
                {rev.status !== "published" && (
                  <button
                    disabled={processingId === rev.id}
                    onClick={() => handleModerate(rev.id, "published")}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition"
                  >
                    Publish
                  </button>
                )}
                {rev.status !== "flagged" && (
                  <button
                    disabled={processingId === rev.id}
                    onClick={() => handleModerate(rev.id, "flagged")}
                    className="px-3.5 py-1.5 border border-amber-700 text-amber-300 hover:bg-amber-900/40 font-bold text-xs rounded-lg transition"
                  >
                    Flag
                  </button>
                )}
                {rev.status !== "rejected" && (
                  <button
                    disabled={processingId === rev.id}
                    onClick={() => handleModerate(rev.id, "rejected")}
                    className="px-3.5 py-1.5 border border-rose-800 text-rose-300 hover:bg-rose-900/40 font-bold text-xs rounded-lg transition"
                  >
                    Reject
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
