"use client";

import { useEffect, useRef } from "react";

const I = "var(--font-inter)";

const CLIPS = [
  { src: "/demo1.mp4", views: "18.4K", likes: "1.2K" },
  { src: "/demo2.mp4", views: "27.1K", likes: "1.9K" },
  { src: "/demo3.mp4", views: "9.3K",  likes: "642"  },
  { src: "/demo4.mp4", views: "14.7K", likes: "1.1K" },
  { src: "/demo5.mp4", views: "5.8K",  likes: "381"  },
  { src: "/demo6.mp4", views: "22.6K", likes: "1.7K" },
  { src: "/demo7.mp4", views: "11.2K", likes: "874"  },
  { src: "/demo8.mp4", views: "7.4K",  likes: "503"  },
  { src: "/demo9.mp4", views: "19.9K", likes: "1.4K" },
];

const GAP = 18;
const HEIGHT = 360;

export default function VideoStrip() {
  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const posRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Width of exactly one set of clips (half the duplicated track)
    const halfWidth = track.scrollWidth / 2;
    const speed = 0.6; // px per frame

    function tick() {
      posRef.current += speed;
      if (posRef.current >= halfWidth) posRef.current -= halfWidth;
      if (track) track.style.transform = `translateX(${-posRef.current}px)`;
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const doubled = [...CLIPS, ...CLIPS];

  return (
    <div style={{ overflow: "hidden", marginBottom: 56 }}>
      <div
        ref={trackRef}
        style={{ display: "flex", gap: GAP, width: "max-content", willChange: "transform" }}
      >
        {doubled.map((clip, i) => (
          <div key={i} style={{ position: "relative", flexShrink: 0, borderRadius: 20, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.13)" }}>
            <video
              src={clip.src}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              style={{ height: HEIGHT, width: "auto", display: "block", objectFit: "cover" }}
            />
            {/* Liquid glass overlay */}
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              padding: "32px 12px 12px",
              background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)",
              pointerEvents: "none",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 6 }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 5,
                  background: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(16px) saturate(2)",
                  WebkitBackdropFilter: "blur(16px) saturate(2)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  borderRadius: 100, padding: "5px 10px",
                }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", fontFamily: I }}>{clip.views}</span>
                </div>
                <div style={{
                  display: "flex", alignItems: "center", gap: 5,
                  background: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(16px) saturate(2)",
                  WebkitBackdropFilter: "blur(16px) saturate(2)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  borderRadius: 100, padding: "5px 10px",
                }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="rgba(255,75,75,1)" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", fontFamily: I }}>{clip.likes}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
