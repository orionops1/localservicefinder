import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-zinc-800 dark:bg-zinc-950/95">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-emerald-700 dark:text-emerald-500">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-700 text-white dark:bg-emerald-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </span>
            <span className="font-extrabold text-zinc-900 dark:text-white">
              Local<span className="text-emerald-700 dark:text-emerald-500">Services</span>.lk
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-300">
            <Link href="/services" className="transition-colors hover:text-emerald-700 dark:hover:text-emerald-400">
              Browse Categories
            </Link>
            <Link href="/#districts" className="transition-colors hover:text-emerald-700 dark:hover:text-emerald-400">
              All Districts
            </Link>
            <Link href="/customer/enquiries" className="transition-colors hover:text-emerald-700 dark:hover:text-emerald-400">
              My Requests
            </Link>
            <Link href="/how-it-works" className="transition-colors hover:text-emerald-700 dark:hover:text-emerald-400">
              How It Works
            </Link>
            <Link href="/safety" className="transition-colors hover:text-emerald-700 dark:hover:text-emerald-400">
              Trust & Safety
            </Link>
          </nav>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Language Indicator */}
          <div className="hidden sm:flex items-center text-xs font-semibold text-zinc-500 border border-zinc-200 rounded-md px-2 py-1 dark:border-zinc-800 dark:text-zinc-400">
            <span className="text-emerald-700 dark:text-emerald-400 font-bold">EN</span>
            <span className="mx-1 text-zinc-300 dark:text-zinc-700">|</span>
            <span className="hover:text-zinc-900 dark:hover:text-zinc-200 cursor-pointer">සිං</span>
            <span className="mx-1 text-zinc-300 dark:text-zinc-700">|</span>
            <span className="hover:text-zinc-900 dark:hover:text-zinc-200 cursor-pointer">தமி</span>
          </div>

          <Link
            href="/provider/onboarding"
            className="hidden sm:inline-flex items-center justify-center rounded-lg bg-emerald-50 px-3.5 py-2 text-xs md:text-sm font-semibold text-emerald-800 transition-colors hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300 dark:hover:bg-emerald-900/60"
          >
            List Your Service
          </Link>

          <Link
            href="/provider/dashboard"
            className="hidden lg:inline-flex items-center justify-center rounded-lg border border-zinc-200 px-3.5 py-2 text-xs md:text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
          >
            Provider Portal
          </Link>

          <Link
            href="/sign-in"
            className="inline-flex items-center justify-center rounded-lg bg-emerald-700 px-4 py-2 text-xs md:text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500"
          >
            Sign In
          </Link>
        </div>
      </div>
    </header>
  );
}
