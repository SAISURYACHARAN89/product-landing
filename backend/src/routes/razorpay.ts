import { Router } from "express";
import crypto from "crypto";
import { generateLicenseKey } from "../lib/license";
import { sendLicenseEmail } from "../lib/email";
import { appendCustomer, findByPaymentId } from "../lib/store";

const router = Router();

// Mounted with express.raw() in index.ts so req.body is the raw Buffer —
// required because the HMAC signature is computed over the exact raw bytes.
router.post("/", async (req, res) => {
  const body = (req.body as Buffer).toString("utf8");
  const signature = req.header("x-razorpay-signature");
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET as string;

  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
  if (!signature || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
    return res.status(400).send("Invalid signature");
  }

  const event = JSON.parse(body);
  if (event.event !== "payment_link.paid" && event.event !== "payment.captured") {
    return res.status(200).send("Ignored");
  }

  const payment = event.payload?.payment?.entity ?? event.payload?.payment_link?.entity;
  const email = payment?.email ?? payment?.customer?.email;
  const paymentId = payment?.id;
  if (!email) return res.status(400).send("No email on payment");
  if (!paymentId) return res.status(400).send("No payment id");

  // Razorpay retries webhooks on non-2xx — reuse the existing key on retry
  // instead of generating a new one and double-storing the customer.
  const existing = findByPaymentId(paymentId);
  const licenseKey = existing?.licenseKey ?? generateLicenseKey({ email, product: "cursur" });

  if (!existing) {
    appendCustomer({
      email,
      product: "cursur",
      paymentMethod: "razorpay",
      paymentId,
      licenseKey,
      createdAt: new Date().toISOString(),
    });
  }

  try {
    await sendLicenseEmail(email, licenseKey);
  } catch (err) {
    console.error("Razorpay webhook: failed to send license email", err);
    return res.status(500).send("Email send failed");
  }

  return res.status(200).send("OK");
});

export default router;
