import Link from "next/link";

const features = [
  {
    title: "Fast to set up",
    desc: "Get up and running in minutes with zero configuration and sensible defaults.",
    icon: "⚡",
  },
  {
    title: "Built to scale",
    desc: "From your first customer to your millionth — performance that keeps up.",
    icon: "📈",
  },
  {
    title: "Secure by default",
    desc: "Best-in-class security and privacy baked into every layer.",
    icon: "🔒",
  },
];

const tiers = [
  {
    name: "Starter",
    price: "$0",
    period: "/mo",
    features: ["Up to 3 projects", "Community support", "Basic analytics"],
    cta: "Get started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/mo",
    features: ["Unlimited projects", "Priority support", "Advanced analytics", "Custom domain"],
    cta: "Start free trial",
    highlighted: true,
  },
  {
    name: "Team",
    price: "$49",
    period: "/mo",
    features: ["Everything in Pro", "Team collaboration", "SSO & roles", "Dedicated SLA"],
    cta: "Contact sales",
    highlighted: false,
  },
];

const faqs: [string, string][] = [
  ["Is there a free plan?", "Yes — the Starter plan is free forever, no credit card needed."],
  ["Can I cancel anytime?", "Absolutely. Upgrade, downgrade, or cancel whenever you like."],
  ["Do you offer refunds?", "If you're not happy in the first 30 days, we'll refund you in full."],
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/80 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-white">P</span>
            Product
          </Link>
          <div className="hidden items-center gap-8 text-sm text-slate-600 sm:flex">
            <a href="#features" className="hover:text-slate-900">Features</a>
            <a href="#pricing" className="hover:text-slate-900">Pricing</a>
            <a href="#faq" className="hover:text-slate-900">FAQ</a>
          </div>
          <a
            href="#pricing"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            Get started
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-indigo-50 to-white" />
        <div className="mx-auto max-w-4xl px-5 py-24 text-center sm:py-32">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
            ✨ Now in public beta
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl">
            The simplest way to
            <span className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
              {" "}ship your product
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
            A one-line description of what your product does and who it&apos;s for. Replace this
            with your real pitch — clear, specific, and benefit-led.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#pricing"
              className="w-full rounded-xl bg-indigo-600 px-6 py-3 text-center font-medium text-white transition hover:bg-indigo-700 sm:w-auto"
            >
              Start for free
            </a>
            <a
              href="#features"
              className="w-full rounded-xl border border-slate-200 px-6 py-3 text-center font-medium text-slate-700 transition hover:bg-slate-50 sm:w-auto"
            >
              See how it works
            </a>
          </div>
          <p className="mt-4 text-xs text-slate-400">No credit card required · Cancel anytime</p>
        </div>
      </section>

      {/* Social proof */}
      <section className="border-y border-slate-100 bg-slate-50/60">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-5 py-8 text-sm font-medium text-slate-400">
          <span>Trusted by teams at</span>
          {["Acme", "Globex", "Initech", "Umbrella", "Hooli"].map((n) => (
            <span key={n} className="text-slate-500">{n}</span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-5 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything you need</h2>
          <p className="mt-4 text-slate-600">
            Swap these three benefits for the things your customers actually care about.
          </p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-slate-100 bg-white p-7 shadow-sm">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-indigo-50 text-xl">{f.icon}</div>
              <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-slate-50/60 py-24">
        <div className="mx-auto max-w-6xl px-5">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Simple, honest pricing</h2>
            <p className="mt-4 text-slate-600">Start free. Upgrade when you&apos;re ready.</p>
          </div>
          <div className="mt-14 grid items-start gap-6 lg:grid-cols-3">
            {tiers.map((t) => (
              <div
                key={t.name}
                className={`rounded-2xl border bg-white p-7 ${
                  t.highlighted ? "border-indigo-600 shadow-lg ring-1 ring-indigo-600" : "border-slate-200 shadow-sm"
                }`}
              >
                {t.highlighted && (
                  <span className="mb-3 inline-block rounded-full bg-indigo-600 px-3 py-1 text-xs font-medium text-white">
                    Most popular
                  </span>
                )}
                <h3 className="text-lg font-semibold">{t.name}</h3>
                <p className="mt-3">
                  <span className="text-4xl font-bold">{t.price}</span>
                  <span className="text-slate-500">{t.period}</span>
                </p>
                <ul className="mt-6 space-y-3 text-sm text-slate-600">
                  {t.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2">
                      <span className="mt-0.5 text-indigo-600">✓</span> {feat}
                    </li>
                  ))}
                </ul>
                <a
                  href="#"
                  className={`mt-7 block rounded-xl px-5 py-3 text-center font-medium transition ${
                    t.highlighted
                      ? "bg-indigo-600 text-white hover:bg-indigo-700"
                      : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {t.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-5 py-24">
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">Questions</h2>
        <div className="mt-12 divide-y divide-slate-100">
          {faqs.map(([q, a]) => (
            <div key={q} className="py-6">
              <h3 className="font-medium">{q}</h3>
              <p className="mt-2 text-sm text-slate-600">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-6xl px-5 pb-24">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-16 text-center text-white">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to get started?</h2>
          <p className="mx-auto mt-4 max-w-xl text-indigo-100">
            Join thousands of teams already shipping faster.
          </p>
          <a
            href="#"
            className="mt-8 inline-block rounded-xl bg-white px-7 py-3 font-medium text-indigo-700 transition hover:bg-indigo-50"
          >
            Start for free
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-10 text-sm text-slate-500 sm:flex-row">
          <span>© {new Date().getFullYear()} Product. All rights reserved.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-900">Privacy</a>
            <a href="#" className="hover:text-slate-900">Terms</a>
            <a href="#" className="hover:text-slate-900">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
