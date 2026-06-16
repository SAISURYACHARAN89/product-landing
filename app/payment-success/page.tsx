"use client";

import { useEffect, useState } from "react";

export default function PaymentSuccessPage() {
  const [licenseKey, setLicenseKey] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const paymentId = params.get("razorpay_payment_id");
    if (!paymentId) {
      setNotFound(true);
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.cursur.app";
    const startedAt = Date.now();
    const tick = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/license/lookup?payment_id=${encodeURIComponent(paymentId)}`);
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
          <p style={{ fontSize: 13, color: "#777" }}>
            We're still processing your payment. Check your email in a minute for your license key — if it
            doesn't arrive, contact support@cursur.app.
          </p>
        ) : (
          <p style={{ fontSize: 13, color: "#bbb" }}>Your license key will appear here in a few seconds.</p>
        )}
      </div>
    </div>
  );
}
