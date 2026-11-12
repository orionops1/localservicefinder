"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CATEGORIES, DISTRICTS, LOCALITIES } from "@/lib/data/seed-data";

function PostRequestForm() {
  const searchParams = useSearchParams();

  const initialCat = searchParams.get("category") || "";
  const initialDist = searchParams.get("district") || "";
  const initialTown = searchParams.get("town") || "";

  // Multi-step State (1: Service, 2: Description, 3: Location, 4: Timeline, 5: Contact & Review)
  const [step, setStep] = useState(1);

  // Form Fields
  const [category, setCategory] = useState(initialCat);
  const [jobTitle, setJobTitle] = useState("");
  const [description, setDescription] = useState("");
  const [district, setDistrict] = useState(initialDist);
  const [town, setTown] = useState(initialTown);
  const [urgency, setUrgency] = useState<"urgent" | "this_week" | "flexible">("this_week");
  const [preferredDate, setPreferredDate] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [contactMethod, setContactMethod] = useState<"whatsapp" | "phone">("whatsapp");

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [requestId, setRequestId] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Town options for selected district
  const selectedDistrictObj = DISTRICTS.find((d) => d.slug === district);
  const availableTowns = selectedDistrictObj
    ? LOCALITIES.filter((l) => l.district_id === selectedDistrictObj.id)
    : [];

  const handleNext = () => {
    setError(null);
    if (step === 1) {
      if (!category) {
        setError("Please select a service category to continue.");
        return;
      }
    } else if (step === 2) {
      if (!description.trim() || description.trim().length < 15) {
        setError("Please provide a description with at least 15 characters so pros can understand your job.");
        return;
      }
    } else if (step === 3) {
      if (!district) {
        setError("Please select your district.");
        return;
      }
    }
    setStep((prev) => Math.min(prev + 1, 5));
  };

  const handleBack = () => {
    setError(null);
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!customerName.trim() || !contactNumber.trim()) {
      setError("Please provide your name and valid contact number.");
      return;
    }

    setSubmitting(true);

    try {
      // Post request to lead engine
      const res = await fetch("/api/v1/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_id: "biz-sample-01", // Marketplace pool
          category_id: category,
          message: `${jobTitle ? `[${jobTitle}] ` : ""}${description}\n\nUrgency: ${urgency} | Location: ${town ? `${town}, ` : ""}${district} | Preferred Contact: ${contactMethod}`,
          customer_name: customerName,
          customer_contact: contactNumber,
          preferred_date: preferredDate || null,
        }),
      });

      if (!res.ok) {
        throw new Error("Unable to submit request. Please try again.");
      }

      const data = await res.json();
      setRequestId(data.lead?.id || `REQ-${Math.floor(100000 + Math.random() * 900000)}`);
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-zinc-200/90 bg-white p-8 text-center shadow-md dark:border-zinc-800 dark:bg-[#0d1726]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-3xl text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
          ✓
        </div>
        <h2 className="mt-5 text-2xl font-extrabold text-zinc-900 dark:text-white">
          Service Request Submitted!
        </h2>
        <p className="mt-2 text-xs font-semibold text-zinc-400">
          Reference Code: <span className="font-mono text-zinc-700 dark:text-zinc-300">{requestId}</span>
        </p>
        <p className="mt-4 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
          Your request has been broadcasted to verified service professionals in {district ? `${district} District` : "your area"}. Suitable professionals will review your requirements and reach out via {contactMethod === "whatsapp" ? "WhatsApp" : "phone"}.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/customer/enquiries"
            className="w-full sm:w-auto rounded-xl bg-[#0a2540] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#0c3246] dark:bg-sky-500 dark:text-zinc-950"
          >
            Track in My Requests
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto rounded-xl border border-zinc-200 px-6 py-2.5 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-semibold text-zinc-500">
          <span>Step {step} of 5</span>
          <span>
            {step === 1 && "Select Service"}
            {step === 2 && "Describe Job"}
            {step === 3 && "Location"}
            {step === 4 && "Timing & Urgency"}
            {step === 5 && "Review & Submit"}
          </span>
        </div>
        <div className="mt-2 h-1.5 w-full rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
          <div
            className="h-full bg-[#0a2540] dark:bg-sky-500 transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Wizard Form Card */}
      <div className="rounded-3xl border border-zinc-200/90 bg-white p-6 sm:p-8 shadow-sm dark:border-zinc-800 dark:bg-[#0d1726]">
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-medium text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </div>
        )}

        {/* STEP 1: SELECT CATEGORY & SERVICE */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                What service do you need?
              </h2>
              <p className="mt-1 text-xs text-zinc-500">
                Choose the category that best matches your job requirements.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {CATEGORIES.map((cat) => {
                const isSelected = category === cat.slug;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.slug)}
                    className={`flex flex-col items-center justify-center rounded-2xl border p-4 text-center transition ${
                      isSelected
                        ? "border-[#0a2540] bg-[#0a2540]/5 font-bold text-[#0a2540] dark:border-sky-400 dark:bg-sky-400/10 dark:text-sky-300"
                        : "border-zinc-200 bg-zinc-50/50 hover:bg-zinc-100/70 dark:border-zinc-800 dark:bg-zinc-900"
                    }`}
                  >
                    <span className="text-2xl mb-1.5">{cat.icon}</span>
                    <span className="text-xs">{cat.name_en}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={handleNext}
                className="rounded-xl bg-[#0a2540] px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#0c3246] dark:bg-sky-500 dark:text-zinc-950"
              >
                Continue &rarr;
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: DESCRIBE WORK */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                Describe the work required
              </h2>
              <p className="mt-1 text-xs text-zinc-500">
                Be specific about problems, room sizes, or requirements so pros can offer accurate estimates.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Brief Job Title (Optional)
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Master bathroom water leak repair, 1.5HP AC gas refill"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-xs text-zinc-900 focus:border-[#0a2540] focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Job Details & Description *
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what needs fixing, installation details, equipment brands, or any special requirements..."
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-xs text-zinc-900 focus:border-[#0a2540] focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
              <span className="text-[10px] text-zinc-400">
                Minimum 15 characters ({description.trim().length} entered)
              </span>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="rounded-xl border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300"
              >
                &larr; Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="rounded-xl bg-[#0a2540] px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#0c3246] dark:bg-sky-500 dark:text-zinc-950"
              >
                Continue &rarr;
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: LOCATION & TOWN */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                Where is the work located?
              </h2>
              <p className="mt-1 text-xs text-zinc-500">
                Match with vetted professionals who cover your specific district and town.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                District *
              </label>
              <select
                value={district}
                onChange={(e) => {
                  setDistrict(e.target.value);
                  setTown("");
                }}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-xs text-zinc-900 focus:border-[#0a2540] focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              >
                <option value="">Select District</option>
                {DISTRICTS.map((d) => (
                  <option key={d.id} value={d.slug}>
                    {d.name_en} District ({d.name_si})
                  </option>
                ))}
              </select>
            </div>

            {district && (
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Town / Locality (Optional)
                </label>
                {availableTowns.length > 0 ? (
                  <select
                    value={town}
                    onChange={(e) => setTown(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-xs text-zinc-900 focus:border-[#0a2540] focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  >
                    <option value="">Select specific town (or leave for all district)</option>
                    {availableTowns.map((t) => (
                      <option key={t.id} value={t.slug}>
                        {t.name_en}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={town}
                    onChange={(e) => setTown(e.target.value)}
                    placeholder="Enter your town or neighborhood"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-xs text-zinc-900 focus:border-[#0a2540] focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                  />
                )}
              </div>
            )}

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="rounded-xl border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300"
              >
                &larr; Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="rounded-xl bg-[#0a2540] px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#0c3246] dark:bg-sky-500 dark:text-zinc-950"
              >
                Continue &rarr;
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: TIMING & URGENCY */}
        {step === 4 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                When do you need this done?
              </h2>
              <p className="mt-1 text-xs text-zinc-500">
                Let professionals know how quickly you need them on site.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { id: "urgent", label: "Urgent / Immediately", icon: "🚨", desc: "Within 24 hours" },
                { id: "this_week", label: "This Week", icon: "📅", desc: "Next 2–5 days" },
                { id: "flexible", label: "Flexible", icon: "⏳", desc: "Planning ahead" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setUrgency(opt.id as "urgent" | "this_week" | "flexible")}
                  className={`rounded-2xl border p-4 text-left transition ${
                    urgency === opt.id
                      ? "border-[#0a2540] bg-[#0a2540]/5 dark:border-sky-400 dark:bg-sky-400/10"
                      : "border-zinc-200 bg-zinc-50/50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900"
                  }`}
                >
                  <div className="text-xl">{opt.icon}</div>
                  <div className="mt-2 text-xs font-bold text-zinc-900 dark:text-white">
                    {opt.label}
                  </div>
                  <div className="text-[10px] text-zinc-500">{opt.desc}</div>
                </button>
              ))}
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Preferred Date (Optional)
              </label>
              <input
                type="date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-xs text-zinc-900 focus:border-[#0a2540] focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="rounded-xl border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300"
              >
                &larr; Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="rounded-xl bg-[#0a2540] px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#0c3246] dark:bg-sky-500 dark:text-zinc-950"
              >
                Continue &rarr;
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: CONTACT & REVIEW */}
        {step === 5 && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                Contact Preferences & Review
              </h2>
              <p className="mt-1 text-xs text-zinc-500">
                Vetted professionals will reach out directly with quotations.
              </p>
            </div>

            {/* Summary Box */}
            <div className="rounded-xl border border-zinc-100 bg-zinc-50/80 p-4 text-xs dark:border-zinc-800 dark:bg-zinc-900/60 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-zinc-400">Category:</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200 capitalize">{category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Location:</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                  {town ? `${town}, ` : ""}{district} District
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Urgency:</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200 capitalize">{urgency.replace("_", " ")}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Kasun Fernando"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-xs text-zinc-900 focus:border-[#0a2540] focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Contact Phone / WhatsApp *
              </label>
              <input
                type="tel"
                required
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="077 123 4567 or +94 77 123 4567"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-xs text-zinc-900 focus:border-[#0a2540] focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Preferred Contact Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setContactMethod("whatsapp")}
                  className={`rounded-xl border p-2.5 text-center text-xs font-semibold transition ${
                    contactMethod === "whatsapp"
                      ? "border-emerald-600 bg-emerald-50 text-emerald-800 dark:border-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                      : "border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                  }`}
                >
                  💬 WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => setContactMethod("phone")}
                  className={`rounded-xl border p-2.5 text-center text-xs font-semibold transition ${
                    contactMethod === "phone"
                      ? "border-[#0a2540] bg-[#0a2540]/10 text-[#0a2540] dark:border-sky-400 dark:bg-sky-400/10 dark:text-sky-300"
                      : "border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                  }`}
                >
                  📞 Direct Phone Call
                </button>
              </div>
            </div>

            <p className="text-[11px] text-zinc-500 leading-relaxed">
              By submitting, you agree to share this enquiry with relevant matching verified professionals in accordance with our Sri Lanka PDPA privacy guidelines. Your details are never sold to third-party telemarketers.
            </p>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={handleBack}
                disabled={submitting}
                className="rounded-xl border border-zinc-200 px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300"
              >
                &larr; Back
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-xl bg-[#0a2540] px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#0c3246] disabled:opacity-50 dark:bg-sky-500 dark:text-zinc-950"
              >
                {submitting ? "Broadcasting Request..." : "Submit Service Request"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function PostRequestPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Post a Service Request
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-zinc-500">
          Describe what you need done and invite vetted local professionals across Sri Lanka to send you quotations.
        </p>
      </div>

      <Suspense fallback={<div className="text-center py-12 text-zinc-400 text-xs">Loading form...</div>}>
        <PostRequestForm />
      </Suspense>
    </div>
  );
}
