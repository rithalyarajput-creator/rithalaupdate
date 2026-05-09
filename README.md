# 🚩 Rithala Update v2 — Full-stack Next.js + Postgres

> **Public website + Admin dashboard + Database — all on Vercel, all free**

This is the **dynamic v2** of [rithalaupdate.online](https://rithalaupdate.online),
rebuilt from the static Astro v1 to give Sandeep Rajput a real WordPress-style
admin where new posts go live in **under 10 seconds** without touching code.

[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js%2014-000000?logo=next.js&logoColor=white)](https://nextjs.org)
[![Database: Vercel Postgres](https://img.shields.io/badge/DB-Vercel%20Postgres-336791?logo=postgresql&logoColor=white)](https://vercel.com/storage/postgres)
[![Deploy: Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com)

## ✨ What you get

* 🌐 **Public site** at `/` — home, post pages, category pages
* 🔐 **Admin login** at `/admin/login` — email + password
* 📊 **Dashboard** at `/admin/dashboard` — counts + recent activity
* 📝 **Post editor** at `/admin/posts/new` — title, slug, body, image, categories
* 🖼️ **Image upload** to Vercel Blob storage
* ⚡ **Real-time updates** — `revalidatePath()` on every save means the live
  site refreshes within seconds, no rebuild needed
* 🔍 **SEO ready** — sitemap, robots, OpenGraph, RSS, JSON-LD
* 🔗 **Legacy URL preservation** — old WordPress paths (`/2025/09/14/747/`)
  still resolve, so Google rankings carry over from v1

## 📁 Folder layout

```
rithalaupdate-v2/
├── public/
│   ├── logo.png
│   └── favicon.png
├── scripts/
│   ├── schema.sql           # Postgres schema
│   ├── db-setup.mjs         # creates tables, admin user, imports WP posts
│   └── rithala-wxr.xml      # WordPress export to migrate from
├── src/
│   ├── app/
│   │   ├── layout.tsx       # root layout
│   │   ├── page.tsx         # home
│   │   ├── [...slug]/       # post & page detail (catch-all)
│   │   ├── category/[slug]/ # category archive
│   │   ├── admin/           # all admin pages (protected by middleware)
│   │   ├── api/             # /api/auth, /api/posts, /api/upload
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   └── rss.xml/route.ts
│   ├── components/          # PublicShell, AdminShell, PostCard, PostEditor
│   ├── lib/                 # db.ts, auth.ts
│   └── middleware.ts        # protects /admin/*
├── package.json
├── next.config.mjs
└── tsconfig.json
```

## 🚀 Local development

```bash
# 1. Install dependencies
npm install

# 2. Copy env template
cp .env.example .env.local

# 3. Edit .env.local — at minimum set:
#    POSTGRES_URL              (from Vercel project → Storage → Postgres)
#    JWT_SECRET                (any 32+ char random string)
#    ADMIN_EMAIL               (your email)
#    ADMIN_PASSWORD            (initial password — change after first login)

# 4. Initialise database (creates tables, admin user, imports WP posts)
node scripts/db-setup.mjs

# 5. Run dev server
npm run dev

# 6. Open
#    http://localhost:3000             — public site
#    http://localhost:3000/admin/login — admin (use email/password from step 3)
```

## 🌐 Deploy to Vercel (5 minutes)

1. Push this repo to GitHub.
2. <https://vercel.com/new> → Import the repo.
3. **Storage tab → Create → Postgres** → connect to the project.
4. **Storage tab → Create → Blob** → connect to the project (for image uploads).
5. **Settings → Environment Variables** add:
   * `JWT_SECRET` — long random string
   * `ADMIN_EMAIL` — your email
   * `ADMIN_PASSWORD` — initial password
   * `NEXT_PUBLIC_SITE_URL` — `https://rithalaupdate.online`
   (Postgres + Blob env vars are auto-injected.)
6. Deploy. Vercel gives you `https://rithalaupdate-v2.vercel.app`.
7. **Run the DB setup** — open the Vercel project's **Postgres → Query** tab
   and paste the contents of `scripts/schema.sql`, then run.
   Or locally: `vercel env pull .env.local && node scripts/db-setup.mjs`
8. **Custom domain** → Domains tab → add `rithalaupdate.online`.

## 🔄 How "instant publish" works

```
Admin edits post → click Publish
   ↓
POST/PUT /api/posts → row written in Postgres
   ↓
revalidatePath('/') and revalidatePath('/{slug}/')
   ↓
Next 5–10s: any visitor hitting those paths sees the new content
```

No git commit, no rebuild, no cache to clear. Vercel's ISR + on-demand
revalidation handles it transparently.

## 🔒 Security notes

* Passwords are bcrypt-hashed (10 rounds).
* Sessions are JWT in an HTTP-only cookie (7 day expiry).
* `middleware.ts` blocks unauthenticated access to `/admin/*` at the edge.
* `BLOB_READ_WRITE_TOKEN` is server-only; clients never see it.
* All write APIs (`POST /api/posts`, `DELETE`, etc.) require a valid session.

## 🛠 Customising

* **Add a category** → just `INSERT INTO categories (slug, name) VALUES (...)`
  in the Postgres Query tab. The admin dropdown picks it up automatically.
* **Change the site title / social links** → `UPDATE settings SET value = ...`
  (or wire up a Settings page in admin — left as future work).
* **Reset admin password** → re-run `node scripts/db-setup.mjs` with new
  `ADMIN_PASSWORD` env var.

## 📜 License

MIT.
