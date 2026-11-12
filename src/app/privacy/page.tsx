import Link from "next/link";

export const metadata = {
  title: "Privacy Policy (PDPA No. 9 of 2022) — LocalServices.lk",
  description: "Our privacy policy outlining how customer and provider data is collected, processed, and safeguarded in compliance with Sri Lanka's Personal Data Protection Act.",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <nav className="mb-6 flex items-center gap-2 text-xs text-zinc-500">
        <Link href="/" className="hover:text-[#0a2540]">Home</Link>
        <span>/</span>
        <span className="text-zinc-900 dark:text-white font-medium">Privacy</span>
      </nav>

      <div className="border-b border-zinc-200/80 pb-6 dark:border-zinc-800">
        <span className="text-xs font-bold uppercase tracking-wider text-[#0f766e] dark:text-sky-400">
          Sri Lanka Statutory Compliance
        </span>
        <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white">
          Privacy Policy
        </h1>
        <p className="mt-1 text-xs text-zinc-500">
          Last updated: November 2026 • Compliant with Personal Data Protection Act No. 9 of 2022 (PDPA)
        </p>
      </div>

      <div className="mt-8 space-y-6 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
        <section>
          <h2 className="text-base font-bold text-zinc-900 dark:text-white mb-2">
            1. Scope & Lawful Basis for Processing
          </h2>
          <p>
            LocalServices.lk operates as a data controller and data processor under the Sri Lanka Personal Data Protection Act (PDPA No. 9 of 2022). We collect and process personal data solely for facilitating direct connections between customers and verified local service professionals.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-zinc-900 dark:text-white mb-2">
            2. Customer Enquiry Data & Consent
          </h2>
          <p>
            When submitting a service enquiry or posting a request, customers explicitly consent to sharing their contact snapshot (name, phone/WhatsApp, job location) with matching service professionals. This information is never sold, leased, or broadcast to unrelated telemarketers.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-zinc-900 dark:text-white mb-2">
            3. Provider Verification Documents Safeguards
          </h2>
          <p>
            Government-issued identity cards (NIC), passports, and business registration certificates uploaded by providers are stored in encrypted private object storage. These documents are never publicly viewable, indexable by search engines, or accessible to ordinary platform users. Authorized platform reviewers inspect verification evidence through short-lived (5-minute), cryptographically signed URLs.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-zinc-900 dark:text-white mb-2">
            4. Statutory Data Subject Rights
          </h2>
          <p>
            Under Section 13–16 of the Sri Lanka PDPA, you retain the statutory right to request access to your personal data, rectify inaccurate records, withdraw consent, or request complete account erasure. To exercise your rights, please contact our Data Protection Officer at privacy@localservices.lk.
          </p>
        </section>
      </div>
    </div>
  );
}
