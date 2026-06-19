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
          trackEvent("purchase_complete", { payment_id: paymentId, page: "buy" });
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

// Animated cursor illustration
function CursorIllustration() {
  return (
    <div style={{ position: "relative", width: 120, height: 120 }}>
      {/* Glow */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: 80, height: 80, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)",
      }} />
      {/* Cursor SVG */}
      <svg width="72" height="86" viewBox="0 0 52 62" fill="none"
        style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
        <path d="M6 4L46 28L29 34L22 56L6 4Z" fill="#111" stroke="#111" strokeWidth="2" strokeLinejoin="round"/>
      </svg>
      {/* Eyes / accessory */}
      <div style={{
        position: "absolute", top: "28%", left: "62%",
        fontSize: 26, lineHeight: 1,
        animation: "cursur-float 3s ease-in-out infinite",
      }}>😎</div>
    </div>
  );
}

// Step indicator
function Step({ n, text }: { n: number; text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{
        width: 24, height: 24, borderRadius: "50%", background: "#111",
        color: "#fff", fontSize: 11, fontWeight: 700,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>{n}</div>
      <span style={{ fontSize: 13, color: "#555", fontWeight: 300, lineHeight: 1.4 }}>{text}</span>
    </div>
  );
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
          trackEvent("buy_clicked", { method: "paypal", page: "buy" });
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
      const rzp = new (window as any).Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: "cursur",
        callback_url: "https://cursur.app/payment-success",
        redirect: false,
        handler: (response: { razorpay_payment_id: string }) => {
          trackEvent("buy_clicked", { method: "razorpay", page: "buy" });
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

  const paid = licenseKey || licensePending || licenseTimedOut;

  return (
    <div style={{ minHeight: "100vh", background: "#f7f7f8", fontFamily: I }}>
      <style>{`
        @keyframes cursur-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
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

      {/* Top bar */}
      <div style={{ borderBottom: "1px solid #ebebeb", background: "#fff", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontFamily: G, fontSize: 24, fontWeight: 500, color: "#111", lineHeight: 1 }}>
            c<span style={{ color: "#3b82f6" }}>u</span>rs<span style={{ color: "#3b82f6" }}>u</span>r
          </span>
          <img src="/logo.png" alt="" style={{ width: 18, height: 18, objectFit: "contain" }} />
        </a>
        <span style={{ fontSize: 12, color: "#bbb", fontWeight: 300 }}>Secure checkout</span>
      </div>

      {/* Main layout */}
      <div style={{
        maxWidth: 900, margin: "0 auto", padding: "48px 24px",
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32,
      }}
        className="checkout-grid"
      >
        {/* ── LEFT: Product info ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>

          {/* Product card */}
          <div style={{ background: "#fff", borderRadius: 20, padding: "36px 32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
              <CursorIllustration />
              <div>
                <h1 style={{ fontFamily: G, fontSize: 32, fontWeight: 500, letterSpacing: "-0.02em", color: "#111", margin: 0, lineHeight: 1.1 }}>cursur</h1>
                <p style={{ fontSize: 13, color: "#888", margin: "4px 0 0", fontWeight: 300 }}>macOS app · v0.1.0</p>
              </div>
            </div>

            {/* Price */}
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6 }}>
              <span style={{ fontFamily: G, fontSize: 42, fontWeight: 500, color: "#111", letterSpacing: "-0.02em" }}>
                {isIndia ? "₹399" : "$4.99"}
              </span>
              <span style={{ fontSize: 13, color: "#aaa", fontWeight: 300 }}>one-time</span>
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "#f0fdf4", borderRadius: 6, padding: "4px 10px", marginBottom: 24 }}>
              <svg viewBox="0 0 16 16" width="12" height="12" fill="none">
                <path d="M13.5 4.5L6.5 11.5L2.5 7.5" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ fontSize: 11, color: "#16a34a", fontWeight: 500 }}>No subscription. Pay once, use forever.</span>
            </div>

            {/* What's included */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                "OS-level cursor personalisation — works everywhere",
                "Emotions that react to what you're doing",
                "All future updates included",
                "License key delivered instantly by email",
              ].map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <svg viewBox="0 0 16 16" width="14" height="14" fill="none" style={{ marginTop: 1, flexShrink: 0 }}>
                    <path d="M13.5 4.5L6.5 11.5L2.5 7.5" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span style={{ fontSize: 13, color: "#444", fontWeight: 300, lineHeight: 1.5 }}>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* How it works */}
          <div style={{ background: "#fff", borderRadius: 20, padding: "28px 32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <h2 style={{ fontFamily: G, fontSize: 18, fontWeight: 500, color: "#111", margin: "0 0 20px" }}>How it works</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <Step n={1} text="Download the cursur app for Mac below" />
              <Step n={2} text="Pay once — your license key appears instantly on screen and is emailed to you" />
              <Step n={3} text="Open cursur, paste your license key, and you're in" />
            </div>

            {/* Download button */}
            <a
              href="/Cursur_0.1.0_aarch64.dmg"
              download
              onClick={() => trackEvent("download_clicked", { platform: "mac", page: "buy" })}
              style={{
                marginTop: 24, display: "inline-flex", alignItems: "center", gap: 8,
                padding: "10px 20px", borderRadius: 10,
                background: "#f5f5f7", color: "#333",
                textDecoration: "none", fontSize: 13, fontWeight: 500,
                border: "1px solid #e8e8e8",
              }}
            >
              <svg viewBox="0 0 814 1000" style={{ width: 12, height: 12, fill: "#555", flexShrink: 0 }}>
                <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.8 135.4-317.7 269-317.7 70.2 0 128.7 46.3 170.7 46.3 40.3 0 107.3-49 185.4-49 29.5 0 108.2 2.6 168.4 74.3zm-234.4-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/>
              </svg>
              Download for Mac (v0.1.0)
            </a>
          </div>
        </div>

        {/* ── RIGHT: Payment ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: "36px 32px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>

            {paid ? (
              /* ── Post-payment state ── */
              licenseKey ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ textAlign: "center", paddingBottom: 8 }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
                    <h2 style={{ fontFamily: G, fontSize: 26, fontWeight: 500, letterSpacing: "-0.015em", margin: "0 0 6px" }}>You&apos;re all set!</h2>
                    <p style={{ fontSize: 13, color: "#888", margin: 0, fontWeight: 300 }}>Copy the key below and paste it into the cursur app.</p>
                  </div>
                  <div style={{ background: "#f6f6f6", borderRadius: 10, padding: "14px 16px", fontSize: 11.5, fontFamily: "monospace", wordBreak: "break-all", color: "#333", lineHeight: 1.6 }}>
                    {licenseKey}
                  </div>
                  <button
                    onClick={() => { navigator.clipboard.writeText(licenseKey); setLicenseCopied(true); setTimeout(() => setLicenseCopied(false), 2000); trackEvent("license_key_copied", { page: "buy" }); }}
                    style={{ width: "100%", padding: "14px 0", borderRadius: 10, background: "#111", color: "#fff", border: "none", cursor: "pointer", fontFamily: I, fontSize: 14, fontWeight: 600 }}
                  >
                    {licenseCopied ? "✓ Copied!" : "Copy license key"}
                  </button>
                  <p style={{ fontSize: 12, color: "#bbb", textAlign: "center", margin: 0, fontWeight: 300 }}>We also emailed this key to you.</p>
                </div>
              ) : licensePending ? (
                <div style={{ textAlign: "center", padding: "32px 0", display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ fontSize: 32 }}>⏳</div>
                  <h2 style={{ fontFamily: G, fontSize: 22, fontWeight: 500, margin: 0 }}>Confirming payment…</h2>
                  <p style={{ fontSize: 13, color: "#888", margin: 0, fontWeight: 300 }}>Your license key will appear here in a few seconds.</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 14, padding: "8px 0" }}>
                  <p style={{ fontSize: 13, color: "#777", margin: 0 }}>Payment received — taking a moment to confirm. Your key is on its way by email.</p>
                  {lastPaymentId && <p style={{ fontSize: 11, color: "#bbb", margin: 0, fontFamily: "monospace" }}>Ref: {lastPaymentId}</p>}
                  <button onClick={() => lastPaymentId && poll(lastPaymentId)} style={{ width: "100%", padding: "13px 0", borderRadius: 10, background: "#111", color: "#fff", border: "none", cursor: "pointer", fontFamily: I, fontSize: 14, fontWeight: 600 }}>
                    Check again
                  </button>
                  <p style={{ fontSize: 11, color: "#bbb", margin: 0 }}>Still nothing? <a href="mailto:support@cursur.app" style={{ color: "#3b82f6" }}>support@cursur.app</a></p>
                </div>
              )
            ) : (
              /* ── Pre-payment state ── */
              <>
                <h2 style={{ fontFamily: G, fontSize: 22, fontWeight: 500, letterSpacing: "-0.015em", margin: "0 0 6px" }}>Complete your order</h2>
                <p style={{ fontSize: 13, color: "#aaa", margin: "0 0 28px", fontWeight: 300 }}>
                  {isIndia ? "Pay ₹399 once. Your license key is shown on screen immediately." : "Pay once. Your license key is shown on screen immediately."}
                </p>

                {isIndia ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <button
                      onClick={payWithRazorpay}
                      disabled={!razorpayReady || razorpayLoading}
                      style={{
                        width: "100%", height: 54, borderRadius: 12, background: "#111", color: "#fff",
                        border: "none", cursor: razorpayReady ? "pointer" : "default",
                        opacity: razorpayReady ? 1 : 0.55, fontFamily: I, fontSize: 15, fontWeight: 600,
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                        transition: "opacity 0.15s ease",
                      }}
                    >
                      {razorpayLoading ? "Opening payment…" : !razorpayReady ? "Loading…" : (
                        <>
                          <span>Pay ₹399</span>
                          <span style={{ width: 1, height: 16, background: "rgba(255,255,255,0.2)" }} />
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, opacity: 0.85, fontSize: 13 }}>
                            <svg viewBox="0 0 32 32" style={{ width: 13, height: 13 }}>
                              <path d="M9 4h10.5c5.2 0 8 2.7 7.4 7.1-.5 4.1-3.6 6.3-7.9 6.3h-4.4l-1.7 9.6H8.2L9 22.4 13 4z" fill="#fff" opacity="0.95"/>
                            </svg>
                            Razorpay
                          </span>
                        </>
                      )}
                    </button>
                    <p style={{ fontSize: 11, color: "#bbb", textAlign: "center", margin: 0 }}>UPI · Cards · Netbanking · Wallets — secured by Razorpay</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <div style={{ width: "100%", minHeight: 50, position: "relative" }}>
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
                      <div id="paypal-buy-container" style={{ width: "100%", opacity: paypalRendered ? 1 : 0, transition: "opacity 0.35s ease" }} />
                    </div>
                    <p style={{ fontSize: 11, color: "#bbb", textAlign: "center", margin: 0 }}>PayPal · Debit · Credit card · Apple Pay</p>
                  </div>
                )}

                {/* Trust signals */}
                <div style={{ marginTop: 28, paddingTop: 24, borderTop: "1px solid #f0f0f0", display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    { icon: "🔒", text: "Secure payment — your card details never touch our servers" },
                    { icon: "⚡", text: "License key delivered instantly after payment" },
                    { icon: "📧", text: "Key also sent to your email as backup" },
                  ].map((t, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <span style={{ fontSize: 14, flexShrink: 0 }}>{t.icon}</span>
                      <span style={{ fontSize: 12, color: "#888", fontWeight: 300, lineHeight: 1.5 }}>{t.text}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Responsive: stack columns on mobile */}
      <style>{`
        @media (max-width: 680px) {
          .checkout-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Footer */}
      <div style={{ textAlign: "center", padding: "16px 24px 40px", fontSize: 12, color: "#ccc", fontWeight: 300 }}>
        <a href="/terms" style={{ color: "#ccc", textDecoration: "none", marginRight: 16 }}>Terms</a>
        <a href="/privacy" style={{ color: "#ccc", textDecoration: "none", marginRight: 16 }}>Privacy</a>
        <a href="mailto:support@cursur.app" style={{ color: "#ccc", textDecoration: "none" }}>support@cursur.app</a>
      </div>
    </div>
  );
}
