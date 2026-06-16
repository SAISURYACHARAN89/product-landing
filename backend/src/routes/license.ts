import { Router } from "express";
import { verifyLicenseKey } from "../lib/license";
import { findByPaymentId, findByEmail } from "../lib/store";
import { sendLicenseEmail } from "../lib/email";

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

// "Recovery key" form on the website — re-sends the existing license key to
// whatever email purchased it. Always responds the same way regardless of
// whether the email is found, so this can't be used to check who's a customer.
router.post("/recover", async (req, res) => {
  const { email } = req.body ?? {};
  if (!email || typeof email !== "string") return res.status(400).json({ ok: false });

  const record = findByEmail(email);
  if (record) {
    try {
      await sendLicenseEmail(record.email, record.licenseKey);
    } catch (err) {
      console.error("License recovery: failed to send email", err);
    }
  }

  return res.status(200).json({ ok: true });
});

export default router;
