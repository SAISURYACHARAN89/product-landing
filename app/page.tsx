const moods = [
  { emoji: "😎", label: "Watching" },
  { emoji: "🎯", label: "Focused" },
  { emoji: "😴", label: "Tired" },
  { emoji: "🤩", label: "Excited" },
  { emoji: "😤", label: "Grinding" },
  { emoji: "🧘", label: "Calm" },
  { emoji: "🤔", label: "Thinking" },
  { emoji: "🎉", label: "Celebrating" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-neutral-900" style={{ fontFamily: "var(--font-inter)" }}>

      {/* Floating pill nav */}
      <div className="flex justify-center pt-8 px-6">
        <nav className="inline-flex items-center gap-6 rounded-full border border-neutral-200 px-5 py-2.5 text-sm shadow-sm bg-white">
          <a href="#download" className="text-neutral-400 hover:text-neutral-800 transition-colors">
            Get for Mac
          </a>
          <span className="font-semibold text-neutral-900 tracking-tight">
            c<span className="text-blue-500">ur</span>s<span className="text-blue-500">ur</span>
          </span>
          <a href="#download" className="text-neutral-400 hover:text-neutral-800 transition-colors">
            Get for Windows
          </a>
        </nav>
      </div>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 pt-28 pb-20">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-blue-500 mb-6">
          Now in beta
        </p>
        <h1 className="text-6xl font-semibold tracking-[-0.03em] leading-[1.1] max-w-2xl text-neutral-900">
          Your cursor<br />has feelings.
        </h1>
        <p className="mt-7 text-lg text-neutral-400 font-light max-w-sm leading-relaxed">
          Sunglasses while you watch. Sharp focus while you work. 70+ emotions, OS-level deep.
        </p>
        <div id="download" className="mt-12 flex items-center gap-3">
          <a
            href="#"
            className="inline-flex items-center gap-2.5 rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white hover:bg-neutral-700 transition-colors"
          >
            <svg viewBox="0 0 814 1000" className="w-4 h-4 fill-white" xmlns="http://www.w3.org/2000/svg">
              <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.8 135.4-317.7 269-317.7 70.2 0 128.7 46.3 170.7 46.3 40.3 0 107.3-49 185.4-49 29.5 0 108.2 2.6 168.4 74.3zm-234.4-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/>
            </svg>
            Download for Mac
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-2.5 rounded-full border border-neutral-200 px-6 py-3 text-sm font-medium text-neutral-700 hover:border-neutral-400 transition-colors"
          >
            <svg viewBox="0 0 88 88" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 12.4l35.7-4.9v34.4H0zm39.9-5.5L87.3 0v41.5H39.9zM0 45.9h35.7v34.4L0 75.5zm39.9.4h47.4v41.3l-47.4-6.6z" fill="#00ADEF"/>
            </svg>
            Download for Windows
          </a>
        </div>
        <p className="mt-4 text-xs text-neutral-300">Free to try · No account needed</p>
      </section>

      {/* Mood grid */}
      <section className="mx-auto max-w-2xl px-6 pb-32">
        <div className="grid grid-cols-4 gap-3">
          {moods.map(({ emoji, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 rounded-2xl border border-neutral-100 bg-neutral-50 py-6 hover:border-neutral-300 hover:bg-white transition-all cursor-default"
            >
              <span className="text-2xl">{emoji}</span>
              <span className="text-xs text-neutral-400 font-medium">{label}</span>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-neutral-300">+62 more emotions</p>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-100 py-7">
        <div className="flex justify-center gap-5 text-xs text-neutral-300">
          <a href="#" className="hover:text-neutral-600 transition-colors">Privacy</a>
          <span>·</span>
          <a href="#" className="hover:text-neutral-600 transition-colors">X</a>
          <span>·</span>
          <a href="#" className="hover:text-neutral-600 transition-colors">IG</a>
          <span>·</span>
          <a href="#" className="hover:text-neutral-600 transition-colors">TT</a>
        </div>
      </footer>

    </div>
  );
}
