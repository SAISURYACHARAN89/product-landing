const emotions = [
  "Happy", "Sad", "Excited", "Calm", "Angry", "Curious",
  "Playful", "Focused", "Tired", "Surprised", "Bored", "Anxious",
  "Joyful", "Melancholy", "Energetic", "Dreamy", "Frustrated",
  "Hopeful", "Silly", "Confident", "Nervous", "Peaceful",
  "Mischievous", "Determined", "Gloomy", "Cheerful", "Nostalgic",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-[#1a1a1a]">

      {/* Nav */}
      <header className="border-b border-slate-200">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-8 py-5">
          <a href="#download" className="text-sm text-slate-500 hover:text-slate-800 transition font-light tracking-wide">
            Get for mac
          </a>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-center">
            Give your c<span className="text-blue-500">ur</span>s<span className="text-blue-500">ur</span> a personality.
          </h1>
          <a href="#download" className="text-sm text-slate-500 hover:text-slate-800 transition font-light tracking-wide">
            Get for windows
          </a>
        </nav>
      </header>

      {/* Main 3-column */}
      <main className="mx-auto max-w-5xl px-8 py-10">
        <div className="grid grid-cols-[200px_1fr_200px] gap-6 items-start">

          {/* Left: Emotions panel — scrollable list */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 h-80 flex flex-col">
            <p className="font-display text-base font-semibold mb-3">70+ emotions</p>
            <div className="emotions-scroll flex-1">
              <ul className="space-y-1.5">
                {emotions.map((e) => (
                  <li
                    key={e}
                    className="text-sm text-slate-600 hover:text-blue-500 cursor-pointer transition leading-snug"
                  >
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Center: Monitor mockup */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            {/* Screen area */}
            <div className="rounded-xl border border-slate-200 bg-white p-3 mb-4">
              <div className="flex gap-3">
                {/* Window 1 */}
                <div className="flex-1 rounded-lg border border-slate-200 bg-white">
                  <div className="flex gap-1.5 px-2.5 py-2 border-b border-slate-100">
                    <span className="w-3 h-3 rounded-full bg-red-400" />
                    <span className="w-3 h-3 rounded-full bg-yellow-400" />
                    <span className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="h-36" />
                </div>
                {/* Window 2 */}
                <div className="w-40 rounded-lg border border-slate-200 bg-white">
                  <div className="flex gap-1.5 px-2.5 py-2 border-b border-slate-100">
                    <span className="w-3 h-3 rounded-full bg-red-400" />
                    <span className="w-3 h-3 rounded-full bg-yellow-400" />
                    <span className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="h-36" />
                </div>
              </div>
              {/* Cursor */}
              <div className="mt-3 ml-1">
                <div className="w-4 h-6 bg-slate-300 rounded-full opacity-70" />
              </div>
            </div>
            {/* Dock */}
            <div className="flex justify-center">
              <div className="flex gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
                {[
                  "bg-slate-400",
                  "bg-slate-500",
                  "bg-green-500",
                  "bg-yellow-400",
                  "bg-red-400",
                  "bg-slate-600",
                  "bg-blue-400",
                ].map((c, i) => (
                  <div key={i} className={`w-9 h-9 rounded-xl ${c}`} />
                ))}
              </div>
            </div>
          </div>

          {/* Right: Settings panel */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 h-80">
            <p className="text-base font-medium mb-5">
              c<span className="text-blue-500">ur</span>s<span className="text-blue-500">ur</span>{" "}
              <span className="font-semibold">settings</span>
            </p>
            <div className="space-y-6">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-widest mb-3">Size</p>
                <div className="relative h-1 bg-slate-200 rounded-full">
                  <div className="absolute w-full h-1 bg-slate-100 rounded-full" />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-blue-500 shadow-md border-2 border-white cursor-pointer"
                    style={{ left: "40%" }}
                  />
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-widest mb-2">Age</p>
                <p className="text-sm">
                  <span className="text-blue-500 font-medium">Aging</span>
                  <span className="text-slate-400"> / stagnant</span>
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Download section */}
        <div id="download" className="mt-24 text-center">
          <div className="flex items-center justify-center gap-4 mb-12">
            <h2 className="font-display text-5xl font-bold tracking-tight">
              Get C<span className="text-blue-500">UR</span>S<span className="text-blue-500">UR</span>.
            </h2>
            {/* Mouse icon */}
            <div className="w-10 h-14 rounded-full border-2 border-slate-300 bg-white relative shadow-sm flex-shrink-0">
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-slate-300 rounded-full" />
            </div>
          </div>

          <div className="flex justify-center gap-24">
            {/* Windows */}
            <div className="flex flex-col items-center gap-5">
              <svg viewBox="0 0 88 88" className="w-16 h-16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 12.402l35.687-4.86.016 34.423-35.67.203zm35.67 33.529l.028 34.453L.028 75.48l-.01-29.72zm4.326-39.025L87.314 0v41.527l-47.318.376zm47.329 39.349l-.016 41.307-47.318-6.672-.066-34.804z" fill="#00ADEF"/>
              </svg>
              <a
                href="#"
                className="rounded-xl bg-blue-500 px-10 py-3 text-sm font-medium text-white hover:bg-blue-600 transition tracking-wide"
              >
                Download
              </a>
            </div>

            {/* Mac */}
            <div className="flex flex-col items-center gap-5">
              <svg viewBox="0 0 814 1000" className="w-14 h-16" fill="#1a1a1a" xmlns="http://www.w3.org/2000/svg">
                <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.8 135.4-317.7 269-317.7 70.2 0 128.7 46.3 170.7 46.3 40.3 0 107.3-49 185.4-49 29.5 0 108.2 2.6 168.4 74.3zm-234.4-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/>
              </svg>
              <a
                href="#"
                className="rounded-xl bg-blue-500 px-10 py-3 text-sm font-medium text-white hover:bg-blue-600 transition tracking-wide"
              >
                Download
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-100 py-6 text-center">
        <div className="flex justify-center gap-3 text-xs text-slate-400">
          <a href="#" className="hover:text-slate-600 transition">Privacy policy</a>
          <span>·</span>
          <a href="#" className="hover:text-slate-600 transition">X</a>
          <span>·</span>
          <a href="#" className="hover:text-slate-600 transition">IG</a>
          <span>·</span>
          <a href="#" className="hover:text-slate-600 transition">TT</a>
        </div>
      </footer>

    </div>
  );
}
