"use client";

import React, { useState } from "react";
import Link from "next/link";

interface VerificationItem {
  id: string;
  checkType: "identity_checked" | "business_details_checked" | "qualification_checked";
  fileName: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  rejectionReason?: string;
}

export default function ProviderVerificationPage() {
  const [submissions, setSubmissions] = useState<VerificationItem[]>([
    {
      id: "v-sample-1",
      checkType: "identity_checked",
      fileName: "nic_front_back_copy.pdf",
      status: "approved",
      submittedAt: "2026-11-10",
    },
  ]);

  const [uploadingType, setUploadingType] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [previewingId, setPreviewingId] = useState<string | null>(null);

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    checkType: "identity_checked" | "business_details_checked" | "qualification_checked"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setUploadingType(checkType);

    try {
      // 1. Get presigned session for private verification document
      const sessionRes = await fetch("/api/v1/provider/upload/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: "00000000-0000-0000-0000-000000000001",
          fileName: file.name,
          fileType: file.type || "application/pdf",
          fileSizeBytes: file.size,
          purpose: "verification_doc",
          verificationType: checkType,
        }),
      });

      const sessionData = await sessionRes.json();
      if (!sessionRes.ok) {
        throw new Error(sessionData.error || "Failed to initialize upload session.");
      }

      // 2. Direct upload to private object storage using presigned URL
      const uploadRes = await fetch(sessionData.uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type || "application/pdf",
        },
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error(`Upload failed with status: ${uploadRes.status}`);
      }

      // 3. Confirm upload and record private verification submission
      const confirmRes = await fetch("/api/v1/provider/upload/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: "00000000-0000-0000-0000-000000000001",
          objectKey: sessionData.objectKey,
          bucket: sessionData.bucket,
          fileName: file.name,
          fileSizeBytes: file.size,
          fileType: file.type,
          purpose: "verification_doc",
          verificationType: checkType,
        }),
      });

      const confirmData = await confirmRes.json();
      if (!confirmRes.ok) {
        throw new Error(confirmData.error || "Failed to record document.");
      }

      const newSubmission: VerificationItem = {
        id: confirmData.record.id,
        checkType,
        fileName: file.name,
        status: "pending",
        submittedAt: new Date().toISOString().slice(0, 10),
      };

      setSubmissions((prev) => [newSubmission, ...prev]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload verification document.";
      setErrorMsg(msg);
    } finally {
      setUploadingType(null);
    }
  };

  const handleDownloadSecurePreview = async (submissionId: string) => {
    setPreviewingId(submissionId);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/v1/provider/documents/${submissionId}/download`);
      const data = await res.json();

      if (!res.ok || !data.downloadUrl) {
        throw new Error(data.error || "Failed to generate secure download URL.");
      }

      // Open short-lived URL in new tab
      window.open(data.downloadUrl, "_blank", "noopener,noreferrer");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unable to access document preview.";
      setErrorMsg(msg);
    } finally {
      setPreviewingId(null);
    }
  };

  const verificationCategories = [
    {
      type: "identity_checked" as const,
      title: "National Identity Card (NIC) or Passport",
      description: "Required for individual practitioners and managing directors. Both front and back copies.",
      badge: "Identity Checked",
    },
    {
      type: "business_details_checked" as const,
      title: "Business Registration (BR Certificate)",
      description: "Divisional Secretariat or Registrar of Companies (ROC) certified copy.",
      badge: "Business Details Checked",
    },
    {
      type: "qualification_checked" as const,
      title: "Vocational & Trade Qualifications",
      description: "NVQ Level 3/4/5 certificates, CEB/LECO lineman permits, or engineering institute memberships.",
      badge: "Qualification Checked",
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Verification & Trust Evidence</h1>
            <p className="text-xs text-slate-600 mt-1">
              Upload compliance documents to earn verified badges. All documents are stored in private
              encrypted storage and are never exposed publicly.
            </p>
          </div>
          <Link
            href="/provider/dashboard"
            className="text-xs font-bold text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-sm font-semibold">
            {errorMsg}
          </div>
        )}

        {/* Upload Cards by Category */}
        <div className="space-y-4 mb-8">
          {verificationCategories.map((cat) => {
            const existing = submissions.find((s) => s.checkType === cat.type);
            const isUploading = uploadingType === cat.type;

            return (
              <div
                key={cat.type}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-bold text-slate-900">{cat.title}</h3>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {cat.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 max-w-lg">{cat.description}</p>
                  {existing && (
                    <p className="text-[11px] text-slate-600 font-semibold pt-1">
                      Submitted document: <span className="text-slate-900">{existing.fileName}</span> (
                      {existing.submittedAt})
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  {existing && (
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-md uppercase ${
                        existing.status === "approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : existing.status === "rejected"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {existing.status}
                    </span>
                  )}

                  <div>
                    <input
                      type="file"
                      id={`file-${cat.type}`}
                      accept="application/pdf,image/jpeg,image/png,image/webp"
                      onChange={(e) => handleUpload(e, cat.type)}
                      disabled={isUploading}
                      className="hidden"
                    />
                    <label
                      htmlFor={`file-${cat.type}`}
                      className="cursor-pointer inline-flex items-center px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-sm transition-colors"
                    >
                      {isUploading
                        ? "Uploading..."
                        : existing
                        ? "Re-upload"
                        : "Upload Document"}
                    </label>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Existing Submissions Audit Table */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
            Submitted Verification Audit Log
          </h2>

          <div className="divide-y divide-slate-100">
            {submissions.map((sub) => (
              <div key={sub.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-slate-800 capitalize">
                    {sub.checkType.replace(/_/g, " ")}
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    File: {sub.fileName} • Date: {sub.submittedAt}
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleDownloadSecurePreview(sub.id)}
                    disabled={previewingId === sub.id}
                    className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold underline"
                  >
                    {previewingId === sub.id ? "Generating Link..." : "Download Preview (Secure)"}
                  </button>
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[11px] uppercase ${
                      sub.status === "approved"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {sub.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
