"use client";

export default function CursorMascot() {
  return (
    <img
      src="/cursor-cropped.gif"
      alt="cursur mascot"
      style={{
        width: 340,
        height: "auto",
        objectFit: "contain",
        display: "block",
        userSelect: "none",
        imageRendering: "auto",
      }}
      draggable={false}
    />
  );
}
