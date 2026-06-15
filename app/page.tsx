"use client";

import { useState, useRef, forwardRef } from "react";

// ─── Emotion cards ───────────────────────────────────────────────
function CursorSkin({ accessory, size = 52 }: { accessory: string; size?: number }) {
  const h = size * 1.2;
  const es = size * 0.55;
  return (
    <div className="relative" style={{ width: size + es * 0.8, height: h }}>
      <svg width={size} height={h} viewBox="0 0 52 62" fill="none" style={{ position: "absolute", left: 0, top: 0 }}>
        <path d="M6 4L46 28L29 34L22 56L6 4Z" fill="#fff" stroke="#1a1a1a" strokeWidth="3" strokeLinejoin="round"/>
      </svg>
      <div style={{ position: "absolute", left: size * 0.55, top: 0, fontSize: es, lineHeight: 1 }}>{accessory}</div>
    </div>
  );
}

const emotionCards = [
  { label: "Watching",    accessory: "😎" },
  { label: "Focused",     accessory: "🎯" },
  { label: "Tired",       accessory: "😴" },
  { label: "Excited",     accessory: "🤩" },
  { label: "Grinding",    accessory: "😤" },
  { label: "Calm",        accessory: "🧘" },
  { label: "Thinking",    accessory: "🤔" },
  { label: "Celebrating", accessory: "🎉" },
  { label: "Nervous",     accessory: "😬" },
  { label: "Hyped",       accessory: "🥳" },
  { label: "Peaceful",    accessory: "😌" },
  { label: "Nerding out", accessory: "🤓" },
  { label: "Mischievous", accessory: "😏" },
  { label: "Bored",       accessory: "🥱" },
  { label: "Sad",         accessory: "😢" },
  { label: "On fire",     accessory: "🔥" },
  { label: "Melting",     accessory: "🫠" },
  { label: "Mind blown",  accessory: "🤯" },
  { label: "Chill",       accessory: "😇" },
  { label: "Devious",     accessory: "😈" },
];

// ─── Demo zones ──────────────────────────────────────────────────
const zones = [
  { id: "video", label: "Watching 😎", top: "8%",  left: "4%",  width: "44%", height: "46%" },
  { id: "work",  label: "Focused 🎯",  top: "8%",  left: "52%", width: "44%", height: "46%" },
  { id: "music", label: "Vibing 🎵",   top: "61%", left: "4%",  width: "28%", height: "29%" },
  { id: "chat",  label: "Chatting 💬", top: "61%", left: "36%", width: "28%", height: "29%" },
  { id: "game",  label: "Gaming 🕹️",  top: "61%", left: "68%", width: "28%", height: "29%" },
];

const G = "var(--font-garamond)";
const I = "var(--font-inter)";

// ─── MacBook mockup ──────────────────────────────────────────────
// Real MacBook Pro 16": lid 358×244mm, screen 345.2×215.1mm (~16:10.15)
// Proportions: bezel top≈7px, sides≈7px, chin≈22px at display scale
function MacBook({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ width: "100%", userSelect: "none" }}>
      {/* Lid */}
      <div style={{
        background: "linear-gradient(180deg, #3a3a3c 0%, #2c2c2e 100%)",
        borderRadius: "14px 14px 0 0",
        padding: "10px 12px 20px 12px",
        boxShadow: "0 0 0 1px #1c1c1e, inset 0 1px 0 rgba(255,255,255,0.08)",
        position: "relative",
      }}>
        {/* Screen bezel + content */}
        <div style={{
          background: "#000",
          borderRadius: 6,
          overflow: "hidden",
          aspectRatio: "16 / 10",
          position: "relative",
        }}>
          {children}
          {/* Notch overlaid on top of screen */}
          <div style={{
            position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
            width: "22%", height: "7%", background: "#1c1c1e",
            borderRadius: "0 0 12px 12px", zIndex: 10,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#3a3a3c" }} />
          </div>
        </div>
      </div>
      {/* Hinge shadow line */}
      <div style={{ height: 3, background: "linear-gradient(180deg,#1a1a1a,#3a3a3a)", borderRadius: "0 0 2px 2px" }} />
      {/* Base / keyboard deck */}
      <div style={{
        background: "linear-gradient(180deg, #3a3a3c 0%, #2e2e30 100%)",
        borderRadius: "0 0 10px 10px",
        height: 28,
        boxShadow: "0 4px 16px rgba(0,0,0,0.35), 0 0 0 1px #1c1c1e",
        position: "relative",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        paddingBottom: 4,
      }}>
        {/* Speaker grilles */}
        <div style={{ display: "flex", gap: 3 }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} style={{ width: 2, height: 4, background: "#2a2a2c", borderRadius: 1 }} />
          ))}
        </div>
      </div>
      {/* Foot shadow */}
      <div style={{ height: 6, margin: "0 24px", background: "radial-gradient(ellipse, rgba(0,0,0,0.18) 0%, transparent 70%)", borderRadius: "50%" }} />
    </div>
  );
}

