# zumbawithemily.com

One-page site for Emily's weekly Zumba class in New Town, St. Charles, MO.
Every Saturday 9:30–10:30 AM at Citrine Events, 3212 Rue Royal. $20/class.

Static HTML/CSS/JS, no build step, hosted on GitHub Pages.

## How it works

- `index.html` / `styles.css` / `script.js` — the whole site.
- RSVP + contact forms POST to [Web3Forms](https://web3forms.com), which emails
  Emily each submission. No server, no database.
- Upcoming Saturdays are computed client-side in `script.js`, so the RSVP date
  list never needs updating.
- `assets/` — cropped photo + optimized flyer (`flyer-original.png` is the
  source screenshot).

## Setup checklist (before launch)

1. **Form delivery**: go to [web3forms.com](https://web3forms.com), enter
   Emily's email, paste the access key into `CONFIG.WEB3FORMS_KEY` in
   `script.js`. Until then, forms show a "text Emily instead" fallback.
2. **Optional links**: set `CONFIG.VENMO_URL` and `CONFIG.FACEBOOK_URL` in
   `script.js` (hidden while empty).
3. **GitHub Pages**: repo Settings → Pages → Deploy from branch → `main`, `/ (root)`.
   The `CNAME` file is already in place for the custom domain.
4. **Namecheap DNS** for zumbawithemily.com:
   - `A` records on `@`: `185.199.108.153`, `185.199.109.153`,
     `185.199.110.153`, `185.199.111.153`
   - `CNAME` record on `www`: `jacwalste.github.io.`
   - Then in repo Settings → Pages, set the custom domain and check
     **Enforce HTTPS** once the cert issues.

## Local preview

Open `index.html` in a browser, or `python3 -m http.server` in the repo root.
