"use client";

import { useState, useRef, forwardRef } from "react";

const zones = [
  { id: "video", label: "Watching 😎", top: "10%",  left: "5%",  width: "42%", height: "44%" },
  { id: "work",  label: "Focused 🎯",  top: "10%",  left: "53%", width: "42%", height: "44%" },
  { id: "music", label: "Vibing 🎵",   top: "62%",  left: "5%",  width: "27%", height: "28%" },
  { id: "chat",  label: "Chatting 💬", top: "62%",  left: "37%", width: "27%", height: "28%" },
  { id: "game",  label: "Gaming 🕹️",  top: "62%",  left: "69%", width: "26%", height: "28%" },
];

export default function Home() {
  const [platform, setPlatform] = useState<"mac" | "windows">("mac");
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [inside, setInside] = useState(false);
  const demoRef = useRef<HTMLDivElement>(null);
  const isMac = platform === "mac";

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = demoRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCursorPos({ x, y });
    const xp = (x / rect.width) * 100;
    const yp = (y / rect.height) * 100;
    const hit = zones.find(z => xp >= parseFloat(z.left) && xp <= parseFloat(z.left) + parseFloat(z.width) && yp >= parseFloat(z.top) && yp <= parseFloat(z.top) + parseFloat(z.height));
    setActiveZone(hit?.id ?? null);
  }

  const activeLabel = zones.find(z => z.id === activeZone)?.label ?? "Idle 🖱️";

  return (
    <div className="min-h-screen bg-white flex flex-col" style={{ cursor: inside ? "none" : "auto" }}>

      {/* Nav — Apple-style frosted rectangular bar */}
      <div className="px-6 pt-4">
        <nav className="mx-auto max-w-[1100px] flex items-center justify-between px-6 py-3 rounded-2xl border border-neutral-200/80 bg-white/80 backdrop-blur-xl shadow-sm">
          <span className="text-[15px] font-bold tracking-tight text-neutral-900">
            c<span className="text-blue-500">u</span>rs<span className="text-blue-500">u</span>r
          </span>
          <div className="flex items-center gap-6 text-[13px] text-neutral-400 font-medium">
            <a href="#" className="hover:text-neutral-800 transition-colors">X</a>
            <a href="#" className="hover:text-neutral-800 transition-colors">Instagram</a>
            <a href="#" className="hover:text-neutral-800 transition-colors">TikTok</a>
            <a href="#" className="hover:text-neutral-800 transition-colors">Privacy</a>
          </div>
        </nav>
      </div>

      {/* Main — tight two-column */}
      <main className="flex-1 flex flex-col lg:flex-row items-center gap-8 max-w-[1100px] mx-auto w-full px-6 pt-10 pb-10">

        {/* Left: Hero */}
        <div className="lg:w-[400px] flex-shrink-0 w-full">
          <h1 className="text-[56px] font-extrabold leading-[1.05] tracking-[-0.03em] text-neutral-950 mb-4">
            Your c<span className="text-blue-500">u</span>rs<span className="text-blue-500">u</span>r<br />
            <span className="text-neutral-400 font-light italic" style={{ fontStyle: "italic" }}>has feelings.</span>
          </h1>

          <p className="text-[15px] text-neutral-400 leading-relaxed mb-8 max-w-[300px] font-normal">
            It wears sunglasses while you watch. Sharpens up while you work. 70+ emotions, OS-level deep.
          </p>

          {/* Platform switcher — Apple rounded-rect style */}
          <div className="inline-flex rounded-xl border border-neutral-200 bg-neutral-50 p-1 mb-5 gap-1">
            <button
              onClick={() => setPlatform("mac")}
              className={`flex items-center gap-2 rounded-[10px] px-5 py-2 text-[13px] font-semibold transition-all ${isMac ? "bg-white text-neutral-900 shadow-sm border border-neutral-200/80" : "text-neutral-400 hover:text-neutral-600"}`}
            >
              <svg viewBox="0 0 814 1000" className={`w-3.5 h-3.5 ${isMac ? "fill-neutral-800" : "fill-neutral-400"}`}><path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.8 135.4-317.7 269-317.7 70.2 0 128.7 46.3 170.7 46.3 40.3 0 107.3-49 185.4-49 29.5 0 108.2 2.6 168.4 74.3zm-234.4-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/></svg>
              Mac
            </button>
            <button
              onClick={() => setPlatform("windows")}
              className={`flex items-center gap-2 rounded-[10px] px-5 py-2 text-[13px] font-semibold transition-all ${!isMac ? "bg-white text-neutral-900 shadow-sm border border-neutral-200/80" : "text-neutral-400 hover:text-neutral-600"}`}
            >
              <svg viewBox="0 0 88 88" className="w-3.5 h-3.5"><path d="M0 12.4l35.7-4.9v34.4H0zm39.9-5.5L87.3 0v41.5H39.9zM0 45.9h35.7v34.4L0 75.5zm39.9.4h47.4v41.3l-47.4-6.6z" fill={!isMac ? "#0078d4" : "#aaa"}/></svg>
              Windows
            </button>
          </div>

          <div>
            <a
              href="#"
              className="inline-flex items-center gap-2 rounded-xl bg-neutral-950 px-6 py-3 text-[13px] font-semibold text-white hover:bg-neutral-800 transition-colors"
            >
              Download for {isMac ? "Mac" : "Windows"} →
            </a>
            <p className="mt-3 text-[12px] text-neutral-300">Free to try · No account needed</p>
          </div>
        </div>

        {/* Right: Demo */}
        <div className="flex-1 w-full">
          {isMac ? (
            <div className="rounded-[18px] p-[9px] shadow-2xl shadow-neutral-300/60" style={{ background: "linear-gradient(160deg, #e2e2e2 0%, #c8c8c8 100%)" }}>
              <div className="rounded-[11px] overflow-hidden" style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.3)" }}>
                <div className="flex items-center gap-1.5 px-4 py-2.5 bg-[#ececec] border-b border-neutral-300/60">
                  <span className="w-3 h-3 rounded-full bg-[#ff5f57] shadow-sm" />
                  <span className="w-3 h-3 rounded-full bg-[#febc2e] shadow-sm" />
                  <span className="w-3 h-3 rounded-full bg-[#28c840] shadow-sm" />
                  <span className="flex-1 text-center text-[11px] text-neutral-500 font-medium">cursur — live demo</span>
                </div>
                <DemoArea ref={demoRef} onMove={onMove} onEnter={() => setInside(true)} onLeave={() => { setInside(false); setActiveZone(null); }} zones={zones} activeZone={activeZone} inside={inside} pos={cursorPos} label={activeLabel} isWin={false} />
              </div>
            </div>
          ) : (
            <div className="rounded-[6px] shadow-2xl shadow-neutral-400/30 overflow-hidden" style={{ background: "#2d2d2d" }}>
              <div className="flex items-center bg-[#202020] px-3 py-2 gap-2">
                <div className="w-4 h-4 bg-[#0078d4] rounded-[3px] flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 88 88" className="w-2.5 h-2.5"><path d="M0 12.4l35.7-4.9v34.4H0zm39.9-5.5L87.3 0v41.5H39.9zM0 45.9h35.7v34.4L0 75.5zm39.9.4h47.4v41.3l-47.4-6.6z" fill="white"/></svg>
                </div>
                <span className="text-[11px] text-[#999] flex-1">cursur — live demo</span>
                <div className="flex">
                  {["─","□","✕"].map((s,i) => (
                    <span key={i} className={`w-10 h-6 flex items-center justify-center text-[11px] text-[#999] hover:bg-[${i===2?"#c42b1c":"#ffffff20"}] transition-colors cursor-default`}>{s}</span>
                  ))}
                </div>
              </div>
              <DemoArea ref={demoRef} onMove={onMove} onEnter={() => setInside(true)} onLeave={() => { setInside(false); setActiveZone(null); }} zones={zones} activeZone={activeZone} inside={inside} pos={cursorPos} label={activeLabel} isWin={true} />
            </div>
          )}
          <p className="mt-2.5 text-center text-[11px] text-neutral-300 font-medium">
            {inside ? `cursur feels: ${activeLabel}` : "Hover inside to try cursur"}
          </p>
        </div>
      </main>
    </div>
  );
}

