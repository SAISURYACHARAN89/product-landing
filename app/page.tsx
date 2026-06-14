"use client";

import { useState, useRef, useEffect } from "react";

const zones = [
  { id: "video", label: "Watching 😎", top: "12%", left: "8%", width: "38%", height: "42%" },
  { id: "work",  label: "Focused 🎯",  top: "12%", left: "52%", width: "40%", height: "42%" },
  { id: "music", label: "Vibing 🎵",  top: "62%", left: "8%",  width: "25%", height: "28%" },
  { id: "chat",  label: "Chatting 💬", top: "62%", left: "38%", width: "25%", height: "28%" },
  { id: "game",  label: "Gaming 🕹️",  top: "62%", left: "68%", width: "24%", height: "28%" },
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
      const t = parseFloat(z.top);
      const l = parseFloat(z.left);
      const w = parseFloat(z.width);
      const h = parseFloat(z.height);
      return xPct >= l && xPct <= l + w && yPct >= t && yPct <= t + h;
    });
    setActiveZone(hit?.id ?? null);
  }

  const activeLabel = zones.find((z) => z.id === activeZone)?.label ?? "Idle 🖱️";

  return (
    <div className="min-h-screen bg-white text-neutral-900" style={{ fontFamily: "var(--font-inter)", cursor: insideDemo ? "none" : "auto" }}>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-16 pt-28 pb-16">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-blue-500 mb-8">Beta</p>
        <h1 className="text-7xl font-semibold tracking-[-0.04em] leading-[1.05] mb-8">
          Your c<span className="text-blue-500">u</span>rs<span className="text-blue-500">u</span>r<br />
          has feelings.
        </h1>
        <p className="text-xl text-neutral-400 font-light max-w-md leading-relaxed mb-12">
          It wears sunglasses while you watch. Sharpens up while you work. 70+ emotions, baked into your OS.
        </p>

        {/* Platform toggle + download */}
        <div className="flex items-center gap-4">
          <div className="inline-flex rounded-full border border-neutral-200 p-1">
            <button
              onClick={() => setPlatform("mac")}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${platform === "mac" ? "bg-neutral-900 text-white" : "text-neutral-500 hover:text-neutral-800"}`}
            >
              Mac
            </button>
            <button
              onClick={() => setPlatform("windows")}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${platform === "windows" ? "bg-neutral-900 text-white" : "text-neutral-500 hover:text-neutral-800"}`}
            >
              Windows
            </button>
          </div>
          <a
            href="#"
            className="rounded-full bg-blue-500 px-8 py-3 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
          >
            Download for {platform === "mac" ? "Mac" : "Windows"} →
          </a>
        </div>
      </section>

      {/* Desktop demo */}
      <section className="max-w-5xl mx-auto px-16 pb-32">
        {/* Screen bezel */}
        <div className="rounded-2xl border border-neutral-200 bg-neutral-100 p-3 shadow-xl shadow-neutral-100">
          {/* Title bar */}
          <div className="flex items-center gap-2 mb-2 px-1">
            <span className="w-3 h-3 rounded-full bg-red-400" />
            <span className="w-3 h-3 rounded-full bg-yellow-400" />
            <span className="w-3 h-3 rounded-full bg-green-400" />
            <span className="ml-auto text-xs text-neutral-400 font-mono">cursur — live demo</span>
          </div>

          {/* Desktop area */}
          <div
            ref={demoRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setInsideDemo(true)}
            onMouseLeave={() => { setInsideDemo(false); setActiveZone(null); }}
            className="relative rounded-xl bg-neutral-50 overflow-hidden select-none"
            style={{ height: 420 }}
          >
            {/* Zone cards */}
            {zones.map((z) => (
              <div
                key={z.id}
                className={`absolute rounded-xl border transition-all duration-150 ${
                  activeZone === z.id
                    ? "border-blue-300 bg-blue-50"
                    : "border-neutral-200 bg-white"
                }`}
                style={{ top: z.top, left: z.left, width: z.width, height: z.height }}
              >
                <div className="p-3">
                  <div className="flex gap-1 mb-2">
                    <span className="w-2 h-2 rounded-full bg-red-300" />
                    <span className="w-2 h-2 rounded-full bg-yellow-300" />
                    <span className="w-2 h-2 rounded-full bg-green-300" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-1.5 bg-neutral-100 rounded-full w-3/4" />
                    <div className="h-1.5 bg-neutral-100 rounded-full w-1/2" />
                    <div className="h-1.5 bg-neutral-100 rounded-full w-2/3" />
                  </div>
                </div>
              </div>
            ))}

            {/* Custom cursor */}
            {insideDemo && (
              <div
                className="pointer-events-none absolute z-50 flex flex-col items-center gap-1"
                style={{ left: cursorPos.x, top: cursorPos.y, transform: "translate(-4px, -4px)" }}
              >
                {/* Arrow cursor shape */}
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M4 2L18 11L11 13L8 20L4 2Z" fill="white" stroke="#111" strokeWidth="1.5" strokeLinejoin="round"/>
                </svg>
                {activeZone && (
                  <span className="mt-1 whitespace-nowrap rounded-full bg-neutral-900 px-2.5 py-1 text-[10px] font-medium text-white shadow-lg">
                    {activeLabel}
                  </span>
                )}
              </div>
            )}

            {/* Hint text when not hovering */}
            {!insideDemo && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-xs text-neutral-300 tracking-wide">Move your cursor inside to try it</p>
              </div>
            )}
          </div>
        </div>

        {/* Caption */}
        <p className="mt-4 text-center text-xs text-neutral-300">
          {insideDemo ? `Cursur is feeling: ${activeLabel}` : "Hover over the screen above"}
        </p>
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
