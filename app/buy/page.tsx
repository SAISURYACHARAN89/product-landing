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

  return (
    <div style={{
      minHeight: "100vh", background: "#fff", display: "flex",
      flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "40px 24px", fontFamily: I,
    }}>
      <style>{`
        @keyframes cursur-shimmer {
          0% { background-position: 100% 0; }
          100% { background-position: 0 0; }
        }
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

      {/* Card */}
      <div style={{ width: "100%", maxWidth: 340, textAlign: "center" }}>

        {/* Logo */}
        <a href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 40, justifyContent: "center" }}>
          <img src="/logo.png" alt="cursur" style={{ width: 32, height: 32, objectFit: "contain" }} />
          <span style={{ fontFamily: G, fontSize: 28, fontWeight: 500, color: "#111", lineHeight: 1 }}>
            c<span style={{ color: "#3b82f6" }}>u</span>rs<span style={{ color: "#3b82f6" }}>u</span>r
          </span>
        </a>

        {licenseKey ? (
          /* ── Success ── */
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <p style={{ fontSize: 13, color: "#888", margin: 0 }}>You&apos;re in. Copy your license key and paste it into the app.</p>
            <div style={{ background: "#f6f6f6", borderRadius: 10, padding: "14px 16px", fontSize: 11.5, fontFamily: "monospace", wordBreak: "break-all", color: "#333", lineHeight: 1.6, textAlign: "left" }}>
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
          /* ── Pending ── */
          <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "16px 0" }}>
            <p style={{ fontSize: 14, color: "#555", margin: 0 }}>Confirming payment…</p>
            <p style={{ fontSize: 12, color: "#bbb", margin: 0 }}>Your key will appear here in a moment.</p>
          </div>

        ) : licenseTimedOut ? (
          /* ── Timeout ── */
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <p style={{ fontSize: 13, color: "#777", margin: 0 }}>Taking longer than usual — we&apos;ll email your key shortly.</p>
            {lastPaymentId && <p style={{ fontSize: 11, color: "#bbb", margin: 0, fontFamily: "monospace" }}>Ref: {lastPaymentId}</p>}
            <button onClick={() => lastPaymentId && poll(lastPaymentId)} style={{ width: "100%", padding: "13px 0", borderRadius: 10, background: "#111", color: "#fff", border: "none", cursor: "pointer", fontFamily: I, fontSize: 14, fontWeight: 600 }}>
              Check again
            </button>
            <p style={{ fontSize: 12, color: "#bbb", margin: 0 }}>
              Still nothing? <a href="mailto:support@cursur.app" style={{ color: "#3b82f6" }}>support@cursur.app</a>
            </p>
          </div>

        ) : (
          /* ── Checkout ── */
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Price */}
            <div>
              <div style={{ fontFamily: G, fontSize: 52, fontWeight: 500, color: "#111", letterSpacing: "-0.02em", lineHeight: 1 }}>
                {isIndia ? "₹399" : "$3.99"}
              </div>
              <p style={{ fontSize: 13, color: "#aaa", margin: "6px 0 0", fontWeight: 300 }}>one-time · no subscription</p>
            </div>

            {/* Payment */}
            {isIndia ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <button
                  onClick={payWithRazorpay}
                  disabled={!razorpayReady || razorpayLoading}
                  style={{
                    width: "100%", height: 52, borderRadius: 12, background: "#111", color: "#fff",
                    border: "none", cursor: razorpayReady ? "pointer" : "default",
                    opacity: razorpayReady ? 1 : 0.5, fontFamily: I, fontSize: 15, fontWeight: 600,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                    transition: "opacity 0.15s",
                  }}
                >
                  {razorpayLoading ? "Opening…" : !razorpayReady ? "Loading…" : (
                    <>
                      <span>Pay ₹399</span>
                      <span style={{ width: 1, height: 14, background: "rgba(255,255,255,0.2)" }} />
                      <span style={{ fontSize: 12, opacity: 0.8 }}>Razorpay</span>
                    </>
                  )}
                </button>
                <p style={{ fontSize: 11, color: "#ccc", margin: 0 }}>UPI · Cards · Netbanking</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ position: "relative", minHeight: 50 }}>
                  <div style={{
                    position: "absolute", inset: 0, borderRadius: 9,
                    background: "linear-gradient(90deg, #f3f3f3 25%, #ececec 37%, #f3f3f3 63%)",
                    backgroundSize: "400% 100%",
                    animation: "cursur-shimmer 1.4s ease-in-out infinite",
                    opacity: paypalRendered ? 0 : 1,
                    pointerEvents: "none",
                    transition: "opacity 0.3s",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, color: "#bbb",
                  }}>
                    Loading…
                  </div>
                  <div id="paypal-buy-container" style={{ width: "100%", opacity: paypalRendered ? 1 : 0, transition: "opacity 0.3s" }} />
                </div>
                <p style={{ fontSize: 11, color: "#ccc", margin: 0 }}>PayPal · Debit · Credit · Apple Pay</p>
              </div>
            )}

            <p style={{ fontSize: 12, color: "#bbb", margin: 0 }}>
              License key delivered instantly after payment.
            </p>
          </div>
        )}

        <p style={{ marginTop: 40, fontSize: 12, color: "#ddd" }}>
          <a href="/" style={{ color: "#ddd", textDecoration: "none" }}>← Back</a>
        </p>
      </div>
    </div>
  );
}
