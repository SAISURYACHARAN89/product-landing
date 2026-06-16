"use client";

import { useEffect, useState } from "react";

export default function PaymentSuccessPage() {
  const [licenseKey, setLicenseKey] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);

  function poll(id: string) {
    setNotFound(false);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.cursur.app";
    const startedAt = Date.now();
    const tick = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/license/lookup?payment_id=${encodeURIComponent(id)}`);
        const data = await res.json();
        if (data.found) {
          setLicenseKey(data.licenseKey);
          return;
        }
      } catch {}
      if (Date.now() - startedAt < 30000) {
        setTimeout(tick, 2000);
      } else {
        setNotFound(true);
      }
    };
    tick();
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("razorpay_payment_id");
    if (!id) {
      setNotFound(true);
      return;
    }
    setPaymentId(id);
    poll(id);
  }, []);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, sans-serif", padding: 24 }}>
      <div style={{ maxWidth: 380, width: "100%", textAlign: "center" }}>
        <h1 style={{ fontSize: 26, fontWeight: 500, marginBottom: 24 }}>
          {licenseKey ? "You're all set" : notFound ? "Payment received" : "Confirming your payment…"}
        </h1>

        {licenseKey ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <p style={{ fontSize: 13, color: "#777", margin: 0 }}>
              Here's your license key — copy it now and paste it into the app. We've also emailed it to you.
            </p>
            <div style={{ width: "100%", background: "#f6f6f6", borderRadius: 10, padding: "12px 14px", fontSize: 12, fontFamily: "monospace", wordBreak: "break-all", textAlign: "left" }}>
              {licenseKey}
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(licenseKey);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              style={{ width: "100%", padding: "11px 0", borderRadius: 9, background: "#111", color: "#fff", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600 }}
            >
              {copied ? "Copied!" : "Copy license key"}
            </button>
          </div>
        ) : notFound ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <p style={{ fontSize: 13, color: "#777", margin: 0 }}>
              Your payment went through, but it's taking longer than usual to confirm. We'll email your license
              key as soon as it's ready.
            </p>
            {paymentId && (
              <p style={{ fontSize: 11, color: "#bbb", margin: 0 }}>
                Payment ref: <span style={{ fontFamily: "monospace" }}>{paymentId}</span>
              </p>
            )}
            {paymentId && (
              <button
                onClick={() => poll(paymentId)}
                style={{ width: "100%", padding: "11px 0", borderRadius: 9, background: "#111", color: "#fff", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600 }}
              >
                Check again
              </button>
            )}
            <p style={{ fontSize: 11, color: "#bbb", margin: 0 }}>
              Still nothing after a few minutes? Email support@cursur.app with the payment ref above.
            </p>
          </div>
        ) : (
          <p style={{ fontSize: 13, color: "#bbb" }}>Your license key will appear here in a few seconds.</p>
        )}
      </div>
    </div>
  );
}
