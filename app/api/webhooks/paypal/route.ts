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

export async function POST(req: NextRequest) {
  const body = await req.text();
  const accessToken = await getAccessToken();

  const verified = await verifyWebhookSignature(req.headers, body, accessToken);
  if (!verified) return new Response("Invalid signature", { status: 400 });

  const event = JSON.parse(body);
  if (event.event_type !== "CHECKOUT.ORDER.APPROVED" && event.event_type !== "PAYMENT.SALE.COMPLETED") {
    return new Response("Ignored", { status: 200 });
  }

  const email =
    event.resource?.payer?.email_address ??
    event.resource?.payer?.email ??
    event.resource?.purchase_units?.[0]?.payee?.email_address;
  if (!email) return new Response("No email on payment", { status: 400 });

  const licenseKey = generateLicenseKey({ email, product: "cursur" });
  await sendLicenseEmail(email, licenseKey);

  return new Response("OK", { status: 200 });
}
