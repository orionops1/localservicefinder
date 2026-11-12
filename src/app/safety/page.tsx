import Link from "next/link";
import { VerificationBadge } from "@/components/ui/verification-badge";

export const metadata = {
  title: "Trust, Safety & Verification Standards — LocalServices.lk",
  description: "Learn how LocalServices.lk verifies service professionals, prevents fraud, enforces authentic reviews, and complies with Sri Lanka's Personal Data Protection Act.",
};

const VERIFICATION_LEVELS = [
  {
    type: "phone_confirmed" as const,
    title: "Phone Confirmed",
    whatIsChecked: "The provider's mobile telephone number is directly confirmed before public listing.",
    whatItMeans: "Ensures that customers can reliably reach a real person who answers incoming enquiries.",
    whatItDoesNotMean: "Does not verify identity, business legitimacy, or technical capability.",
  },
  {
    type: "identity_checked" as const,
    title: "Identity Checked",
    whatIsChecked: "The platform staff has reviewed official government-issued photo identification (National Identity Card - NIC, Passport, or Driving Licence).",
    whatItMeans: "Confirms that a real, accountable human being with a verified national identity owns the profile.",
    whatItDoesNotMean: "Does not guarantee workmanship, punctuality, pricing, or future conduct.",
  },
  {
    type: "business_details_checked" as const,
    title: "Business Checked",
    whatIsChecked: "Official Business Registration (BR) certificate from the Divisional Secretariat or Department of Registrar of Companies.",
    whatItMeans: "Confirms that the service operates as a registered sole proprietorship, partnership, or private limited company in Sri Lanka.",
    whatItDoesNotMean: "Does not guarantee company solvency or replace a formal written contract for large projects.",
  },
  {
    type: "qualification_checked" as const,
    title: "Qualification Checked",
    whatIsChecked: "Trade certification, NVQ credentials, Ceylon Electricity Board (CEB) licence, or relevant technical trade diplomas.",
    whatItMeans: "Confirms that the professional has demonstrated formal vocational training or licensing in their trade category.",
    whatItDoesNotMean: "Does not remove the customer's responsibility to confirm specific job requirements and warranty terms.",
  },
  {
    type: "platform_reviewed" as const,
    title: "Platform Reviewed",
    whatIsChecked: "Detailed manual review by marketplace moderators including past job records, portfolio photo checks, and compliance verification.",
    whatItMeans: "Represents an elevated review tier for active service businesses with an established track record.",
    whatItDoesNotMean: "Does not constitute insurance or an unconditional platform warranty.",
  },
];

export default function SafetyPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <span className="text-xs font-bold uppercase tracking-wider text-[#0f766e] dark:text-sky-400">
          Trust & Safety Framework
        </span>
        <h1 className="mt-3 text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          Evidence-Based Trust
        </h1>
        <p className="mt-4 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
          We believe in transparency over generic marketing claims. We do not use one generic &quot;Verified&quot; seal for every check — we display exactly what documentation was checked.
        </p>
      </div>

      {/* Critical Principle Callout */}
      <div className="mb-16 rounded-2xl border-l-4 border-[#0a2540] bg-zinc-50 p-6 dark:border-sky-500 dark:bg-[#0d1726]">
        <h2 className="text-sm font-bold text-zinc-900 dark:text-white">
          Our Core Safety Principle
        </h2>
        <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
          A checked identity verifies that official government documentation was reviewed by our team. It does not mean the platform unconditionally guarantees future workmanship, honesty, or conduct. We empower you to make informed decisions by showing transparent, verified track records and authentic job feedback.
        </p>
      </div>

      {/* 5 Levels of Verification */}
      <div className="space-y-8 mb-20">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white border-b border-zinc-200/80 pb-4 dark:border-zinc-800">
          The 5 Evidence-Based Verification Levels
        </h2>

        <div className="grid grid-cols-1 gap-6">
          {VERIFICATION_LEVELS.map((level) => (
            <div
              key={level.type}
              className="rounded-2xl border border-zinc-200/90 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-[#0d1726]"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-zinc-100 pb-3 dark:border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <VerificationBadge type={level.type} size="md" />
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                    {level.title}
                  </h3>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="font-bold text-zinc-500 uppercase tracking-wider block text-[10px] mb-1">
                    What Was Checked
                  </span>
                  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    {level.whatIsChecked}
                  </p>
                </div>
                <div>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block text-[10px] mb-1">
                    What It Confirms
                  </span>
                  <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                    {level.whatItMeans}
                  </p>
                </div>
                <div>
                  <span className="font-bold text-zinc-400 uppercase tracking-wider block text-[10px] mb-1">
                    What It Does Not Guarantee
                  </span>
                  <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {level.whatItDoesNotMean}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Authentic Reviews Policy */}
      <section className="mb-20 rounded-3xl border border-zinc-200/90 bg-white p-8 sm:p-10 shadow-sm dark:border-zinc-800 dark:bg-[#0d1726]">
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white">
          Authentic Review & Anti-Fraud Policy
        </h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
          <div>
            <h3 className="font-bold text-zinc-900 dark:text-white mb-1.5 text-sm">
              Locked to Completed Platform Jobs
            </h3>
            <p>
              On LocalServices.lk, reviews cannot be submitted anonymously or bought. A customer can only write a review after a real enquiry has progressed through the platform lifecycle to &quot;completed&quot;. Each lead allows exactly one verified review (`UNIQUE(lead_id)`).
            </p>
          </div>
          <div>
            <h3 className="font-bold text-zinc-900 dark:text-white mb-1.5 text-sm">
              Dispute & Moderation Safeguards
            </h3>
            <p>
              Providers have the right to respond publicly to reviews or report fraudulent claims. Platform administrators moderate all disputed reviews through human review to ensure fair, authentic feedback for all parties.
            </p>
          </div>
        </div>
      </section>

      {/* Sri Lanka PDPA Compliance */}
      <section className="mb-20 rounded-3xl bg-zinc-50 p-8 sm:p-10 border border-zinc-200/80 dark:bg-zinc-900/40 dark:border-zinc-800">
        <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
          Personal Data Protection Act (PDPA No. 9 of 2022) Compliance
        </h2>
        <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
          We treat customer and provider privacy with statutory seriousness. Verification documents (NIC, BR, certificates) are stored in secure, private encrypted storage. They are never publicly viewable or shared. Access is restricted to authorized platform reviewers via short-lived, authenticated URLs.
        </p>
        <div className="mt-4">
          <Link
            href="/privacy"
            className="text-xs font-bold text-[#0f766e] dark:text-sky-400 hover:underline"
          >
            Read our complete Privacy Policy &rarr;
          </Link>
        </div>
      </section>

      {/* Report a Provider Box */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-[#0d1726] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
            Encountered suspicious activity or misconduct?
          </h3>
          <p className="text-xs text-zinc-500">
            Our moderation team investigates all reports within 24 hours.
          </p>
        </div>
        <Link
          href="/contact"
          className="rounded-xl border border-zinc-300 px-4 py-2 text-xs font-semibold text-zinc-800 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800 shrink-0"
        >
          Report an Issue
        </Link>
      </div>
    </div>
  );
}