// ─── Windows laptop mockup ───────────────────────────────────────
// Based on Surface Laptop / premium Windows laptop proportions
function WindowsLaptop({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ width: "100%", userSelect: "none" }}>
      {/* Lid */}
      <div style={{
        background: "linear-gradient(180deg, #d0d0d2 0%, #b8b8ba 100%)",
        borderRadius: "10px 10px 0 0",
        padding: "14px 14px 18px 14px",
        boxShadow: "0 0 0 1px #a0a0a2, inset 0 1px 0 rgba(255,255,255,0.5)",
        position: "relative",
      }}>
        {/* Webcam */}
        <div style={{
          position: "absolute", top: 6, left: "50%", transform: "translateX(-50%)",
          width: 6, height: 6, borderRadius: "50%", background: "#888", zIndex: 2,
        }} />
        {/* Screen bezel + content */}
        <div style={{
          background: "#000",
          borderRadius: 4,
          overflow: "hidden",
          aspectRatio: "16 / 9",
          position: "relative",
        }}>
          {children}
        </div>
      </div>
      {/* Hinge */}
      <div style={{ height: 4, background: "linear-gradient(180deg,#888,#bbb)", borderRadius: "0 0 2px 2px" }} />
      {/* Base */}
      <div style={{
        background: "linear-gradient(180deg, #c4c4c6 0%, #b0b0b2 100%)",
        borderRadius: "0 0 8px 8px",
        height: 26,
        boxShadow: "0 6px 20px rgba(0,0,0,0.2), 0 0 0 1px #a0a0a2",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div style={{ width: 40, height: 3, background: "rgba(0,0,0,0.12)", borderRadius: 2 }} />
      </div>
      <div style={{ height: 6, margin: "0 24px", background: "radial-gradient(ellipse, rgba(0,0,0,0.12) 0%, transparent 70%)", borderRadius: "50%" }} />
    </div>
  );
}

