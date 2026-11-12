import Link from "next/link";

export const metadata = {
  title: "Help Centre & FAQs — LocalServices.lk",
  description: "Frequently asked questions for customers and service providers on LocalServices.lk.",
};

const FAQS = [
  {
    q: "Does LocalServices.lk charge a booking fee or commission?",
    a: "No. LocalServices.lk operates with 0% booking commission. You pay the service professional directly for their labor and materials according to your agreed estimate or quotation.",
  },
  {
    q: "How do I know if a professional is trustworthy?",
    a: "Look for evidence-based verification badges on the provider's profile. We verify government National Identity Cards (NIC), Business Registration certificates (BR), and technical trade qualifications. Each badge displays exactly what was checked.",
  },
  {
    q: "What is 'Post a Request'?",
    a: "If you have a complex project or prefer providers to come to you, you can post a service request describing your work, location, and urgency. Matching vetted providers in your area will review your request and send direct quotations.",
  },
  {
    q: "How do customer reviews work?",
    a: "Reviews can only be submitted after a real platform enquiry reaches the 'completed' stage. This prevents fake reviews, self-ratings, or competitor sabotage.",
  },
  {
    q: "I am a tradesperson. How do I get verified?",
    a: "Register your free provider profile, upload your services and travel towns, and submit your identity document (NIC or BR) in the Provider Dashboard verification tab. Our moderation team reviews submissions within 24–48 hours.",
  },
];

export default function HelpPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <nav className="mb-6 flex items-center gap-2 text-xs text-zinc-500">
        <Link href="/" className="hover:text-[#0a2540]">Home</Link>
        <span>/</span>
        <span className="text-zinc-900 dark:text-white font-medium">Help Centre</span>
      </nav>

      <div className="border-b border-zinc-200/80 pb-6 dark:border-zinc-800">
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white">
          Frequently Asked Questions
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-zinc-500">
          Everything you need to know about finding pros, requesting quotes, and listing your services.
        </p>
      </div>

      <div className="mt-8 space-y-6">
        {FAQS.map((faq, i) => (
          <div
            key={i}
            className="rounded-2xl border border-zinc-200/90 bg-white p-6 dark:border-zinc-800 dark:bg-[#0d1726]"
          >
            <h2 className="text-sm font-bold text-zinc-900 dark:text-white">
              {faq.q}
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
              {faq.a}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-2xl bg-zinc-50 p-6 dark:bg-zinc-900/60 text-center">
        <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
          Still have questions?
        </h3>
        <p className="mt-1 text-xs text-zinc-500">
          Our team is available to help you with any inquiries or issues.
        </p>
        <Link
          href="/contact"
          className="mt-4 inline-block rounded-xl bg-[#0a2540] px-5 py-2 text-xs font-bold text-white hover:bg-[#0c3246] dark:bg-sky-500 dark:text-zinc-950"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
}
