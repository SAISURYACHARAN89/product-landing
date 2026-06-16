import { Router } from "express";
import { verifyLicenseKey } from "../lib/license";
import { findByPaymentId } from "../lib/store";

const router = Router();

router.post("/validate", (req, res) => {
  const { key } = req.body ?? {};
  if (!key) return res.status(400).json({ valid: false });

  const payload = verifyLicenseKey(key);
  if (!payload) return res.status(200).json({ valid: false });

  return res.status(200).json({ valid: true, email: payload.email, product: payload.product });
});

// Polled by the success page/modal right after checkout to grab the key the
// webhook generated, so it can be shown on screen instead of email-only.
router.get("/lookup", (req, res) => {
  const paymentId = req.query.payment_id as string | undefined;
  if (!paymentId) return res.status(400).json({ found: false });

  const record = findByPaymentId(paymentId);
  if (!record) return res.status(200).json({ found: false });

  return res.status(200).json({ found: true, licenseKey: record.licenseKey, email: record.email });
});

export default router;
