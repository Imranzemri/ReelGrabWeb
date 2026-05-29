# ReelGrab — Instagram & TikTok Reel Downloader

A production-ready **Next.js 14 (App Router)** app: paste an Instagram Reel or TikTok
link, preview the video + caption, and download the HD MP4 in one click. Built for free
hosting on **Vercel**, with **SEO** and **Google AdSense** wired in.

---

## How it works (architecture)

```
Browser ──paste link──▶ /api/fetch ──▶ RapidAPI downloader ──▶ direct video URL
Browser ──Download────▶ /api/download (proxies the file as an .mp4 attachment)
```

A browser **cannot** fetch Instagram/TikTok videos directly (CORS + auth + anti-scraping),
so a server route does it. We use a **third-party RapidAPI** downloader as the fetch engine
(your choice during setup). The provider is swappable — see `lib/providers.ts`.

---

## 1. Run locally

```bash
npm install
cp .env.example .env.local   # then fill in values (see below)
npm run dev                  # http://localhost:3000
```

The site runs without an API key — but fetching a link will return a clear
"RAPIDAPI_KEY is not configured" error until you add one.

## 2. Get a fetch API key (RapidAPI)

1. Sign up at <https://rapidapi.com> (free).
2. Subscribe to a social downloader API. Good options (all have free tiers):
   - **Social Download All in One** — one endpoint for IG + TikTok (this is the default adapter).
   - **TikTok Video No Watermark** + an **Instagram** API if you prefer specialized ones.
3. Copy your **X-RapidAPI-Key** and **host**, put them in `.env.local`:
   ```
   RAPIDAPI_KEY=xxxxxxxxxxxxxxxx
   RAPIDAPI_HOST=social-download-all-in-one.p.rapidapi.com
   FETCH_PROVIDER=aio
   ```

> ⚠️ **Response shapes differ between APIs.** The `aio` adapter in `lib/providers.ts` maps a
> common shape (`{ title, author, thumbnail, medias: [{ url, quality, extension }] }`). If your
> chosen API returns something different, edit the mapping in that file — it's heavily commented.

### Swapping or adding a provider
Open `lib/providers.ts`, copy the `aioProvider` object, change the endpoint/mapping, register it
in `registry`, and set `FETCH_PROVIDER` to its name.

## 3. Deploy free on Vercel

1. Push this folder to a GitHub repo.
2. Go to <https://vercel.com>, **Import** the repo (framework auto-detected as Next.js).
3. In **Settings → Environment Variables**, add everything from `.env.example`
   (`RAPIDAPI_KEY`, `RAPIDAPI_HOST`, `FETCH_PROVIDER`, `NEXT_PUBLIC_SITE_URL`, the AdSense vars).
4. Deploy. Add your custom domain under **Settings → Domains** (free).

Set `NEXT_PUBLIC_SITE_URL` to your final domain so canonical URLs, sitemap, and Open Graph
tags are correct.

---

## 4. SEO — getting found on Google

Already built in:
- Title/description/keywords + Open Graph + Twitter cards (`app/layout.tsx`).
- `WebApplication` + `FAQPage` **JSON-LD** structured data (rich results).
- `app/sitemap.ts` → `/sitemap.xml`, `app/robots.ts` → `/robots.txt`.
- Real on-page content (How it works, FAQ) — Google ranks pages with useful text, not bare tools.

**Your to-do after deploy:**
1. Add the site to **Google Search Console** (<https://search.google.com/search-console>) and
   submit `https://your-domain.com/sitemap.xml`.
2. Add an `og.png` (1200×630) to `/public` for nice link previews.
3. Earn a few backlinks and keep the FAQ/content fresh — that's what actually moves rankings.

> Honest note: "top of Google" for terms like *instagram downloader* is extremely competitive
> (dozens of established sites). The technical SEO here is solid; ranking #1 also takes time,
> backlinks, and content. Consider long-tail angles (e.g. a specific niche or language).

---

## 5. Google AdSense — running ads

1. Apply at <https://adsense.google.com> with your **live** domain (AdSense rejects empty or
   thin sites — the content pages here help).
2. Once approved, set in your env vars:
   ```
   NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
   NEXT_PUBLIC_ADSENSE_SLOT_TOP=XXXXXXXXXX
   NEXT_PUBLIC_ADSENSE_SLOT_INLINE=XXXXXXXXXX
   ```
3. Edit `public/ads.txt` — replace `pub-0000000000000000` with your publisher ID.
4. Ad slots render automatically. With no client ID set, they show a discreet "ad space"
   placeholder so dev builds stay clean.

> ⚠️ **AdSense + downloader sites:** Google's program policies discourage sites whose primary
> purpose is downloading copyrighted media, and such sites are sometimes rejected or limited.
> The Terms/Privacy pages and original content here improve your odds, but approval isn't
> guaranteed. Have a backup ad network (e.g. Ezoic, Adsterra) in mind.

---

## Legal / ToS reality check

Instagram, Meta, and TikTok **prohibit** unauthorized downloading in their Terms of Service.
This project is provided for downloading content **you own or have permission to use**. You are
responsible for compliance with copyright and platform terms. The included Terms/Privacy pages
make this explicit to your users.

---

## Project structure

```
app/
  layout.tsx          SEO metadata, fonts, AdSense script, JSON-LD
  page.tsx            Hero + tool + How-it-works + FAQ + footer
  globals.css
  api/fetch/route.ts     POST link → normalized media (rate-limited)
  api/download/route.ts  GET proxy → forces .mp4 attachment download
  privacy/page.tsx       Privacy policy (AdSense requirement)
  terms/page.tsx         Terms of use
  sitemap.ts / robots.ts
components/
  Downloader.tsx      Client UI (paste, preview, caption, download)
  AdSlot.tsx          AdSense unit (renders placeholder if unconfigured)
lib/
  providers.ts        Swappable fetch-provider abstraction
public/
  ads.txt
```
