import type { Metadata } from "next";
import { EB_Garamond, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const garamond = EB_Garamond({
  variable: "--font-garamond",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const GA_ID = "G-VNCCCP3DLY";

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
    <html lang="en" className={`${garamond.variable} ${inter.variable} h-full`}>
      <head>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="ga-init" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { page_path: window.location.pathname });
        `}</Script>
      </head>
      <body className="bg-white text-neutral-900 antialiased">{children}</body>
    </html>
  );
}

