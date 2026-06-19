"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import { trackEvent } from "@/lib/gtag";

const G = "var(--font-garamond)";
const I = "var(--font-inter)";

const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

function pollForLicenseKey(
  paymentId: string,
  cb: { setPending: (v: boolean) => void; setKey: (v: string | null) => void; setTimedOut: (v: boolean) => void; setPaymentId: (v: string | null) => void }
) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.cursur.app";
  cb.setPaymentId(paymentId);
  cb.setPending(true);
  cb.setKey(null);
  cb.setTimedOut(false);
  const deadline = Date.now() + 30_000;
  function tick() {
    fetch(`${apiUrl}/api/license/lookup?payment_id=${encodeURIComponent(paymentId)}`)
      .then(r => r.json())
      .then((data: { found: boolean; licenseKey?: string }) => {
        if (data.found && data.licenseKey) {
          cb.setPending(false);
          cb.setKey(data.licenseKey);
          trackEvent("purchase_complete", { payment_id: paymentId });
        } else if (Date.now() < deadline) {
          setTimeout(tick, 2000);
        } else {
          cb.setPending(false);
          cb.setTimedOut(true);
        }
      })
      .catch(() => {
        if (Date.now() < deadline) setTimeout(tick, 2000);
        else { cb.setPending(false); cb.setTimedOut(true); }
      });
  }
  tick();
}

