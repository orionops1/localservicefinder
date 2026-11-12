import Link from "next/link";

export const metadata = {
  title: "Terms of Service — LocalServices.lk",
  description: "Terms and conditions governing the use of LocalServices.lk for customers and service providers in Sri Lanka.",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <nav className="mb-6 flex items-center gap-2 text-xs text-zinc-500">
        <Link href="/" className="hover:text-[#0a2540]">Home</Link>
        <span>/</span>
        <span className="text-zinc-900 dark:text-white font-medium">Terms</span>
      </nav>

      <div className="border-b border-zinc-200/80 pb-6 dark:border-zinc-800">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white">
          Terms of Service
        </h1>
        <p className="mt-1 text-xs text-zinc-500">
          Last updated: November 2026
        </p>
      </div>

      <div className="mt-8 space-y-6 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
        <section>
          <h2 className="text-base font-bold text-zinc-900 dark:text-white mb-2">
            1. Platform Role & Limitations
          </h2>
          <p>
            LocalServices.lk is an online discovery and evaluation marketplace connecting service seekers with independent service providers in Sri Lanka. LocalServices.lk is not an employer, general contractor, or insurer of any service professional listed on the platform.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-zinc-900 dark:text-white mb-2">
            2. Meaning of Verification Badges
          </h2>
          <p>
            Verification badges indicate that official identification or registration documents were reviewed by our compliance team at a specific point in time. Badges do not constitute a performance bond, financial guarantee, or warranty regarding future workmanship. Customers are encouraged to confirm scope, materials, and payment terms in writing prior to commencing work.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-zinc-900 dark:text-white mb-2">
            3. Direct Payments & Independent Contracts
          </h2>
          <p>
            All commercial transactions, service contracts, and payments occur directly between the customer and the service professional. LocalServices.lk charges 0% commission on job values and is not a party to payment processing or physical work execution.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-zinc-900 dark:text-white mb-2">
            4. Review Integrity & Anti-Fraud
          </h2>
          <p>
            Users agree not to submit fraudulent, defamatory, or deceptive reviews. Reviews are tied to platform interactions. LocalServices.lk reserves the right to moderate, flag, or remove reviews that violate content guidelines or are found to be fabricated.
          </p>
        </section>
      </div>
    </div>
  );
}
