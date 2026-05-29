"use client";

import { useState, useCallback } from "react";

interface MediaVariant {
  quality: string;
  url: string;
  ext: string;
}
interface Media {
  platform: string;
  title: string;
  author: string;
  thumbnail: string;
  durationSec?: number;
  variants: MediaVariant[];
  sourceUrl: string;
}

export default function Downloader() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [media, setMedia] = useState<Media | null>(null);
  const [copied, setCopied] = useState(false);

  const submit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      setError(null);
      setMedia(null);
      const value = url.trim();
      if (!value) {
        setError("Paste an Instagram Reel or TikTok link first.");
        return;
      }
      setLoading(true);
      try {
        const res = await fetch("/api/fetch", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ url: value }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data?.message || "Couldn't fetch that link.");
        } else {
          setMedia(data.media as Media);
        }
      } catch {
        setError("Network error. Check your connection and try again.");
      } finally {
        setLoading(false);
      }
    },
    [url]
  );

  const pasteFromClipboard = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setUrl(text.trim());
    } catch {
      /* clipboard blocked — ignore */
    }
  }, []);

  const copyCaption = useCallback(async () => {
    if (!media?.title) return;
    try {
      await navigator.clipboard.writeText(media.title);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  }, [media]);

  const downloadHref = (v: MediaVariant) => {
    const name = `${media?.platform || "reel"}-${(media?.author || "video").replace(/\W+/g, "")}`;
    return `/api/download?u=${encodeURIComponent(v.url)}&name=${encodeURIComponent(name)}`;
  };

  return (
    <div className="w-full">
      {/* Input card */}
      <form
        onSubmit={submit}
        className="field-shadow rounded-2xl border border-white/10 bg-ink-soft/70 p-2 backdrop-blur"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              inputMode="url"
              autoComplete="off"
              spellCheck={false}
              placeholder="Paste an Instagram Reel or TikTok link…"
              className="w-full rounded-xl bg-black/30 px-4 py-4 text-[15px] text-cream outline-none ring-0 placeholder:text-white/30 focus:bg-black/40"
            />
            <button
              type="button"
              onClick={pasteFromClipboard}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-3 py-1.5 text-xs font-medium text-white/45 transition hover:bg-white/5 hover:text-white/80"
            >
              Paste
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-accent px-6 py-4 text-[15px] font-semibold text-ink transition hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-60 sm:py-4"
          >
            {loading ? "Fetching…" : "Get video"}
          </button>
        </div>
      </form>

      <p className="mt-3 px-1 text-center text-xs text-white/35">
        Works with Reels, TikTok videos & short links. Only download content you have the
        right to use.
      </p>

      {/* Error */}
      {error && (
        <div className="mt-5 rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent-soft">
          {error}
        </div>
      )}

      {/* Result */}
      {media && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-ink-soft/60 shadow-card">
          <div className="grid gap-0 sm:grid-cols-[200px_1fr]">
            {/* Preview */}
            <div className="relative bg-black/40">
              {media.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={media.thumbnail}
                  alt={media.title}
                  className="h-full max-h-[280px] w-full object-cover sm:max-h-none"
                />
              ) : (
                <div className="flex h-44 items-center justify-center text-white/30">
                  no preview
                </div>
              )}
              <span className="absolute left-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-cream backdrop-blur">
                {media.platform}
              </span>
            </div>

            {/* Meta + actions */}
            <div className="flex flex-col gap-4 p-5">
              <div>
                {media.author && (
                  <p className="text-sm font-medium text-accent-soft">@{media.author}</p>
                )}
                <p className="mt-1 line-clamp-4 text-[15px] leading-relaxed text-cream/90">
                  {media.title}
                </p>
              </div>

              <button
                onClick={copyCaption}
                className="self-start rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-white/60 transition hover:border-white/25 hover:text-white"
              >
                {copied ? "Caption copied ✓" : "Copy caption"}
              </button>

              <div className="mt-auto flex flex-wrap gap-2 pt-2">
                {media.variants.map((v, i) => (
                  <a
                    key={i}
                    href={downloadHref(v)}
                    className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${
                      i === 0
                        ? "bg-accent text-ink hover:bg-accent-soft"
                        : "border border-white/15 text-cream hover:border-white/35"
                    }`}
                  >
                    Download {media.variants.length > 1 ? v.quality : "video"}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
