import { NextRequest } from "next/server";
import crypto from "crypto";
import { generateLicenseKey } from "@/lib/license";
import { sendLicenseEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature");
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET as string;

  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
  if (!signature || signature !== expected) {
    return new Response("Invalid signature", { status: 400 });
  }

  const event = JSON.parse(body);
  if (event.event !== "payment_link.paid" && event.event !== "payment.captured") {
    return new Response("Ignored", { status: 200 });
  }

  const payment = event.payload?.payment?.entity ?? event.payload?.payment_link?.entity;
  const email = payment?.email ?? payment?.customer?.email;
  if (!email) return new Response("No email on payment", { status: 400 });

  const licenseKey = generateLicenseKey({ email, product: "cursur" });
  try {
    await sendLicenseEmail(email, licenseKey);
  } catch (err) {
    console.error("Razorpay webhook: failed to send license email", err);
    return new Response("Email send failed", { status: 500 });
  }

  return new Response("OK", { status: 200 });
}
