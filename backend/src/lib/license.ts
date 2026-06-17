import jwt from "jsonwebtoken";

const SECRET = process.env.LICENSE_SECRET as string;

export type LicensePayload = {
  email: string;
  product: string;
};

export function generateLicenseKey(payload: LicensePayload): string {
  if (!SECRET) throw new Error("LICENSE_SECRET is not set");
  return jwt.sign(payload, SECRET, { algorithm: "HS256", expiresIn: "10y" });
}

export function verifyLicenseKey(key: string): LicensePayload | null {
  if (!SECRET) throw new Error("LICENSE_SECRET is not set");
  try {
    return jwt.verify(key, SECRET, { algorithms: ["HS256"] }) as LicensePayload & jwt.JwtPayload;
  } catch {
    return null;
  }
}
