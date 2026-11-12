import Link from "next/link";

export const metadata = {
  title: "For Service Professionals — Grow Your Business | LocalServices.lk",
  description: "Join Sri Lanka's verified trade and service professional marketplace. Win direct customer enquiries in your towns with zero platform commission.",
};

const BENEFITS = [
  {
    title: "Zero Booking Commission",
    description: "You keep 100% of what you earn from customer jobs. We do not take a percentage cut of your workmanship.",
    icon: "⚡",
  },
  {
    title: "Direct WhatsApp & Phone Contact",
    description: "No middlemen or call center roadblocks. Customers call or message your business directly.",
    icon: "📲",
  },
  {
    title: "Evidence-Based Verification Badges",
    description: "Stand out from unregistered roadside classifieds with official NIC, Business Registration, and Trade Qualification badges.",
    icon: "🛡️",
  },
  {
    title: "Target Your Specific Service Towns",
    description: "Set your exact coverage areas so you only receive customer enquiries where your team is willing to travel.",
    icon: "📍",
  },
  {
    title: "Platform-Confirmed Reviews",
    description: "Build an unassailable online reputation with reviews tied to real completed jobs that cannot be faked by competitors.",
    icon: "⭐",
  },
  {
    title: "Private & Secure Document Handling",
    description: "Your government identity documents are encrypted and reviewed by platform staff — never displayed publicly or sold.",
    icon: "🔒",
  },
];

export default function ForProfessionalsPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <span className="inline-block rounded-full bg-zinc-100 px-3.5 py-1 text-xs font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 mb-4">
          For Technicians, Tradespeople & Businesses in Sri Lanka
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Your skills deserve to be discovered.
        </h1>
        <p className="mt-4 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Create a professional profile, showcase your verified credentials and portfolio, and connect with customers looking for your services across your designated towns.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/provider/onboarding"
            className="w-full sm:w-auto rounded-xl bg-[#0a2540] px-8 py-3.5 text-xs sm:text-sm font-bold text-white shadow-sm hover:bg-[#0c3246] dark:bg-sky-500 dark:text-zinc-950 dark:hover:bg-sky-400"
          >
            Create Free Provider Profile
          </Link>
          <Link
            href="/safety"
            className="w-full sm:w-auto rounded-xl border border-zinc-200 px-6 py-3.5 text-xs sm:text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300"
          >
            Verification Standards
          </Link>
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="border-t border-zinc-200/80 pt-16 dark:border-zinc-800">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Why Professionals Choose LocalServices.lk
          </h2>
          <p className="mt-1 text-xs text-zinc-500">
            We are not a lead-selling scam or a classified clone. We build long-term trust.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((b) => (
            <div
              key={b.title}
              className="rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-[#0d1726]"
            >
              <div className="text-2xl mb-3">{b.icon}</div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                {b.title}
              </h3>
              <p className="mt-2 text-xs text-zinc-600 leading-relaxed dark:text-zinc-400">
                {b.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Box */}
      <div className="mt-20 rounded-3xl bg-[#0a2540] p-8 sm:p-14 text-white text-center">
        <h2 className="text-2xl sm:text-4xl font-extrabold">
          Ready to grow your customer base?
        </h2>
        <p className="mt-3 text-xs sm:text-sm text-zinc-300 max-w-xl mx-auto leading-relaxed">
          It takes less than 5 minutes to set up your profile, list your services, and submit your identity verification. Start receiving genuine customer enquiries in your area today.
        </p>
        <div className="mt-8">
          <Link
            href="/provider/onboarding"
            className="inline-flex rounded-xl bg-white px-8 py-3.5 text-xs sm:text-sm font-bold text-[#0a2540] shadow-sm hover:bg-zinc-100"
          >
            Join as a Professional — Free Forever
          </Link>
        </div>
      </div>
    </div>
  );
}
