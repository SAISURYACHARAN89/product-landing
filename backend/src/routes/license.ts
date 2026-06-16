import { Router } from "express";
import { verifyLicenseKey } from "../lib/license";

const router = Router();

router.post("/validate", (req, res) => {
  const { key } = req.body ?? {};
  if (!key) return res.status(400).json({ valid: false });

  const payload = verifyLicenseKey(key);
  if (!payload) return res.status(200).json({ valid: false });

  return res.status(200).json({ valid: true, email: payload.email, product: payload.product });
});

export default router;
