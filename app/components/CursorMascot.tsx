"use client";

export default function CursorMascot() {
  return (
    <>
      <style>{`
        @keyframes float {
          0%   { transform: translateY(0px) rotate(-1.5deg); }
          30%  { transform: translateY(-14px) rotate(0.5deg); }
          60%  { transform: translateY(-8px) rotate(-0.8deg); }
          100% { transform: translateY(0px) rotate(-1.5deg); }
        }
        @keyframes stick-brush {
          0%,100% { transform: rotate(0deg); transform-origin: 30% 20%; }
          20%     { transform: rotate(-6deg); transform-origin: 30% 20%; }
          50%     { transform: rotate(4deg); transform-origin: 30% 20%; }
          75%     { transform: rotate(-3deg); transform-origin: 30% 20%; }
        }
        @keyframes blink-left {
          0%,8%,100%  { transform: scaleY(1); }
          4%           { transform: scaleY(0.06); }
        }
        @keyframes blink-right {
          0%,55%,63%,100% { transform: scaleY(1); }
          59%              { transform: scaleY(0.06); }
        }
        @keyframes drift {
          0%,100% { transform: translateX(0); }
          40%     { transform: translateX(6px); }
          70%     { transform: translateX(-4px); }
        }
      `}</style>

      {/* Outer: slow horizontal drift */}
      <div style={{ animation: "drift 9s ease-in-out infinite", display: "inline-block" }}>
        {/* Middle: float up/down */}
        <div style={{ animation: "float 5s ease-in-out infinite", display: "inline-block", position: "relative" }}>

          {/* GIF — stick gets its own animation via wrapper */}
          <div style={{ animation: "stick-brush 7s ease-in-out infinite", display: "inline-block" }}>
            <img
              src="/cursor-mascot.gif"
              alt="cursur mascot"
              style={{ width: 260, height: 260, objectFit: "contain", display: "block", userSelect: "none" }}
              draggable={false}
            />
          </div>

          {/* Left eye blink overlay — positioned over the left eye in the GIF */}
          <div style={{
            position: "absolute",
            top: "37%", left: "32%",
            width: "13%", height: "9%",
            background: "#e8e8e8",
            borderRadius: "50%",
            animation: "blink-left 7s ease-in-out infinite",
            transformOrigin: "center center",
            pointerEvents: "none",
          }} />

          {/* Right eye blink overlay */}
          <div style={{
            position: "absolute",
            top: "37%", left: "46%",
            width: "13%", height: "9%",
            background: "#e8e8e8",
            borderRadius: "50%",
            animation: "blink-right 11s ease-in-out infinite",
            transformOrigin: "center center",
            pointerEvents: "none",
          }} />

        </div>
      </div>
    </>
  );
}
