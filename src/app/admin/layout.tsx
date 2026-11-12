import React from "react";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Admin Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link href="/admin" className="flex items-center space-x-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white font-black text-sm">
                LK
              </span>
              <span className="font-extrabold text-white text-base tracking-tight">
                Marketplace <span className="text-emerald-400 font-black">Admin</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center space-x-1 text-xs font-bold text-slate-300">
              <Link
                href="/admin"
                className="px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition"
              >
                📊 Dashboard
              </Link>
              <Link
                href="/admin/providers"
                className="px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition"
              >
                🏢 Provider Queue
              </Link>
              <Link
                href="/admin/verifications"
                className="px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition"
              >
                🛡️ Verification Queue
              </Link>
              <Link
                href="/admin/audit-logs"
                className="px-3 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition"
              >
                📜 Audit Logs
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-3">
            <span className="hidden sm:inline text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2.5 py-1 rounded-full">
              Super Admin Session
            </span>
            <Link
              href="/"
              className="text-xs font-semibold text-slate-400 hover:text-white transition border border-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-800"
            >
              Public Marketplace ↗
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 bg-slate-950">{children}</main>
    </div>
  );
}
