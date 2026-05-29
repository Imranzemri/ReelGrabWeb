import Link from "next/link";
import Downloader from "@/components/Downloader";
import AdSlot from "@/components/AdSlot";

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "ReelGrab";

const steps = [
  {
    n: "01",
    t: "Copy the link",
    d: "On Instagram or TikTok, tap Share → Copy Link on the reel you want.",
  },
  {
    n: "02",
    t: "Paste it here",
    d: "Drop the link in the box above and hit Get video. We fetch it in seconds.",
  },
  {
    n: "03",
    t: "Download the MP4",
    d: "Preview it, copy the caption if you need it, then save the HD file.",
  },
];

const faqs = [
  {
    q: "Is this Instagram & TikTok downloader free?",
    a: "Yes. You can download Reels and TikTok videos for free, with no account or app install required.",
  },
  {
    q: "Do downloads have a watermark?",
    a: "Where the source provides a clean stream, we return the highest-quality version available. TikTok no-watermark availability depends on the video.",
  },
  {
    q: "Can I get the caption too?",
    a: "Yes — the original caption is shown next to the video with a one-tap Copy button.",
  },
  {
    q: "Is it legal to download reels?",
    a: "Download only content you own or have permission to use. Reposting someone else's video can violate copyright and the platform's Terms of Service. You are responsible for how you use downloaded files.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-3xl px-5 pb-24 pt-10 sm:pt-16">
      {/* Header */}
      <header className="mb-10 flex items-center justify-between">
        <span className="font-display text-xl font-semibold tracking-tight text-cream">
          {SITE_NAME}
        </span>
        <nav className="flex items-center gap-5 text-sm text-white/45">
          <a href="#how" className="transition hover:text-white">How it works</a>
          <a href="#faq" className="transition hover:text-white">FAQ</a>
        </nav>
      </header>

      {/* Hero */}
      <section className="mb-8">
        <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/55">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Free · No login · No watermark
        </p>
        <h1 className="font-display text-4xl font-semibold leading-[1.08] tracking-tight text-cream sm:text-5xl">
          Download Instagram Reels &<br className="hidden sm:block" /> TikTok videos in HD.
        </h1>
        <p className="mt-4 max-w-xl text-[17px] leading-relaxed text-white/55">
          Paste a link, grab the video and its caption in one click. No app, no signup, no
          watermark — just the file.
        </p>
      </section>

      {/* Tool */}
      <Downloader />

      {/* Ad — below the fold, after the tool (AdSense-friendly placement) */}
      <div className="my-12">
        <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP} />
      </div>

      {/* How it works */}
      <section id="how" className="scroll-mt-10">
        <h2 className="font-display text-2xl font-semibold text-cream">How it works</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {steps.map((s) => (
            <div
              key={s.n}
              className="rounded-2xl border border-white/10 bg-ink-soft/50 p-5"
            >
              <span className="font-display text-sm text-accent">{s.n}</span>
              <h3 className="mt-2 text-[15px] font-semibold text-cream">{s.t}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-white/50">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="my-12">
        <AdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_INLINE} />
      </div>

      {/* FAQ */}
      <section id="faq" className="scroll-mt-10">
        <h2 className="font-display text-2xl font-semibold text-cream">
          Frequently asked questions
        </h2>
        <div className="mt-5 divide-y divide-white/10 rounded-2xl border border-white/10 bg-ink-soft/40">
          {faqs.map((f) => (
            <details key={f.q} className="group p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between text-[15px] font-medium text-cream">
                {f.q}
                <span className="ml-4 text-white/40 transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-white/55">{f.a}</p>
            </details>
          ))}
        </div>
        {/* FAQ structured data for rich results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqs.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            }),
          }}
        />
      </section>

      {/* Footer */}
      <footer className="mt-16 flex flex-col items-center gap-3 border-t border-white/10 pt-8 text-center text-xs text-white/35">
        <p>
          {SITE_NAME} is not affiliated with Instagram, Meta, or TikTok. Trademarks belong to
          their respective owners. Download only content you have the right to use.
        </p>
        <div className="flex gap-5">
          <Link href="/privacy" className="hover:text-white">Privacy</Link>
          <Link href="/terms" className="hover:text-white">Terms</Link>
        </div>

        <div className="mt-4 flex flex-col items-center gap-2 border-t border-white/10 pt-5">
          <p className="text-white/40">
            Developed by <span className="font-medium text-white/70">Imran Khan</span>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5">
            <a
              href="mailto:imrankhanzemri@gmail.com"
              className="inline-flex items-center gap-1.5 transition hover:text-white"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-10 5L2 7" />
              </svg>
              imrankhanzemri@gmail.com
            </a>
            <span className="text-white/15">·</span>
            <a
              href="https://instagram.com/imran_zemri"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 transition hover:text-white"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
              @imran_zemri
            </a>
            <span className="text-white/15">·</span>
            <a
              href="https://snapchat.com/add/izemri19"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 transition hover:text-white"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
                <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.135.553-.073.27-.27.405-.57.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.778-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.15-.055-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.227-3.651.307-4.837C7.392 1.077 10.739.807 11.722.807l.484-.014z" />
              </svg>
              izemri19
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
