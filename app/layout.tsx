import type { Metadata } from "next";
import Script from "next/script";
import { Manrope, Fraunces } from "next/font/google";
import "./globals.css";

const body = Manrope({ subsets: ["latin"], variable: "--font-body" });
const display = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-display",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "ReelGrab";
const ADSENSE = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Instagram & TikTok Reel Downloader (Free, No Watermark)`,
    template: `%s · ${SITE_NAME}`,
  },
  description:
    "Download Instagram Reels and TikTok videos in HD with their caption — free, fast, no watermark, no login. Paste a link and save the MP4 in one click.",
  keywords: [
    "instagram reel downloader",
    "tiktok downloader",
    "download instagram reels",
    "tiktok no watermark",
    "reel to mp4",
    "save instagram video",
    "free video downloader",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Instagram & TikTok Reel Downloader`,
    description:
      "Paste an Instagram Reel or TikTok link and download the HD video with its caption. Free, no watermark, no signup.",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Reel Downloader`,
    description: "Download Instagram Reels & TikTok videos in HD. Free, no watermark.",
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${body.variable} ${display.variable}`}>
      <head>
        {/* Structured data helps Google show a rich result. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: SITE_NAME,
              applicationCategory: "MultimediaApplication",
              operatingSystem: "Any",
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              url: SITE_URL,
            }),
          }}
        />
        {ADSENSE ? (
          <Script
            id="adsense-init"
            async
            strategy="afterInteractive"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE}`}
            crossOrigin="anonymous"
          />
        ) : null}
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
