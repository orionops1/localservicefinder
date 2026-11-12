import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50/80 dark:border-zinc-800 dark:bg-[#070d17]">
      <div className="container mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Brand Column */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0a2540] text-white dark:bg-sky-500 dark:text-zinc-950">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </span>
              <span className="font-extrabold text-base text-zinc-900 dark:text-white">
                Local<span className="text-[#0f766e] dark:text-sky-400">Services</span>.lk
              </span>
            </Link>
            <p className="max-w-sm text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
              A trusted marketplace to discover, evaluate, and connect with service professionals across Sri Lanka. Built on human-verified identities, authentic job reviews, and zero hidden platform fees.
            </p>
            <div className="text-[11px] text-zinc-500 dark:text-zinc-500">
              Sri Lanka: Western, Central, Southern, North Western, Northern, Eastern, North Central, Uva, and Sabaragamuwa.
            </div>
          </div>

          {/* Browse Services */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
              Browse Services
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs text-zinc-600 dark:text-zinc-400">
              <li>
                <Link href="/services/plumbing" className="hover:text-[#0a2540] dark:hover:text-sky-400 transition">
                  Plumbing & Leak Repairs
                </Link>
              </li>
              <li>
                <Link href="/services/electrical" className="hover:text-[#0a2540] dark:hover:text-sky-400 transition">
                  Electrical & Rewiring
                </Link>
              </li>
              <li>
                <Link href="/services/ac-repair" className="hover:text-[#0a2540] dark:hover:text-sky-400 transition">
                  AC Repair & Servicing
                </Link>
              </li>
              <li>
                <Link href="/services/cleaning" className="hover:text-[#0a2540] dark:hover:text-sky-400 transition">
                  Home & Office Cleaning
                </Link>
              </li>
              <li>
                <Link href="/services/carpentry" className="hover:text-[#0a2540] dark:hover:text-sky-400 transition">
                  Carpentry & Woodwork
                </Link>
              </li>
              <li>
                <Link href="/services" className="font-semibold text-[#0f766e] dark:text-sky-400 hover:underline">
                  All Categories &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Discover Locations */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
              Explore Locations
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs text-zinc-600 dark:text-zinc-400">
              <li>
                <Link href="/locations/colombo" className="hover:text-[#0a2540] dark:hover:text-sky-400 transition">
                  Colombo District
                </Link>
              </li>
              <li>
                <Link href="/locations/gampaha" className="hover:text-[#0a2540] dark:hover:text-sky-400 transition">
                  Gampaha & Negombo
                </Link>
              </li>
              <li>
                <Link href="/locations/kandy" className="hover:text-[#0a2540] dark:hover:text-sky-400 transition">
                  Kandy & Central
                </Link>
              </li>
              <li>
                <Link href="/locations/galle" className="hover:text-[#0a2540] dark:hover:text-sky-400 transition">
                  Galle & Southern
                </Link>
              </li>
              <li>
                <Link href="/locations/jaffna" className="hover:text-[#0a2540] dark:hover:text-sky-400 transition">
                  Jaffna & Northern
                </Link>
              </li>
              <li>
                <Link href="/locations" className="font-semibold text-[#0f766e] dark:text-sky-400 hover:underline">
                  All 25 Districts &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* For Professionals & Trust */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
              Trust & Professionals
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs text-zinc-600 dark:text-zinc-400">
              <li>
                <Link href="/for-professionals" className="hover:text-[#0a2540] dark:hover:text-sky-400 transition">
                  For Service Professionals
                </Link>
              </li>
              <li>
                <Link href="/provider/onboarding" className="hover:text-[#0a2540] dark:hover:text-sky-400 transition">
                  Join as a Pro
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-[#0a2540] dark:hover:text-sky-400 transition">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/safety" className="hover:text-[#0a2540] dark:hover:text-sky-400 transition">
                  Trust & Verification Standards
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-[#0a2540] dark:hover:text-sky-400 transition">
                  Privacy Policy (PDPA No. 9 of 2022)
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#0a2540] dark:hover:text-sky-400 transition">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-zinc-200/80 pt-6 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 gap-4">
          <p>© 2026 LocalServices.lk. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:underline">About</Link>
            <Link href="/contact" className="hover:underline">Contact</Link>
            <Link href="/help" className="hover:underline">Help Centre</Link>
            <Link href="/privacy" className="hover:underline">Privacy</Link>
            <Link href="/terms" className="hover:underline">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
