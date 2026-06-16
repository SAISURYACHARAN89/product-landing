import "dotenv/config";
import express from "express";
import cors from "cors";
import razorpayRoute from "./routes/razorpay";
import paypalRoute from "./routes/paypal";
import licenseRoute from "./routes/license";

const app = express();

app.use(cors({ origin: process.env.ALLOWED_ORIGIN || "*" }));

// Webhook routes need the raw request body for signature verification,
// so they get express.raw() instead of the global express.json().
app.use("/api/webhooks/razorpay", express.raw({ type: "*/*" }), razorpayRoute);
app.use("/api/webhooks/paypal", express.raw({ type: "*/*" }), paypalRoute);

app.use(express.json());
app.use("/api/license", licenseRoute);

app.get("/health", (_req, res) => res.status(200).send("ok"));

const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;
app.listen(PORT, () => console.log(`cursur backend listening on :${PORT}`));