// ─── Demo screen content ─────────────────────────────────────────
const DemoArea = forwardRef<HTMLDivElement, {
  onMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  onEnter: () => void;
  onLeave: () => void;
  activeZone: string | null;
  inside: boolean;
  pos: { x: number; y: number };
  label: string;
  isWin: boolean;
}>(function DemoArea({ onMove, onEnter, onLeave, activeZone, inside, pos, label, isWin }, ref) {
  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="relative select-none overflow-hidden w-full h-full"
      style={{ background: isWin ? "#1e3a5f" : "#f5f5f7", cursor: "none" }}
    >
      {/* Windows taskbar bg */}
      {isWin && (
        <div className="absolute bottom-0 left-0 right-0 flex items-center px-3 gap-2" style={{ height: "8%", background: "#0f172a", zIndex: 1 }}>
          <div className="flex items-center justify-center" style={{ width: 16, height: 16, background: "#0078d4", borderRadius: 3 }}>
            <svg viewBox="0 0 88 88" style={{ width: 10, height: 10 }}><path d="M0 12.4l35.7-4.9v34.4H0zm39.9-5.5L87.3 0v41.5H39.9zM0 45.9h35.7v34.4L0 75.5zm39.9.4h47.4v41.3l-47.4-6.6z" fill="white"/></svg>
          </div>
          <div style={{ width: 14, height: 14, background: "rgba(255,255,255,0.07)", borderRadius: 2 }} />
          <div style={{ width: 14, height: 14, background: "rgba(255,255,255,0.07)", borderRadius: 2 }} />
          <span className="ml-auto" style={{ fontSize: 8, color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>12:00</span>
        </div>
      )}

      {/* App windows */}
      {zones.map(z => (
        <div
          key={z.id}
          className="absolute bg-white transition-all duration-150"
          style={{
            top: z.top, left: z.left, width: z.width, height: z.height,
            borderRadius: isWin ? 3 : 8,
            border: activeZone === z.id
              ? `1px solid ${isWin ? "#0078d4" : "#93c5fd"}`
              : `1px solid ${isWin ? "rgba(255,255,255,0.1)" : "#e5e5e5"}`,
            boxShadow: activeZone === z.id ? "0 4px 16px rgba(0,0,0,0.12)" : "none",
          }}
        >
          <div className="p-2">
            {isWin ? (
              <div className="flex justify-between items-center mb-1.5">
                <div style={{ height: 4, width: 28, background: "#f0f0f0", borderRadius: 2 }} />
                <div style={{ width: 6, height: 6, background: "#fca5a5", borderRadius: 1 }} />
              </div>
            ) : (
              <div className="flex gap-1 mb-1.5">
                {["#ff5f57","#febc2e","#28c840"].map(c => (
                  <span key={c} style={{ width: 6, height: 6, borderRadius: "50%", background: c, display: "inline-block" }} />
                ))}
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ height: 4, width: "68%", background: "#f0f0f0", borderRadius: 3 }} />
              <div style={{ height: 4, width: "42%", background: "#f0f0f0", borderRadius: 3 }} />
            </div>
          </div>
        </div>
      ))}

      {/* Custom cursor */}
      {inside && (
        <div className="pointer-events-none absolute z-50" style={{ left: pos.x, top: pos.y, transform: "translate(-2px,-2px)" }}>
          <svg width="16" height="18" viewBox="0 0 18 20" fill="none">
            <path d="M2 1L16 9.5L9.5 11.5L7 18L2 1Z" fill="white" stroke="#1a1a1a" strokeWidth="1.5" strokeLinejoin="round"/>
          </svg>
          {activeZone && (
            <div className="absolute whitespace-nowrap font-semibold text-white" style={{ left: 18, top: 0, background: "rgba(15,15,15,0.85)", borderRadius: 6, padding: "3px 8px", backdropFilter: "blur(8px)", fontFamily: I, fontSize: 10 }}>
              {label}
            </div>
          )}
        </div>
      )}

      {!inside && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span style={{ fontSize: 11, fontFamily: I, color: isWin ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.15)" }}>
            Move your cursor here to try
          </span>
        </div>
      )}
    </div>
  );
});

// ─── Page ─────────────────────────────────────────────────────────
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
    setCursorPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    const xp = ((e.clientX - rect.left) / rect.width) * 100;
    const yp = ((e.clientY - rect.top) / rect.height) * 100;
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
      <div className="sticky top-0 z-50 flex justify-center px-6 pt-5 pb-3">
        <nav className="w-full flex items-center justify-between px-5 py-2.5" style={{ maxWidth: 960, borderRadius: 14, border: "1px solid rgba(0,0,0,0.08)", background: "rgba(255,255,255,0.72)", backdropFilter: "blur(24px) saturate(180%)", WebkitBackdropFilter: "blur(24px) saturate(180%)", boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(0,0,0,0.04)" }}>
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
      <section className="flex flex-col items-center text-center px-6 pt-20 pb-10">
        <h1 className="text-[96px] leading-[1.0] tracking-[-0.025em] text-neutral-950" style={{ fontFamily: G, fontWeight: 500, maxWidth: 780 }}>
          Give your{" "}
          c<span className="text-blue-500">u</span>rs<span className="text-blue-500">u</span>r
          <br />
          a <em>personality.</em>
        </h1>
      </section>

      {/* ── Laptop Demo ── */}
      <section className="px-6 pb-6">
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          {isMac ? (
            <MacBook>
              <DemoArea ref={demoRef} onMove={onMove} onEnter={() => setInside(true)} onLeave={() => { setInside(false); setActiveZone(null); }} activeZone={activeZone} inside={inside} pos={cursorPos} label={activeLabel} isWin={false} />
            </MacBook>
          ) : (
            <WindowsLaptop>
              <DemoArea ref={demoRef} onMove={onMove} onEnter={() => setInside(true)} onLeave={() => { setInside(false); setActiveZone(null); }} activeZone={activeZone} inside={inside} pos={cursorPos} label={activeLabel} isWin={true} />
            </WindowsLaptop>
          )}
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
                style={{ width: 220, height: 210, borderRadius: 22, background: "#fafafa", border: "1px solid #f0f0f0" }}
              >
                <CursorSkin accessory={card.accessory} size={64} />
                <span className="text-[13px] font-medium text-neutral-500" style={{ fontFamily: I }}>{card.label}</span>
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
