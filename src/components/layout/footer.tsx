import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2 text-lg font-bold text-zinc-900 dark:text-white">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-700 text-white dark:bg-emerald-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </span>
              <span>LocalServices.lk</span>
            </div>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Sri Lanka&apos;s trusted local service discovery and enquiry platform. Find verified professionals across all 25 districts.
            </p>
            <div className="text-xs text-zinc-500 dark:text-zinc-500">
              Coverage: Western, Southern, Central, Northern, Eastern, North Western, North Central, Uva & Sabaragamuwa.
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Popular Services</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-zinc-600 dark:text-zinc-400">
              <li>
                <Link href="/services/plumbing" className="hover:text-emerald-700 dark:hover:text-emerald-400">
                  Plumbing Services
                </Link>
              </li>
              <li>
                <Link href="/services/electrical" className="hover:text-emerald-700 dark:hover:text-emerald-400">
                  Electrical Work
                </Link>
              </li>
              <li>
                <Link href="/services/ac-repair" className="hover:text-emerald-700 dark:hover:text-emerald-400">
                  AC Repair & Servicing
                </Link>
              </li>
              <li>
                <Link href="/services/cleaning" className="hover:text-emerald-700 dark:hover:text-emerald-400">
                  Home & Office Cleaning
                </Link>
              </li>
              <li>
                <Link href="/services/carpentry" className="hover:text-emerald-700 dark:hover:text-emerald-400">
                  Carpentry & Masonry
                </Link>
              </li>
            </ul>
          </div>

          {/* For Providers */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">For Professionals</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-zinc-600 dark:text-zinc-400">
              <li>
                <Link href="/provider/onboarding" className="hover:text-emerald-700 dark:hover:text-emerald-400">
                  Register as a Provider
                </Link>
              </li>
              <li>
                <Link href="/safety" className="hover:text-emerald-700 dark:hover:text-emerald-400">
                  Verification Standards
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-emerald-700 dark:hover:text-emerald-400">
                  How Enquiries Work
                </Link>
              </li>
              <li>
                <Link href="/provider/dashboard" className="hover:text-emerald-700 dark:hover:text-emerald-400">
                  Provider Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Legal */}
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Trust & Legal</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-zinc-600 dark:text-zinc-400">
              <li>
                <Link href="/privacy" className="hover:text-emerald-700 dark:hover:text-emerald-400">
                  Privacy Notice (PDPA No. 9 of 2022)
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-emerald-700 dark:hover:text-emerald-400">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/safety" className="hover:text-emerald-700 dark:hover:text-emerald-400">
                  Community Safety Guidelines
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-700 dark:hover:text-emerald-400">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-zinc-200 pt-8 dark:border-zinc-800">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              &copy; 2026 LocalServices.lk — All rights reserved. Sri Lanka Local Services Discovery Marketplace.
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-500">
              English • සිංහල • தமிழ்
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
