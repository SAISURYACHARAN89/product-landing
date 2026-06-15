"use client";

import { useState, useRef, forwardRef } from "react";

// Each card: cursor SVG + accessory overlay
function CursorSkin({ accessory, color = "#fff", size = 52 }: { accessory: React.ReactNode; color?: string; size?: number }) {
  const h = size * 1.2;
  const emojiSize = size * 0.55;
  return (
    <div className="relative" style={{ width: size + emojiSize * 0.8, height: h }}>
      <svg width={size} height={h} viewBox="0 0 52 62" fill="none" style={{ position: "absolute", left: 0, top: 0 }}>
        <path d="M6 4L46 28L29 34L22 56L6 4Z" fill={color} stroke="#1a1a1a" strokeWidth="3" strokeLinejoin="round"/>
      </svg>
      <div style={{ position: "absolute", left: size * 0.55, top: 0, fontSize: emojiSize, lineHeight: 1 }}>
        {accessory}
      </div>
    </div>
  );
}

const emotionCards: { label: string; bg: string; accessory: string }[] = [
  { label: "Watching",     bg: "#fafafa", accessory: "😎" },
  { label: "Focused",      bg: "#fafafa", accessory: "🎯" },
  { label: "Tired",        bg: "#fafafa", accessory: "😴" },
  { label: "Excited",      bg: "#fafafa", accessory: "🤩" },
  { label: "Grinding",     bg: "#fafafa", accessory: "😤" },
  { label: "Calm",         bg: "#fafafa", accessory: "🧘" },
  { label: "Thinking",     bg: "#fafafa", accessory: "🤔" },
  { label: "Celebrating",  bg: "#fafafa", accessory: "🎉" },
  { label: "Nervous",      bg: "#fafafa", accessory: "😬" },
  { label: "Hyped",        bg: "#fafafa", accessory: "🥳" },
  { label: "Peaceful",     bg: "#fafafa", accessory: "😌" },
  { label: "Nerding out",  bg: "#fafafa", accessory: "🤓" },
  { label: "Mischievous",  bg: "#fafafa", accessory: "😏" },
  { label: "Bored",        bg: "#fafafa", accessory: "🥱" },
  { label: "Sad",          bg: "#fafafa", accessory: "😢" },
  { label: "On fire",      bg: "#fafafa", accessory: "🔥" },
  { label: "Melting",      bg: "#fafafa", accessory: "🫠" },
  { label: "Mind blown",   bg: "#fafafa", accessory: "🤯" },
  { label: "Chill",        bg: "#fafafa", accessory: "😇" },
  { label: "Devious",      bg: "#fafafa", accessory: "😈" },
];

