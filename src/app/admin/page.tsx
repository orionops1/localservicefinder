"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { PlatformMetrics, AdminAuditLogRecord } from "@/types/database";

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<PlatformMetrics | null>(null);
  const [recentLogs, setRecentLogs] = useState<AdminAuditLogRecord[]>([]);
  const [pendingProvidersCount, setPendingProvidersCount] = useState(0);
  const [pendingVerificationsCount, setPendingVerificationsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadOverview() {
      try {
        const res = await fetch("/api/v1/admin/overview");
        const data = await res.json();
        if (isMounted) {
          setMetrics(data.metrics);
          setRecentLogs(data.recentAuditLogs || []);
          setPendingProvidersCount(data.pendingProvidersCount || 0);
          setPendingVerificationsCount(data.pendingVerificationsCount || 0);
        }
      } catch (err) {
        console.error("Failed to load admin overview", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadOverview();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Top Banner */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Platform Administration & Moderation</h1>
          <p className="text-xs text-slate-400 mt-1">
            Human review operations, compliance audits, and trust badge issuance across Sri Lanka.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Link
            href="/admin/providers"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition"
          >
            Review Providers ({pendingProvidersCount})
          </Link>
          <Link
            href="/admin/verifications"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs rounded-xl transition"
          >
            Review Verifications ({pendingVerificationsCount})
          </Link>
        </div>
      </div>

      {/* Actionable Alerts */}
      {(pendingProvidersCount > 0 || pendingVerificationsCount > 0) && (
        <div className="mb-8 p-4 bg-amber-950/40 border border-amber-800/80 rounded-2xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="text-xs font-bold text-amber-200">
                Action Required: Moderation Queue Pending
              </p>
              <p className="text-[11px] text-amber-300/80">
                There are {pendingProvidersCount} provider listing applications and{" "}
                {pendingVerificationsCount} compliance documents awaiting verification.
              </p>
            </div>
          </div>
          <Link
            href="/admin/providers"
            className="text-xs font-bold text-amber-400 hover:underline"
          >
            Open Queue →
          </Link>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Total Providers
          </p>
          <p className="text-2xl font-black text-white mt-1">
            {loading ? "..." : metrics?.totalProviders}
          </p>
          <span className="text-[11px] text-emerald-400 font-semibold mt-1 inline-block">
            {metrics?.approvedProviders} Approved & Live
          </span>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Pending Approval
          </p>
          <p className="text-2xl font-black text-amber-400 mt-1">
            {loading ? "..." : metrics?.pendingProviders}
          </p>
          <Link
            href="/admin/providers"
            className="text-[11px] text-slate-400 hover:text-white hover:underline mt-1 inline-block"
          >
            Review queue →
          </Link>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Marketplace Inquiries
          </p>
          <p className="text-2xl font-black text-white mt-1">
            {loading ? "..." : metrics?.totalLeads}
          </p>
          <span className="text-[11px] text-blue-400 font-semibold mt-1 inline-block">
            {metrics?.activeLeads} Active in Progress
          </span>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Districts Active
          </p>
          <p className="text-2xl font-black text-white mt-1">
            {loading ? "..." : metrics?.totalDistrictsCovered} / 25
          </p>
          <span className="text-[11px] text-slate-400 mt-1 inline-block">All 9 Provinces Covered</span>
        </div>
      </div>

      {/* Recent Admin Audit Logs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white">Recent Immutable Audit Activity</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              All administrative approvals, rejections, and badge allocations are logged with actor IDs.
            </p>
          </div>
          <Link
            href="/admin/audit-logs"
            className="text-xs font-bold text-emerald-400 hover:underline"
          >
            View Full Trail →
          </Link>
        </div>

        {recentLogs.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">No audit activity logged yet.</p>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {recentLogs.map((log) => (
              <div key={log.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-200">{log.action.replace(/_/g, " ")}</span>
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                      {log.target_type}
                    </span>
                  </div>
                  {log.reason && <p className="text-slate-400 text-[11px] mt-0.5">{log.reason}</p>}
                </div>
                <div className="text-right">
                  <p className="text-slate-300 text-[11px] font-semibold">{log.actor_name}</p>
                  <span className="text-[10px] text-slate-500">
                    {log.created_at.slice(0, 16).replace("T", " ")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
