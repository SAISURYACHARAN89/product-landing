"use client";

import { useState, useRef, forwardRef } from "react";

const zones = [
  { id: "video", label: "Watching 😎", top: "10%",  left: "5%",  width: "42%", height: "44%" },
  { id: "work",  label: "Focused 🎯",  top: "10%",  left: "53%", width: "42%", height: "44%" },
  { id: "music", label: "Vibing 🎵",   top: "62%",  left: "5%",  width: "27%", height: "28%" },
  { id: "chat",  label: "Chatting 💬", top: "62%",  left: "37%", width: "27%", height: "28%" },
  { id: "game",  label: "Gaming 🕹️",  top: "62%",  left: "69%", width: "26%", height: "28%" },
];

const G = "var(--font-garamond)";
const I = "var(--font-inter)";

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
    const hit = zones.find(z =>
      xp >= parseFloat(z.left) && xp <= parseFloat(z.left) + parseFloat(z.width) &&
      yp >= parseFloat(z.top)  && yp <= parseFloat(z.top)  + parseFloat(z.height)
    );
    setActiveZone(hit?.id ?? null);
  }

  const activeLabel = zones.find(z => z.id === activeZone)?.label ?? "Idle 🖱️";

  return (
    <div className="bg-white" style={{ cursor: inside ? "none" : "auto", fontFamily: G }}>

      {/* Nav */}
      <div className="px-6 pt-5">
        <nav
          className="mx-auto flex items-center justify-between px-6 py-3 border border-neutral-200/80 bg-white/80 backdrop-blur-xl"
          style={{ maxWidth: 1100, borderRadius: 14 }}
        >
          <span className="text-[17px] font-semibold tracking-tight" style={{ fontFamily: G }}>
            c<span className="text-blue-500">u</span>rs<span className="text-blue-500">u</span>r
          </span>
          <div className="flex items-center gap-6 text-[13px] text-neutral-400" style={{ fontFamily: I }}>
            <a href="#" className="hover:text-neutral-800 transition-colors font-medium">X</a>
            <a href="#" className="hover:text-neutral-800 transition-colors font-medium">Instagram</a>
            <a href="#" className="hover:text-neutral-800 transition-colors font-medium">TikTok</a>
            <a href="#" className="hover:text-neutral-800 transition-colors font-medium">Privacy</a>
          </div>
        </nav>
      </div>

      {/* Content */}
      <div className="mx-auto px-6 pt-8 pb-10" style={{ maxWidth: 1100 }}>
        <div className="flex flex-col lg:flex-row items-stretch gap-10">

          {/* Hero */}
          <div className="lg:w-[440px] flex-shrink-0 w-full flex flex-col justify-center">
            <h1
              className="text-[66px] leading-[1.06] tracking-[-0.01em] text-neutral-950 mb-6"
              style={{ fontFamily: G, fontWeight: 500 }}
            >
              Your c<span className="text-blue-500">u</span>rs<span className="text-blue-500">u</span>r<br />
              has <em>feelings.</em>
            </h1>

            <p className="text-[16px] text-neutral-400 leading-relaxed mb-9 max-w-[310px]" style={{ fontFamily: I, fontWeight: 300 }}>
              Sunglasses while you watch. Sharp focus while you work. 70+ emotions, OS-level deep.
            </p>

            {/* Platform switcher */}
            <div
              className="inline-flex p-1 mb-5 gap-1"
              style={{ fontFamily: I, background: "#f5f5f7", borderRadius: 13, border: "1px solid #e5e5e5" }}
            >
              <button
                onClick={() => setPlatform("mac")}
                className="flex items-center gap-2 px-6 py-2.5 text-[14px] font-semibold transition-all"
                style={{
                  borderRadius: 10,
                  background: isMac ? "#fff" : "transparent",
                  color: isMac ? "#111" : "#aaa",
                  boxShadow: isMac ? "0 1px 4px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.05)" : "none",
                }}
              >
                <svg viewBox="0 0 814 1000" style={{ width: 14, height: 14, fill: isMac ? "#111" : "#ccc" }}><path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.8 135.4-317.7 269-317.7 70.2 0 128.7 46.3 170.7 46.3 40.3 0 107.3-49 185.4-49 29.5 0 108.2 2.6 168.4 74.3zm-234.4-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/></svg>
                Mac
              </button>
              <button
                onClick={() => setPlatform("windows")}
                className="flex items-center gap-2 px-6 py-2.5 text-[14px] font-semibold transition-all"
                style={{
                  borderRadius: 10,
                  background: !isMac ? "#0078d4" : "transparent",
                  color: !isMac ? "#fff" : "#aaa",
                  boxShadow: !isMac ? "0 1px 4px rgba(0,120,212,0.35)" : "none",
                }}
              >
                <svg viewBox="0 0 88 88" style={{ width: 14, height: 14 }}>
                  <path d="M0 12.4l35.7-4.9v34.4H0zm39.9-5.5L87.3 0v41.5H39.9zM0 45.9h35.7v34.4L0 75.5zm39.9.4h47.4v41.3l-47.4-6.6z" fill={!isMac ? "white" : "#ccc"}/>
                </svg>
                Windows
              </button>
            </div>

            <div>
              <a
                href="#"
                className="inline-flex items-center gap-2.5 text-[14px] font-medium transition-colors"
                style={{
                  fontFamily: I,
                  color: isMac ? "#111" : "#0078d4",
                  padding: "10px 0",
                  borderBottom: `1.5px solid ${isMac ? "#d4d4d4" : "#93c5fd"}`,
                  display: "inline-flex",
                }}
              >
                {isMac ? (
                  <svg viewBox="0 0 814 1000" style={{ width: 13, height: 13, fill: "#111" }}><path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.8 135.4-317.7 269-317.7 70.2 0 128.7 46.3 170.7 46.3 40.3 0 107.3-49 185.4-49 29.5 0 108.2 2.6 168.4 74.3zm-234.4-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/></svg>
                ) : (
                  <svg viewBox="0 0 88 88" style={{ width: 13, height: 13 }}><path d="M0 12.4l35.7-4.9v34.4H0zm39.9-5.5L87.3 0v41.5H39.9zM0 45.9h35.7v34.4L0 75.5zm39.9.4h47.4v41.3l-47.4-6.6z" fill="#0078d4"/></svg>
                )}
                Download for {isMac ? "Mac" : "Windows"}
              </a>
              <p className="mt-3 text-[11px] text-neutral-300" style={{ fontFamily: I }}>Free to try · No account needed</p>
            </div>
          </div>

          {/* Demo */}
          <div className="flex-1 w-full">
            {isMac ? (
              <div style={{ borderRadius: 18, padding: 9, background: "linear-gradient(160deg,#e2e2e2,#c8c8c8)", boxShadow: "0 25px 60px rgba(0,0,0,0.15)" }}>
                <div style={{ borderRadius: 11, overflow: "hidden" }}>
                  <div className="flex items-center gap-1.5 px-4 py-2.5" style={{ background: "#ececec", borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
                    <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57", display: "inline-block" }} />
                    <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e", display: "inline-block" }} />
                    <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840", display: "inline-block" }} />
                    <span className="flex-1 text-center text-[11px] text-neutral-500" style={{ fontFamily: I }}>cursur — live demo</span>
                  </div>
                  <DemoArea ref={demoRef} onMove={onMove} onEnter={() => setInside(true)} onLeave={() => { setInside(false); setActiveZone(null); }} zones={zones} activeZone={activeZone} inside={inside} pos={cursorPos} label={activeLabel} isWin={false} />
                </div>
              </div>
            ) : (
              <div style={{ borderRadius: 5, overflow: "hidden", boxShadow: "0 25px 60px rgba(0,0,0,0.2)", background: "#1e1e1e" }}>
                <div className="flex items-center px-3 py-2 gap-2" style={{ background: "#1a1a1a" }}>
                  <div className="flex items-center justify-center" style={{ width: 16, height: 16, background: "#0078d4", borderRadius: 3 }}>
                    <svg viewBox="0 0 88 88" style={{ width: 10, height: 10 }}><path d="M0 12.4l35.7-4.9v34.4H0zm39.9-5.5L87.3 0v41.5H39.9zM0 45.9h35.7v34.4L0 75.5zm39.9.4h47.4v41.3l-47.4-6.6z" fill="white"/></svg>
                  </div>
                  <span className="flex-1 text-[11px] text-[#888]" style={{ fontFamily: I }}>cursur — live demo</span>
                  <div className="flex" style={{ fontFamily: I }}>
                    <span className="flex items-center justify-center text-[11px] text-[#888] hover:bg-white/10 transition-colors cursor-default" style={{ width: 40, height: 28 }}>─</span>
                    <span className="flex items-center justify-center text-[11px] text-[#888] hover:bg-white/10 transition-colors cursor-default" style={{ width: 40, height: 28 }}>□</span>
                    <span className="flex items-center justify-center text-[11px] text-[#888] hover:bg-red-600 hover:text-white transition-colors cursor-default" style={{ width: 40, height: 28 }}>✕</span>
                  </div>
                </div>
                <DemoArea ref={demoRef} onMove={onMove} onEnter={() => setInside(true)} onLeave={() => { setInside(false); setActiveZone(null); }} zones={zones} activeZone={activeZone} inside={inside} pos={cursorPos} label={activeLabel} isWin={true} />
              </div>
            )}
            <p className="mt-2.5 text-center text-[11px] text-neutral-300" style={{ fontFamily: I }}>
              {inside ? `cursur feels: ${activeLabel}` : "Hover inside to try cursur"}
            </p>
          </div>

        </div>
      </div>
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
          className="absolute bg-white transition-all duration-150"
          style={{
            top: z.top, left: z.left, width: z.width, height: z.height,
            borderRadius: isWin ? 3 : 10,
            border: activeZone === z.id
              ? (isWin ? "1px solid #0078d4" : "1px solid #93c5fd")
              : "1px solid " + (isWin ? "rgba(255,255,255,0.12)" : "#e5e5e5"),
            boxShadow: activeZone === z.id ? "0 4px 16px rgba(0,0,0,0.1)" : "none",
          }}
        >
          <div className="p-3">
            {isWin ? (
              <div className="flex justify-between items-center mb-2">
                <div style={{ height: 6, width: 36, background: "#f0f0f0", borderRadius: 2 }} />
                <div style={{ width: 8, height: 8, background: "#fca5a5", borderRadius: 1 }} />
              </div>
            ) : (
              <div className="flex gap-1 mb-2.5">
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff5f57", display: "inline-block" }} />
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#febc2e", display: "inline-block" }} />
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#28c840", display: "inline-block" }} />
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ height: 6, width: "72%", background: "#f0f0f0", borderRadius: 4 }} />
              <div style={{ height: 6, width: "48%", background: "#f0f0f0", borderRadius: 4 }} />
            </div>
          </div>
        </div>
      ))}

      {isWin && (
        <div className="absolute bottom-0 left-0 right-0 flex items-center px-3 gap-2" style={{ height: 32, background: "#111827" }}>
          <div className="flex items-center justify-center" style={{ width: 18, height: 18, background: "#0078d4", borderRadius: 3 }}>
            <svg viewBox="0 0 88 88" style={{ width: 11, height: 11 }}><path d="M0 12.4l35.7-4.9v34.4H0zm39.9-5.5L87.3 0v41.5H39.9zM0 45.9h35.7v34.4L0 75.5zm39.9.4h47.4v41.3l-47.4-6.6z" fill="white"/></svg>
          </div>
          <div style={{ width: 18, height: 18, background: "rgba(255,255,255,0.08)", borderRadius: 3 }} />
          <div style={{ width: 18, height: 18, background: "rgba(255,255,255,0.08)", borderRadius: 3 }} />
          <span className="ml-auto text-[10px]" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>12:00</span>
        </div>
      )}

      {inside && (
        <div className="pointer-events-none absolute z-50" style={{ left: pos.x, top: pos.y, transform: "translate(-2px,-2px)" }}>
          <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
            <path d="M2 1L16 9.5L9.5 11.5L7 18L2 1Z" fill="white" stroke="#1a1a1a" strokeWidth="1.4" strokeLinejoin="round"/>
          </svg>
          {activeZone && (
            <div
              className="absolute whitespace-nowrap text-[11px] font-semibold text-white"
              style={{ left: 20, top: 0, background: "rgba(20,20,20,0.88)", borderRadius: 8, padding: "4px 10px", backdropFilter: "blur(8px)", fontFamily: "var(--font-inter)" }}
            >
              {label}
            </div>
          )}
        </div>
      )}

      {!inside && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span style={{ fontSize: 12, fontFamily: "var(--font-inter)", color: isWin ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.18)" }}>
            Move your cursor here to try
          </span>
        </div>
      )}
    </div>
  );
});
