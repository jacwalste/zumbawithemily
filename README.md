# zumbawithemily.com

Website for Emily's weekly Zumba class in New Town, St. Charles, MO.
Saturdays 9:30–10:30 AM at Citrine Events. Live at
[zumbawithemily.com](https://zumbawithemily.com).

## Stack

Static HTML, CSS, and vanilla JS. No build step, no framework, no backend.

- `index.html`, `styles.css`, `script.js` — the whole site.
- RSVP and contact forms submit to [Web3Forms](https://web3forms.com),
  which emails Emily each submission.
- Upcoming class dates are computed client-side, so the RSVP date list
  never needs manual updating.
- `assets/` — photos, flyer, share card, and grain textures.

## Local preview

```sh
python3 -m http.server
```

Then open http://localhost:8000. Or just open `index.html` directly.

## Deployment

Hosted on GitHub Pages from `main`. The `CNAME` file points the custom
domain at the Pages site. Pushing to `main` deploys.

Site config (form key, Venmo and Facebook links) lives in the `CONFIG`
object at the top of `script.js`.
