import { NextRequest, NextResponse } from "next/server";
import {
  detectPlatform,
  getProvider,
  isValidUrl,
  ProviderError,
} from "@/lib/providers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Very small in-memory rate limiter (per warm serverless instance).
// For production-grade limiting use Upstash Redis or Vercel KV.
const hits = new Map<string, { count: number; ts: number }>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 15;

function limited(ip: string): boolean {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now - rec.ts > WINDOW_MS) {
    hits.set(ip, { count: 1, ts: now });
    return false;
  }
  rec.count += 1;
  return rec.count > MAX_PER_WINDOW;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "anon";

  if (limited(ip)) {
    return NextResponse.json(
      { error: "rate_limited", message: "Too many requests. Please wait a minute." },
      { status: 429 }
    );
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "bad_request", message: "Invalid request body." },
      { status: 400 }
    );
  }

  const url = String(body?.url || "").trim();

  if (!isValidUrl(url)) {
    return NextResponse.json(
      { error: "invalid_url", message: "Please paste a valid http(s) link." },
      { status: 400 }
    );
  }

  const platform = detectPlatform(url);
  if (platform === "unknown") {
    return NextResponse.json(
      {
        error: "unsupported",
        message: "That link isn't a recognized Instagram or TikTok URL.",
      },
      { status: 400 }
    );
  }

  try {
    const provider = getProvider();
    const media = await provider.fetch(url);
    return NextResponse.json({ ok: true, media }, { status: 200 });
  } catch (err) {
    if (err instanceof ProviderError) {
      const status =
        err.code === "rate_limited" ? 429 : err.code === "missing_key" ? 500 : 502;
      return NextResponse.json({ error: err.code, message: err.message }, { status });
    }
    return NextResponse.json(
      { error: "unknown", message: "Something went wrong fetching that link." },
      { status: 500 }
    );
  }
}
