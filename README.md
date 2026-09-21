# rainbowropes Website

This project is structured for Cloudflare Pages / Wrangler deployment using a static asset pipeline.

## Folder structure

- `public/` — deployable static site root
  - `index.html` — homepage
  - `pages/` — additional pages like About, Services, Contact
  - `blog/` — blog landing page and individual blog posts
  - `assets/` — CSS, JS, images, fonts
  - `404.html` — custom Cloudflare 404 page
- `wrangler.jsonc` — Cloudflare deployment config
- `package.json` — Node + Wrangler setup

## Local preview

```bash
npm run dev
```

## Deploy

```bash
npm run deploy
```

## Cloudflare Pages note

This project uses a static Pages deployment model. The build output is in `public/` and Wrangler points to that directory through `pages_build_output_dir` in `wrangler.jsonc`.

## Notes

- Keep all future pages under `public/`.
- For new blog posts, add them under `public/blog/`.
- Add new images under `public/assets/images/`.
- Update CSS under `public/assets/css/`.
- Keep internal links relative to `/` for Cloudflare static hosting.

## Navigation and clean URLs

Every page includes the premium sticky header. Both desktop and mobile navigation
use Home (`/`), About Us (`/about`), Products (`/products/`), Blogs (`/blog/`),
and Contact Us (`/contact`). The premium header appears when scrolling through
the page banner; pages without a banner show it immediately.

`public/_redirects` maps `/about` and `/contact` to their HTML files in
`public/pages/` using internal rewrites. Old URLs redirect to the clean addresses,
including links with `.html`, while preserving query strings. The folders stay
in place. Add a matching rewrite when adding another page under `public/pages/`.

Header behavior lives in `public/assets/js/header.js`. Load it after jQuery and
SlickNav. Each header initializes its own mobile menu.
