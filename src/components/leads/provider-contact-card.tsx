"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProviderDetailView } from "@/types/database";

interface ProviderContactCardProps {
  provider: ProviderDetailView;
}

export function ProviderContactCard({ provider }: ProviderContactCardProps) {
  const [isFavourited, setIsFavourited] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  // Enquiry modal state
  const [isOpen, setIsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedLeadId, setSubmittedLeadId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [selectedServiceId, setSelectedServiceId] = useState(
    provider.services && provider.services.length > 0 ? provider.services[0].id : ""
  );
  const [message, setMessage] = useState("");

  const handleTrackTap = async (channel: "phone" | "whatsapp") => {
    try {
      fetch("/api/v1/analytics/contact-tap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: provider.id,
          channel,
          source: "profile_page",
        }),
      }).catch(() => {});
    } catch {
      // Non-blocking
    }
  };

  const handleToggleFavourite = async () => {
    setFavLoading(true);
    try {
      const res = await fetch("/api/v1/favourites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: "cust-sample-01",
          businessId: provider.id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsFavourited(data.favourited);
      }
    } catch {
      // Fallback
      setIsFavourited(!isFavourited);
    } finally {
      setFavLoading(false);
    }
  };

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/v1/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: "cust-sample-01",
          businessId: provider.id,
          providerServiceId: selectedServiceId || undefined,
          categoryId: "cat-general",
          message,
          customerNameSnapshot: name,
          customerContactSnapshot: phone,
          preferredDate: preferredDate || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send enquiry.");
      }

      setSubmittedLeadId(data.lead.id);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to send enquiry. Please try again.";
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="sticky top-24 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-zinc-900 dark:text-white">
          Contact Provider Directly
        </h2>
        <button
          onClick={handleToggleFavourite}
          disabled={favLoading}
          className={`text-sm px-2.5 py-1 rounded-lg border transition-colors flex items-center space-x-1 ${
            isFavourited
              ? "bg-rose-50 text-rose-600 border-rose-200 font-bold"
              : "text-zinc-500 border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800"
          }`}
          title="Save provider to favourites"
        >
          <span>{isFavourited ? "❤️" : "🤍"}</span>
          <span className="text-xs">{isFavourited ? "Saved" : "Save"}</span>
        </button>
      </div>

      <div className="space-y-3">
        {provider.public_phone && (
          <a
            href={`tel:${provider.public_phone}`}
            onClick={() => handleTrackTap("phone")}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 py-3 text-xs font-semibold text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
          >
            <span>📞 Call:</span>
            <span>{provider.public_phone}</span>
          </a>
        )}

        {provider.public_whatsapp && (
          <a
            href={`https://wa.me/${provider.public_whatsapp.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleTrackTap("whatsapp")}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-semibold text-white transition hover:bg-emerald-700"
          >
            <span>💬 Chat on WhatsApp</span>
          </a>
        )}
      </div>

      {/* Platform Enquiry CTA */}
      <div className="border-t border-zinc-100 pt-5 dark:border-zinc-800">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
          Need a formal quotation?
        </h3>
        <p className="text-xs text-zinc-500 leading-relaxed mb-4">
          Send an official service request through LocalServices.lk to track lead status, inspect quotes, and leave verified reviews.
        </p>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-full rounded-xl border-2 border-emerald-700 bg-emerald-50/50 py-2.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 dark:border-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300 transition-colors"
        >
          📩 Send Service Enquiry
        </button>
      </div>

      {/* Community Safety Reminder */}
      <div className="rounded-xl bg-zinc-50 p-3.5 text-[11px] leading-relaxed text-zinc-500 dark:bg-zinc-950/70 border border-zinc-100 dark:border-zinc-800">
        <strong className="block text-zinc-700 dark:text-zinc-300 mb-1">
          🛡️ Safety Tips for Customers:
        </strong>
        Always confirm the scope and estimated quotation before work begins. Never pay full amounts upfront before physical inspection.
      </div>

      {/* Interactive Enquiry Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-zinc-200 dark:border-zinc-800 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setIsOpen(false);
                setSubmittedLeadId(null);
              }}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 text-lg font-bold"
            >
              ✕
            </button>

            {submittedLeadId ? (
              <div className="py-6 text-center space-y-4">
                <span className="text-4xl">🎉</span>
                <h3 className="text-lg font-black text-zinc-900 dark:text-white">
                  Enquiry Sent Successfully!
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-sm mx-auto">
                  Your request has been delivered to <strong>{provider.name}</strong>. The provider will review your requirements and reach out via phone or WhatsApp.
                </p>
                <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-xs text-zinc-500">
                  Reference Lead ID: <code className="font-bold text-zinc-800 dark:text-zinc-200">{submittedLeadId}</code>
                </div>
                <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                  <Link
                    href="/customer/enquiries"
                    className="px-5 py-2.5 rounded-lg bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition"
                  >
                    View My Enquiries →
                  </Link>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setSubmittedLeadId(null);
                    }}
                    className="px-4 py-2 rounded-lg border border-zinc-300 text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className="space-y-4">
                <div>
                  <h3 className="text-base font-black text-zinc-900 dark:text-white">
                    Send Enquiry to {provider.name}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1">
                    Describe your requirements in detail to receive an accurate estimate.
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-medium">
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nimal Perera"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-xs bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 077 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-xs bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-xs bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                {provider.services && provider.services.length > 0 && (
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                      Service Requested
                    </label>
                    <select
                      value={selectedServiceId}
                      onChange={(e) => setSelectedServiceId(e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-xs bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                      {provider.services.map((svc) => (
                        <option key={svc.id} value={svc.id}>
                          {svc.title} ({svc.pricing_type}: {svc.currency} {svc.price_min?.toLocaleString()})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Job Description & Location *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe the issue, work required, and your neighborhood/town in Sri Lanka..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-xs bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-xs font-semibold text-zinc-600 dark:text-zinc-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg transition-colors disabled:opacity-50"
                  >
                    {submitting ? "Sending Request..." : "Send Free Enquiry"}
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