const zones = [
  { id: "video", label: "Watching 😎", top: "9%",  left: "4%",  width: "44%", height: "46%" },
  { id: "work",  label: "Focused 🎯",  top: "9%",  left: "52%", width: "44%", height: "46%" },
  { id: "music", label: "Vibing 🎵",   top: "62%", left: "4%",  width: "28%", height: "28%" },
  { id: "chat",  label: "Chatting 💬", top: "62%", left: "36%", width: "28%", height: "28%" },
  { id: "game",  label: "Gaming 🕹️",  top: "62%", left: "68%", width: "28%", height: "28%" },
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
    <div className="bg-white" style={{ cursor: inside ? "none" : "auto" }}>

      {/* ── Nav ── */}
      <div className="sticky top-0 z-50 flex justify-center px-6 pt-5 pb-3 bg-white/80 backdrop-blur-xl">
        <nav
          className="w-full flex items-center justify-between px-5 py-2.5"
          style={{ maxWidth: 960, borderRadius: 14, border: "1px solid #e8e8e8", background: "rgba(255,255,255,0.9)" }}
        >
          <span className="text-[16px] font-semibold" style={{ fontFamily: G }}>
            c<span className="text-blue-500">u</span>rs<span className="text-blue-500">u</span>r
          </span>
          <div className="flex items-center gap-5 text-[13px] text-neutral-400" style={{ fontFamily: I }}>
            <a href="#" className="hover:text-neutral-800 transition-colors">X</a>
            <a href="#" className="hover:text-neutral-800 transition-colors">Instagram</a>
            <a href="#" className="hover:text-neutral-800 transition-colors">TikTok</a>
            <a href="#" className="hover:text-neutral-800 transition-colors">Privacy</a>
          </div>
        </nav>
      </div>

      {/* ── Hero ── */}
      <section className="flex flex-col items-center text-center px-6 pt-16 pb-14">
        <h1
          className="text-[72px] leading-[1.04] tracking-[-0.015em] text-neutral-950 mb-5"
          style={{ fontFamily: G, fontWeight: 500, maxWidth: 700 }}
        >
          Give your c<span className="text-blue-500">u</span>rs<span className="text-blue-500">u</span>r<br />
          a <em>personality.</em>
        </h1>
        <p
          className="text-[16px] text-neutral-400 leading-relaxed mb-10"
          style={{ fontFamily: I, fontWeight: 300, maxWidth: 380 }}
        >
          An OS level integration, so it will work anywhere on your screen.
        </p>

        {/* Download buttons */}
        <div className="flex items-center gap-3" style={{ fontFamily: I }}>
          <a
            href="#"
            onClick={() => setPlatform("mac")}
            className="inline-flex items-center gap-2 text-[13px] font-semibold transition-all hover:opacity-80"
            style={{ padding: "10px 20px", borderRadius: 10, background: "#111", color: "#fff" }}
          >
            <svg viewBox="0 0 814 1000" style={{ width: 13, height: 13, fill: "#fff" }}><path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.8 135.4-317.7 269-317.7 70.2 0 128.7 46.3 170.7 46.3 40.3 0 107.3-49 185.4-49 29.5 0 108.2 2.6 168.4 74.3zm-234.4-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/></svg>
            Download for Mac
          </a>
          <a
            href="#"
            onClick={() => setPlatform("windows")}
            className="inline-flex items-center gap-2 text-[13px] font-semibold transition-all hover:opacity-80"
            style={{ padding: "10px 20px", borderRadius: 10, background: "#0078d4", color: "#fff" }}
          >
            <svg viewBox="0 0 88 88" style={{ width: 13, height: 13 }}><path d="M0 12.4l35.7-4.9v34.4H0zm39.9-5.5L87.3 0v41.5H39.9zM0 45.9h35.7v34.4L0 75.5zm39.9.4h47.4v41.3l-47.4-6.6z" fill="white"/></svg>
            Download for Windows
          </a>
        </div>
        <p className="mt-3 text-[11px] text-neutral-300" style={{ fontFamily: I }}>Free to try · No account needed</p>
      </section>

      {/* ── Demo ── */}
      <section className="px-6 pb-16">
        <div style={{ maxWidth: 960, margin: "0 auto" }}>

          {/* Platform toggle */}
          <div className="flex justify-center mb-5">
            <div
              className="inline-flex p-1 gap-1"
              style={{ background: "#f5f5f7", borderRadius: 12, border: "1px solid #e8e8e8", fontFamily: I }}
            >
              {(["mac", "windows"] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className="flex items-center gap-1.5 text-[12px] font-semibold transition-all"
                  style={{
                    padding: "7px 16px", borderRadius: 9,
                    background: platform === p ? (p === "windows" ? "#0078d4" : "#fff") : "transparent",
                    color: platform === p ? (p === "windows" ? "#fff" : "#111") : "#aaa",
                    boxShadow: platform === p && p === "mac" ? "0 1px 4px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05)" : "none",
                  }}
                >
                  {p === "mac" ? (
                    <svg viewBox="0 0 814 1000" style={{ width: 11, height: 11, fill: platform === "mac" ? "#111" : "#ccc" }}><path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.8 135.4-317.7 269-317.7 70.2 0 128.7 46.3 170.7 46.3 40.3 0 107.3-49 185.4-49 29.5 0 108.2 2.6 168.4 74.3zm-234.4-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/></svg>
                  ) : (
                    <svg viewBox="0 0 88 88" style={{ width: 11, height: 11 }}><path d="M0 12.4l35.7-4.9v34.4H0zm39.9-5.5L87.3 0v41.5H39.9zM0 45.9h35.7v34.4L0 75.5zm39.9.4h47.4v41.3l-47.4-6.6z" fill={platform === "windows" ? "white" : "#ccc"}/></svg>
                  )}
                  {p === "mac" ? "Mac" : "Windows"}
                </button>
              ))}
            </div>
          </div>

          {/* Screen */}
          {isMac ? (
            <div style={{ borderRadius: 18, padding: 9, background: "linear-gradient(160deg,#e2e2e2,#c8c8c8)", boxShadow: "0 30px 80px rgba(0,0,0,0.13)" }}>
              <div style={{ borderRadius: 11, overflow: "hidden" }}>
                <div className="flex items-center gap-1.5 px-4 py-2.5" style={{ background: "#ececec", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
                  <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57", display: "inline-block" }} />
                  <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#febc2e", display: "inline-block" }} />
                  <span style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c840", display: "inline-block" }} />
                  <span className="flex-1 text-center text-[11px] text-neutral-400" style={{ fontFamily: I }}>cursur — live demo</span>
                </div>
                <DemoArea ref={demoRef} onMove={onMove} onEnter={() => setInside(true)} onLeave={() => { setInside(false); setActiveZone(null); }} zones={zones} activeZone={activeZone} inside={inside} pos={cursorPos} label={activeLabel} isWin={false} />
              </div>
            </div>
          ) : (
            <div style={{ borderRadius: 5, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.18)", background: "#1a1a1a" }}>
              <div className="flex items-center px-3 py-2 gap-2" style={{ background: "#111" }}>
                <div className="flex items-center justify-center" style={{ width: 16, height: 16, background: "#0078d4", borderRadius: 3 }}>
                  <svg viewBox="0 0 88 88" style={{ width: 10, height: 10 }}><path d="M0 12.4l35.7-4.9v34.4H0zm39.9-5.5L87.3 0v41.5H39.9zM0 45.9h35.7v34.4L0 75.5zm39.9.4h47.4v41.3l-47.4-6.6z" fill="white"/></svg>
                </div>
                <span className="flex-1 text-[11px] text-[#666]" style={{ fontFamily: I }}>cursur — live demo</span>
                <div className="flex">
                  {["─","□","✕"].map((s, i) => (
                    <span key={i} className={`flex items-center justify-center text-[11px] text-[#666] transition-colors cursor-default ${i === 2 ? "hover:bg-red-600 hover:text-white" : "hover:bg-white/10"}`} style={{ width: 38, height: 26, fontFamily: I }}>{s}</span>
                  ))}
                </div>
              </div>
              <DemoArea ref={demoRef} onMove={onMove} onEnter={() => setInside(true)} onLeave={() => { setInside(false); setActiveZone(null); }} zones={zones} activeZone={activeZone} inside={inside} pos={cursorPos} label={activeLabel} isWin={true} />
            </div>
          )}
          <p className="mt-3 text-center text-[11px] text-neutral-300" style={{ fontFamily: I }}>
            {inside ? `cursur feels: ${activeLabel}` : "Move your cursor inside to try it"}
          </p>
        </div>
      </section>

      {/* ── Emotions scroll ── */}
      <section className="pb-16">
        <div className="relative">
          <div className="pointer-events-none absolute left-0 top-0 bottom-3 w-28 z-10" style={{ background: "linear-gradient(to right, #fff, transparent)" }} />
          <div className="pointer-events-none absolute right-0 top-0 bottom-3 w-28 z-10" style={{ background: "linear-gradient(to left, #fff, transparent)" }} />
          <div className="flex gap-4 overflow-x-auto pb-3" style={{ paddingLeft: 40, paddingRight: 40, scrollbarWidth: "none" }}>
            {emotionCards.map(card => (
              <div
                key={card.label}
                className="flex-shrink-0 flex flex-col items-center justify-center gap-4 transition-all cursor-default hover:border-neutral-200 hover:shadow-md hover:bg-white"
                style={{ width: 230, height: 220, borderRadius: 22, background: "#fafafa", border: "1px solid #f0f0f0" }}
              >
                <CursorSkin accessory={card.accessory} size={64} />
                <span className="text-[14px] font-medium text-neutral-500" style={{ fontFamily: I }}>{card.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-neutral-100 py-6">
        <div className="flex justify-center gap-5 text-[12px] text-neutral-300" style={{ fontFamily: I }}>
          <a href="#" className="hover:text-neutral-600 transition-colors">Privacy</a>
          <span>·</span>
          <a href="#" className="hover:text-neutral-600 transition-colors">X</a>
          <span>·</span>
          <a href="#" className="hover:text-neutral-600 transition-colors">Instagram</a>
          <span>·</span>
          <a href="#" className="hover:text-neutral-600 transition-colors">TikTok</a>
        </div>
      </footer>

    </div>
  );
}

const DemoArea = forwardRef<HTMLDivElement, {
  onMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  onEnter: () => void;
  onLeave: () => void;
  zones: typeof zones;
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
      style={{ height: 400, background: isWin ? "#1e3a5f" : "#f5f5f7" }}
    >
      {zones.map(z => (
        <div
          key={z.id}
          className="absolute bg-white transition-all duration-150"
          style={{
            top: z.top, left: z.left, width: z.width, height: z.height,
            borderRadius: isWin ? 3 : 10,
            border: activeZone === z.id
              ? `1px solid ${isWin ? "#0078d4" : "#93c5fd"}`
              : `1px solid ${isWin ? "rgba(255,255,255,0.1)" : "#e5e5e5"}`,
            boxShadow: activeZone === z.id ? "0 4px 20px rgba(0,0,0,0.08)" : "none",
          }}
        >
          <div className="p-3">
            {isWin ? (
              <div className="flex justify-between items-center mb-2">
                <div style={{ height: 5, width: 32, background: "#f0f0f0", borderRadius: 2 }} />
                <div style={{ width: 7, height: 7, background: "#fca5a5", borderRadius: 1 }} />
              </div>
            ) : (
              <div className="flex gap-1 mb-2.5">
                {["#ff5f57","#febc2e","#28c840"].map(c => (
                  <span key={c} style={{ width: 8, height: 8, borderRadius: "50%", background: c, display: "inline-block" }} />
                ))}
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <div style={{ height: 5, width: "70%", background: "#f0f0f0", borderRadius: 3 }} />
              <div style={{ height: 5, width: "45%", background: "#f0f0f0", borderRadius: 3 }} />
            </div>
          </div>
        </div>
      ))}

      {isWin && (
        <div className="absolute bottom-0 left-0 right-0 flex items-center px-3 gap-2" style={{ height: 30, background: "#0f172a" }}>
          <div className="flex items-center justify-center" style={{ width: 17, height: 17, background: "#0078d4", borderRadius: 3 }}>
            <svg viewBox="0 0 88 88" style={{ width: 10, height: 10 }}><path d="M0 12.4l35.7-4.9v34.4H0zm39.9-5.5L87.3 0v41.5H39.9zM0 45.9h35.7v34.4L0 75.5zm39.9.4h47.4v41.3l-47.4-6.6z" fill="white"/></svg>
          </div>
          <div style={{ width: 16, height: 16, background: "rgba(255,255,255,0.06)", borderRadius: 2 }} />
          <div style={{ width: 16, height: 16, background: "rgba(255,255,255,0.06)", borderRadius: 2 }} />
          <span className="ml-auto text-[10px]" style={{ color: "rgba(255,255,255,0.25)", fontFamily: "monospace" }}>12:00</span>
        </div>
      )}

      {inside && (
        <div className="pointer-events-none absolute z-50" style={{ left: pos.x, top: pos.y, transform: "translate(-2px,-2px)" }}>
          <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
            <path d="M2 1L16 9.5L9.5 11.5L7 18L2 1Z" fill="white" stroke="#1a1a1a" strokeWidth="1.4" strokeLinejoin="round"/>
          </svg>
          {activeZone && (
            <div className="absolute whitespace-nowrap text-[11px] font-semibold text-white" style={{ left: 20, top: 0, background: "rgba(15,15,15,0.85)", borderRadius: 7, padding: "4px 10px", backdropFilter: "blur(8px)", fontFamily: I }}>
              {label}
            </div>
          )}
        </div>
      )}

      {!inside && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span style={{ fontSize: 12, fontFamily: I, color: isWin ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.15)" }}>
            Move your cursor here to try
          </span>
        </div>
      )}
    </div>
  );
});
