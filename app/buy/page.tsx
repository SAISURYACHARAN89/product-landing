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

  // ── Post-payment ─────────────────────────────────────────────────────────
  if (paid) {
    return (
      <div style={{ minHeight: "100vh", background: "#f7f7f5", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: I }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: "40px 36px", width: "100%", maxWidth: 400, boxShadow: "0 2px 24px rgba(0,0,0,0.07)" }}>
          {licenseKey ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "center", textAlign: "center" }}>
              <div style={{ width: 56, height: 56, background: "#f0fdf4", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>✓</div>
              <div>
                <h2 style={{ fontFamily: G, fontSize: 26, fontWeight: 500, margin: "0 0 6px", letterSpacing: "-0.02em" }}>You&apos;re in.</h2>
                <p style={{ fontSize: 13, color: "#888", margin: 0 }}>Paste this into cursur to activate.</p>
              </div>
              <div style={{ width: "100%", background: "#f7f7f5", borderRadius: 10, padding: "14px 16px", fontSize: 11.5, fontFamily: "monospace", wordBreak: "break-all", color: "#333", lineHeight: 1.8, textAlign: "left" }}>
                {licenseKey}
              </div>
              <button
                onClick={() => { navigator.clipboard.writeText(licenseKey); setLicenseCopied(true); setTimeout(() => setLicenseCopied(false), 2000); trackEvent("license_key_copied"); }}
                style={{ width: "100%", padding: "14px 0", borderRadius: 10, background: "#111", color: "#fff", border: "none", cursor: "pointer", fontFamily: I, fontSize: 14, fontWeight: 600 }}
              >
                {licenseCopied ? "✓  Copied!" : "Copy license key"}
              </button>
              <p style={{ fontSize: 12, color: "#ccc", margin: 0 }}>Also sent to your email.</p>
            </div>
          ) : licensePending ? (
            <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
              <div style={{ width: 40, height: 40, border: "2.5px solid #e8e8e8", borderTopColor: "#111", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
              <p style={{ fontSize: 15, color: "#444", margin: 0, fontWeight: 500 }}>Confirming payment…</p>
              <p style={{ fontSize: 13, color: "#aaa", margin: 0 }}>Your key will appear here in a moment.</p>
            </div>
          ) : (
            <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 14, alignItems: "center" }}>
              <p style={{ fontSize: 13, color: "#666", margin: 0 }}>Payment went through — key on its way to your email.</p>
              {lastPaymentId && <p style={{ fontSize: 11, color: "#bbb", margin: 0, fontFamily: "monospace" }}>{lastPaymentId}</p>}
              <button onClick={() => lastPaymentId && poll(lastPaymentId)} style={{ width: "100%", padding: "13px 0", borderRadius: 10, background: "#111", color: "#fff", border: "none", cursor: "pointer", fontFamily: I, fontSize: 14, fontWeight: 600 }}>Check again</button>
              <a href="mailto:support@cursur.app" style={{ fontSize: 12, color: "#aaa" }}>support@cursur.app</a>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Checkout ─────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#f7f7f5", fontFamily: I }}>
      <style>{`
        @keyframes shimmer { 0%{background-position:100% 0} 100%{background-position:0 0} }
        @keyframes spin { to { transform: rotate(360deg); } }
        input:focus { border-color: #111 !important; outline: none; }
        * { box-sizing: border-box; }
      `}</style>

      {!isIndia && (
        <Script src="https://www.paypal.com/sdk/js?client-id=BAANxjkoW5d8mHCzlsIBMPCua8xdTB9HvNVpyqtNP3KWc35bMFmIL9B7FSX_nT3SrKg2FFnZmMch23LUwk&components=hosted-buttons&disable-funding=venmo&currency=USD" crossOrigin="anonymous" strategy="afterInteractive" onLoad={() => setPaypalReady(true)} />
      )}
      {isIndia && (
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" onLoad={() => setRazorpayReady(true)} />
      )}

      {/* Top bar */}
      <div style={{ borderBottom: "1px solid #ebebeb", background: "#fff", padding: "0 32px", height: 56, display: "flex", alignItems: "center", gap: 8 }}>
        <img src="/cursor-hero.png" alt="" style={{ width: 28, height: 28, objectFit: "contain" }} />
        <span style={{ fontFamily: G, fontSize: 20, fontWeight: 500, color: "#111", letterSpacing: "-0.02em" }}>
          c<span style={{ color: "#3b82f6" }}>u</span>rs<span style={{ color: "#3b82f6" }}>u</span>r
        </span>
      </div>

      {/* Main */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "48px 24px", gap: 24, flexWrap: "wrap" }}>

        {/* Left: summary */}
        <div style={{ width: "100%", maxWidth: 340 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#aaa", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 20px" }}>Order summary</p>

          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
            <img src="/cursor-hero.png" alt="" style={{ width: 52, height: 52, objectFit: "contain", flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 600, fontSize: 15, color: "#111" }}>cursur</div>
              <div style={{ fontSize: 12, color: "#aaa", marginTop: 2 }}>macOS · Lifetime license</div>
            </div>
            <div style={{ marginLeft: "auto", fontWeight: 700, fontSize: 18, color: "#111" }}>{price}</div>
          </div>

          <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              ["⚡️", "Instant delivery", "License key shown immediately after payment"],
              ["📧", "Email backup", "Key also sent to your inbox"],
              ["♾️", "Lifetime access", "One-time payment, use forever"],
            ].map(([icon, title, desc]) => (
              <div key={title} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ fontSize: 16, lineHeight: 1, marginTop: 1 }}>{icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#333" }}>{title}</div>
                  <div style={{ fontSize: 12, color: "#aaa", marginTop: 1 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: payment card */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "28px 28px", width: "100%", maxWidth: 380, boxShadow: "0 1px 12px rgba(0,0,0,0.06)", border: "1px solid #ebebeb" }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#aaa", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 18px" }}>Payment</p>

          <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#555", marginBottom: 6 }}>Email address</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && emailOk && isIndia) payWithRazorpay(); }}
            style={{
              width: "100%", padding: "11px 14px", borderRadius: 10,
              border: "1.5px solid #e0e0e0", fontSize: 14, color: "#111",
              fontFamily: I, marginBottom: 16, transition: "border-color 0.15s",
              background: "#fff",
            }}
          />

          {isIndia ? (
            <button
              onClick={payWithRazorpay}
              disabled={!razorpayReady || razorpayLoading || !emailOk}
              style={{
                width: "100%", height: 48, borderRadius: 10,
                background: emailOk ? "#111" : "#f0f0f0",
                color: emailOk ? "#fff" : "#bbb",
                border: "none",
                cursor: emailOk && razorpayReady ? "pointer" : "default",
                fontFamily: I, fontSize: 15, fontWeight: 600,
                transition: "background 0.2s, color 0.2s",
              }}
            >
              {razorpayLoading ? "Opening…" : !razorpayReady ? "Loading…" : `Pay ₹399`}
            </button>
          ) : (
            <div style={{ pointerEvents: emailOk ? "auto" : "none", opacity: emailOk ? 1 : 0.4, transition: "opacity 0.2s" }}>
              <div style={{ position: "relative", minHeight: 48, borderRadius: 10, overflow: "hidden" }}>
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

          <div style={{ marginTop: 16, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <span style={{ fontSize: 10.5, color: "#ccc", marginRight: 4 }}>🔒</span>
            {/* Apple Pay */}
            <div style={{ background: "#f5f5f5", borderRadius: 6, padding: "4px 9px", fontSize: 11, fontWeight: 700, color: "#333", letterSpacing: "-0.02em" }}>Apple Pay</div>
            {/* PayPal */}
            <div style={{ background: "#f5f5f5", borderRadius: 6, padding: "4px 9px", fontSize: 11, fontWeight: 700, color: "#003087" }}>Pay<span style={{ color: "#009cde" }}>Pal</span></div>
            {/* Razorpay */}
            <div style={{ background: "#f5f5f5", borderRadius: 6, padding: "4px 9px", fontSize: 11, fontWeight: 700, color: "#2d68fe" }}>Razorpay</div>
          </div>
        </div>
      </div>

      <div style={{ textAlign: "center", paddingBottom: 32 }}>
        <a href="/" style={{ fontSize: 12, color: "#bbb", textDecoration: "none" }}>← Back to cursur.app</a>
      </div>
    </div>
  );
}
