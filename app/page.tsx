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
      className="min-h-screen bg-white flex flex-col"
      style={{ fontFamily: "var(--font-inter)", cursor: insideDemo ? "none" : "auto" }}
    >
      {/* Header */}
      <header className="flex items-center justify-between px-10 py-5">
        <span className="text-base font-semibold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
          c<span className="text-blue-500">u</span>rs<span className="text-blue-500">u</span>r
        </span>
        <div className="flex items-center gap-5 text-sm text-neutral-400">
          <a href="#" className="hover:text-neutral-700 transition-colors">X</a>
          <a href="#" className="hover:text-neutral-700 transition-colors">IG</a>
          <a href="#" className="hover:text-neutral-700 transition-colors">TT</a>
          <a href="#" className="hover:text-neutral-700 transition-colors">Privacy</a>
        </div>
      </header>

      {/* Body — side by side on desktop, stacked on mobile */}
      <main className="flex-1 flex flex-col lg:flex-row items-center gap-10 px-10 py-8 max-w-[1280px] mx-auto w-full">

        {/* Hero */}
        <div className="lg:w-[380px] flex-shrink-0 w-full">
          <h1
            className="text-[52px] leading-[1.08] tracking-[-0.01em] text-neutral-900 mb-5"
            style={{ fontFamily: "var(--font-display)", fontWeight: 400 }}
          >
            Your c<span className="text-blue-500">u</span>rs<span className="text-blue-500">u</span>r<br />
            has <em>feelings.</em>
          </h1>
          <p className="text-[15px] text-neutral-400 font-light leading-relaxed mb-8 max-w-[300px]">
            Sunglasses while you watch. Sharp focus while you work. 70+ emotions, baked into your OS.
          </p>

          {/* Platform toggle */}
          <div className="inline-flex items-center gap-1 rounded-full border border-neutral-200 p-1 mb-4">
            <button
              onClick={() => setPlatform("mac")}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${isMac ? "bg-neutral-900 text-white" : "text-neutral-400 hover:text-neutral-700"}`}
            >
              Mac
            </button>
            <button
              onClick={() => setPlatform("windows")}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${!isMac ? "bg-neutral-900 text-white" : "text-neutral-400 hover:text-neutral-700"}`}
            >
              Windows
            </button>
          </div>

          <br />
          <a
            href="#"
            className="inline-flex items-center gap-2 rounded-full bg-blue-500 px-7 py-3 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
          >
            {isMac ? (
              <svg viewBox="0 0 814 1000" className="w-3.5 h-3.5 fill-white"><path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.8 135.4-317.7 269-317.7 70.2 0 128.7 46.3 170.7 46.3 40.3 0 107.3-49 185.4-49 29.5 0 108.2 2.6 168.4 74.3zm-234.4-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/></svg>
            ) : (
              <svg viewBox="0 0 88 88" className="w-3.5 h-3.5"><path d="M0 12.4l35.7-4.9v34.4H0zm39.9-5.5L87.3 0v41.5H39.9zM0 45.9h35.7v34.4L0 75.5zm39.9.4h47.4v41.3l-47.4-6.6z" fill="white"/></svg>
            )}
            Download for {isMac ? "Mac" : "Windows"}
          </a>
          <p className="mt-3 text-xs text-neutral-300">Free to try · No account needed</p>
        </div>

        {/* Demo screen */}
        <div className="flex-1 w-full">
          {isMac ? (
            <div className="rounded-[20px] bg-gradient-to-b from-neutral-300 to-neutral-200 p-[10px] shadow-2xl shadow-neutral-200/80">
              <div className="rounded-[12px] overflow-hidden border border-neutral-300/50 bg-white">
                <div className="flex items-center gap-2 bg-neutral-100 border-b border-neutral-200 px-4 py-2.5">
                  <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                  <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
                  <span className="w-3 h-3 rounded-full bg-[#28c840]" />
                  <span className="flex-1 text-center text-[11px] text-neutral-400 font-mono">cursur — live demo</span>
                </div>
                <DemoArea ref={demoRef} onMouseMove={handleMouseMove} onEnter={() => setInsideDemo(true)} onLeave={() => { setInsideDemo(false); setActiveZone(null); }} zones={zones} activeZone={activeZone} insideDemo={insideDemo} cursorPos={cursorPos} activeLabel={activeLabel} isWindows={false} />
              </div>
            </div>
          ) : (
            <div className="rounded-[5px] bg-gradient-to-b from-slate-600 to-slate-700 p-[10px] shadow-2xl shadow-slate-300/40">
              <div className="bg-white overflow-hidden rounded-[2px]">
                <div className="flex items-center bg-[#1a1a2e] px-3 py-2">
                  <div className="flex items-center gap-1.5 mr-3">
                    <div className="w-4 h-4 bg-[#0078d4] rounded-sm flex items-center justify-center">
                      <svg viewBox="0 0 88 88" className="w-2.5 h-2.5"><path d="M0 12.4l35.7-4.9v34.4H0zm39.9-5.5L87.3 0v41.5H39.9zM0 45.9h35.7v34.4L0 75.5zm39.9.4h47.4v41.3l-47.4-6.6z" fill="white"/></svg>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">cursur — live demo</span>
                  <div className="ml-auto flex">
                    <span className="px-4 py-1 text-[11px] text-slate-400 hover:bg-slate-700 cursor-default">─</span>
                    <span className="px-4 py-1 text-[11px] text-slate-400 hover:bg-slate-700 cursor-default">□</span>
                    <span className="px-4 py-1 text-[11px] text-slate-400 hover:bg-red-600 hover:text-white cursor-default">✕</span>
                  </div>
                </div>
                <DemoArea ref={demoRef} onMouseMove={handleMouseMove} onEnter={() => setInsideDemo(true)} onLeave={() => { setInsideDemo(false); setActiveZone(null); }} zones={zones} activeZone={activeZone} insideDemo={insideDemo} cursorPos={cursorPos} activeLabel={activeLabel} isWindows={true} />
              </div>
            </div>
          )}
          <p className="mt-3 text-center text-[11px] text-neutral-300">
            {insideDemo ? `cursur is feeling: ${activeLabel}` : "Hover inside to try it"}
          </p>
        </div>
      </main>
    </div>
  );
}

