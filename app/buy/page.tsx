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
  const [tab, setTab] = useState<"card" | "alt">("card");
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
  const altLabel = isIndia ? "Razorpay" : "PayPal";
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
      <div style={{ minHeight: "100vh", background: "#161616", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: I }}>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ background: "#1e1e1e", border: "1px solid #2a2a2a", borderRadius: 16, padding: "40px 36px", width: "100%", maxWidth: 400 }}>
          {licenseKey ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "center", textAlign: "center" }}>
              <div style={{ width: 52, height: 52, background: "rgba(34,197,94,0.12)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: "#22c55e" }}>✓</div>
              <div>
                <h2 style={{ fontFamily: G, fontSize: 26, fontWeight: 500, margin: "0 0 6px", letterSpacing: "-0.02em", color: "#fff" }}>You&apos;re in.</h2>
                <p style={{ fontSize: 13, color: "#666", margin: 0 }}>Paste this into cursur to activate.</p>
              </div>
              <div style={{ width: "100%", background: "#111", border: "1px solid #2a2a2a", borderRadius: 10, padding: "14px 16px", fontSize: 11.5, fontFamily: "monospace", wordBreak: "break-all", color: "#ccc", lineHeight: 1.8, textAlign: "left" }}>
                {licenseKey}
              </div>
              <button
                onClick={() => { navigator.clipboard.writeText(licenseKey); setLicenseCopied(true); setTimeout(() => setLicenseCopied(false), 2000); trackEvent("license_key_copied"); }}
                style={{ width: "100%", padding: "14px 0", borderRadius: 10, background: "#fff", color: "#111", border: "none", cursor: "pointer", fontFamily: I, fontSize: 14, fontWeight: 600 }}
              >
                {licenseCopied ? "✓  Copied!" : "Copy license key"}
              </button>
              <p style={{ fontSize: 12, color: "#444", margin: 0 }}>Also sent to your email.</p>
            </div>
          ) : licensePending ? (
            <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
              <div style={{ width: 40, height: 40, border: "2.5px solid #2a2a2a", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
              <p style={{ fontSize: 15, color: "#ccc", margin: 0, fontWeight: 500 }}>Confirming payment…</p>
              <p style={{ fontSize: 13, color: "#555", margin: 0 }}>Your key will appear here in a moment.</p>
            </div>
          ) : (
            <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: 14, alignItems: "center" }}>
              <p style={{ fontSize: 13, color: "#888", margin: 0 }}>Payment went through — key on its way to your email.</p>
              {lastPaymentId && <p style={{ fontSize: 11, color: "#444", margin: 0, fontFamily: "monospace" }}>{lastPaymentId}</p>}
              <button onClick={() => lastPaymentId && poll(lastPaymentId)} style={{ width: "100%", padding: "13px 0", borderRadius: 10, background: "#fff", color: "#111", border: "none", cursor: "pointer", fontFamily: I, fontSize: 14, fontWeight: 600 }}>Check again</button>
              <a href="mailto:support@cursur.app" style={{ fontSize: 12, color: "#555" }}>support@cursur.app</a>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Checkout ─────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#161616", fontFamily: I, display: "flex" }}>
      <style>{`
        @keyframes shimmer { 0%{background-position:100% 0} 100%{background-position:0 0} }
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: #3a3a3a; }
        input:focus { border-color: #555 !important; outline: none; }
        * { box-sizing: border-box; }
        @media (max-width: 700px) {
          .checkout-panels { flex-direction: column !important; }
          .checkout-left { border-right: none !important; border-bottom: 1px solid #222; }
        }
      `}</style>

      {!isIndia && (
        <Script src="https://www.paypal.com/sdk/js?client-id=BAANxjkoW5d8mHCzlsIBMPCua8xdTB9HvNVpyqtNP3KWc35bMFmIL9B7FSX_nT3SrKg2FFnZmMch23LUwk&components=hosted-buttons&disable-funding=venmo&currency=USD" crossOrigin="anonymous" strategy="afterInteractive" onLoad={() => setPaypalReady(true)} />
      )}
      {isIndia && (
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" onLoad={() => setRazorpayReady(true)} />
      )}

      <div className="checkout-panels" style={{ flex: 1, display: "flex", flexWrap: "wrap" }}>

        {/* ── Left panel ── */}
        <div className="checkout-left" style={{ flex: "1 1 320px", padding: "52px 48px", borderRight: "1px solid #222", display: "flex", flexDirection: "column" }}>

          {/* Product */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 32 }}>
            <div style={{ width: 52, height: 52, background: "#222", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <img src="/cursor-hero.png" alt="cursur" style={{ width: 36, height: 36, objectFit: "contain" }} />
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, color: "#fff" }}>cursur</div>
          </div>

          {/* Big price */}
          <div style={{ fontFamily: G, fontSize: 48, fontWeight: 500, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1, marginBottom: 32 }}>{price}</div>

          {/* Line items */}
          <div style={{ borderTop: "1px solid #222", paddingTop: 20, display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#666" }}>
              <span>Subtotal</span>
              <span>{price}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#666" }}>
              <span>Taxes</span>
              <span>$0</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 600, color: "#fff", borderTop: "1px solid #222", paddingTop: 16, marginTop: 2 }}>
              <span>Total</span>
              <span>{price}</span>
            </div>
          </div>

          {/* Copy */}
          <div style={{ marginTop: 28 }}>
            <p style={{ fontSize: 13, color: "#555", lineHeight: 1.65, margin: "0 0 6px" }}>
              🔒 One-time payment. No subscriptions, ever.
            </p>
            <p style={{ fontSize: 13, color: "#444", lineHeight: 1.65, margin: 0 }}>
              License key delivered instantly after payment and also sent to your email.
            </p>
          </div>
        </div>

        {/* ── Right panel ── */}
        <div style={{ flex: "1 1 320px", padding: "52px 48px", display: "flex", flexDirection: "column" }}>

          {/* Email */}
          <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#888", marginBottom: 8 }}>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && emailOk) { tab === "card" ? payWithRazorpay() : (isIndia ? payWithRazorpay() : undefined); } }}
            style={{
              width: "100%", padding: "13px 16px", borderRadius: 10,
              border: "1.5px solid #2a2a2a", fontSize: 14, color: "#fff",
              fontFamily: I, marginBottom: 24, transition: "border-color 0.15s",
              background: "#1e1e1e",
            }}
          />

          {/* Payment method tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
            {(["card", "alt"] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  flex: 1, padding: "11px 0", borderRadius: 10,
                  background: tab === t ? "#2a2a2a" : "transparent",
                  border: tab === t ? "1.5px solid #3a3a3a" : "1.5px solid #232323",
                  color: tab === t ? "#fff" : "#555",
                  fontFamily: I, fontSize: 13, fontWeight: 600,
                  cursor: "pointer", transition: "all 0.15s",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                }}
              >
                {t === "card" ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                    Card
                  </>
                ) : altLabel}
              </button>
            ))}
          </div>

          {/* Payment action */}
          <div style={{ pointerEvents: emailOk ? "auto" : "none", opacity: emailOk ? 1 : 0.35, transition: "opacity 0.2s" }}>
            {tab === "card" || isIndia ? (
              /* Card tab or India always uses Razorpay (supports cards + UPI) */
              <button
                onClick={payWithRazorpay}
                disabled={!razorpayReady || razorpayLoading}
                style={{
                  width: "100%", height: 52, borderRadius: 10,
                  background: "#fff", color: "#111",
                  border: "none",
                  cursor: razorpayReady ? "pointer" : "default",
                  fontFamily: I, fontSize: 15, fontWeight: 600,
                }}
              >
                {razorpayLoading ? "Opening…" : !razorpayReady ? "Loading…" : `Pay now`}
              </button>
            ) : (
              /* Alt tab + international = PayPal widget */
              <div style={{ position: "relative", minHeight: 52, borderRadius: 10, overflow: "hidden" }}>
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(90deg,#222 25%,#282828 37%,#222 63%)",
                  backgroundSize: "400% 100%",
                  animation: "shimmer 1.4s ease-in-out infinite",
                  opacity: paypalRendered ? 0 : 1,
                  pointerEvents: "none", transition: "opacity 0.3s",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, color: "#555",
                }}>Loading…</div>
                <div id="paypal-container" style={{ width: "100%", opacity: paypalRendered ? 1 : 0, transition: "opacity 0.3s" }} />
              </div>
            )}
          </div>

          {/* Legal */}
          <div style={{ marginTop: 20 }}>
            <p style={{ fontSize: 11.5, color: "#3a3a3a", lineHeight: 1.7, margin: 0 }}>
              By completing your purchase you agree to our{" "}
              <a href="/terms" style={{ color: "#555", textDecoration: "underline" }}>Terms of Service</a>.
              {" "}This is a one-time charge.
            </p>
            <div style={{ marginTop: 14 }}>
              <a href="/" style={{ fontSize: 12, color: "#3a3a3a", textDecoration: "none" }}>← Back to cursur.app</a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
