"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Find Professionals", href: "/professionals" },
    { name: "Categories", href: "/services" },
    { name: "Locations", href: "/locations" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "For Professionals", href: "/for-professionals" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-zinc-800 dark:bg-[#0a121e]/95">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 tracking-tight group">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0a2540] text-white shadow-sm transition group-hover:bg-[#0c3246] dark:bg-sky-500 dark:text-zinc-950">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </span>
            <span className="font-extrabold text-lg text-zinc-900 dark:text-white">
              Local<span className="text-[#0f766e] dark:text-sky-400">Services</span>.lk
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-300">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`transition-colors py-1 ${
                    isActive
                      ? "text-[#0a2540] dark:text-sky-400 font-semibold border-b-2 border-[#0a2540] dark:border-sky-400"
                      : "hover:text-[#0a2540] dark:hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Action Items */}
        <div className="flex items-center gap-3">
          {/* Primary CTA: Post a Request */}
          <Link
            href="/post-request"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0a2540] px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:bg-[#0c3246] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0a2540] dark:bg-sky-500 dark:text-zinc-950 dark:hover:bg-sky-400"
          >
            <span>Post a Request</span>
            <span className="text-xs">⚡</span>
          </Link>

          {/* Account Links (Desktop) */}
          <div className="hidden sm:flex items-center gap-2 border-l border-zinc-200 pl-3 dark:border-zinc-800">
            <Link
              href="/provider/dashboard"
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              Pro Portal
            </Link>
            <Link
              href="/sign-in"
              className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-800 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              Sign In
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex lg:hidden items-center justify-center rounded-lg p-2 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 focus:outline-none"
            aria-label="Toggle mobile menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-zinc-200 bg-white px-4 pt-3 pb-6 dark:border-zinc-800 dark:bg-[#0a121e]">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                {link.name}
              </Link>
            ))}
            <div className="border-t border-zinc-200 pt-3 dark:border-zinc-800 flex flex-col gap-2">
              <Link
                href="/post-request"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full rounded-xl bg-[#0a2540] py-2.5 text-center text-sm font-semibold text-white dark:bg-sky-500 dark:text-zinc-950"
              >
                Post a Service Request
              </Link>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/provider/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl border border-zinc-200 py-2 text-center text-xs font-semibold text-zinc-800 dark:border-zinc-700 dark:text-zinc-200"
                >
                  Provider Portal
                </Link>
                <Link
                  href="/sign-in"
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl border border-zinc-200 py-2 text-center text-xs font-semibold text-zinc-800 dark:border-zinc-700 dark:text-zinc-200"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
