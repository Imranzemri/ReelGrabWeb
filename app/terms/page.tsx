import type { Metadata } from "next";
import Link from "next/link";

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "ReelGrab";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `Terms governing use of ${SITE_NAME}.`,
};

export default function Terms() {
  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-16">
      <Link href="/" className="text-sm text-accent-soft hover:underline">
        ← Back
      </Link>
      <h1 className="mt-6 font-display text-3xl font-semibold text-cream">Terms of Use</h1>
      <p className="mt-2 text-sm text-white/40">Last updated: {new Date().getFullYear()}</p>

      <div className="mt-8 space-y-6 text-[15px] leading-relaxed text-white/65">
        <p>
          By using {SITE_NAME} you agree to these terms. If you do not agree, please do not use
          the service.
        </p>

        <section>
          <h2 className="text-lg font-semibold text-cream">Acceptable use</h2>
          <p>
            You agree to download only content that you own or have explicit permission to use.
            You are solely responsible for ensuring your use complies with copyright law and the
            Terms of Service of Instagram, Meta, and TikTok. Do not use this tool to infringe
            intellectual property or to redistribute others' content without authorization.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-cream">No affiliation</h2>
          <p>
            {SITE_NAME} is an independent tool and is not affiliated with, endorsed by, or
            sponsored by Instagram, Meta Platforms, or TikTok. All trademarks belong to their
            respective owners.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-cream">No warranty</h2>
          <p>
            The service is provided "as is" without warranties of any kind. Availability depends
            on third-party platforms and may break or change at any time. We are not liable for
            any damages arising from use of the service.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-cream">Changes</h2>
          <p>We may update these terms at any time. Continued use means you accept the changes.</p>
        </section>
      </div>
    </main>
  );
}
