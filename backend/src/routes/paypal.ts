import { Router } from "express";
import { generateLicenseKey } from "../lib/license";
import { sendLicenseEmail } from "../lib/email";

const router = Router();

const PAYPAL_API = "https://api-m.paypal.com";

async function getAccessToken() {
  const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString("base64");
  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials",
  });
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

async function verifyWebhookSignature(headers: Record<string, string | undefined>, body: string, accessToken: string) {
  const res = await fetch(`${PAYPAL_API}/v1/notifications/verify-webhook-signature`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      auth_algo: headers["paypal-auth-algo"],
      cert_url: headers["paypal-cert-url"],
      transmission_id: headers["paypal-transmission-id"],
      transmission_sig: headers["paypal-transmission-sig"],
      transmission_time: headers["paypal-transmission-time"],
      webhook_id: process.env.PAYPAL_WEBHOOK_ID,
      webhook_event: JSON.parse(body),
    }),
  });
  const data = (await res.json()) as { verification_status: string };
  return data.verification_status === "SUCCESS";
}

// Mounted with express.raw() in index.ts — PayPal's signature verification call
// needs the exact raw body re-parsed as JSON, same bytes that were received.
router.post("/", async (req, res) => {
  const body = (req.body as Buffer).toString("utf8");
  const accessToken = await getAccessToken();

  const verified = await verifyWebhookSignature(req.headers as Record<string, string | undefined>, body, accessToken);
  if (!verified) return res.status(400).send("Invalid signature");

  const event = JSON.parse(body);
  const paymentEvents = ["CHECKOUT.ORDER.APPROVED", "PAYMENT.SALE.COMPLETED", "PAYMENT.CAPTURE.COMPLETED"];
  if (!paymentEvents.includes(event.event_type)) {
    return res.status(200).send("Ignored");
  }

  const email = event.resource?.payer?.email_address ?? event.resource?.payer?.email;
  if (!email) {
    console.warn(`PayPal webhook: ${event.event_type} had no payer email, skipping`);
    return res.status(200).send("No email on payment");
  }

  const licenseKey = generateLicenseKey({ email, product: "cursur" });
  try {
    await sendLicenseEmail(email, licenseKey);
  } catch (err) {
    console.error("PayPal webhook: failed to send license email", err);
    return res.status(500).send("Email send failed");
  }

  return res.status(200).send("OK");
});

export default router;
