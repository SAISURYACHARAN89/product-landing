export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">

      {/* Nav */}
      <header className="border-b border-slate-200">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <a
            href="#download"
            className="text-sm text-slate-600 hover:text-slate-900 transition"
          >
            Get for mac
          </a>
          <h1 className="text-xl font-semibold tracking-tight">
            Give your c<span className="text-blue-500">ur</span>s<span className="text-blue-500">ur</span> a personality.
          </h1>
          <a
            href="#download"
            className="text-sm text-slate-600 hover:text-slate-900 transition"
          >
            Get for windows
          </a>
        </nav>
      </header>

      {/* Main 3-column */}
      <main className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid grid-cols-[220px_1fr_220px] gap-6 items-start">

          {/* Left: Emotions panel */}
          <div className="rounded-xl border border-slate-200 p-5">
            <p className="text-sm font-medium text-slate-700 mb-5">70+ emotions</p>
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="flex-1 h-0.5 bg-slate-200 rounded-full relative">
                    <div
                      className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded bg-blue-500"
                      style={{ right: `${[10, 18, 14, 22, 8, 16][i]}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Center: Monitor mockup */}
          <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
            {/* Monitor screen */}
            <div className="rounded-lg border border-slate-300 bg-white p-3 mb-3">
              <div className="flex gap-3">
                {/* Window 1 */}
                <div className="flex-1 rounded border border-slate-200 bg-white">
                  <div className="flex gap-1 p-2 border-b border-slate-100">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  </div>
                  <div className="h-36" />
                </div>
                {/* Window 2 */}
                <div className="w-44 rounded border border-slate-200 bg-white">
                  <div className="flex gap-1 p-2 border-b border-slate-100">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                  </div>
                  <div className="h-36" />
                </div>
              </div>
              {/* Cursor mascot */}
              <div className="mt-2 text-2xl">🖱️</div>
            </div>
            {/* Dock */}
            <div className="flex justify-center">
              <div className="flex gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2">
                {["bg-slate-400", "bg-slate-500", "bg-green-500", "bg-yellow-400", "bg-red-400", "bg-slate-600", "bg-blue-400"].map((c, i) => (
                  <div key={i} className={`w-8 h-8 rounded-lg ${c} opacity-80`} />
                ))}
              </div>
            </div>
          </div>

          {/* Right: Settings panel */}
          <div className="rounded-xl border border-slate-200 p-5">
            <p className="text-sm font-medium text-slate-700 mb-5">
              c<span className="text-blue-500">ur</span>s<span className="text-blue-500">ur</span> settings
            </p>
            <div className="space-y-5">
              <div>
                <p className="text-xs text-slate-500 mb-2">Size</p>
                <div className="relative h-0.5 bg-slate-200 rounded-full">
                  <div className="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-blue-500 shadow" />
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 mb-1">Age</p>
                <p className="text-sm">
                  <span className="text-blue-500 font-medium">Aging</span>
                  <span className="text-slate-400"> / stagnant</span>
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Download section */}
        <div id="download" className="mt-20 text-center">
          <h2 className="text-5xl font-bold tracking-tight mb-10">
            Get C<span className="text-blue-500">UR</span>S<span className="text-blue-500">UR</span>.{" "}
            <span className="inline-block">🖱️</span>
          </h2>

          <div className="flex justify-center gap-20">
            {/* Windows */}
            <div className="flex flex-col items-center gap-4">
              <svg viewBox="0 0 88 88" className="w-16 h-16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 12.402l35.687-4.86.016 34.423-35.67.203zm35.67 33.529l.028 34.453L.028 75.48l-.01-29.72zm4.326-39.025L87.314 0v41.527l-47.318.376zm47.329 39.349l-.016 41.307-47.318-6.672-.066-34.804z" fill="#00ADEF"/>
              </svg>
              <a
                href="#"
                className="rounded-lg bg-blue-500 px-8 py-2.5 text-sm font-medium text-white hover:bg-blue-600 transition"
              >
                Download
              </a>
            </div>

            {/* Mac */}
            <div className="flex flex-col items-center gap-4">
              <svg viewBox="0 0 814 1000" className="w-14 h-16" fill="#555" xmlns="http://www.w3.org/2000/svg">
                <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.8 135.4-317.7 269-317.7 70.2 0 128.7 46.3 170.7 46.3 40.3 0 107.3-49 185.4-49 29.5 0 108.2 2.6 168.4 74.3zm-234.4-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/>
              </svg>
              <a
                href="#"
                className="rounded-lg bg-blue-500 px-8 py-2.5 text-sm font-medium text-white hover:bg-blue-600 transition"
              >
                Download
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-100 py-6 text-center text-xs text-slate-400">
        <div className="flex justify-center gap-4">
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
