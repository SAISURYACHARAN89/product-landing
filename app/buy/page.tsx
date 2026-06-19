"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import { trackEvent } from "@/lib/gtag";

const G = "var(--font-garamond)";
const I = "var(--font-inter)";

function pollForLicenseKey(
  paymentId: string,
  setLicensePending: (v: boolean) => void,
  setLicenseKey: (v: string | null) => void,
  setLicenseTimedOut: (v: boolean) => void,
  setLastPaymentId: (v: string | null) => void,
) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.cursur.app";
  setLastPaymentId(paymentId);
  setLicensePending(true);
  setLicenseKey(null);
  setLicenseTimedOut(false);
  const deadline = Date.now() + 30_000;
  function tick() {
    fetch(`${apiUrl}/api/license/lookup?payment_id=${encodeURIComponent(paymentId)}`)
      .then(r => r.json())
      .then((data: { found: boolean; licenseKey?: string }) => {
        if (data.found && data.licenseKey) {
          setLicensePending(false);
          setLicenseKey(data.licenseKey);
          trackEvent("purchase_complete", { payment_id: paymentId });
        } else if (Date.now() < deadline) {
          setTimeout(tick, 2000);
        } else {
          setLicensePending(false);
          setLicenseTimedOut(true);
        }
      })
      .catch(() => {
        if (Date.now() < deadline) setTimeout(tick, 2000);
        else { setLicensePending(false); setLicenseTimedOut(true); }
      });
  }
  tick();
}

