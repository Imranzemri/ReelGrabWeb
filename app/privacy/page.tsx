import type { Metadata } from "next";
import Link from "next/link";

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "ReelGrab";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${SITE_NAME} handles data, cookies, and advertising.`,
};

export default function Privacy() {
  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-16">
      <Link href="/" className="text-sm text-accent-soft hover:underline">
        ← Back
      </Link>
      <h1 className="mt-6 font-display text-3xl font-semibold text-cream">Privacy Policy</h1>
      <p className="mt-2 text-sm text-white/40">Last updated: {new Date().getFullYear()}</p>

      <div className="prose-invert mt-8 space-y-6 text-[15px] leading-relaxed text-white/65">
        <p>
          {SITE_NAME} ("we", "us") lets you download publicly available Instagram and TikTok
          videos. We aim to collect as little data as possible. This page explains what we do
          and don't collect.
        </p>

        <section>
          <h2 className="text-lg font-semibold text-cream">Links you submit</h2>
          <p>
            When you paste a link, it is sent to our server and a third-party download API
            only to resolve the video. We do not store the links you submit or the videos you
            download.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-cream">Cookies & advertising</h2>
          <p>
            We use Google AdSense to display ads. Google and its partners may use cookies to
            serve ads based on your prior visits to this and other websites. You can opt out of
            personalized advertising by visiting{" "}
            <a className="text-accent-soft hover:underline" href="https://www.google.com/settings/ads">
              Google Ads Settings
            </a>
            . For more, see{" "}
            <a
              className="text-accent-soft hover:underline"
              href="https://policies.google.com/technologies/ads"
            >
              How Google uses information from sites that use its services
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-cream">Analytics & logs</h2>
          <p>
            Our hosting provider may keep standard server logs (IP address, user agent) for
            security and rate-limiting. These are not used to identify you personally.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-cream">Contact</h2>
          <p>Questions? Reach us at the email listed on the site.</p>
        </section>
      </div>
    </main>
  );
}
