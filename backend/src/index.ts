import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import razorpayRoute from "./routes/razorpay";
import paypalRoute from "./routes/paypal";
import licenseRoute from "./routes/license";
import createOrderRoute from "./routes/createOrder";

const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN;
if (!ALLOWED_ORIGIN) {
  console.warn("WARNING: ALLOWED_ORIGIN is not set — defaulting to cursur.app. Set it in .env to suppress this.");
}

const app = express();

app.use(helmet());
app.use(cors({ origin: ALLOWED_ORIGIN || "https://cursur.app" }));

// Webhook routes need the raw request body for signature verification,
// so they get express.raw() instead of the global express.json().
app.use("/api/webhooks/razorpay", express.raw({ type: "*/*" }), razorpayRoute);
app.use("/api/webhooks/paypal", express.raw({ type: "*/*" }), paypalRoute);

app.use(express.json());

// Rate limits — protect against abuse and email spam
const recoverLimit = rateLimit({ windowMs: 60_000, max: 5, standardHeaders: true, legacyHeaders: false });
const lookupLimit  = rateLimit({ windowMs: 60_000, max: 10, standardHeaders: true, legacyHeaders: false });
const createOrderLimit = rateLimit({ windowMs: 60_000, max: 10, standardHeaders: true, legacyHeaders: false });

app.use("/api/license/recover", recoverLimit);
app.use("/api/license/lookup",  lookupLimit);
app.use("/api/razorpay/create-order", createOrderLimit);

app.use("/api/license", licenseRoute);
app.use("/api/razorpay/create-order", createOrderRoute);

app.get("/health", (_req, res) => res.status(200).send("ok"));

const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;
app.listen(PORT, () => console.log(`cursur backend listening on :${PORT}`));
