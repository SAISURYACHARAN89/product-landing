import { NextRequest } from "next/server";
import { verifyLicenseKey } from "@/lib/license";

export async function POST(req: NextRequest) {
  const { key } = await req.json();
  if (!key) return Response.json({ valid: false }, { status: 400 });

  const payload = verifyLicenseKey(key);
  if (!payload) return Response.json({ valid: false }, { status: 200 });

  return Response.json({ valid: true, email: payload.email, product: payload.product }, { status: 200 });
}