import { forwardRef } from "react";

const DemoArea = forwardRef<HTMLDivElement, {
  onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  onEnter: () => void;
  onLeave: () => void;
  zones: { id: string; label: string; top: string; left: string; width: string; height: string }[];
  activeZone: string | null;
  insideDemo: boolean;
  cursorPos: { x: number; y: number };
  activeLabel: string;
  isWindows: boolean;
}>(function DemoArea({ onMouseMove, onEnter, onLeave, zones, activeZone, insideDemo, cursorPos, activeLabel, isWindows }, ref) {
  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={`relative select-none overflow-hidden ${isWindows ? "bg-[#0a3d6b]" : "bg-neutral-50"}`}
      style={{ height: 360 }}
    >
      {zones.map((z) => (
        <div
          key={z.id}
          className={`absolute border transition-all duration-100 ${
            activeZone === z.id
              ? isWindows ? "border-blue-400 bg-blue-50" : "border-blue-200 bg-blue-50/60"
              : "bg-white " + (isWindows ? "border-slate-200" : "border-neutral-200")
          }`}
          style={{
            top: z.top, left: z.left, width: z.width, height: z.height,
            borderRadius: isWindows ? 2 : 10,
          }}
        >
          <div className="p-2.5">
            {isWindows ? (
              <div className="flex justify-between items-center mb-2">
                <div className="h-1.5 w-10 bg-slate-100 rounded-sm" />
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-slate-200 rounded-sm" />
                  <div className="w-2 h-2 bg-red-200 rounded-sm" />
                </div>
              </div>
            ) : (
              <div className="flex gap-1 mb-2">
                <span className="w-2 h-2 rounded-full bg-red-300" />
                <span className="w-2 h-2 rounded-full bg-yellow-300" />
                <span className="w-2 h-2 rounded-full bg-green-300" />
              </div>
            )}
            <div className="space-y-1.5">
              <div className="h-1.5 rounded-full w-3/4 bg-neutral-100" />
              <div className="h-1.5 rounded-full w-1/2 bg-neutral-100" />
            </div>
          </div>
        </div>
      ))}

      {isWindows && (
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-[#1a1a2e] flex items-center px-3 gap-2">
          <div className="w-5 h-5 bg-[#0078d4] rounded-sm flex items-center justify-center">
            <svg viewBox="0 0 88 88" className="w-3 h-3"><path d="M0 12.4l35.7-4.9v34.4H0zm39.9-5.5L87.3 0v41.5H39.9zM0 45.9h35.7v34.4L0 75.5zm39.9.4h47.4v41.3l-47.4-6.6z" fill="white"/></svg>
          </div>
          <div className="w-5 h-5 bg-slate-700 rounded-sm" />
          <div className="w-5 h-5 bg-slate-700 rounded-sm" />
          <div className="ml-auto text-[10px] text-slate-500">12:00 AM</div>
        </div>
      )}

      {insideDemo && (
        <div className="pointer-events-none absolute z-50" style={{ left: cursorPos.x, top: cursorPos.y, transform: "translate(-2px, -2px)" }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2.5 1.5L15.5 9L9.5 11L7 16.5L2.5 1.5Z" fill="white" stroke="#111" strokeWidth="1.4" strokeLinejoin="round"/>
          </svg>
          {activeZone && (
            <span className="absolute left-5 top-0 whitespace-nowrap rounded-full bg-neutral-900/90 px-2.5 py-1 text-[10px] font-medium text-white shadow-lg backdrop-blur-sm">
              {activeLabel}
            </span>
          )}
        </div>
      )}

      {!insideDemo && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-xs text-neutral-400/60">Move your cursor here to try</p>
        </div>
      )}
    </div>
  );
});
