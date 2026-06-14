const emotions = [
  "Happy", "Focused", "Excited", "Calm", "Playful",
  "Tired", "Curious", "Angry", "Dreamy", "Surprised",
  "Bored", "Joyful", "Anxious", "Silly", "Melancholy",
  "Energetic", "Hopeful", "Mischievous", "Confident", "Peaceful",
  "Nervous", "Nostalgic", "Determined", "Gloomy", "Cheerful",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white selection:bg-blue-100">

      {/* Pill Nav */}
      <div className="flex justify-center pt-6 px-4">
        <nav className="flex items-center gap-8 rounded-full border border-neutral-200 bg-white px-6 py-3 shadow-sm">
          <a href="#download" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors whitespace-nowrap">
            Get for Mac
          </a>
          <span className="text-base font-semibold tracking-tight">
            c<span className="text-blue-500">ur</span>s<span className="text-blue-500">ur</span>
          </span>
          <a href="#download" className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors whitespace-nowrap">
            Get for Windows
          </a>
        </nav>
      </div>

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 pt-24 pb-16 text-center">
        <h1 className="text-5xl font-semibold tracking-tight leading-tight text-neutral-900 sm:text-6xl">
          Give your c<span className="text-blue-500">ur</span>s<span className="text-blue-500">ur</span>{" "}
          a personality.
        </h1>
        <p className="mt-6 text-lg text-neutral-400 font-light max-w-xl mx-auto leading-relaxed">
          Your cursor changes with context. Sunglasses while watching. Laser focus while working. 70+ emotions, OS-level deep.
        </p>
      </section>

      {/* Product preview */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="grid grid-cols-[180px_1fr_180px] gap-5 items-stretch">

          {/* Emotions list */}
          <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-5 flex flex-col">
            <p className="text-xs font-medium text-neutral-400 uppercase tracking-widest mb-4">
              70+ emotions
            </p>
            <div className="emotions-scroll flex-1 h-52">
              <ul className="py-4 space-y-2.5">
                {emotions.map((e) => (
                  <li key={e} className="text-sm text-neutral-600 leading-none">
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Desktop mockup */}
          <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-4 flex flex-col gap-3">
            {/* Window row */}
            <div className="flex gap-3 flex-1">
              {/* Large window */}
              <div className="flex-[3] rounded-xl border border-neutral-200 bg-white overflow-hidden">
                <div className="flex items-center gap-1.5 px-3 py-2.5 border-b border-neutral-100">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                </div>
                <div className="h-40 bg-white" />
              </div>
              {/* Small window */}
              <div className="flex-[2] rounded-xl border border-neutral-200 bg-white overflow-hidden">
                <div className="flex items-center gap-1.5 px-3 py-2.5 border-b border-neutral-100">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                </div>
                <div className="h-40 bg-white" />
              </div>
            </div>
            {/* Dock */}
            <div className="flex justify-center">
              <div className="inline-flex gap-2 bg-white border border-neutral-200 rounded-2xl px-4 py-2.5">
                {["bg-neutral-300","bg-neutral-400","bg-green-400","bg-yellow-300","bg-red-400","bg-neutral-500","bg-blue-400"].map((c,i)=>(
                  <div key={i} className={`w-8 h-8 rounded-xl ${c}`} />
                ))}
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-5 flex flex-col gap-6">
            <p className="text-xs font-medium text-neutral-400 uppercase tracking-widest">
              c<span className="text-blue-500">ur</span>s<span className="text-blue-500">ur</span> settings
            </p>
            <div className="space-y-5">
              <div>
                <p className="text-xs text-neutral-400 mb-3">Size</p>
                <div className="relative h-[2px] bg-neutral-200 rounded-full">
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow"
                    style={{ left: "45%" }}
                  />
                </div>
              </div>
              <div>
                <p className="text-xs text-neutral-400 mb-2">Age</p>
                <p className="text-sm">
                  <span className="text-blue-500">Aging</span>
                  <span className="text-neutral-300"> / stagnant</span>
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Download */}
      <section id="download" className="pb-32 text-center px-6">
        <div className="flex items-center justify-center gap-5 mb-14">
          <h2 className="text-5xl font-semibold tracking-tight">
            Get C<span className="text-blue-500">UR</span>S<span className="text-blue-500">UR</span>.
          </h2>
          {/* Mouse glyph */}
          <div className="w-9 h-13 rounded-[999px] border-[1.5px] border-neutral-300 relative flex justify-center pt-2">
            <div className="w-px h-3 bg-neutral-300 rounded-full" />
          </div>
        </div>

        <div className="flex justify-center gap-16">
          {/* Windows */}
          <div className="flex flex-col items-center gap-5">
            <svg viewBox="0 0 88 88" className="w-14 h-14" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 12.4l35.7-4.9v34.4H0zm39.9-5.5L87.3 0v41.5H39.9zM0 45.9h35.7v34.4L0 75.5zm39.9.4h47.4v41.3l-47.4-6.6z" fill="#00ADEF"/>
            </svg>
            <a
              href="#"
              className="rounded-full bg-blue-500 px-8 py-2.5 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
            >
              Download
            </a>
          </div>

          {/* Mac */}
          <div className="flex flex-col items-center gap-5">
            <svg viewBox="0 0 814 1000" className="w-12 h-14" fill="#111" xmlns="http://www.w3.org/2000/svg">
              <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.8 135.4-317.7 269-317.7 70.2 0 128.7 46.3 170.7 46.3 40.3 0 107.3-49 185.4-49 29.5 0 108.2 2.6 168.4 74.3zm-234.4-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/>
            </svg>
            <a
              href="#"
              className="rounded-full bg-blue-500 px-8 py-2.5 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
            >
              Download
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-100 py-6">
        <div className="flex justify-center gap-4 text-xs text-neutral-400">
          <a href="#" className="hover:text-neutral-700 transition-colors">Privacy policy</a>
          <span>·</span>
          <a href="#" className="hover:text-neutral-700 transition-colors">X</a>
          <span>·</span>
          <a href="#" className="hover:text-neutral-700 transition-colors">IG</a>
          <span>·</span>
          <a href="#" className="hover:text-neutral-700 transition-colors">TT</a>
        </div>
      </footer>

    </div>
  );
}
