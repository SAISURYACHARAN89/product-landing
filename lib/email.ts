import { Resend } from "resend";

export async function sendLicenseEmail(to: string, licenseKey: string) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM || "onboarding@resend.dev",
    to,
    subject: "Your cursur license key",
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; color: #111;">
        <h1 style="font-size: 22px; font-weight: 600; margin-bottom: 8px;">Thanks for buying cursur 🎉</h1>
        <p style="font-size: 14px; color: #555; line-height: 1.6;">Here's your license key. Paste it into the app to activate it.</p>
        <div style="background: #f5f5f7; border-radius: 10px; padding: 16px; margin: 20px 0; font-family: monospace; font-size: 12px; word-break: break-all; color: #111;">
          ${licenseKey}
        </div>
        <p style="font-size: 13px; color: #888; line-height: 1.6;">Questions? Reply to this email or write to support@cursur.app.</p>
      </div>
    `,
  });
  if (error) throw new Error(`Resend failed: ${error.message}`);
}