export default function BuyPage() {
  const [email, setEmail] = useState("");
  const [paypalReady, setPaypalReady] = useState(false);
  const [paypalRendered, setPaypalRendered] = useState(false);
  const [razorpayReady, setRazorpayReady] = useState(false);
  const [razorpayLoading, setRazorpayLoading] = useState(false);
  const [licenseKey, setLicenseKey] = useState<string | null>(null);
  const [licensePending, setLicensePending] = useState(false);
  const [licenseCopied, setLicenseCopied] = useState(false);
  const [licenseTimedOut, setLicenseTimedOut] = useState(false);
  const [lastPaymentId, setLastPaymentId] = useState<string | null>(null);

  const isIndia = typeof Intl !== "undefined"
    ? ["Asia/Kolkata", "Asia/Calcutta"].includes(Intl.DateTimeFormat().resolvedOptions().timeZone)
    : false;

  const price = isIndia ? "₹399" : "$3.99";
  const emailOk = isValidEmail(email);
  const paid = licenseKey || licensePending || licenseTimedOut;

  const poll = (id: string) => pollForLicenseKey(id, {
    setPending: setLicensePending, setKey: setLicenseKey,
    setTimedOut: setLicenseTimedOut, setPaymentId: setLastPaymentId,
  });

  useEffect(() => {
    if (isIndia || !paypalReady || !(window as any).paypal) return;
    const container = document.getElementById("paypal-container");
    if (container) container.innerHTML = "";
    setPaypalRendered(false);
    (window as any).paypal.HostedButtons({
      hostedButtonId: "92LU4XERGJRJA",
      onApprove: (data: { orderID: string }) => {
        trackEvent("buy_clicked", { method: "paypal" });
        poll(data.orderID);
      },
    }).render("#paypal-container").then(() => {
      requestAnimationFrame(() => setPaypalRendered(true));
    });
  }, [paypalReady, isIndia]);

  async function payWithRazorpay() {
    if (!emailOk) return;
    setRazorpayLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.cursur.app";
    try {
      const res = await fetch(`${apiUrl}/api/razorpay/create-order`, { method: "POST" });
      const order = await res.json();
      if (!order.orderId) throw new Error();
      new (window as any).Razorpay({
        key: order.keyId, amount: order.amount,
        currency: order.currency, order_id: order.orderId,
        name: "cursur", prefill: { email: email.trim() },
        callback_url: "https://cursur.app/payment-success",
        redirect: false,
        handler: (r: { razorpay_payment_id: string }) => {
          trackEvent("buy_clicked", { method: "razorpay" });
          poll(r.razorpay_payment_id);
        },
      }).open();
    } catch { alert("Couldn't start payment. Try again."); }
    finally { setRazorpayLoading(false); }
  }

  // ── Shared card wrapper ──────────────────────────────────────────────────
  const card = (children: React.ReactNode) => (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: "#fff", padding: "40px 24px",
      fontFamily: I,
    }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        {children}
      </div>
    </div>
  );

  // ── Post-payment ─────────────────────────────────────────────────────────
  if (paid) {
    return card(
      licenseKey ? (
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 20, alignItems: "center" }}>
          <img src="/cursor-hero.png" alt="" style={{ width: 90, height: 90, objectFit: "contain" }} />
          <div>
            <h2 style={{ fontFamily: G, fontSize: 30, fontWeight: 500, margin: "0 0 6px", letterSpacing: "-0.02em" }}>You&apos;re in.</h2>
            <p style={{ fontSize: 13, color: "#999", margin: 0, fontWeight: 300 }}>Paste this key into cursur to activate.</p>
          </div>
          <div style={{
            width: "100%", background: "#f6f6f6", borderRadius: 12,
            padding: "16px", fontSize: 12, fontFamily: "monospace",
            wordBreak: "break-all", color: "#333", lineHeight: 1.7, textAlign: "left",
          }}>
            {licenseKey}
          </div>
          <button
            onClick={() => { navigator.clipboard.writeText(licenseKey); setLicenseCopied(true); setTimeout(() => setLicenseCopied(false), 2000); trackEvent("license_key_copied"); }}
            style={{
              width: "100%", padding: "15px 0", borderRadius: 12,
              background: "#111", color: "#fff", border: "none",
              cursor: "pointer", fontFamily: I, fontSize: 15, fontWeight: 600,
            }}
          >
            {licenseCopied ? "✓  Copied!" : "Copy license key"}
          </button>
          <p style={{ fontSize: 12, color: "#ccc", margin: 0, fontWeight: 300 }}>Key also sent to your email.</p>
        </div>
      ) : licensePending ? (
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
          <img src="/cursor-hero.png" alt="" style={{ width: 80, height: 80, objectFit: "contain", opacity: 0.5 }} />
          <p style={{ fontSize: 15, color: "#555", margin: 0 }}>Confirming payment…</p>
          <p style={{ fontSize: 13, color: "#bbb", margin: 0, fontWeight: 300 }}>Your key will appear here in a moment.</p>
        </div>
      ) : (
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
          <p style={{ fontSize: 13, color: "#777", margin: 0 }}>Payment went through — key on its way to your email.</p>
          {lastPaymentId && <p style={{ fontSize: 11, color: "#bbb", margin: 0, fontFamily: "monospace" }}>{lastPaymentId}</p>}
          <button onClick={() => lastPaymentId && poll(lastPaymentId)} style={{ width: "100%", padding: "13px 0", borderRadius: 12, background: "#111", color: "#fff", border: "none", cursor: "pointer", fontFamily: I, fontSize: 14, fontWeight: 600 }}>Check again</button>
          <p style={{ fontSize: 12, color: "#bbb", margin: 0 }}><a href="mailto:support@cursur.app" style={{ color: "#3b82f6" }}>support@cursur.app</a></p>
        </div>
      )
    );
  }

  // ── Checkout ─────────────────────────────────────────────────────────────
  return card(
    <>
      <style>{`
        @keyframes shimmer { 0%{background-position:100% 0} 100%{background-position:0 0} }
        input:focus { border-color: #111 !important; }
      `}</style>

      {!isIndia && (
        <Script src="https://www.paypal.com/sdk/js?client-id=BAANxjkoW5d8mHCzlsIBMPCua8xdTB9HvNVpyqtNP3KWc35bMFmIL9B7FSX_nT3SrKg2FFnZmMch23LUwk&components=hosted-buttons&disable-funding=venmo&currency=USD" crossOrigin="anonymous" strategy="afterInteractive" onLoad={() => setPaypalReady(true)} />
      )}
      {isIndia && (
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" onLoad={() => setRazorpayReady(true)} />
      )}

      {/* Product */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 36 }}>
        <img src="/cursor-hero.png" alt="cursur" style={{ width: 64, height: 64, objectFit: "contain", flexShrink: 0 }} />
        <div>
          <div style={{ fontFamily: G, fontSize: 26, fontWeight: 500, color: "#111", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
            c<span style={{ color: "#3b82f6" }}>u</span>rs<span style={{ color: "#3b82f6" }}>u</span>r
          </div>
          <div style={{ fontSize: 12, color: "#aaa", fontWeight: 300, marginTop: 3 }}>macOS · lifetime license</div>
        </div>
        <div style={{ marginLeft: "auto", textAlign: "right" }}>
          <div style={{ fontFamily: G, fontSize: 28, fontWeight: 500, color: "#111", letterSpacing: "-0.02em" }}>{price}</div>
          <div style={{ fontSize: 11, color: "#ccc", fontWeight: 300 }}>one-time</div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "#f0f0f0", marginBottom: 28 }} />

      {/* Email */}
      <input
        type="email"
        placeholder="Email address"
        value={email}
        onChange={e => setEmail(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter" && emailOk && isIndia) payWithRazorpay(); }}
        style={{
          width: "100%", padding: "14px 16px", borderRadius: 12,
          border: "1.5px solid #e8e8e8", fontSize: 14, color: "#111",
          fontFamily: I, outline: "none", marginBottom: 12,
          transition: "border-color 0.15s",
        }}
      />

      {/* Pay */}
      {isIndia ? (
        <button
          onClick={payWithRazorpay}
          disabled={!razorpayReady || razorpayLoading || !emailOk}
          style={{
            width: "100%", height: 52, borderRadius: 12,
            background: emailOk ? "#111" : "#f0f0f0",
            color: emailOk ? "#fff" : "#bbb",
            border: "none",
            cursor: emailOk && razorpayReady ? "pointer" : "default",
            fontFamily: I, fontSize: 15, fontWeight: 600,
            transition: "background 0.2s, color 0.2s",
          }}
        >
          {razorpayLoading ? "Opening…" : !razorpayReady ? "Loading…" : "Pay ₹399"}
        </button>
      ) : (
        <div style={{ pointerEvents: emailOk ? "auto" : "none", opacity: emailOk ? 1 : 0.35, transition: "opacity 0.2s" }}>
          <div style={{ position: "relative", minHeight: 52, borderRadius: 12, overflow: "hidden" }}>
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(90deg,#f3f3f3 25%,#ececec 37%,#f3f3f3 63%)",
              backgroundSize: "400% 100%",
              animation: "shimmer 1.4s ease-in-out infinite",
              opacity: paypalRendered ? 0 : 1,
              pointerEvents: "none", transition: "opacity 0.3s",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, color: "#bbb",
            }}>Loading…</div>
            <div id="paypal-container" style={{ width: "100%", opacity: paypalRendered ? 1 : 0, transition: "opacity 0.3s" }} />
          </div>
        </div>
      )}

      {/* Subtext */}
      <p style={{ fontSize: 12, color: "#ccc", textAlign: "center", margin: "14px 0 0", fontWeight: 300 }}>
        🔒 Key delivered instantly · also sent to your email
      </p>

      <p style={{ fontSize: 12, textAlign: "center", margin: "28px 0 0" }}>
        <a href="/" style={{ color: "#ccc", textDecoration: "none" }}>← Back to cursur.app</a>
      </p>
    </>
  );
}
