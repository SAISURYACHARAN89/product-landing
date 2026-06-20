"use client";

// Image: cursor-hero-2x.png — 819×1131, displayed at 420×580
// Eye centres (display px): left=(118,232) right=(197,220), radius≈43

export default function CursorMascot() {
  return (
    <>
      <style>{`
        @keyframes mascot-float {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-7px); }
        }
        @keyframes mascot-click {
          /* idle most of the time — animation-duration is long so the active part is rare */
          0%,88%,100% { transform: translateY(0px) rotate(0deg); }
          90%          { transform: translateY(-10px) rotate(-4deg); }
          94%          { transform: translateY(-8px) rotate(-3deg); }
          97%          { transform: translateY(-3px) rotate(-1deg); }
        }

        /* Left eye — slow tired blink */
        @keyframes blink-l {
          0%,72%,100% { height: 0%; }
          78%          { height: 88%; }
          84%          { height: 88%; }
          90%          { height: 0%; }
        }
        /* Right eye — independent, slightly different timing */
        @keyframes blink-r {
          0%,40%,100% { height: 0%; }
          46%          { height: 88%; }
          54%          { height: 88%; }
          60%          { height: 0%; }
        }
      `}</style>

      {/* Float wrapper */}
      <div style={{ animation: "mascot-float 4.5s ease-in-out infinite", display: "inline-block" }}>
        {/* Click / stick-raise wrapper */}
        <div style={{ animation: "mascot-click 9s ease-in-out infinite", display: "inline-block", position: "relative", width: 420, height: 580 }}>

          <img
            src="/cursor-hero-2x.png"
            alt="cursur mascot"
            style={{ width: 420, height: 580, objectFit: "contain", display: "block", userSelect: "none" }}
            draggable={false}
          />

          {/* ── Left eye blink overlay ── */}
          <div style={{
            position: "absolute",
            left: 75, top: 189,
            width: 86, height: 86,
            borderRadius: "50%",
            overflow: "hidden",
            pointerEvents: "none",
          }}>
            {/* Lid curtain — sweeps down from top */}
            <div style={{
              position: "absolute",
              top: 0, left: 0, right: 0,
              background: "rgba(220,220,228,0.97)",
              borderRadius: "50% 50% 48% 48% / 30% 30% 50% 50%",
              animation: "blink-l 7s ease-in-out infinite",
            }} />
          </div>

          {/* ── Right eye blink overlay ── */}
          <div style={{
            position: "absolute",
            left: 154, top: 177,
            width: 86, height: 86,
            borderRadius: "50%",
            overflow: "hidden",
            pointerEvents: "none",
          }}>
            <div style={{
              position: "absolute",
              top: 0, left: 0, right: 0,
              background: "rgba(220,220,228,0.97)",
              borderRadius: "50% 50% 48% 48% / 30% 30% 50% 50%",
              animation: "blink-r 11s ease-in-out infinite",
            }} />
          </div>

        </div>
      </div>
    </>
  );
}
