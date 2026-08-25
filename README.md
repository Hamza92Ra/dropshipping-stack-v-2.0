# DropshippingStack — Vercel Edition

This is a Next.js (App Router) rewrite of your PHP `dropshipping-stack` repo, built to deploy
on Vercel while keeping your **existing MySQL database on AwardSpace** as the data store.

## Before you touch Vercel: enable Remote MySQL on AwardSpace

Shared hosts like AwardSpace block external connections to MySQL by default — only the PHP
running on the same server could reach the DB. Vercel's functions run somewhere else entirely,
so:

1. In AwardSpace control panel, find **Remote MySQL** (sometimes under "Database" or "Advanced").
2. Whitelist connections — either Vercel's outbound IP ranges (Vercel doesn't publish static IPs
   for Hobby/Pro plans, so you may need `%` / "allow all" if AwardSpace doesn't support a proxy),
   or use a connection pooler/tunnel if AwardSpace restricts by IP.
3. Confirm you can connect from outside their network with a MySQL client using the same
   host/port before deploying — this is the #1 thing that will silently break everything.

If AwardSpace won't allow remote connections at all, the fallback is moving the database itself
to a host built for this (PlanetScale, Railway, Neon-for-MySQL alternatives, or a small VPS) —
happy to help with that migration if it comes to it.

## 1. Install dependencies

```bash
npm install
```

## 2. Set up the database

Run `schema.sql` against your existing database — it only creates tables that don't already
exist, so it's safe to run alongside your current `database.sql`. Compare column names against
your live `tools` table; the app expects `slug`, `logo_url`, `affiliate_url`, `upvotes`, etc. —
rename or add columns as needed.

## 3. Environment variables

Copy `.env.example` to `.env.local` and fill in your AwardSpace DB credentials, a generated
`SECRET_KEY`, and Gmail SMTP credentials (same ones PHPMailer used).

```bash
cp .env.example .env.local
```

## 4. Run locally

```bash
npm run dev
```

Visit http://localhost:3000 — this connects live to your AwardSpace MySQL, same as before.

## 5. Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Then add every variable from `.env.example` in the Vercel dashboard under
**Settings → Environment Variables** (they don't get read from `.env.local` in production).

The cron job in `vercel.json` (daily price-alert check) only runs once deployed — Vercel Cron
doesn't fire locally.

## What's carried over from the PHP app

- Homepage, tool pages, category pages, live search
- Login / register / logout, email verification, forgot/reset password
- Bookmarks, price alerts (+ daily cron + email), roadmap checklist
- Compare (up to 3 tools), Stack Builder, Submit-a-tool
- Admin panel: tools list, create, edit, delete
- Affiliate click tracking (`/api/go`, replaces `go.php`)
- Greenhouse design system (Fraunces + Nunito, sage/amber palette), dark mode scoped to
  `/profile` only, mobile hamburger nav

## What still needs your attention

- **Admin reviews/submissions screens** — the `submissions` table and API exist, but there's no
  admin UI to approve/reject yet; right now it's SQL-only (`UPDATE submissions SET status = ...`).
- **Calculator page** — not ported yet; the old `calculator.php` logic needs to move into a
  client component.
- **Rate limiting** on login/register/reset endpoints — worth adding before this is public-facing
  again, since PHP + Apache may have had something at the server level that Vercel functions
  don't get for free.
- The AI chatbot (Groq) isn't included in this pass — say the word and I'll port that next,
  now as a streaming API route instead of a PHP endpoint.
