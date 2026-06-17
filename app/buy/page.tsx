"use client";

import { useState, useEffect } from "react";
import Script from "next/script";

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
        onApprove: (data: { orderID: string }) => poll(data.orderID),
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
      const rzp = new (window as any).Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: "cursur",
        callback_url: "https://cursur.app/payment-success",
        redirect: false,
        handler: (response: { razorpay_payment_id: string }) => {
          poll(response.razorpay_payment_id);
        },
      });
      rzp.open();
    } catch {
      alert("Couldn't start payment. Please try again.");
    } finally {
      setRazorpayLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f9f9f9", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", fontFamily: I }}>

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
      <div style={{
        background: "#fff", borderRadius: 20, padding: "40px 36px", width: "100%", maxWidth: 380,
        boxShadow: "0 8px 40px rgba(0,0,0,0.10)", textAlign: "center",
      }}>
        {/* Brand */}
        <a href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 32, justifyContent: "center" }}>
          <span style={{ fontFamily: G, fontSize: 28, fontWeight: 500, color: "#111", lineHeight: 1 }}>
            c<span style={{ color: "#3b82f6" }}>u</span>rs<span style={{ color: "#3b82f6" }}>u</span>r
          </span>
          <img src="/logo.png" alt="" style={{ width: 22, height: 22, objectFit: "contain" }} />
        </a>

        <h1 style={{ fontFamily: G, fontSize: 26, fontWeight: 500, letterSpacing: "-0.015em", marginBottom: 6 }}>
          {licenseKey ? "You're all set" : "Get cursur"}
        </h1>
        <p style={{ fontSize: 13, color: "#aaa", marginBottom: 28, fontWeight: 300 }}>
          {licenseKey ? "Your license key is ready." : "One-time purchase. No subscription."}
        </p>

        {/* Content */}
        <div style={{ minHeight: 120 }}>
          {licenseKey ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
              <p style={{ fontSize: 13, color: "#777", margin: 0 }}>
                Copy your key and paste it into the app. We've also emailed it to you.
              </p>
              <div style={{ width: "100%", background: "#f6f6f6", borderRadius: 10, padding: "12px 14px", fontSize: 12, fontFamily: "monospace", wordBreak: "break-all", textAlign: "left" }}>
                {licenseKey}
              </div>
              <button
                onClick={() => { navigator.clipboard.writeText(licenseKey); setLicenseCopied(true); setTimeout(() => setLicenseCopied(false), 2000); }}
                style={{ width: "100%", padding: "13px 0", borderRadius: 10, background: "#111", color: "#fff", border: "none", cursor: "pointer", fontFamily: I, fontSize: 14, fontWeight: 600 }}
              >
                {licenseCopied ? "Copied!" : "Copy license key"}
              </button>
            </div>
          ) : licensePending ? (
            <div style={{ padding: "20px 0", display: "flex", flexDirection: "column", gap: 8 }}>
              <p style={{ fontSize: 13, color: "#777", margin: 0 }}>Confirming your payment…</p>
              <p style={{ fontSize: 12, color: "#bbb", margin: 0 }}>Your license key will appear here in a few seconds.</p>
            </div>
          ) : licenseTimedOut ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "10px 0" }}>
              <p style={{ fontSize: 13, color: "#777", margin: 0 }}>
                Payment received — taking a moment to confirm. We'll email your key shortly.
              </p>
              {lastPaymentId && (
                <p style={{ fontSize: 11, color: "#bbb", margin: 0 }}>
                  Ref: <span style={{ fontFamily: "monospace" }}>{lastPaymentId}</span>
                </p>
              )}
              <button
                onClick={() => lastPaymentId && poll(lastPaymentId)}
                style={{ width: "100%", padding: "13px 0", borderRadius: 10, background: "#111", color: "#fff", border: "none", cursor: "pointer", fontFamily: I, fontSize: 14, fontWeight: 600 }}
              >
                Check again
              </button>
              <p style={{ fontSize: 11, color: "#bbb", margin: 0 }}>
                Still nothing? Email <a href="mailto:support@cursur.app" style={{ color: "#3b82f6" }}>support@cursur.app</a>
              </p>
            </div>
          ) : isIndia ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <button
                onClick={payWithRazorpay}
                disabled={!razorpayReady || razorpayLoading}
                style={{
                  width: "100%", height: 52, borderRadius: 11, background: "#111", color: "#fff",
                  border: "none", cursor: razorpayReady ? "pointer" : "default",
                  opacity: razorpayReady ? 1 : 0.55, fontFamily: I, fontSize: 15, fontWeight: 600,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  transition: "opacity 0.15s ease",
                }}
              >
                {razorpayLoading ? "Starting…" : !razorpayReady ? "Loading…" : (
                  <>
                    <span>Pay ₹399</span>
                    <span style={{ width: 1, height: 14, background: "rgba(255,255,255,0.25)" }} />
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, opacity: 0.85 }}>
                      <svg viewBox="0 0 32 32" style={{ width: 13, height: 13 }}>
                        <path d="M9 4h10.5c5.2 0 8 2.7 7.4 7.1-.5 4.1-3.6 6.3-7.9 6.3h-4.4l-1.7 9.6H8.2L9 22.4 13 4z" fill="#fff" opacity="0.95"/>
                      </svg>
                      Razorpay
                    </span>
                  </>
                )}
              </button>
              <p style={{ fontSize: 11, color: "#bbb", margin: 0 }}>UPI · Cards · Netbanking — secured by Razorpay</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <p style={{ fontSize: 13, color: "#888", margin: 0 }}>Pay with PayPal — cards accepted too</p>
              <div style={{ width: "100%", maxWidth: 300, minHeight: 50, display: "flex", justifyContent: "center", position: "relative" }}>
                <div style={{
                  position: "absolute", inset: 0, height: 50, borderRadius: 9,
                  background: "linear-gradient(90deg, #f3f3f3 25%, #ececec 37%, #f3f3f3 63%)",
                  backgroundSize: "400% 100%",
                  animation: "cursur-shimmer 1.4s ease-in-out infinite",
                  opacity: paypalRendered ? 0 : 1,
                  pointerEvents: "none",
                  transition: "opacity 0.35s ease",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, color: "#bbb", fontFamily: I,
                }}>
                  Loading PayPal…
                </div>
                <div
                  id="paypal-buy-container"
                  style={{ width: "100%", opacity: paypalRendered ? 1 : 0, transition: "opacity 0.35s ease" }}
                />
              </div>
            </div>
          )}
        </div>

        <p style={{ marginTop: 28, fontSize: 12, color: "#ccc", fontWeight: 300 }}>
          <a href="/" style={{ color: "#ccc", textDecoration: "none" }}>← Back to cursur.app</a>
        </p>
      </div>
    </div>
  );
}
