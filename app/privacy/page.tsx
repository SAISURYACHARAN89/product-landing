export default function PrivacyPolicy() {
  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "80px 32px", fontFamily: "var(--font-inter)", color: "#111" }}>
      <a href="/" style={{ fontSize: 13, color: "#aaa", textDecoration: "none", display: "inline-block", marginBottom: 48 }}>← Back to cursur</a>
      <h1 style={{ fontFamily: "var(--font-garamond)", fontSize: 48, fontWeight: 500, lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: 12 }}>Privacy Policy</h1>
      <p style={{ fontSize: 13, color: "#aaa", marginBottom: 48 }}>Last updated: June 2025</p>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontFamily: "var(--font-garamond)", fontSize: 22, fontWeight: 500, marginBottom: 10 }}>What we collect</h2>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: "#444", fontWeight: 300 }}>
          Cursur is an OS-level cursor personalisation app. We collect minimal data. If you opt in to the Windows notification list, we store your email address solely to notify you when Windows support launches. We do not sell, share, or use your email for any other purpose.
        </p>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontFamily: "var(--font-garamond)", fontSize: 22, fontWeight: 500, marginBottom: 10 }}>How the app works</h2>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: "#444", fontWeight: 300 }}>
          Cursur runs locally on your device. It reads the active application context to determine which animation to display. No screen content, keystrokes, or personal data are transmitted off your device. Everything stays on your machine.
        </p>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontFamily: "var(--font-garamond)", fontSize: 22, fontWeight: 500, marginBottom: 10 }}>Refund programme</h2>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: "#444", fontWeight: 300 }}>
          If you participate in our creator refund programme, you voluntarily send us a link to your post. We use that link only to verify the view count and process your refund. We do not store or share the link beyond that.
        </p>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontFamily: "var(--font-garamond)", fontSize: 22, fontWeight: 500, marginBottom: 10 }}>Cookies</h2>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: "#444", fontWeight: 300 }}>
          This website uses localStorage to remember your Windows notification preference. No third-party tracking cookies are used.
        </p>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontFamily: "var(--font-garamond)", fontSize: 22, fontWeight: 500, marginBottom: 10 }}>Contact</h2>
        <p style={{ fontSize: 15, lineHeight: 1.7, color: "#444", fontWeight: 300 }}>
          Questions? Email us at <a href="mailto:cursurapp@gmail.com" style={{ color: "#3b82f6", textDecoration: "none" }}>cursurapp@gmail.com</a>
        </p>
      </section>
    </div>
  );
}
