# 🚩 Rithala Update — Website

> **Rajput heritage, temples, festivals & village life from Rithala Village, Delhi**

This repository powers **[rithalaupdate.com](https://rithalaupdate.com)** — a fast,
SEO-friendly static site rebuilt from the original [WordPress export](./wordpress-export.xml)
of `rithalaupdate.wordpress.com`.

[![Built with Astro](https://img.shields.io/badge/Built%20with-Astro-FF5D01?logo=astro&logoColor=white)](https://astro.build)
[![Deploy: Cloudflare Pages](https://img.shields.io/badge/Deploy-Cloudflare%20Pages-F38020?logo=cloudflare&logoColor=white)](https://pages.cloudflare.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](#license)

---

## ✨ What's inside

| Feature | Status |
|---|---|
| Full WordPress (WXR) import → static site | ✅ |
| **Original URL paths preserved** for SEO | ✅ |
| Hindi (Devanagari) URL support | ✅ |
| `sitemap.xml`, `robots.txt`, RSS feed | ✅ |
| Open Graph, Twitter cards, JSON-LD | ✅ |
| Mobile-first responsive design | ✅ |
| Zero JavaScript by default (static HTML) | ✅ |
| Free hosting on Cloudflare Pages / Netlify | ✅ |

## 📁 Project structure

```
rithalaupdate/
├── public/                  # static assets served as-is
│   ├── CNAME                # custom-domain hint for GitHub Pages
│   ├── _redirects           # Netlify / Cloudflare Pages redirects
│   ├── favicon.png
│   └── logo.png
├── src/
│   ├── components/          # reusable .astro components
│   │   └── PostCard.astro
│   ├── data/                # generated at build (git-ignored)
│   │   └── wxr.json
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── lib/
│   │   └── content.js       # helpers around the parsed WordPress data
│   ├── pages/
│   │   ├── index.astro      # home page
│   │   ├── 404.astro
│   │   ├── [...slug].astro  # every WordPress post & page
│   │   ├── category/[slug].astro
│   │   ├── rss.xml.js
│   │   ├── robots.txt.js
│   │   └── sitemap.xml.js
│   └── styles/
│       └── global.css
├── scripts/
│   ├── parse-wxr.mjs        # WordPress XML → src/data/wxr.json
│   └── postbuild-redirects.mjs
├── wordpress-export.xml     # source content (edit-safe)
├── astro.config.mjs
├── package.json
└── README.md
```

## 🚀 Quick start (local dev)

```bash
# 1. Install Node 20+ (use nvm or download from nodejs.org)
node --version          # should print v20.x or later

# 2. Clone & install
git clone https://github.com/rithalyarajput-creator/rithalaupdate.git
cd rithalaupdate
npm install

# 3. Generate content from the WXR file & start dev server
npm run dev

# 4. Open http://localhost:4321 in a browser
```

### Other useful scripts

```bash
npm run build      # parse WXR + build static site to ./dist
npm run preview    # preview the production build locally
npm run parse      # only re-parse the WordPress XML
```

## 🔄 Updating content

The site pulls **everything** from `wordpress-export.xml`. To add or change content:

1. **Easiest:** keep editing posts on
   [rithalaupdate.wordpress.com](https://rithalaupdate.wordpress.com), export
   the new WXR (`Tools → Export → All content`), replace
   `wordpress-export.xml` and push. The deploy will rebuild automatically.
2. **Power user:** edit `wordpress-export.xml` directly (it's a regular XML
   file). New `<item>` blocks with `<wp:post_type>post</wp:post_type>` and
   `<wp:status>publish</wp:status>` become posts.

The build script (`scripts/parse-wxr.mjs`) preserves:

* original WordPress URL paths (`/2025/09/20/.../`) for SEO,
* a fallback `/{post_name}/` slug,
* category slugs (`/category/<slug>/`),
* featured images, dates, authors and excerpts.

## 🌐 Deploying to your custom domain

This repo is set up for **`rithalaupdate.com`** via Cloudflare Pages (free,
unlimited bandwidth, automatic SSL). Three minutes:

1. Sign in at [pages.cloudflare.com](https://pages.cloudflare.com).
2. **Create a project → Connect to Git → pick `rithalyarajput-creator/rithalaupdate`**.
3. Build settings (auto-detected, but verify):
   * **Build command:** `npm run build`
   * **Build output directory:** `dist`
   * **Environment variable:** `SITE_URL = https://rithalaupdate.com`
4. After the first deploy, go to **Custom domains → Add `rithalaupdate.com`**
   and follow the DNS prompts (usually a single CNAME or NS update at your
   registrar). Cloudflare issues the SSL certificate for you.

> **Other one-click hosts:** the included `netlify.toml` works on
> [Netlify](https://netlify.com), and the static `dist/` folder can be
> uploaded to GitHub Pages, Vercel, S3+CloudFront or any web server.

### Auto-deploy on push

Cloudflare Pages and Netlify both watch the `main` branch by default. Every
`git push` triggers a fresh build & global deploy in ~30 seconds.

## 🔍 SEO checklist (already implemented)

* ✅ `sitemap.xml` (with proper Hindi URL encoding & per-page `lastmod`)
* ✅ `robots.txt` referencing the sitemap
* ✅ Canonical `<link rel="canonical">` on every page
* ✅ Per-page Open Graph + Twitter card tags
* ✅ JSON-LD: `WebSite` + per-article `Article` schema
* ✅ HTML `lang="hi"` and `og:locale=hi_IN`
* ✅ **Original URL paths preserved** so Google's existing rankings carry over
* ✅ RSS feed (auto-discovered via `<link rel="alternate">`)
* ✅ Mobile viewport, fast, no render-blocking JS by default

After the first deploy, register the domain in
[Google Search Console](https://search.google.com/search-console) and submit
`https://rithalaupdate.com/sitemap.xml`.

## 🤝 Credits

* **Owner & content:** Sandeep Rajput a.k.a. *Rithalya Rajput* — Rithala
  Village, Delhi
* **Design & development:** built with [Astro](https://astro.build)
* **Photos & stories:** Rithala village community

> *"रिठाला गाँव की हर तस्वीर एक कहानी कहती है — यह वेबसाइट उन कहानियों
>  को संजोए रखने का एक छोटा सा प्रयास है।"*

## License

MIT — see [LICENSE](./LICENSE) (content remains the property of its
respective creators; please credit `rithalaupdate.com` when republishing).
