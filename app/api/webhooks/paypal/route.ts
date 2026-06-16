import { NextRequest } from "next/server";
import { generateLicenseKey } from "@/lib/license";
import { sendLicenseEmail } from "@/lib/email";

const PAYPAL_API = "https://api-m.paypal.com";

async function getAccessToken() {
  const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString("base64");
  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials",
  });
  const data = await res.json();
  return data.access_token as string;
}

async function verifyWebhookSignature(headers: Headers, body: string, accessToken: string) {
  const res = await fetch(`${PAYPAL_API}/v1/notifications/verify-webhook-signature`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      auth_algo: headers.get("paypal-auth-algo"),
      cert_url: headers.get("paypal-cert-url"),
      transmission_id: headers.get("paypal-transmission-id"),
      transmission_sig: headers.get("paypal-transmission-sig"),
      transmission_time: headers.get("paypal-transmission-time"),
      webhook_id: process.env.PAYPAL_WEBHOOK_ID,
      webhook_event: JSON.parse(body),
    }),
  });
  const data = await res.json();
  return data.verification_status === "SUCCESS";
}

async function getOrderPayerEmail(orderId: string, accessToken: string) {
  const res = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await res.json();
  return data.payer?.email_address as string | undefined;
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const accessToken = await getAccessToken();

  const verified = await verifyWebhookSignature(req.headers, body, accessToken);
  if (!verified) return new Response("Invalid signature", { status: 400 });

  const event = JSON.parse(body);
  const paymentEvents = ["CHECKOUT.ORDER.APPROVED", "PAYMENT.SALE.COMPLETED", "PAYMENT.CAPTURE.COMPLETED"];
  if (!paymentEvents.includes(event.event_type)) {
    return new Response("Ignored", { status: 200 });
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
      return new Response("Order lookup failed", { status: 500 });
    }
  }

  if (!email) {
    console.error(
      `PayPal webhook: no payer email found for order ${orderId ?? "unknown"} (capture ${captureId ?? "unknown"}). ` +
        `A customer paid but won't get an automatic license email — check this order in the PayPal dashboard and send their key manually.`
    );
    return new Response("No email on payment", { status: 200 });
  }

  const licenseKey = generateLicenseKey({ email, product: "cursur" });
  try {
    await sendLicenseEmail(email, licenseKey);
  } catch (err) {
    console.error("PayPal webhook: failed to send license email", err);
    return new Response("Email send failed", { status: 500 });
  }

  return new Response("OK", { status: 200 });
}
