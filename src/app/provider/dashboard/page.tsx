"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BusinessRecord, ProviderServiceItem, VerificationSubmissionRecord } from "@/types/database";
import { ProviderServiceAreaRecord, ProviderMediaRecord } from "@/features/provider/provider-service";

function DashboardContent() {
  const searchParams = useSearchParams();
  const submittedJustNow = searchParams.get("submitted") === "true";
  const businessIdParam = searchParams.get("id");

  const [loading, setLoading] = useState(true);
  const [business, setBusiness] = useState<BusinessRecord | null>(null);
  const [services, setServices] = useState<ProviderServiceItem[]>([]);
  const [serviceAreas, setServiceAreas] = useState<ProviderServiceAreaRecord[]>([]);
  const [media, setMedia] = useState<ProviderMediaRecord[]>([]);
  const [verifications, setVerifications] = useState<VerificationSubmissionRecord[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const url = businessIdParam
          ? `/api/v1/provider/businesses?id=${businessIdParam}`
          : `/api/v1/provider/businesses`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.business) {
          setBusiness(data.business);
          setServices(data.services || []);
          setServiceAreas(data.serviceAreas || []);
          setMedia(data.media || []);
          setVerifications(data.verifications || []);
        } else {
          // Default mock business for demonstration
          setBusiness({
            id: "biz-sample-01",
            owner_id: "user-1",
            name: "Lanka Precision Works",
            slug: "lanka-precision-works",
            description: "Experienced residential and commercial mechanical & electrical trade services.",
            business_type: "sole_proprietor",
            contact_email: "support@lankaprecision.lk",
            contact_phone: "0771234567",
            status: submittedJustNow ? "pending_review" : "approved",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
          setServices([
            {
              id: "s1",
              title: "Electrical Inspection & Maintenance",
              pricing_type: "starting_at",
              price_min: 3000,
              currency: "LKR",
            },
          ]);
          setServiceAreas([{ id: "a1", business_id: "biz-sample-01", district_id: 1, radius_km: 25 }]);
        }
      } catch (err) {
        console.error("Failed to load business details", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [businessIdParam, submittedJustNow]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-sm font-semibold text-slate-500 animate-pulse">
          Loading provider portal...
        </p>
      </div>
    );
  }

  const status = business?.status || "draft";

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Top bar with provider details */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <h1 className="text-2xl font-black text-slate-900">{business?.name}</h1>
              <span
                className={`text-xs uppercase font-extrabold px-3 py-1 rounded-full ${
                  status === "approved"
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                    : status === "pending_review"
                    ? "bg-amber-100 text-amber-800 border border-amber-300"
                    : "bg-slate-100 text-slate-700 border border-slate-300"
                }`}
              >
                {status.replace("_", " ")}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Provider ID: <code className="text-slate-700">{business?.id}</code> • Registered:{" "}
              {business?.created_at?.slice(0, 10)}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {business?.slug && (
              <Link
                href={`/providers/${business.slug}`}
                className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                👁️ Preview Public Listing
              </Link>
            )}
            <Link
              href="/provider/profile"
              className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-xs font-bold text-white transition-colors"
            >
              ✏️ Edit Profile
            </Link>
          </div>
        </div>

        {/* Status Callout Banner */}
        {submittedJustNow && (
          <div className="mb-8 p-5 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-start space-x-3">
            <span className="text-2xl">🎉</span>
            <div>
              <h3 className="text-sm font-bold text-emerald-950">
                Application Received Successfully!
              </h3>
              <p className="text-xs text-emerald-800 mt-1">
                Your service listing has been sent to our verification and moderation team in Sri
                Lanka. We verify phone numbers and qualification credentials within 24–48 business
                hours.
              </p>
            </div>
          </div>
        )}

        {status === "pending_review" && !submittedJustNow && (
          <div className="mb-8 p-5 bg-amber-50 border border-amber-300 rounded-2xl flex items-start space-x-3">
            <span className="text-2xl">⏳</span>
            <div>
              <h3 className="text-sm font-bold text-amber-950">Verification in Progress</h3>
              <p className="text-xs text-amber-800 mt-1">
                Your business is currently undergoing moderation. Once approved, your profile and
                services will be discoverable by customers across your designated coverage districts.
              </p>
            </div>
          </div>
        )}

        {status === "approved" && (
          <div className="mb-8 p-5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start space-x-3">
            <span className="text-2xl">✅</span>
            <div>
              <h3 className="text-sm font-bold text-emerald-950">Active Public Listing</h3>
              <p className="text-xs text-emerald-800 mt-1">
                Your profile is live. Customer inquiry leads and direct contact taps will appear in
                your inbox as prospective clients reach out.
              </p>
            </div>
          </div>
        )}

        {/* Dashboard Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Services</p>
            <p className="text-2xl font-black text-slate-900 mt-2">{services.length}</p>
            <Link
              href="/provider/services"
              className="text-xs text-emerald-700 font-semibold hover:underline mt-2 inline-block"
            >
              Manage catalog →
            </Link>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Coverage</p>
            <p className="text-2xl font-black text-slate-900 mt-2">
              {serviceAreas.length} {serviceAreas.length === 1 ? "District" : "Districts"}
            </p>
            <Link
              href="/provider/service-areas"
              className="text-xs text-emerald-700 font-semibold hover:underline mt-2 inline-block"
            >
              Edit districts →
            </Link>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Portfolio</p>
            <p className="text-2xl font-black text-slate-900 mt-2">{media.length} Photos</p>
            <Link
              href="/provider/onboarding"
              className="text-xs text-emerald-700 font-semibold hover:underline mt-2 inline-block"
            >
              Upload photos →
            </Link>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Verification</p>
            <p className="text-2xl font-black text-slate-900 mt-2">
              {verifications.length > 0 ? "Uploaded" : "Pending"}
            </p>
            <Link
              href="/provider/verification"
              className="text-xs text-emerald-700 font-semibold hover:underline mt-2 inline-block"
            >
              Verify documents →
            </Link>
          </div>
        </div>

        {/* Quick Management Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Services Overview */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Your Services</h2>
              <Link
                href="/provider/services"
                className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200"
              >
                + Add Service
              </Link>
            </div>
            {services.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No services listed yet.</p>
            ) : (
              <div className="space-y-3">
                {services.map((svc) => (
                  <div
                    key={svc.id}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-800">{svc.title}</p>
                      <p className="text-slate-500 capitalize">{svc.pricing_type.replace("_", " ")}</p>
                    </div>
                    {svc.price_min && (
                      <span className="font-extrabold text-emerald-800">
                        {svc.currency} {svc.price_min.toLocaleString()}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Verification Badges Status */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Trust & Verification</h2>
              <Link
                href="/provider/verification"
                className="text-xs font-bold text-emerald-700 hover:underline"
              >
                Upload Documents →
              </Link>
            </div>
            <div className="space-y-3">
              {[
                {
                  title: "Phone Number Verified",
                  desc: "Confirmed via OTP to Sri Lankan telecom networks",
                  badge: "Active",
                  active: true,
                },
                {
                  title: "National Identity / Passport",
                  desc: "Private identity check verified by local moderation",
                  badge: verifications.length > 0 ? "Under Review" : "Not Submitted",
                  active: verifications.length > 0,
                },
                {
                  title: "Business Registration (BR)",
                  desc: "Government divisional secretariat registration",
                  badge: business?.registration_number ? "Provided" : "Optional",
                  active: !!business?.registration_number,
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-slate-800">{item.title}</p>
                    <p className="text-slate-500 text-[11px]">{item.desc}</p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-md font-bold text-[11px] ${
                      item.active
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {item.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProviderDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <p className="text-sm font-semibold text-slate-500 animate-pulse">
            Loading provider dashboard...
          </p>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
