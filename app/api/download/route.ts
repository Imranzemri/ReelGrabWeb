import { NextRequest, NextResponse } from "next/server";
import { isValidUrl } from "@/lib/providers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Streams the remote video back through our origin with a
// Content-Disposition: attachment header. This is what makes the
// "Download" button save an actual .mp4 file instead of opening the
// CDN URL in a new tab (cross-origin downloads can't be forced from
// the client alone).
export async function GET(req: NextRequest) {
  const src = req.nextUrl.searchParams.get("u") || "";
  const name = (req.nextUrl.searchParams.get("name") || "reel").replace(/[^a-z0-9-_]/gi, "_");

  if (!isValidUrl(src)) {
    return NextResponse.json({ error: "invalid_url" }, { status: 400 });
  }

  // Allowlist: only proxy known social CDNs to avoid being an open proxy.
  let host = "";
  try {
    host = new URL(src).hostname;
  } catch {
    return NextResponse.json({ error: "invalid_url" }, { status: 400 });
  }
  // Known TikTok / Instagram / ByteDance CDN families. We allow these
  // exact domains and any subdomain of them (regional CDNs vary a lot),
  // so the proxy can't be used as a fully open proxy for arbitrary hosts.
  const ALLOWED_DOMAINS = [
    // Instagram / Meta
    "cdninstagram.com",
    "fbcdn.net",
    // TikTok
    "tiktok.com",
    "tiktokcdn.com",
    "tiktokcdn-us.com",
    "tiktokcdn-eu.com",
    "tiktokv.com",
    "tiktokvdc.com",
    // ByteDance / shared CDNs TikTok uses
    "byteoversea.com",
    "ibyteimg.com",
    "ibytedtos.com",
    "muscdn.com",
    "ttvcdn.com",
    "akamaized.net",
  ];
  const hostLc = host.toLowerCase();
  const allowed = ALLOWED_DOMAINS.some(
    (d) => hostLc === d || hostLc.endsWith(`.${d}`)
  );
  if (!allowed) {
    // Include the host so it's easy to add if a new CDN shows up.
    return NextResponse.json({ error: "host_not_allowed", host }, { status: 400 });
  }

  const upstream = await fetch(src, {
    headers: {
      // Some CDNs require a UA / referer to serve the file.
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
    },
    cache: "no-store",
  });

  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({ error: "upstream_failed" }, { status: 502 });
  }

  const headers = new Headers();
  headers.set("Content-Type", upstream.headers.get("content-type") || "video/mp4");
  const len = upstream.headers.get("content-length");
  if (len) headers.set("Content-Length", len);
  headers.set("Content-Disposition", `attachment; filename="${name}.mp4"`);
  headers.set("Cache-Control", "no-store");

  return new NextResponse(upstream.body, { status: 200, headers });
}
