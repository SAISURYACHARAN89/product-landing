"use client";

import { useState, useRef, useEffect, forwardRef } from "react";
import { trackEvent } from "@/lib/gtag";
import VideoStrip from "./components/VideoStrip";

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
        {/* Notch */}
        <div style={{
          position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: 110, height: 12, background: "#1c1c1e",
          borderRadius: "0 0 10px 10px", zIndex: 2,
        }} />
        {/* Webcam dot */}
        <div style={{
          position: "absolute", top: 4, left: "50%", transform: "translateX(-50%)",
          width: 6, height: 6, borderRadius: "50%", background: "#2a2a2c", zIndex: 3,
        }} />
        {/* Screen bezel + content */}
        <div style={{
          background: "#000",
          borderRadius: 6,
          overflow: "hidden",
          aspectRatio: "16 / 10",
          position: "relative",
        }}>
          {children}
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
  const [recoveryOpen, setRecoveryOpen] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoverySubmitted, setRecoverySubmitted] = useState(false);
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

      {/* ── Recovery Key Modal ── */}
      {recoveryOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
          style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(8px)" }}
          onClick={e => { if (e.target === e.currentTarget) { setRecoveryOpen(false); } }}
        >
          <div style={{ background: "#fff", borderRadius: 20, padding: "40px 36px", width: "100%", maxWidth: 420, boxShadow: "0 24px 60px rgba(0,0,0,0.15)", fontFamily: I }}>
            <button onClick={() => setRecoveryOpen(false)} style={{ position: "absolute", top: 0, right: 0, opacity: 0 }} aria-label="close" />
            {!recoverySubmitted ? (
              <>
                <h2 style={{ fontFamily: G, fontSize: 26, fontWeight: 500, letterSpacing: "-0.015em", marginBottom: 8 }}>Recover your key</h2>
                <p style={{ fontSize: 13, color: "#aaa", fontWeight: 300, marginBottom: 28, lineHeight: 1.6 }}>Enter the email you used to purchase cursur and we will send your license key to it.</p>
                <form onSubmit={async e => {
                  e.preventDefault();
                  setRecoverySubmitted(true);
                  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.cursur.app";
                  try {
                    await fetch(`${apiUrl}/api/license/recover`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ email: recoveryEmail }),
                    });
                  } catch {}
                }}>
                  <input
                    autoFocus
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={recoveryEmail}
                    onChange={e => setRecoveryEmail(e.target.value)}
                    style={{
                      width: "100%", padding: "11px 14px", borderRadius: 10,
                      border: "1px solid #e0e0e0", fontSize: 14, color: "#111",
                      background: "#fafafa", outline: "none", fontFamily: I,
                      marginBottom: 14, boxSizing: "border-box",
                    }}
                  />
                  <button type="submit" style={{
                    width: "100%", padding: "11px", borderRadius: 10,
                    background: "#111", color: "#fff", fontSize: 14,
                    fontWeight: 600, fontFamily: I, cursor: "pointer", border: "none",
                  }}>
                    Send recovery email
                  </button>
                </form>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "16px 0" }}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>✉️</div>
                <h2 style={{ fontFamily: G, fontSize: 24, fontWeight: 500, letterSpacing: "-0.015em", marginBottom: 10 }}>Check your inbox</h2>
                <p style={{ fontSize: 13, color: "#888", fontWeight: 300, lineHeight: 1.7 }}>
                  If that email made a purchase, we've sent your license key to<br />
                  <span style={{ color: "#111", fontWeight: 500 }}>{recoveryEmail}</span>
                </p>
                <button onClick={() => setRecoveryOpen(false)} style={{ marginTop: 24, fontSize: 13, color: "#bbb", background: "none", border: "none", cursor: "pointer", fontFamily: I }}>
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Nav ── */}
      <div className="sticky top-0 z-50 flex justify-center px-3 sm:px-6 pt-5 pb-3">
        <nav className="w-full flex items-center justify-between px-3 sm:px-5 py-2.5 gap-2" style={{ maxWidth: 960, borderRadius: 14, border: "1px solid rgba(0,0,0,0.08)", background: "rgba(255,255,255,0.65)", backdropFilter: "blur(28px) saturate(180%)", WebkitBackdropFilter: "blur(28px) saturate(180%)", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <div className="flex items-center gap-1 flex-shrink-0">
            <span className="text-[22px] sm:text-[33px]" style={{ fontFamily: G, fontWeight: 500, lineHeight: 1, position: "relative", top: -2 }}>
              c<span className="text-blue-500">u</span>rs<span className="text-blue-500">u</span>r
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-5 text-[11px] sm:text-[13px] text-neutral-400 flex-shrink-0" style={{ fontFamily: I }}>
            <button onClick={() => { setRecoveryOpen(true); setRecoverySubmitted(false); setRecoveryEmail(""); }} className="hover:text-neutral-800 transition-colors whitespace-nowrap" style={{ background: "none", border: "none", cursor: "pointer", fontFamily: I, fontSize: "inherit", color: "inherit", padding: 0 }}>Recover Key</button>
            <a
              href="/buy"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("buy_clicked", { source: "nav" })}
              className="inline-flex items-center gap-1.5 text-[11px] sm:text-[12px] font-semibold transition-all hover:opacity-75 px-3 sm:px-4 py-1.5 flex-shrink-0"
              style={{ borderRadius: 9, background: "#111", color: "#fff", textDecoration: "none", fontFamily: I }}
            >
              <svg viewBox="0 0 814 1000" style={{ width: 11, height: 11, fill: "#fff", display: "block", marginBottom: 1 }}><path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.8 135.4-317.7 269-317.7 70.2 0 128.7 46.3 170.7 46.3 40.3 0 107.3-49 185.4-49 29.5 0 108.2 2.6 168.4 74.3zm-234.4-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/></svg>
              Buy
            </a>
          </div>
        </nav>
      </div>

      {/* ── Hero ── */}
      <section className="flex flex-col items-center text-center px-6 pt-16 pb-14">
        <h1 className="text-[40px] sm:text-[56px] md:text-[72px] leading-[1.04] tracking-[-0.015em] text-neutral-950 mb-5" style={{ fontFamily: G, fontWeight: 500, maxWidth: 680 }}>
          Give your c<span className="text-blue-500">u</span>rs<span className="text-blue-500">u</span>r<br />
          a <em>personality.</em>
        </h1>
        <p className="text-[16px] text-neutral-400 leading-relaxed" style={{ fontFamily: I, fontWeight: 300, maxWidth: 360 }}>
          An OS level integration, so it will work anywhere on your screen.
        </p>
      </section>

      {/* ── Laptop Demo ── */}
      <section className="px-6 pb-12">
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ borderRadius: 16, overflow: "hidden", background: "#000", boxShadow: "0 8px 40px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.08)", aspectRatio: "16 / 10", position: "relative" }}>
            <video
              id="demo-video"
              src="/demo.mp4"
              poster="/demo-poster.jpg"
              preload="auto"
              autoPlay
              loop
              muted
              playsInline
              controls
              style={{ width: "100%", height: "100%", display: "block", objectFit: "cover" }}
              ref={el => { if (el) el.addEventListener("pause", () => { if (!el.ended) el.play(); }); }}
            />
            <button
              id="unmute-btn"
              onClick={() => {
                const v = document.getElementById("demo-video") as HTMLVideoElement;
                if (v) v.muted = false;
                const b = document.getElementById("unmute-btn");
                if (b) b.style.display = "none";
              }}
              style={{
                position: "absolute", bottom: 52, right: 12,
                background: "rgba(0,0,0,0.6)", color: "#fff",
                border: "none", borderRadius: 8, padding: "6px 12px",
                fontSize: 12, fontFamily: "var(--font-inter)", cursor: "pointer",
                backdropFilter: "blur(8px)", display: "flex", alignItems: "center", gap: 5,
                zIndex: 10,
              }}
            >
              🔇 Tap to unmute
            </button>
          </div>

          {/* Buttons below laptop */}
          <div className="flex justify-center mt-6">
            {/* Mac download — primary CTA */}
            <a
              href="/Cursur_0.1.0_aarch64.dmg"
              download
              onClick={() => { setPlatform("mac"); trackEvent("download_clicked", { platform: "mac" }); }}
              className="inline-flex items-center gap-2 font-semibold"
              style={{
                fontFamily: I, fontSize: 13,
                padding: "10px 22px",
                borderRadius: 10,
                background: "#111",
                color: "#fff",
                whiteSpace: "nowrap",
                boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
              }}
            >
              <svg viewBox="0 0 814 1000" style={{ width: 12, height: 12, fill: "#fff", flexShrink: 0 }}><path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.8 135.4-317.7 269-317.7 70.2 0 128.7 46.3 170.7 46.3 40.3 0 107.3-49 185.4-49 29.5 0 108.2 2.6 168.4 74.3zm-234.4-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/></svg>
              Download for Mac
            </a>
          </div>
        </div>
      </section>

      {/* ── Emotions scroll ── */}
      <section className="pb-10">
        <h2 className="text-center text-[48px] leading-[1.02] tracking-[-0.02em] text-neutral-950 px-6" style={{ fontFamily: G, fontWeight: 500, maxWidth: 640, margin: "16px auto 28px" }}>
          It reads the room.
        </h2>
        <div className="relative">
          <div className="pointer-events-none absolute left-0 top-0 bottom-3 w-28 z-10" style={{ background: "linear-gradient(to right, #fff, transparent)" }} />
          <div className="pointer-events-none absolute right-0 top-0 bottom-3 w-28 z-10" style={{ background: "linear-gradient(to left, #fff, transparent)" }} />
          <div className="flex gap-4 overflow-x-auto pb-3" style={{ paddingLeft: 40, paddingRight: 40, scrollbarWidth: "none" }}>
            {["/cur-1.png","/cur-2.png","/cur-3.png","/cur-4.png","/cur-5.png","/cur-6.png","/cur-7.png","/cur-8.png","/cur-9.png","/cur-10.png"].map((img, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 flex items-center justify-center transition-all cursor-default hover:shadow-md"
                style={{ width: 220, height: 220, borderRadius: 22, background: "#fff", border: "1px solid #f0f0f0" }}
              >
                <img src={img} alt="" style={{ width: 140, height: 140, objectFit: "contain" }} />
              </div>
            ))}
            {/* Mystery card */}
            <div
              className="flex-shrink-0 flex flex-col items-center justify-center gap-2 transition-all cursor-default hover:shadow-md"
              style={{ width: 280, height: 220, borderRadius: 22, background: "#fff", border: "1px dashed #d0d0d0", padding: "0 28px" }}
            >
              <span style={{ fontSize: 28 }}>✦</span>
              <p className="text-[16px] font-medium text-neutral-700 text-center leading-snug" style={{ fontFamily: G, fontWeight: 500 }}>
                There&apos;s tons more reaction animations. We don&apos;t wanna spoil it before you download.
              </p>
            </div>
          </div>
        </div>
        <p className="text-center text-[12px] text-neutral-400 mt-6 px-6" style={{ fontFamily: I, fontWeight: 300, maxWidth: 500, margin: "24px auto 0" }}>
          c<span className="text-blue-500">u</span>rs<span className="text-blue-500">u</span>r knows what you&apos;re doing and gives you a relatable animation, like it&apos;s alive and doing it with you.
        </p>
      </section>

      {/* ── Get Cursur for free ── */}
      <section id="free" className="px-6 py-24" style={{ background: "#f9f9f9", borderTop: "1px solid #f0f0f0", borderBottom: "1px solid #f0f0f0" }}>
        <div className="mx-auto" style={{ maxWidth: 600 }}>
          <p className="text-[12px] font-semibold tracking-widest uppercase text-blue-500 mb-4 text-center" style={{ fontFamily: I, letterSpacing: "0.12em" }}>For creators</p>
          <h2 className="text-[56px] leading-[1.02] tracking-[-0.02em] text-neutral-950 mb-8 text-center" style={{ fontFamily: G, fontWeight: 500 }}>
            c<span className="text-blue-500">u</span>rs<span className="text-blue-500">u</span>r<br />
            for <em>free.</em>
          </h2>
        </div>

        {/* ── Video strip ── */}
        <VideoStrip />

        <div className="mx-auto" style={{ maxWidth: 600 }}>
          <div className="flex flex-col gap-5" style={{ fontFamily: I }}>
            <div className="flex items-start gap-4 p-5" style={{ background: "#fff", borderRadius: 16, border: "1px solid #ebebeb" }}>
              <span className="text-[28px] leading-none mt-0.5">①</span>
              <div>
                <p className="text-[14px] font-semibold text-neutral-800 mb-1">Download cursur and use it</p>
                <p className="text-[13px] text-neutral-400 font-light leading-relaxed">Get it on your Mac or Windows machine and make it yours.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-5" style={{ background: "#fff", borderRadius: 16, border: "1px solid #ebebeb" }}>
              <span className="text-[28px] leading-none mt-0.5">②</span>
              <div>
                <p className="text-[14px] font-semibold text-neutral-800 mb-1">Shoot a video about it</p>
                <p className="text-[13px] text-neutral-400 font-light leading-relaxed">Post a reel on Instagram, TikTok, or YouTube Shorts. Show it off however you want.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-5" style={{ background: "#fff", borderRadius: 16, border: "1px solid #ebebeb" }}>
              <span className="text-[28px] leading-none mt-0.5">③</span>
              <div>
                <p className="text-[14px] font-semibold text-neutral-800 mb-1">Send us the clip once it hits 10k views</p>
                <p className="text-[13px] text-neutral-400 font-light leading-relaxed">We will refund you in full. No questions asked. Send the link to <a href="mailto:support@cursur.app" className="text-neutral-600 hover:underline">support@cursur.app</a></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-neutral-100 py-8">
        <div className="flex flex-col items-center gap-5">
          <div className="flex items-center gap-6">
            <a href="https://www.instagram.com/cursur.app?igsh=NncyNGpqanFpMWNp&utm_source=qr" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-neutral-300 hover:text-neutral-700 transition-colors">
              <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: "currentColor" }}><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
            <a href="mailto:support@cursur.app" aria-label="Email" className="text-neutral-300 hover:text-neutral-700 transition-colors">
              <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, fill: "none" }}><path d="M3 5.5h18a1 1 0 011 1v11a1 1 0 01-1 1H3a1 1 0 01-1-1v-11a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/><path d="M2.5 6.5l9 6.5 9-6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </a>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-neutral-300" style={{ fontFamily: I }}>
            <a href="/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-600 transition-colors">Privacy Policy</a>
            <span>·</span>
            <a href="/terms" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-600 transition-colors">Terms & Conditions</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
