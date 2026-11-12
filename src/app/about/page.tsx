import Link from "next/link";

export const metadata = {
  title: "About Us — LocalServices.lk",
  description: "Learn about LocalServices.lk, Sri Lanka's independent marketplace for discovering trusted, verified service professionals.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <nav className="mb-6 flex items-center gap-2 text-xs text-zinc-500">
        <Link href="/" className="hover:text-[#0a2540]">Home</Link>
        <span>/</span>
        <span className="text-zinc-900 dark:text-white font-medium">About</span>
      </nav>

      <div className="border-b border-zinc-200/80 pb-6 dark:border-zinc-800">
        <span className="text-xs font-bold uppercase tracking-wider text-[#0f766e] dark:text-sky-400">Our Mission</span>
        <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white">
          Find the right professional. Get the job done with confidence.
        </h1>
      </div>

      <div className="mt-8 space-y-6 text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
        <p>
          LocalServices.lk is built to provide the most useful and trusted way to discover, evaluate, and connect with service professionals in Sri Lanka.
        </p>
        <p>
          For homeowners, finding a capable plumber, electrician, or AC technician in Sri Lanka has historically meant relying on word-of-mouth or sifting through unverified, anonymous classified ads. For honest, skilled trade professionals, establishing a verified reputation and reaching high-intent local customers without paying exorbitant lead fees has been equally difficult.
        </p>

        <h2 className="text-xl font-bold text-zinc-900 dark:text-white pt-4">
          What Sets Us Apart
        </h2>
        <ul className="space-y-3 list-disc pl-5">
          <li>
            <strong>Evidence-Based Verification:</strong> We review real government IDs, Business Registrations, and vocational certifications. We show exactly what documentation was checked.
          </li>
          <li>
            <strong>Town-Level Discovery:</strong> Islandwide coverage across all 25 districts with specific town matching so you find technicians who actually service your area.
          </li>
          <li>
            <strong>Zero Booking Commission:</strong> We never charge percentages on job earnings. Customers and professionals deal directly and transparently.
          </li>
          <li>
            <strong>Authentic Reviews:</strong> Customer feedback is locked strictly to completed platform interactions. No fake reviews, self-ratings, or paid promotion disguised as merit.
          </li>
        </ul>

        <div className="mt-10 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex gap-4">
          <Link
            href="/professionals"
            className="rounded-xl bg-[#0a2540] px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#0c3246] dark:bg-sky-500 dark:text-zinc-950"
          >
            Find Professionals
          </Link>
          <Link
            href="/for-professionals"
            className="rounded-xl border border-zinc-300 px-5 py-2.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200"
          >
            For Professionals
          </Link>
        </div>
      </div>
    </div>
  );
}
