import fs from "fs";
import path from "path";

const DATA_DIR = path.join(__dirname, "..", "..", "data");
const DATA_FILE = path.join(DATA_DIR, "customers.json");

export type CustomerRecord = {
  email: string;
  product: string;
  paymentMethod: "razorpay" | "paypal";
  paymentId: string;
  licenseKey: string;
  createdAt: string;
};

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]");
}

function readAll(): CustomerRecord[] {
  ensureFile();
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

export function appendCustomer(record: CustomerRecord) {
  const data = readAll();
  data.push(record);
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

export function findByPaymentId(paymentId: string): CustomerRecord | undefined {
  return readAll().find(r => r.paymentId === paymentId);
}

export function findByEmail(email: string): CustomerRecord | undefined {
  const normalized = email.trim().toLowerCase();
  const matches = readAll().filter(r => r.email.trim().toLowerCase() === normalized);
  return matches.sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
}
