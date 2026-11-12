"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DISTRICTS, CATEGORIES } from "@/lib/data/seed-data";

export default function ProviderOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    businessType: "sole_proprietor" as "individual" | "sole_proprietor" | "registered_company",
    registrationNumber: "",
    contactEmail: "",
    contactPhone: "",
    whatsappNumber: "",
    addressLine1: "",
    districtId: 1, // Default Colombo
    primaryCategoryId: CATEGORIES[0].id,
    serviceTitle: "",
    pricingType: "starting_at" as "fixed" | "starting_at" | "hourly" | "quote",
    priceMin: 2500,
    selectedDistrictIds: [1] as number[],
  });

  const [uploadedMedia, setUploadedMedia] = useState<{
    key: string;
    publicUrl: string;
    fileName: string;
  } | null>(null);

  const [createdBusinessId, setCreatedBusinessId] = useState<string | null>(null);

  const handleNextStep = async () => {
    setErrorMsg(null);
    if (step === 1) {
      if (!formData.name.trim() || formData.name.length < 2) {
        setErrorMsg("Please enter a valid business or trade name (minimum 2 characters).");
        return;
      }
      if (!formData.description.trim() || formData.description.length < 10) {
        setErrorMsg("Please provide a business description (at least 10 characters).");
        return;
      }
    } else if (step === 2) {
      if (!formData.contactPhone.trim() || formData.contactPhone.length < 9) {
        setErrorMsg("Please enter a valid phone number (e.g. 0771234567).");
        return;
      }
      if (!formData.contactEmail.trim() || !formData.contactEmail.includes("@")) {
        setErrorMsg("Please enter a valid contact email address.");
        return;
      }
    } else if (step === 3) {
      if (!formData.serviceTitle.trim()) {
        setErrorMsg("Please enter the title of your main service offering.");
        return;
      }
    } else if (step === 4) {
      if (formData.selectedDistrictIds.length === 0) {
        setErrorMsg("Please select at least one district where you provide services.");
        return;
      }
    }

    setStep((prev) => Math.min(prev + 1, 6));
  };

  const handleDistrictToggle = (id: number) => {
    setFormData((prev) => {
      const exists = prev.selectedDistrictIds.includes(id);
      if (exists) {
        if (prev.selectedDistrictIds.length === 1) return prev; // Keep at least one
        return { ...prev, selectedDistrictIds: prev.selectedDistrictIds.filter((d) => d !== id) };
      } else {
        return { ...prev, selectedDistrictIds: [...prev.selectedDistrictIds, id] };
      }
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setLoading(true);

    try {
      // 1. Request presigned upload session
      const tempBizId = createdBusinessId || "00000000-0000-0000-0000-000000000001";
      const sessionRes = await fetch("/api/v1/provider/upload/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: tempBizId,
          fileName: file.name,
          fileType: file.type || "image/jpeg",
          fileSizeBytes: file.size,
          purpose: "portfolio",
        }),
      });

      const sessionData = await sessionRes.json();
      if (!sessionRes.ok) {
        throw new Error(sessionData.error || "Failed to initialize upload session.");
      }

      // 2. Direct upload to object storage using presigned URL
      const uploadRes = await fetch(sessionData.uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type || "image/jpeg",
        },
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error(`Upload failed with status ${uploadRes.status}`);
      }

      // 3. Confirm upload
      const confirmRes = await fetch("/api/v1/provider/upload/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: tempBizId,
          objectKey: sessionData.objectKey,
          bucket: sessionData.bucket,
          fileName: file.name,
          fileSizeBytes: file.size,
          fileType: file.type,
          purpose: "portfolio",
        }),
      });

      const confirmData = await confirmRes.json();
      if (!confirmRes.ok) {
        throw new Error(confirmData.error || "Failed to confirm upload.");
      }

      setUploadedMedia({
        key: sessionData.objectKey,
        publicUrl: confirmData.publicUrl || URL.createObjectURL(file),
        fileName: file.name,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload image. Please try again.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSubmit = async () => {
    setErrorMsg(null);
    setLoading(true);

    try {
      // 1. Create Business
      const createRes = await fetch("/api/v1/provider/businesses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          businessType: formData.businessType,
          registrationNumber: formData.registrationNumber || undefined,
          contactEmail: formData.contactEmail,
          contactPhone: formData.contactPhone,
          whatsappNumber: formData.whatsappNumber || undefined,
          addressLine1: formData.addressLine1 || undefined,
          districtId: formData.districtId,
          primaryCategoryId: formData.primaryCategoryId,
          initialServiceTitle: formData.serviceTitle,
          pricingType: formData.pricingType,
          priceMin: formData.priceMin,
          serviceAreaDistrictIds: formData.selectedDistrictIds,
        }),
      });

      const createData = await createRes.json();
      if (!createRes.ok) {
        throw new Error(createData.error || "Failed to save business profile.");
      }

      const bizId = createData.business.id;
      setCreatedBusinessId(bizId);

      // 2. Submit for review
      const submitRes = await fetch(`/api/v1/provider/businesses/${bizId}/submit`, {
        method: "POST",
      });

      const submitData = await submitRes.json();
      if (!submitRes.ok) {
        throw new Error(submitData.error || "Failed to submit for review.");
      }

      router.push(`/provider/dashboard?submitted=true&id=${bizId}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred during submission.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header Breadcrumbs */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Provider Application Wizard
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              List your professional trade or service business on Sri Lanka Local Services Finder.
            </p>
          </div>
          <Link
            href="/services"
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-md border border-emerald-200"
          >
            ← Explore Categories
          </Link>
        </div>

        {/* Wizard Steps Tracker */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-8">
          <div className="grid grid-cols-6 gap-2 text-center text-xs font-medium">
            {[
              { num: 1, title: "Identity" },
              { num: 2, title: "Contact" },
              { num: 3, title: "Services" },
              { num: 4, title: "Coverage" },
              { num: 5, title: "Media" },
              { num: 6, title: "Submit" },
            ].map((s) => (
              <div
                key={s.num}
                className={`py-2 rounded-lg transition-colors ${
                  step === s.num
                    ? "bg-emerald-600 text-white font-bold"
                    : step > s.num
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                <span className="block text-sm font-black">{s.num}</span>
                <span className="hidden sm:inline">{s.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start space-x-2">
            <span className="font-bold">Error:</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Wizard Content Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
          {/* STEP 1: Identity */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Step 1: Business Identity & Overview
              </h2>
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1">
                  Business / Trading Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Galle Precision Electricals"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1">
                  Business Entity Type
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { value: "individual", label: "Individual / Freelancer" },
                    { value: "sole_proprietor", label: "Sole Proprietor" },
                    { value: "registered_company", label: "Registered Company (Pvt Ltd)" },
                  ].map((t) => (
                    <label
                      key={t.value}
                      className={`p-3 border rounded-xl cursor-pointer text-sm font-medium flex items-center space-x-2 ${
                        formData.businessType === t.value
                          ? "border-emerald-600 bg-emerald-50 text-emerald-900"
                          : "border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="businessType"
                        value={t.value}
                        checked={formData.businessType === t.value}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            businessType: e.target.value as "individual" | "sole_proprietor" | "registered_company",
                          })
                        }
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>{t.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {formData.businessType !== "individual" && (
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1">
                    BR Number (Business Registration)
                  </label>
                  <input
                    type="text"
                    value={formData.registrationNumber}
                    onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                    placeholder="e.g. W/12345/PVT"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1">
                  About Your Business & Experience <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your services, years in practice, and craftsmanship standards..."
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Contact Details */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Step 2: Contact Information & Headquarters
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1">
                    Direct Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                    placeholder="077 123 4567"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1">
                    WhatsApp Number (for customer quotes)
                  </label>
                  <input
                    type="tel"
                    value={formData.whatsappNumber}
                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                    placeholder="077 123 4567"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1">
                  Contact Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  placeholder="contact@yourbusiness.lk"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1">
                  Physical Office / Workshop Address
                </label>
                <input
                  type="text"
                  value={formData.addressLine1}
                  onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                  placeholder="Street address or workshop premises"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1">
                  Base District in Sri Lanka
                </label>
                <select
                  value={formData.districtId}
                  onChange={(e) => setFormData({ ...formData, districtId: parseInt(e.target.value, 10) })}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {DISTRICTS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name_en} ({d.name_si})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* STEP 3: Services & Pricing */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Step 3: Primary Service & Pricing
              </h2>
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1">
                  Primary Trade Category
                </label>
                <select
                  value={formData.primaryCategoryId}
                  onChange={(e) => setFormData({ ...formData, primaryCategoryId: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name_en} ({cat.name_si})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1">
                  Featured Service Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.serviceTitle}
                  onChange={(e) => setFormData({ ...formData, serviceTitle: e.target.value })}
                  placeholder="e.g. Residential Wiring, Inverter Backup Setup, AC Inspection"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1">
                    Pricing Model
                  </label>
                  <select
                    value={formData.pricingType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pricingType: e.target.value as "fixed" | "starting_at" | "hourly" | "quote",
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="starting_at">Starting from (Base Rate)</option>
                    <option value="fixed">Fixed Price</option>
                    <option value="hourly">Hourly Rate</option>
                    <option value="quote">Custom Quote / Inspection Required</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-1">
                    Base Rate (LKR)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={formData.priceMin}
                    onChange={(e) =>
                      setFormData({ ...formData, priceMin: parseInt(e.target.value, 10) || 0 })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Coverage Area */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Step 4: Operational Service Areas in Sri Lanka
              </h2>
              <p className="text-sm text-slate-600">
                Select all districts where your team travels for customer jobs:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto p-2 border border-slate-200 rounded-xl bg-slate-50">
                {DISTRICTS.map((d) => {
                  const isChecked = formData.selectedDistrictIds.includes(d.id);
                  return (
                    <button
                      type="button"
                      key={d.id}
                      onClick={() => handleDistrictToggle(d.id)}
                      className={`text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                        isChecked
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <span>{d.name_en}</span>
                      <span>{isChecked ? "✓" : "+"}</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-slate-500">
                Selected: {formData.selectedDistrictIds.length} district(s)
              </p>
            </div>
          )}

          {/* STEP 5: Media Upload */}
          {step === 5 && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Step 5: Portfolio & Workshop Photos
              </h2>
              <p className="text-sm text-slate-600">
                Upload your work photos or workshop banner. High quality images increase customer
                trust and inquiry volume. Files are uploaded directly to secure object storage.
              </p>

              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:border-emerald-500 transition-colors">
                <input
                  type="file"
                  id="portfolio-upload"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileUpload}
                  disabled={loading}
                  className="hidden"
                />
                <label
                  htmlFor="portfolio-upload"
                  className="cursor-pointer inline-flex flex-col items-center"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-2xl mb-2">
                    📁
                  </div>
                  <span className="text-sm font-bold text-emerald-700 hover:underline">
                    {loading ? "Uploading directly to storage..." : "Click to select a photo (JPEG, PNG, WebP)"}
                  </span>
                  <span className="text-xs text-slate-400 mt-1">Maximum file size: 5 MB</span>
                </label>
              </div>

              {uploadedMedia && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">🖼️</span>
                    <div>
                      <p className="text-sm font-bold text-emerald-900">{uploadedMedia.fileName}</p>
                      <p className="text-xs text-emerald-700 truncate max-w-xs">{uploadedMedia.key}</p>
                    </div>
                  </div>
                  <span className="text-xs bg-emerald-600 text-white font-bold px-2.5 py-1 rounded-md">
                    Uploaded
                  </span>
                </div>
              )}
            </div>
          )}

          {/* STEP 6: Review & Submit */}
          {step === 6 && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Step 6: Review Application & Submit
              </h2>
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-3 text-sm">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-medium">Business Name:</span>
                  <span className="font-bold text-slate-900">{formData.name}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-medium">Entity Type:</span>
                  <span className="font-bold text-slate-900 capitalize">
                    {formData.businessType.replace("_", " ")}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-medium">Contact Phone:</span>
                  <span className="font-bold text-slate-900">{formData.contactPhone}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-medium">Featured Service:</span>
                  <span className="font-bold text-slate-900">{formData.serviceTitle}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-medium">Starting Rate:</span>
                  <span className="font-bold text-slate-900">
                    LKR {formData.priceMin.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Coverage Districts:</span>
                  <span className="font-bold text-slate-900">
                    {formData.selectedDistrictIds.length} Districts
                  </span>
                </div>
              </div>

              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 leading-relaxed">
                <p className="font-bold mb-1">Sri Lanka Local Services Finder Standards:</p>
                By submitting this application, you confirm that all provided contact details,
                certifications, and rates are genuine. Profiles undergo human moderation before
                appearing in public customer searches.
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => prev - 1)}
                className="px-5 py-2.5 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                ← Back
              </button>
            ) : (
              <div />
            )}

            {step < 6 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-sm font-bold text-white shadow-sm transition-colors"
              >
                Continue →
              </button>
            ) : (
              <button
                type="button"
                disabled={loading}
                onClick={handleFinalSubmit}
                className="px-7 py-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm shadow-md transition-all disabled:opacity-50"
              >
                {loading ? "Submitting Application..." : "Submit Application for Review"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
