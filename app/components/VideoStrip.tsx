"use client";

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

// Duplicate so the CSS animation can loop seamlessly:
// translateX(-50%) moves exactly one full set, then jumps back to 0 invisibly.
const DOUBLED = [...CLIPS, ...CLIPS];

export default function VideoStrip() {
  return (
    <>
      <style>{`
        @keyframes reel-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>

      <div style={{
        overflow: "hidden",
        marginBottom: 56,
        /* Tight vignette using CSS mask — no overlaid divs, no color-matching needed */
        WebkitMaskImage: "linear-gradient(to right, transparent 0px, #000 48px, #000 calc(100% - 48px), transparent 100%)",
        maskImage:        "linear-gradient(to right, transparent 0px, #000 48px, #000 calc(100% - 48px), transparent 100%)",
      }}>
        <div style={{
          display: "flex",
          gap: 18,
          width: "max-content",
          animation: "reel-scroll 42s linear infinite",
          willChange: "transform",
        }}>
          {DOUBLED.map((clip, i) => (
            <div key={i} style={{
              position: "relative",
              flexShrink: 0,
              borderRadius: 20,
              overflow: "hidden",
              boxShadow: "0 4px 20px rgba(0,0,0,0.10)",
            }}>
              <video
                src={clip.src}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                style={{ height: 360, width: "auto", display: "block", objectFit: "cover" }}
              />

              {/* Stats overlay */}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                padding: "36px 12px 12px",
                background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)",
                pointerEvents: "none",
                display: "flex", justifyContent: "space-between", gap: 6,
              }}>
                {/* Views */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 5,
                  background: "rgba(255,255,255,0.14)",
                  backdropFilter: "blur(14px) saturate(1.8)",
                  WebkitBackdropFilter: "blur(14px) saturate(1.8)",
                  border: "1px solid rgba(255,255,255,0.22)",
                  borderRadius: 100, padding: "5px 10px",
                }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", fontFamily: I }}>{clip.views}</span>
                </div>
                {/* Likes */}
                <div style={{
                  display: "flex", alignItems: "center", gap: 5,
                  background: "rgba(255,255,255,0.14)",
                  backdropFilter: "blur(14px) saturate(1.8)",
                  WebkitBackdropFilter: "blur(14px) saturate(1.8)",
                  border: "1px solid rgba(255,255,255,0.22)",
                  borderRadius: 100, padding: "5px 10px",
                }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="rgba(255,75,75,1)" stroke="none">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", fontFamily: I }}>{clip.likes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
