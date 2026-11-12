import Link from "next/link";

export const metadata = {
  title: "Contact Us — LocalServices.lk",
  description: "Get in touch with the LocalServices.lk team for customer support, provider inquiries, or safety concerns.",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <nav className="mb-6 flex items-center gap-2 text-xs text-zinc-500">
        <Link href="/" className="hover:text-[#0a2540]">Home</Link>
        <span>/</span>
        <span className="text-zinc-900 dark:text-white font-medium">Contact</span>
      </nav>

      <div className="border-b border-zinc-200/80 pb-6 dark:border-zinc-800">
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white">
          Contact Us
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-zinc-500">
          Have a question about a provider, your request, or want to partner with us? We are here to help.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-zinc-200/90 bg-white p-6 dark:border-zinc-800 dark:bg-[#0d1726]">
          <div className="text-2xl mb-2">💬</div>
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white">
            WhatsApp Support Desk
          </h2>
          <p className="mt-1 text-xs text-zinc-500 leading-relaxed">
            Fast assistance for customer enquiries and urgent provider onboarding questions.
          </p>
          <a
            href="https://wa.me/94770000000"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
          >
            +94 77 000 0000
          </a>
        </div>

        <div className="rounded-2xl border border-zinc-200/90 bg-white p-6 dark:border-zinc-800 dark:bg-[#0d1726]">
          <div className="text-2xl mb-2">✉️</div>
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white">
            Email Inquiries
          </h2>
          <p className="mt-1 text-xs text-zinc-500 leading-relaxed">
            For trust reports, legal matters, and business partnership requests.
          </p>
          <a
            href="mailto:support@localservices.lk"
            className="mt-4 inline-block font-mono text-xs font-bold text-[#0a2540] dark:text-sky-400 hover:underline"
          >
            support@localservices.lk
          </a>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-zinc-200/90 bg-white p-6 sm:p-8 dark:border-zinc-800 dark:bg-[#0d1726]">
        <h2 className="text-base font-bold text-zinc-900 dark:text-white mb-4">
          Send a Direct Message
        </h2>
        <form className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Your Name
            </label>
            <input
              type="text"
              required
              placeholder="Kasun Perera"
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-xs text-zinc-900 focus:border-[#0a2540] focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Contact Email or Phone
            </label>
            <input
              type="text"
              required
              placeholder="kasun@example.com or 077 123 4567"
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-xs text-zinc-900 focus:border-[#0a2540] focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Message
            </label>
            <textarea
              rows={4}
              required
              placeholder="How can we help you?"
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-xs text-zinc-900 focus:border-[#0a2540] focus:bg-white focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>
          <button
            type="button"
            className="rounded-xl bg-[#0a2540] px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#0c3246] dark:bg-sky-500 dark:text-zinc-950"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