export default function BuyPage() {
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

  const poll = (id: string) => pollForLicenseKey(
    id, setLicensePending, setLicenseKey, setLicenseTimedOut, setLastPaymentId
  );

  useEffect(() => {
    if (!isIndia && paypalReady && (window as any).paypal) {
      const container = document.getElementById("paypal-buy-container");
      if (container) container.innerHTML = "";
      (window as any).paypal.HostedButtons({
        hostedButtonId: "92LU4XERGJRJA",
        onApprove: (data: { orderID: string }) => {
          trackEvent("buy_clicked", { method: "paypal" });
          poll(data.orderID);
        },
      }).render("#paypal-buy-container").then(() => {
        requestAnimationFrame(() => setPaypalRendered(true));
      });
    }
  }, [paypalReady, isIndia]);

  async function payWithRazorpay() {
    setRazorpayLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.cursur.app";
    try {
      const res = await fetch(`${apiUrl}/api/razorpay/create-order`, { method: "POST" });
      const order = await res.json();
      if (!order.orderId) throw new Error("No order id");
      new (window as any).Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: "cursur",
        callback_url: "https://cursur.app/payment-success",
        redirect: false,
        handler: (response: { razorpay_payment_id: string }) => {
          trackEvent("buy_clicked", { method: "razorpay" });
          poll(response.razorpay_payment_id);
        },
      }).open();
    } catch {
      alert("Couldn't start payment. Please try again.");
    } finally {
      setRazorpayLoading(false);
    }
  }

  const paid = licenseKey || licensePending || licenseTimedOut;

  return (
    <div style={{ minHeight: "100vh", background: "#fff", fontFamily: I }}>
      <style>{`
        @keyframes cursur-shimmer {
          0% { background-position: 100% 0; }
          100% { background-position: 0 0; }
        }
        * { box-sizing: border-box; }
      `}</style>

      {!isIndia && (
        <Script
          src="https://www.paypal.com/sdk/js?client-id=BAANxjkoW5d8mHCzlsIBMPCua8xdTB9HvNVpyqtNP3KWc35bMFmIL9B7FSX_nT3SrKg2FFnZmMch23LUwk&components=hosted-buttons&disable-funding=venmo&currency=USD"
          crossOrigin="anonymous"
          strategy="afterInteractive"
          onLoad={() => setPaypalReady(true)}
        />
      )}
      {isIndia && (
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
          onLoad={() => setRazorpayReady(true)}
        />
      )}

      {/* Top nav */}
      <div style={{ padding: "20px 40px", borderBottom: "1px solid #f0f0f0" }}>
        <a href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 7 }}>
          <img src="/logo.png" alt="" style={{ width: 26, height: 26, objectFit: "contain" }} />
          <span style={{ fontFamily: G, fontSize: 22, fontWeight: 500, color: "#111", lineHeight: 1 }}>
            c<span style={{ color: "#3b82f6" }}>u</span>rs<span style={{ color: "#3b82f6" }}>u</span>r
          </span>
        </a>
      </div>

      {paid ? (
        /* ── Post-payment: full screen centered ── */
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 68px)", padding: 40 }}>
          <div style={{ width: "100%", maxWidth: 360, textAlign: "center" }}>
            {licenseKey ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ fontSize: 40, marginBottom: 4 }}>🎉</div>
                <h2 style={{ fontFamily: G, fontSize: 28, fontWeight: 500, margin: 0, letterSpacing: "-0.015em" }}>You&apos;re in.</h2>
                <p style={{ fontSize: 13, color: "#888", margin: 0, fontWeight: 300 }}>Copy your license key and paste it into cursur to activate.</p>
                <div style={{ background: "#f6f6f6", borderRadius: 10, padding: "14px 16px", fontSize: 11.5, fontFamily: "monospace", wordBreak: "break-all", color: "#333", lineHeight: 1.6, textAlign: "left", marginTop: 4 }}>
                  {licenseKey}
                </div>
                <button
                  onClick={() => { navigator.clipboard.writeText(licenseKey); setLicenseCopied(true); setTimeout(() => setLicenseCopied(false), 2000); trackEvent("license_key_copied"); }}
                  style={{ width: "100%", padding: "14px 0", borderRadius: 10, background: "#111", color: "#fff", border: "none", cursor: "pointer", fontFamily: I, fontSize: 14, fontWeight: 600 }}
                >
                  {licenseCopied ? "✓ Copied!" : "Copy license key"}
                </button>
                <p style={{ fontSize: 12, color: "#ccc", margin: 0 }}>Also sent to your email.</p>
              </div>
            ) : licensePending ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <p style={{ fontSize: 15, color: "#555", margin: 0 }}>Confirming payment…</p>
                <p style={{ fontSize: 13, color: "#bbb", margin: 0, fontWeight: 300 }}>Your key will appear here in a moment.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <p style={{ fontSize: 13, color: "#777", margin: 0 }}>Taking longer than usual — we&apos;ll email your key shortly.</p>
                {lastPaymentId && <p style={{ fontSize: 11, color: "#bbb", margin: 0, fontFamily: "monospace" }}>Ref: {lastPaymentId}</p>}
                <button onClick={() => lastPaymentId && poll(lastPaymentId)} style={{ width: "100%", padding: "13px 0", borderRadius: 10, background: "#111", color: "#fff", border: "none", cursor: "pointer", fontFamily: I, fontSize: 14, fontWeight: 600 }}>
                  Check again
                </button>
                <p style={{ fontSize: 12, color: "#bbb", margin: 0 }}>
                  <a href="mailto:support@cursur.app" style={{ color: "#3b82f6" }}>support@cursur.app</a>
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ── Checkout: two column ── */
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          minHeight: "calc(100vh - 68px)",
        }}
          className="checkout-cols"
        >
          {/* LEFT — form */}
          <div style={{ padding: "56px 48px 56px 10%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <h1 style={{ fontFamily: G, fontSize: 26, fontWeight: 500, letterSpacing: "-0.015em", margin: "0 0 6px", color: "#111" }}>
              Contact
            </h1>
            <p style={{ fontSize: 13, color: "#aaa", margin: "0 0 28px", fontWeight: 300 }}>
              Your license key will be sent here.
            </p>

            <input
              type="email"
              placeholder="Email"
              style={{
                width: "100%", padding: "14px 16px", borderRadius: 10,
                border: "1px solid #e0e0e0", fontSize: 14, color: "#111",
                fontFamily: I, outline: "none", marginBottom: 32,
                background: "#fff",
              }}
            />

            {isIndia ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <button
                  onClick={payWithRazorpay}
                  disabled={!razorpayReady || razorpayLoading}
                  style={{
                    width: "100%", height: 52, borderRadius: 12,
                    background: "#111", color: "#fff", border: "none",
                    cursor: razorpayReady ? "pointer" : "default",
                    opacity: razorpayReady ? 1 : 0.5,
                    fontFamily: I, fontSize: 15, fontWeight: 600,
                    transition: "opacity 0.15s",
                  }}
                >
                  {razorpayLoading ? "Opening…" : !razorpayReady ? "Loading…" : `Pay ₹399`}
                </button>
                <p style={{ fontSize: 11, color: "#ccc", margin: 0, textAlign: "center" }}>UPI · Cards · Netbanking</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ position: "relative", minHeight: 50 }}>
                  <div style={{
                    position: "absolute", inset: 0, borderRadius: 10,
                    background: "linear-gradient(90deg, #f3f3f3 25%, #ececec 37%, #f3f3f3 63%)",
                    backgroundSize: "400% 100%",
                    animation: "cursur-shimmer 1.4s ease-in-out infinite",
                    opacity: paypalRendered ? 0 : 1,
                    pointerEvents: "none",
                    transition: "opacity 0.3s",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, color: "#bbb",
                  }}>
                    Loading…
                  </div>
                  <div id="paypal-buy-container" style={{ width: "100%", opacity: paypalRendered ? 1 : 0, transition: "opacity 0.3s" }} />
                </div>
                <p style={{ fontSize: 11, color: "#ccc", margin: 0, textAlign: "center" }}>PayPal · Debit · Credit · Apple Pay</p>
              </div>
            )}
          </div>

          {/* RIGHT — order summary */}
          <div style={{ background: "#f7f7f8", borderLeft: "1px solid #efefef", padding: "56px 10% 56px 48px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            {/* Product row */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28, paddingBottom: 28, borderBottom: "1px solid #e8e8e8" }}>
              <div style={{ width: 52, height: 52, borderRadius: 12, background: "#111", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <img src="/logo.png" alt="" style={{ width: 30, height: 30, objectFit: "contain" }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: "#111" }}>cursur</div>
                <div style={{ fontSize: 12, color: "#aaa", fontWeight: 300, marginTop: 2 }}>macOS · Lifetime license</div>
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#111" }}>{price}</div>
            </div>

            {/* Total */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 14, fontWeight: 500, color: "#111" }}>Total</span>
              <span style={{ fontFamily: G, fontSize: 26, fontWeight: 500, color: "#111", letterSpacing: "-0.01em" }}>{price}</span>
            </div>
            <p style={{ fontSize: 12, color: "#aaa", margin: "6px 0 0", fontWeight: 300 }}>One-time payment. No subscription.</p>
          </div>
        </div>
      )}

      {/* Responsive */}
      <style>{`
        @media (max-width: 680px) {
          .checkout-cols {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
