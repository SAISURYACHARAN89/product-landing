"use client";

import { useState, useRef } from "react";

const zones = [
  { id: "video", label: "Watching 😎", top: "10%",  left: "6%",  width: "42%", height: "44%" },
  { id: "work",  label: "Focused 🎯",  top: "10%",  left: "53%", width: "41%", height: "44%" },
  { id: "music", label: "Vibing 🎵",   top: "62%",  left: "6%",  width: "26%", height: "28%" },
  { id: "chat",  label: "Chatting 💬", top: "62%",  left: "37%", width: "26%", height: "28%" },
  { id: "game",  label: "Gaming 🕹️",  top: "62%",  left: "68%", width: "26%", height: "28%" },
];

export default function Home() {
  const [platform, setPlatform] = useState<"mac" | "windows">("mac");
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [insideDemo, setInsideDemo] = useState(false);
  const demoRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = demoRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCursorPos({ x, y });
    const xPct = (x / rect.width) * 100;
    const yPct = (y / rect.height) * 100;
    const hit = zones.find((z) => {
      const t = parseFloat(z.top), l = parseFloat(z.left);
      const w = parseFloat(z.width), h = parseFloat(z.height);
      return xPct >= l && xPct <= l + w && yPct >= t && yPct <= t + h;
    });
    setActiveZone(hit?.id ?? null);
  }

  const activeLabel = zones.find((z) => z.id === activeZone)?.label ?? "Idle 🖱️";
  const isMac = platform === "mac";

  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "var(--font-inter)", cursor: insideDemo ? "none" : "auto" }}
    >
      {/* Main layout: hero left, demo right */}
      <div className="min-h-screen flex items-center max-w-[1200px] mx-auto px-16 gap-16">

        {/* Left: Hero */}
        <div className="flex-shrink-0 w-[380px]">
          <h1
            className="text-6xl leading-[1.08] tracking-[-0.01em] text-neutral-900 mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Your c<span className="text-blue-500">u</span>rs<span className="text-blue-500">u</span>r<br />
            has <span className="italic">feelings.</span>
          </h1>
          <p className="text-base text-neutral-400 font-light leading-relaxed mb-10 max-w-xs">
            Sunglasses while you watch. Sharp focus while you work. 70+ emotions, OS-level deep.
          </p>

          {/* Platform switcher */}
          <div className="flex items-center gap-1 rounded-full border border-neutral-200 p-1 w-fit mb-5">
            <button
              onClick={() => setPlatform("mac")}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${isMac ? "bg-neutral-900 text-white shadow-sm" : "text-neutral-400 hover:text-neutral-700"}`}
            >
              Mac
            </button>
            <button
              onClick={() => setPlatform("windows")}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${!isMac ? "bg-neutral-900 text-white shadow-sm" : "text-neutral-400 hover:text-neutral-700"}`}
            >
              Windows
            </button>
          </div>

          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-full bg-blue-500 px-7 py-3 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
          >
            {isMac ? (
              <svg viewBox="0 0 814 1000" className="w-4 h-4 fill-white"><path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.8 135.4-317.7 269-317.7 70.2 0 128.7 46.3 170.7 46.3 40.3 0 107.3-49 185.4-49 29.5 0 108.2 2.6 168.4 74.3zm-234.4-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/></svg>
            ) : (
              <svg viewBox="0 0 88 88" className="w-4 h-4"><path d="M0 12.4l35.7-4.9v34.4H0zm39.9-5.5L87.3 0v41.5H39.9zM0 45.9h35.7v34.4L0 75.5zm39.9.4h47.4v41.3l-47.4-6.6z" fill="white"/></svg>
            )}
            Download for {isMac ? "Mac" : "Windows"}
          </a>

          <p className="mt-4 text-xs text-neutral-300">Free to try · No account needed</p>
        </div>

        {/* Right: Demo screen */}
        <div className="flex-1 flex flex-col">
          {isMac ? (
            /* Mac bezel */
            <div className="rounded-2xl bg-neutral-200 p-3 shadow-2xl shadow-neutral-200/60">
              {/* Mac title bar */}
              <div className="rounded-xl bg-white overflow-hidden border border-neutral-100">
                <div className="flex items-center gap-2 bg-neutral-50 border-b border-neutral-100 px-4 py-3">
                  <span className="w-3 h-3 rounded-full bg-red-400" />
                  <span className="w-3 h-3 rounded-full bg-yellow-400" />
                  <span className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="flex-1 text-center text-xs text-neutral-400 font-mono">cursur demo</span>
                </div>
                {/* Desktop area */}
                <div
                  ref={demoRef}
                  onMouseMove={handleMouseMove}
                  onMouseEnter={() => setInsideDemo(true)}
                  onMouseLeave={() => { setInsideDemo(false); setActiveZone(null); }}
                  className="relative bg-neutral-50 select-none overflow-hidden"
                  style={{ height: 380 }}
                >
                  {zones.map((z) => (
                    <div
                      key={z.id}
                      className={`absolute rounded-xl border transition-all duration-100 ${activeZone === z.id ? "border-blue-200 bg-blue-50/70" : "border-neutral-200 bg-white"}`}
                      style={{ top: z.top, left: z.left, width: z.width, height: z.height }}
                    >
                      <div className="p-3">
                        <div className="flex gap-1 mb-2.5">
                          <span className="w-2 h-2 rounded-full bg-red-300" />
                          <span className="w-2 h-2 rounded-full bg-yellow-300" />
                          <span className="w-2 h-2 rounded-full bg-green-300" />
                        </div>
                        <div className="space-y-2">
                          <div className="h-1.5 bg-neutral-100 rounded-full w-3/4" />
                          <div className="h-1.5 bg-neutral-100 rounded-full w-1/2" />
                        </div>
                      </div>
                    </div>
                  ))}
                  {insideDemo && <CustomCursor x={cursorPos.x} y={cursorPos.y} label={activeZone ? activeLabel : null} />}
                  {!insideDemo && <DemoHint />}
                </div>
              </div>
            </div>
          ) : (
            /* Windows bezel */
            <div className="rounded-lg bg-slate-700 p-3 shadow-2xl shadow-slate-300/40">
              <div className="rounded-sm bg-white overflow-hidden border border-slate-600">
                {/* Windows title bar */}
                <div className="flex items-center bg-slate-800 px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-sm flex items-center justify-center">
                      <svg viewBox="0 0 88 88" className="w-2.5 h-2.5"><path d="M0 12.4l35.7-4.9v34.4H0zm39.9-5.5L87.3 0v41.5H39.9zM0 45.9h35.7v34.4L0 75.5zm39.9.4h47.4v41.3l-47.4-6.6z" fill="white"/></svg>
                    </div>
                    <span className="text-xs text-slate-300 font-mono">cursur demo</span>
                  </div>
                  <div className="ml-auto flex gap-3">
                    <span className="text-slate-400 text-xs hover:text-white cursor-pointer">─</span>
                    <span className="text-slate-400 text-xs hover:text-white cursor-pointer">□</span>
                    <span className="text-slate-400 text-xs hover:text-red-400 cursor-pointer">✕</span>
                  </div>
                </div>
                {/* Desktop area */}
                <div
                  ref={demoRef}
                  onMouseMove={handleMouseMove}
                  onMouseEnter={() => setInsideDemo(true)}
                  onMouseLeave={() => { setInsideDemo(false); setActiveZone(null); }}
                  className="relative bg-slate-100 select-none overflow-hidden"
                  style={{ height: 380 }}
                >
                  {zones.map((z) => (
                    <div
                      key={z.id}
                      className={`absolute border transition-all duration-100 ${activeZone === z.id ? "border-blue-400 bg-blue-50" : "border-slate-200 bg-white"}`}
                      style={{ top: z.top, left: z.left, width: z.width, height: z.height, borderRadius: 4 }}
                    >
                      <div className="p-3">
                        <div className="flex items-center justify-between mb-2.5">
                          <div className="flex gap-1">
                            <div className="w-3 h-3 bg-slate-200 border border-slate-300 rounded-sm" />
                            <div className="w-3 h-3 bg-slate-200 border border-slate-300 rounded-sm" />
                          </div>
                          <div className="w-3 h-3 bg-red-100 border border-red-200 rounded-sm" />
                        </div>
                        <div className="space-y-2">
                          <div className="h-1.5 bg-slate-100 rounded-sm w-3/4" />
                          <div className="h-1.5 bg-slate-100 rounded-sm w-1/2" />
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* Windows taskbar */}
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-slate-800 flex items-center px-4 gap-3">
                    <div className="w-4 h-4 bg-blue-500 rounded-sm flex items-center justify-center">
                      <svg viewBox="0 0 88 88" className="w-2.5 h-2.5"><path d="M0 12.4l35.7-4.9v34.4H0zm39.9-5.5L87.3 0v41.5H39.9zM0 45.9h35.7v34.4L0 75.5zm39.9.4h47.4v41.3l-47.4-6.6z" fill="white"/></svg>
                    </div>
                    <div className="w-5 h-5 bg-slate-600 rounded-sm" />
                    <div className="w-5 h-5 bg-slate-600 rounded-sm" />
                    <div className="ml-auto text-[10px] text-slate-400">12:00</div>
                  </div>
                  {insideDemo && <CustomCursor x={cursorPos.x} y={cursorPos.y} label={activeZone ? activeLabel : null} />}
                  {!insideDemo && <DemoHint />}
                </div>
              </div>
            </div>
          )}
          <p className="mt-3 text-center text-xs text-neutral-300">
            {insideDemo ? `cursur is feeling: ${activeLabel}` : "Hover to try it"}
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-neutral-100 py-6">
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

function CustomCursor({ x, y, label }: { x: number; y: number; label: string | null }) {
  return (
    <div
      className="pointer-events-none absolute z-50"
      style={{ left: x, top: y, transform: "translate(-2px, -2px)" }}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3 2L17 10L10.5 12L8 18L3 2Z" fill="white" stroke="#111" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
      {label && (
        <span className="absolute left-5 top-0 whitespace-nowrap rounded-full bg-neutral-900 px-2.5 py-1 text-[10px] font-medium text-white shadow-lg">
          {label}
        </span>
      )}
    </div>
  );
}

function DemoHint() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <p className="text-xs text-neutral-300 tracking-wide">Move your cursor here to try</p>
    </div>
  );
}
