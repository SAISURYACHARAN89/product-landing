import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Cursur — Give your cursor a personality",
  description: "Cursur gives your cursor emotions. Sunglasses while watching. Focused while working. Available for Mac and Windows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} h-full`}>
      <body className="min-h-full bg-white text-neutral-900 antialiased" style={{ fontFamily: "var(--font-jakarta)" }}>{children}</body>
    </html>
  );
}
