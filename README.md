# Rithala Update — Official Website

**Live:** [rithalaupdate.online](https://rithalaupdate.online)  
**Built by:** [Sandeep Rajput (Rithalya Rajput)](https://rithalaupdate.online/sandeep-rajput/)

[![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com)
[![PostgreSQL](https://img.shields.io/badge/Database-Vercel%20Postgres-336791?logo=postgresql&logoColor=white)](https://vercel.com/storage/postgres)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## About

Rithala Update is the official digital platform for **Rithala Village**, North-West Delhi — celebrating Rajputana heritage, culture, events, temples, and the stories of our community since 15 August 2022.

This is **v2** of the website — a full-stack Next.js application with a custom admin dashboard, replacing the earlier static Astro v1. New blog posts go live in under 10 seconds without touching any code.

---

## Features

### Public Website
- Home page with hero section, Rajputana heritage section, auto-sliding image banner, reels strip, latest blog posts, testimonials, and FAQs
- Blog listing page with category, author, year, and search filters
- Individual blog post pages with related posts and SEO structured data
- Photo gallery with category tabs, album folders, and lightbox viewer
- Reels page with embedded video cards
- About / Sandeep Rajput page
- Rithala Village History page
- Contact page with form
- FAQs page
- AI Chatbot (Rithala AI) — tree-based conversational assistant with voice input/output
- PWA-ready (installable on mobile)
- Fully mobile responsive with iPhone safe-area support

### Admin Dashboard (`/admin`)
- Secure login with bcrypt + JWT (HTTP-only cookie)
- Dashboard with post counts and recent activity
- Post editor — title, slug, excerpt, content, featured image, categories, status, scheduled publishing
- Media manager — upload images to Vercel Blob storage
- Categories, Authors, Reels, Photos managers
- Testimonials manager — approve/reject community testimonials
- FAQs manager — create/edit FAQs, set show-on-home flag
- Leads manager — view contact form submissions
- Settings and Users managers

### Technical
- ISR with on-demand revalidation — publish a post and it is live in seconds
- SEO: sitemap.xml, robots.txt, OpenGraph, Twitter cards, JSON-LD structured data, RSS feed
- Legacy WordPress URL support — old post paths still resolve
- Vercel Postgres (Neon) for database
- Vercel Blob for image/media storage

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Pure custom CSS (no Tailwind) |
| Database | Vercel Postgres (PostgreSQL via Neon) |
| Storage | Vercel Blob |
| Auth | JWT + bcryptjs (HTTP-only cookie) |
| Deployment | Vercel |
| AI Chatbot | Custom tree-based logic (no external AI API) |

---

## Project Structure

```
rithalaupdate/
├── public/
│   ├── logo.png
│   └── favicon.png
├── scripts/
│   ├── schema.sql           # PostgreSQL schema
│   └── db-setup.mjs         # Creates tables + admin user
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Home page
│   │   ├── globals.css          # All CSS (single file, no Tailwind)
│   │   ├── [...slug]/           # Blog post / static page (catch-all)
│   │   ├── blog/                # Blog listing + single post
│   │   ├── category/[slug]/     # Category archive
│   │   ├── photos/              # Photo gallery
│   │   ├── reels/               # Reels page
│   │   ├── faqs/                # FAQs page
│   │   ├── contact/             # Contact page
│   │   ├── about/               # About page
│   │   ├── sandeep-rajput/      # Creator bio page
│   │   ├── rithala-village-history/
│   │   ├── contact-location/
│   │   ├── admin/               # All admin pages (protected)
│   │   ├── api/                 # REST API routes
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   └── rss.xml/route.ts
│   ├── components/
│   │   ├── PublicShell.tsx      # Public layout wrapper
│   │   ├── AdminShell.tsx       # Admin layout wrapper
│   │   ├── AIChatBot.tsx        # AI chatbot
│   │   ├── HeroSlider.tsx       # Auto-sliding image banner
│   │   ├── ReelsStrip.tsx       # Horizontal reels strip
│   │   ├── TestimonialsSection.tsx
│   │   ├── PostEditor.tsx       # Rich post editor
│   │   ├── Icon.tsx             # SVG icon system
│   │   └── ...
│   ├── lib/
│   │   ├── db.ts                # Database queries
│   │   └── auth.ts              # JWT auth helpers
│   └── middleware.ts            # Protects /admin/* routes
├── package.json
├── next.config.mjs
└── tsconfig.json
```

---

## Local Development

### Prerequisites
- Node.js 18+
- A Vercel account (for Postgres + Blob storage)

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/rithalyarajput-creator/rithalaupdate.git
cd rithalaupdate

# 2. Install dependencies
npm install

# 3. Pull environment variables from Vercel
vercel env pull .env.local
# Or manually create .env.local:
#   POSTGRES_URL=...
#   BLOB_READ_WRITE_TOKEN=...
#   JWT_SECRET=any-32-char-random-string
#   ADMIN_EMAIL=your@email.com
#   ADMIN_PASSWORD=yourpassword
#   NEXT_PUBLIC_SITE_URL=http://localhost:3000

# 4. Set up database (creates tables + admin user)
node scripts/db-setup.mjs

# 5. Run dev server
npm run dev
```

Open:
- `http://localhost:3000` — public site
- `http://localhost:3000/admin/login` — admin panel

---

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo
3. **Storage tab** → Create → **Postgres** → connect to project
4. **Storage tab** → Create → **Blob** → connect to project
5. **Settings → Environment Variables**, add:
   - `JWT_SECRET` — any long random string
   - `ADMIN_EMAIL` — your login email
   - `ADMIN_PASSWORD` — initial password
   - `NEXT_PUBLIC_SITE_URL` — `https://rithalaupdate.online`
6. Deploy
7. Run the schema: open **Postgres → Query** tab on Vercel and paste `scripts/schema.sql`
8. Add custom domain under the **Domains** tab

---

## How Instant Publishing Works

```
Admin clicks Publish
        ↓
POST /api/posts  →  row saved in Postgres
        ↓
revalidatePath('/') + revalidatePath('/blog/slug/')
        ↓
Within 5–10 seconds: live site shows updated content
```

No git commit. No rebuild. No cache clearing. Just save and it is live.

---

## Security

- Passwords hashed with **bcrypt** (10 rounds)
- Sessions via **JWT** in HTTP-only, Secure, SameSite=Lax cookies (7-day expiry)
- `middleware.ts` blocks all `/admin/*` routes at the edge for unauthenticated users
- `BLOB_READ_WRITE_TOKEN` is server-only — never exposed to the client
- All write APIs require a valid session cookie

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `POSTGRES_URL` | Yes | Vercel Postgres connection string |
| `BLOB_READ_WRITE_TOKEN` | Yes | Vercel Blob token for image uploads |
| `JWT_SECRET` | Yes | Secret key for signing JWT tokens |
| `ADMIN_EMAIL` | Yes | Initial admin login email |
| `ADMIN_PASSWORD` | Yes | Initial admin login password |
| `NEXT_PUBLIC_SITE_URL` | Yes | Full site URL (e.g. `https://rithalaupdate.online`) |

---

## Creator

**Sandeep Rajput** (known online as *Rithalya Rajput*)  
18-year-old digital creator, website developer, and artist from Rithala Village, Delhi.  
Launched Rithala Update on 15 August 2022.

- Website: [rithalaupdate.online](https://rithalaupdate.online)
- Instagram: [@rithala_update](https://instagram.com/rithala_update)
- YouTube: [@rithala_update](https://youtube.com/@rithala_update)
- Email: rithalyarajput@gmail.com

---

## License

MIT — see [LICENSE](LICENSE) for details.
