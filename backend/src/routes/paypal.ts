import { Router } from "express";
import { generateLicenseKey } from "../lib/license";
import { sendLicenseEmail } from "../lib/email";
import { appendCustomer, findByPaymentId } from "../lib/store";

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

async function getOrderPayerEmail(orderId: string, accessToken: string) {
  const res = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = (await res.json()) as { payer?: { email_address?: string } };
  return data.payer?.email_address;
}

// Mounted with express.raw() in index.ts — PayPal's signature verification call
// needs the exact raw body re-parsed as JSON, same bytes that were received.
router.post("/", async (req, res) => {
  const body = (req.body as Buffer).toString("utf8");
  const accessToken = await getAccessToken();

  const verified = await verifyWebhookSignature(req.headers as Record<string, string | undefined>, body, accessToken);
  if (!verified) return res.status(400).send("Invalid signature");

  const event = JSON.parse(body);
  // Only issue keys after money has actually settled — APPROVED fires before capture
  const paymentEvents = ["PAYMENT.SALE.COMPLETED", "PAYMENT.CAPTURE.COMPLETED"];
  if (!paymentEvents.includes(event.event_type)) {
    return res.status(200).send("Ignored");
  }

  // PAYMENT.CAPTURE.COMPLETED doesn't carry the payer's email directly —
  // it has to be looked up via the related order.
  let email = event.resource?.payer?.email_address ?? event.resource?.payer?.email;
  const orderId = event.resource?.supplementary_data?.related_ids?.order_id;
  const captureId = event.resource?.id;
  if (!email && orderId) {
    try {
      email = await getOrderPayerEmail(orderId, accessToken);
    } catch (err) {
      console.error(`PayPal webhook: order lookup failed for order ${orderId} (capture ${captureId}) — will retry`, err);
      return res.status(500).send("Order lookup failed");
    }
  }

  if (!email) {
    console.error(
      `PayPal webhook: no payer email found for order ${orderId ?? "unknown"} (capture ${captureId ?? "unknown"}). ` +
        `A customer paid but won't get an automatic license email — check this order in the PayPal dashboard and send their key manually.`
    );
    return res.status(200).send("No email on payment");
  }

  const paymentId = orderId ?? captureId;
  if (!paymentId) return res.status(400).send("No order/capture id");

  // PayPal retries webhooks on non-2xx — reuse the existing key on retry
  // instead of generating a new one and double-storing the customer.
  const existing = findByPaymentId(paymentId);
  const licenseKey = existing?.licenseKey ?? generateLicenseKey({ email, product: "cursur" });

  if (!existing) {
    appendCustomer({
      email,
      product: "cursur",
      paymentMethod: "paypal",
      paymentId,
      licenseKey,
      createdAt: new Date().toISOString(),
    });
  }

  try {
    await sendLicenseEmail(email, licenseKey);
  } catch (err) {
    console.error("PayPal webhook: failed to send license email", err);
    return res.status(500).send("Email send failed");
  }

  return res.status(200).send("OK");
});

export default router;
