// ───────────────────────────────────────────────────────────────
// Fetch provider abstraction.
//
// A "provider" takes a public Instagram/TikTok URL and returns a
// normalized result: the direct (no-watermark where possible) video
// URL(s), a thumbnail, the caption, and author info.
//
// The default adapter ("aio") targets the RapidAPI "Social Download
// All in One" API, which handles both Instagram reels and TikTok
// videos through a single endpoint. To swap APIs, write a new adapter
// that returns `NormalizedMedia` and register it in `getProvider()`.
// ───────────────────────────────────────────────────────────────

export type Platform = "instagram" | "tiktok" | "unknown";

export interface MediaVariant {
  quality: string; // e.g. "HD · No watermark", "No watermark"
  url: string; // direct video URL
  ext: string; // "mp4"
}

export interface NormalizedMedia {
  platform: Platform;
  title: string; // caption / description
  author: string; // username / handle
  thumbnail: string; // preview image URL
  durationSec?: number;
  variants: MediaVariant[]; // at least one; first = recommended
  sourceUrl: string; // the URL the user pasted
}

export interface FetchProvider {
  name: string;
  fetch(url: string): Promise<NormalizedMedia>;
}

export function detectPlatform(url: string): Platform {
  const u = url.toLowerCase();
  if (u.includes("instagram.com") || u.includes("instagr.am")) return "instagram";
  if (u.includes("tiktok.com") || u.includes("vm.tiktok") || u.includes("vt.tiktok"))
    return "tiktok";
  return "unknown";
}

export function isValidUrl(url: string): boolean {
  try {
    const u = new URL(url.trim());
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

// Turn raw quality strings ("hd_no_watermark") into clean button labels.
function humanizeQuality(q: string): string {
  const s = q.toLowerCase();
  if (s.includes("hd")) return "HD · No watermark";
  if (s.includes("no_watermark") || s.includes("nowatermark")) return "No watermark";
  if (s.includes("watermark")) return "Watermarked";
  if (s === "video" || !s) return "Video";
  return q.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

// Lower rank = better/preferred, sorted to the front.
function qualityRank(q: string): number {
  const s = q.toLowerCase().replace(/[\s_]/g, "");
  if (s.includes("hd")) return 0;
  if (s.includes("nowatermark")) return 1;
  if (s.includes("watermark")) return 3;
  return 2;
}

export class ProviderError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}

// ── Adapter: Social Download All in One (RapidAPI) ───────────────
// Verified response shape (POST JSON { url }):
//   {
//     "title": "...", "author": "...", "unique_id": "...",
//     "thumbnail": "...", "duration": 88447,   // milliseconds
//     "source": "tiktok",
//     "medias": [
//       { "url": "...", "quality": "hd_no_watermark",
//         "extension": "mp4", "type": "video" },
//       { "url": "...", "quality": "audio", "extension": "mp3",
//         "type": "audio" }   // audio entries are filtered out
//     ]
//   }
const aioProvider: FetchProvider = {
  name: "aio",
  async fetch(url: string): Promise<NormalizedMedia> {
    const key = process.env.RAPIDAPI_KEY;
    const host = process.env.RAPIDAPI_HOST || "social-download-all-in-one.p.rapidapi.com";
    if (!key) throw new ProviderError("missing_key", "RAPIDAPI_KEY is not configured.");

    const res = await fetch(`https://${host}/v1/social/autolink`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-rapidapi-key": key,
        "x-rapidapi-host": host,
      },
      body: JSON.stringify({ url }),
      cache: "no-store",
    });

    if (res.status === 429)
      throw new ProviderError("rate_limited", "The downloader API hit its rate limit. Try again shortly.");
    if (!res.ok)
      throw new ProviderError("provider_error", `Provider responded ${res.status}.`);

    const data: any = await res.json();

    if (data?.error)
      throw new ProviderError("provider_error", "The downloader couldn't process that link.");

    const medias: any[] = Array.isArray(data?.medias) ? data.medias : [];

    // Keep only video entries (drop the mp3/audio variant).
    const videos = medias.filter((m) => {
      if (!m || typeof m.url !== "string") return false;
      const tag = `${m.type || ""}${m.extension || ""}`.toLowerCase();
      return tag.includes("video") || tag.includes("mp4");
    });

    const variants: MediaVariant[] = videos.map((m) => ({
      quality: humanizeQuality(String(m.quality || m.label || "video")),
      url: String(m.url),
      ext: String(m.extension || "mp4").replace(/^\./, ""),
    }));

    // Best version first becomes the primary "Download" button.
    variants.sort((a, b) => qualityRank(a.quality) - qualityRank(b.quality));

    if (!variants.length)
      throw new ProviderError("no_media", "No downloadable video was found at that link.");

    // This provider returns duration in milliseconds at the top level.
    const durMs = typeof data?.duration === "number" ? data.duration : undefined;

    return {
      platform: detectPlatform(url),
      title: String(data?.title || "").trim() || "Untitled",
      author: String(data?.author || data?.unique_id || data?.author_name || "").trim(),
      thumbnail: String(data?.thumbnail || data?.thumb || ""),
      durationSec: durMs ? Math.round(durMs / 1000) : undefined,
      variants,
      sourceUrl: url,
    };
  },
};

const registry: Record<string, FetchProvider> = {
  aio: aioProvider,
};

export function getProvider(): FetchProvider {
  const name = process.env.FETCH_PROVIDER || "aio";
  const p = registry[name];
  if (!p) throw new ProviderError("bad_provider", `Unknown FETCH_PROVIDER "${name}".`);
  return p;
}
