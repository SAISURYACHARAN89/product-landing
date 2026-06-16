import { Router } from "express";

const router = Router();

const AMOUNT_INR_PAISE = 39900;

router.post("/", async (_req, res) => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    console.error("RAZORPAY_KEY_ID/RAZORPAY_KEY_SECRET not set");
    return res.status(500).json({ error: "Order creation unavailable" });
  }

  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  try {
    const orderRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
      body: JSON.stringify({ amount: AMOUNT_INR_PAISE, currency: "INR" }),
    });
    if (!orderRes.ok) {
      console.error("Razorpay order creation failed", await orderRes.text());
      return res.status(502).json({ error: "Order creation failed" });
    }
    const order = (await orderRes.json()) as { id: string; amount: number; currency: string };
    return res.status(200).json({ orderId: order.id, amount: order.amount, currency: order.currency, keyId });
  } catch (err) {
    console.error("Razorpay order creation error", err);
    return res.status(502).json({ error: "Order creation failed" });
  }
});

export default router;