const DemoArea = forwardRef<HTMLDivElement, {
  onMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  onEnter: () => void;
  onLeave: () => void;
  zones: { id: string; label: string; top: string; left: string; width: string; height: string }[];
  activeZone: string | null;
  inside: boolean;
  pos: { x: number; y: number };
  label: string;
  isWin: boolean;
}>(function DemoArea({ onMove, onEnter, onLeave, zones, activeZone, inside, pos, label, isWin }, ref) {
  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="relative select-none overflow-hidden"
      style={{ height: 360, background: isWin ? "#1e3a5f" : "#f5f5f7" }}
    >
      {zones.map((z) => (
        <div
          key={z.id}
          className={`absolute border transition-all duration-150 bg-white ${
            activeZone === z.id ? (isWin ? "border-[#0078d4] shadow-md" : "border-blue-300 shadow-md") : (isWin ? "border-[#ffffff20]" : "border-neutral-200")
          }`}
          style={{ top: z.top, left: z.left, width: z.width, height: z.height, borderRadius: isWin ? 3 : 10 }}
        >
          <div className="p-3">
            {isWin ? (
              <div className="flex justify-between items-center mb-2">
                <div className="h-1.5 w-10 bg-neutral-100 rounded-sm" />
                <div className="w-2 h-2 bg-red-200 rounded-sm" />
              </div>
            ) : (
              <div className="flex gap-1 mb-2.5">
                <span className="w-2 h-2 rounded-full bg-[#ff5f57]" />
                <span className="w-2 h-2 rounded-full bg-[#febc2e]" />
                <span className="w-2 h-2 rounded-full bg-[#28c840]" />
              </div>
            )}
            <div className="space-y-1.5">
              <div className="h-1.5 rounded-full w-3/4 bg-neutral-100" />
              <div className="h-1.5 rounded-full w-1/2 bg-neutral-100" />
            </div>
          </div>
        </div>
      ))}

      {isWin && (
        <div className="absolute bottom-0 left-0 right-0 h-8 flex items-center px-3 gap-2" style={{ background: "#1a1a2e" }}>
          <div className="w-5 h-5 bg-[#0078d4] rounded-[3px] flex items-center justify-center">
            <svg viewBox="0 0 88 88" className="w-3 h-3"><path d="M0 12.4l35.7-4.9v34.4H0zm39.9-5.5L87.3 0v41.5H39.9zM0 45.9h35.7v34.4L0 75.5zm39.9.4h47.4v41.3l-47.4-6.6z" fill="white"/></svg>
          </div>
          <div className="w-5 h-4 bg-[#ffffff15] rounded-sm" />
          <div className="w-5 h-4 bg-[#ffffff15] rounded-sm" />
          <div className="ml-auto text-[10px] text-[#ffffff50] font-mono">12:00</div>
        </div>
      )}

      {inside && (
        <div className="pointer-events-none absolute z-50" style={{ left: pos.x, top: pos.y, transform: "translate(-2px, -2px)" }}>
          <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
            <path d="M2 1L16 9.5L9.5 11.5L7 18L2 1Z" fill="white" stroke="#1a1a1a" strokeWidth="1.5" strokeLinejoin="round"/>
          </svg>
          {activeZone && (
            <div className="absolute left-5 top-0 whitespace-nowrap rounded-lg bg-neutral-900/90 px-2.5 py-1 text-[11px] font-semibold text-white shadow-xl backdrop-blur-sm">
              {label}
            </div>
          )}
        </div>
      )}

      {!inside && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-[12px] font-medium" style={{ color: isWin ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.2)" }}>
            Move your cursor here to try
          </span>
        </div>
      )}
    </div>
  );
});
