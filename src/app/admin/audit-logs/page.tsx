"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AdminAuditLogRecord } from "@/types/database";

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AdminAuditLogRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const loadLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/v1/admin/audit-logs?limit=100");
      const data = await res.json();
      if (data.logs) {
        setLogs(data.logs);
      }
    } catch (err) {
      console.error("Failed to load audit logs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    async function fetchLogs() {
      try {
        const res = await fetch("/api/v1/admin/audit-logs?limit=100");
        const data = await res.json();
        if (isMounted && data.logs) {
          setLogs(data.logs);
        }
      } catch (err) {
        console.error("Failed to load audit logs", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchLogs();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredLogs = logs.filter((l) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      l.action.toLowerCase().includes(term) ||
      l.target_type.toLowerCase().includes(term) ||
      (l.reason && l.reason.toLowerCase().includes(term)) ||
      (l.actor_name && l.actor_name.toLowerCase().includes(term))
    );
  });

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Administrative Audit Trail</h1>
          <p className="text-xs text-slate-400 mt-1">
            Immutable system logs recording all human moderation actions, provider status changes, and badge allocations.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={loadLogs}
            className="px-3.5 py-1.5 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition"
          >
            Refresh Logs
          </button>
          <Link
            href="/admin"
            className="text-xs font-bold text-slate-400 hover:text-white border border-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-800"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Search Filter */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Filter audit logs by action, target type, actor, or reason..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-96 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
        />
      </div>

      {/* Audit Log Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500 animate-pulse">
            Loading audit records...
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            No audit records found matching your filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3.5">Timestamp</th>
                  <th className="px-6 py-3.5">Action</th>
                  <th className="px-6 py-3.5">Target</th>
                  <th className="px-6 py-3.5">Staff Actor</th>
                  <th className="px-6 py-3.5">Notes / Decision Context</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-slate-400 text-[11px]">
                      {log.created_at.slice(0, 19).replace("T", " ")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`font-extrabold px-2 py-0.5 rounded text-[10px] uppercase ${
                          log.action.includes("approve")
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                            : log.action.includes("reject")
                            ? "bg-rose-950 text-rose-400 border border-rose-800"
                            : "bg-blue-950 text-blue-400 border border-blue-800"
                        }`}
                      >
                        {log.action.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-200 capitalize">
                          {log.target_type}
                        </span>
                        <code className="text-[10px] text-slate-500">{log.target_id.slice(0, 8)}...</code>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-300 font-medium">
                      {log.actor_name || log.actor_id.slice(0, 8)}
                    </td>
                    <td className="px-6 py-4 text-slate-400 max-w-md">
                      <p className="line-clamp-2">{log.reason || "Administrative record updated."}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
