"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { VerificationSubmissionRecord } from "@/types/database";

export default function AdminVerificationsPage() {
  const [submissions, setSubmissions] = useState<VerificationSubmissionRecord[]>([]);
  const [selectedSub, setSelectedSub] = useState<VerificationSubmissionRecord | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("pending");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadVerifications() {
      try {
        const sampleSubmissions: VerificationSubmissionRecord[] = [
          {
            id: "v-sample-01",
            business_id: "biz-pending-01",
            submitted_by: "user-owner-02",
            check_type: "identity_checked",
            private_storage_path: "verifications/biz-pending-01/identity/nic_copy.pdf",
            status: "pending",
            created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
          },
          {
            id: "v-sample-02",
            business_id: "biz-pending-01",
            submitted_by: "user-owner-02",
            check_type: "business_details_checked",
            private_storage_path: "verifications/biz-pending-01/br/br_certificate.pdf",
            status: "pending",
            created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
          },
          {
            id: "v-sample-03",
            business_id: "biz-sample-01",
            submitted_by: "user-owner-01",
            check_type: "qualification_checked",
            private_storage_path: "verifications/biz-sample-01/qualification/nvq4_electrical.pdf",
            status: "approved",
            reviewer_id: "admin-staff-01",
            checked_at: new Date(Date.now() - 86400000).toISOString(),
            created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
          },
        ];

        if (isMounted) {
          setSubmissions(sampleSubmissions);
          setSelectedSub(sampleSubmissions[0] || null);
        }
      } catch (err) {
        console.error("Failed to load verifications", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadVerifications();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleInspectDocument = async (sub: VerificationSubmissionRecord) => {
    setDownloadingId(sub.id);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/v1/provider/documents/${sub.id}/download`);
      const data = await res.json();
      if (!res.ok || !data.downloadUrl) {
        throw new Error(data.error || "Failed to generate presigned download link.");
      }
      window.open(data.downloadUrl, "_blank", "noopener,noreferrer");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unable to inspect document.";
      setErrorMsg(msg);
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDecision = async (decision: "approved" | "rejected", reason?: string) => {
    if (!selectedSub) return;
    setErrorMsg(null);
    setSuccessMsg(null);
    setProcessing(true);

    try {
      const res = await fetch(`/api/v1/admin/verifications/${selectedSub.id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          decision,
          decisionReason: reason,
          reviewerId: "admin-staff-01",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update verification status.");
      }

      setSuccessMsg(`Document ${decision === "approved" ? "verified and badge awarded" : "rejected"} successfully.`);
      const updated = data.submission;
      setSelectedSub(updated);
      setSubmissions((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      setRejectionModalOpen(false);
      setRejectionReason("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to review verification.";
      setErrorMsg(msg);
    } finally {
      setProcessing(false);
    }
  };

  const filteredSubmissions = submissions.filter((s) => {
    if (statusFilter === "all") return true;
    return s.status === statusFilter;
  });

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Verification & Trust Badge Console</h1>
          <p className="text-xs text-slate-400 mt-1">
            Review submitted National Identity Cards (NIC), BR certificates, and vocational trade credentials.
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
          { id: "pending", label: "Pending Verification" },
          { id: "approved", label: "Verified / Badged" },
          { id: "rejected", label: "Rejected Documents" },
          { id: "all", label: "All Submissions" },
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
        {/* Left: Submissions list */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center text-xs font-bold text-slate-400">
            <span>SUBMISSIONS ({filteredSubmissions.length})</span>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-slate-500 animate-pulse">Loading...</div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No submissions in this queue.
            </div>
          ) : (
            <div className="divide-y divide-slate-800/80 max-h-[600px] overflow-y-auto">
              {filteredSubmissions.map((sub) => {
                const isSelected = selectedSub?.id === sub.id;
                return (
                  <button
                    key={sub.id}
                    onClick={() => {
                      setSelectedSub(sub);
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
                      <span className="text-xs font-bold text-white capitalize">
                        {sub.check_type.replace(/_/g, " ")}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
                          sub.status === "approved"
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                            : sub.status === "rejected"
                            ? "bg-rose-950 text-rose-400 border border-rose-800"
                            : "bg-amber-950 text-amber-400 border border-amber-800"
                        }`}
                      >
                        {sub.status}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 truncate">
                      File: {sub.private_storage_path}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      ID: {sub.id.slice(0, 8)}... • Submitted: {sub.created_at.slice(0, 10)}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Inspection & Decision */}
        <div className="lg:col-span-2 space-y-6">
          {selectedSub ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-xl font-black text-white capitalize">
                    {selectedSub.check_type.replace(/_/g, " ")}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Submission ID: <code className="text-emerald-400">{selectedSub.id}</code> • Business:{" "}
                    <code>{selectedSub.business_id}</code>
                  </p>
                </div>
                <span
                  className={`text-xs font-black px-3 py-1 rounded-full uppercase self-start ${
                    selectedSub.status === "approved"
                      ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                      : selectedSub.status === "rejected"
                      ? "bg-rose-950 text-rose-400 border border-rose-800"
                      : "bg-amber-950 text-amber-400 border border-amber-800"
                  }`}
                >
                  Status: {selectedSub.status}
                </span>
              </div>

              {/* Secure Document Download & Security Notice */}
              <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <p className="text-xs font-bold text-slate-300">
                  🔐 Private Encrypted Document Storage
                </p>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  This document is held in private storage (<code className="text-slate-300">lsf-private-files</code>).
                  Clicking the button below generates a temporary 5-minute cryptographically signed URL
                  for reviewer examination only.
                </p>
                <div>
                  <button
                    disabled={downloadingId === selectedSub.id}
                    onClick={() => handleInspectDocument(selectedSub)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-800/80 font-bold text-xs rounded-xl shadow-sm transition disabled:opacity-50"
                  >
                    {downloadingId === selectedSub.id
                      ? "Generating Signed Link..."
                      : "📄 Inspect Document (Secure Signed URL)"}
                  </button>
                </div>
              </div>

              {selectedSub.decision_reason && (
                <div className="p-4 bg-rose-950/40 border border-rose-800 rounded-xl text-xs text-rose-300">
                  <span className="font-bold block mb-1">Reviewer Decision Note:</span>
                  {selectedSub.decision_reason}
                </div>
              )}

              {/* Decision Actions */}
              <div className="pt-4 border-t border-slate-800 flex flex-wrap gap-3">
                {selectedSub.status !== "approved" && (
                  <button
                    disabled={processing}
                    onClick={() => handleDecision("approved")}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition disabled:opacity-50"
                  >
                    ✓ Verify & Award Badge ({selectedSub.check_type.replace(/_/g, " ")})
                  </button>
                )}

                {selectedSub.status !== "rejected" && (
                  <button
                    disabled={processing}
                    onClick={() => setRejectionModalOpen(true)}
                    className="px-4 py-2.5 bg-rose-900/60 hover:bg-rose-900 text-rose-200 border border-rose-700 font-bold text-xs rounded-xl transition disabled:opacity-50"
                  >
                    ✕ Reject Document
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500 text-xs">
              Select a verification submission from the queue to examine documents.
            </div>
          )}
        </div>
      </div>

      {/* Rejection Modal */}
      {rejectionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Reject Verification Document</h3>
            <p className="text-xs text-slate-400">
              Provide a clear reason explaining why this verification document could not be approved
              (e.g. illegible photo, expired document, mismatching name).
            </p>
            <textarea
              rows={3}
              required
              placeholder="e.g. Document image is blurry or expired. Please upload a clear color PDF/photo."
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
                onClick={() => handleDecision("rejected", rejectionReason)}
                className="px-4 py-1.5 bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs rounded-lg transition disabled:opacity-50"
              >
                Confirm Document Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
