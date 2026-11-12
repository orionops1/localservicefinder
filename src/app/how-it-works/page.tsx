import Link from "next/link";

export const metadata = {
  title: "How It Works — LocalServices.lk",
  description: "Learn how LocalServices.lk helps homeowners and businesses connect with trusted, verified trade professionals across Sri Lanka.",
};

export default function HowItWorksPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs font-bold uppercase tracking-wider text-[#0f766e] dark:text-sky-400">
          Clear & Transparent Marketplace
        </span>
        <h1 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          How LocalServices.lk Works
        </h1>
        <p className="mt-4 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Whether you need emergency plumbing repairs or are growing a trade business, here is how our trust-first marketplace operates.
        </p>
      </div>

      {/* For Customers Journey */}
      <section className="mb-20">
        <div className="border-b border-zinc-200/80 pb-4 dark:border-zinc-800 mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Customer Experience</span>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
            For Homeowners & Businesses
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200/90 bg-white p-7 shadow-sm dark:border-zinc-800 dark:bg-[#0d1726]">
            <div className="text-3xl mb-4">🔍</div>
            <div className="text-xs font-bold text-[#0a2540] dark:text-sky-400 mb-1">Step 01</div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
              Discover & Compare Vetted Pros
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
              Browse professionals by service category and town across all 25 districts. Check human-reviewed government identity (NIC), business registration (BR), and qualification badges.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200/90 bg-white p-7 shadow-sm dark:border-zinc-800 dark:bg-[#0d1726]">
            <div className="text-3xl mb-4">💬</div>
            <div className="text-xs font-bold text-[#0a2540] dark:text-sky-400 mb-1">Step 02</div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
              Connect Directly or Post a Request
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
              Reach out to a provider directly via WhatsApp or phone. If you have a custom or complex project, use &quot;Post a Request&quot; and let matching local pros send you quotations.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200/90 bg-white p-7 shadow-sm dark:border-zinc-800 dark:bg-[#0d1726]">
            <div className="text-3xl mb-4">⭐</div>
            <div className="text-xs font-bold text-[#0a2540] dark:text-sky-400 mb-1">Step 03</div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
              Get It Done & Leave Verified Feedback
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
              Pay the professional directly with zero platform commission. Once the job is completed, leave an authentic rating locked directly to your platform request.
            </p>
          </div>
        </div>
      </section>

      {/* For Providers Journey */}
      <section className="mb-20">
        <div className="border-b border-zinc-200/80 pb-4 dark:border-zinc-800 mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Provider Experience</span>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
            For Service Professionals & Companies
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200/90 bg-white p-7 shadow-sm dark:border-zinc-800 dark:bg-[#0d1726]">
            <div className="text-3xl mb-4">📋</div>
            <div className="text-xs font-bold text-[#0f766e] dark:text-sky-400 mb-1">Step 01</div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
              Create Profile & Set Coverage
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
              List your services, pricing baseline, and designated travel towns. Submit verification documents (NIC / BR / Trade Cert) to earn trust badges.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200/90 bg-white p-7 shadow-sm dark:border-zinc-800 dark:bg-[#0d1726]">
            <div className="text-3xl mb-4">📲</div>
            <div className="text-xs font-bold text-[#0f766e] dark:text-sky-400 mb-1">Step 02</div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
              Receive Enquiries & Send Quotes
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
              Receive notifications for customer enquiries in your service towns. Review job descriptions, photos, and send clear estimates or fixed quotes.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200/90 bg-white p-7 shadow-sm dark:border-zinc-800 dark:bg-[#0d1726]">
            <div className="text-3xl mb-4">🏆</div>
            <div className="text-xs font-bold text-[#0f766e] dark:text-sky-400 mb-1">Step 03</div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
              Build Verified Reputation
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
              Deliver quality work, keep 100% of your earnings (0% commission), and accumulate platform-confirmed reviews that rank you higher organically.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <div className="rounded-3xl bg-[#0a2540] p-8 sm:p-12 text-white text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold">
          Ready to get started?
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-zinc-300 max-w-xl mx-auto">
          Whether you need a job done or want to offer your trade services, join thousands of Sri Lankans on LocalServices.lk today.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/post-request"
            className="rounded-xl bg-white px-6 py-3 text-xs font-bold text-[#0a2540] shadow-sm hover:bg-zinc-100"
          >
            Post a Service Request
          </Link>
          <Link
            href="/provider/onboarding"
            className="rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-xs font-bold text-white hover:bg-white/10"
          >
            Register as a Provider
          </Link>
        </div>
      </div>
    </div>
  );
}
