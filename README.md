# mumbaihomes.co.in — reusable property lead-generation site

A single-page, data-driven microsite for one project at a time. Static files, no
build step, no server. Open `index.html` and it runs.

Currently configured for **Codename Luxury Living by Veena Developers, Borivali West**.

```
index.html              shell only — mount points, no content
data/project.js         ← ALL content lives here. This is the file you edit.
css/styles.css          design system
js/render.js            builds every section from data/project.js
js/app.js               slider, tabs, lightbox, modal, forms, tracking
google-apps-script.gs   paste into Apps Script for the Google Sheet channel
assets/                 your images and videos
```

---

## 1. How the "swap in a new project" design works

`index.html` contains **no project content at all** — only empty sections.
`render.js` reads `window.PROJECT` from `data/project.js` and builds the page.

So when Veena's next project launches, or you take on a different developer:

```bash
cp data/project.js data/next-project.js     # edit the copy
```

then change **one line** in `index.html`:

```html
<script src="data/project.js"></script>   →   <script src="data/next-project.js"></script>
```

Drop the new photos in `assets/`, and you have a complete new microsite. Nothing
in the HTML, CSS or JS needs to change. Keep the old data file — you can bring a
project back for resale inventory at any time.

**Everything is data:** project name, price, EOI offer box, highlights, the
pricing table rows, plan cards, amenity tiles, gallery, location tab categories,
FAQs, developer stats, RERA number and the legal disclaimer. Add or remove list
items freely — the layouts are all `auto-fit` grids, so 6 amenities or 16 both
lay out correctly.

### Placeholders

Any media `src` left as `""` renders a labelled placeholder tile instead of a
broken image. That means **the site looks complete before you have the photos** —
you can put it live and swap art in as the developer releases it.

---

## 2. Adding your images and videos

Put files in `assets/` and reference them by path. That is the whole workflow.

```js
hero: {
  slides: [
    { type: "image", src: "assets/hero-balcony.webp", alt: "Balcony view" },
    { type: "video", src: "assets/walkthrough.mp4",
      poster: "assets/walkthrough-poster.jpg", alt: "Project walkthrough" }
  ]
}
```

Videos work anywhere a slide or gallery item does. They autoplay muted, loop, and
**only the visible slide plays** — off-screen videos pause, so mobile data and
battery stay sane.

Two spots still use CSS backgrounds — swap them once you have art:

- `.visit-band` in `css/styles.css` — replace the second gradient layer with
  `url('../assets/visit-bg.jpg')`.
- `assets/og-image.jpg` at 1200×630 — the preview card when the link is shared
  on WhatsApp, which is where most of your traffic will actually share it.

**Compress before uploading.** Run everything through squoosh.app, target
`.webp` under 200 KB. On a Mumbai 4G connection, page weight is the single
biggest lever on your conversion rate — a 6 MB hero image loses more leads than
any headline gains.

---

## 3. Where leads go

Three channels, all configured in `data/project.js` under `leads:`. Every lead
carries a `source` field ("Hero Form", "Price 2 BHK", "Sticky Brochure", "Auto
Popup"), so you can see which section actually converts.

| Channel | Setup | Effort |
|---|---|---|
| **WhatsApp** | already working | none |
| **Email** | get a key at web3forms.com → paste into `web3formsKey` | 2 min |
| **Google Sheet** | follow the header in `google-apps-script.gs` → paste the `/exec` URL into `sheetsUrl` | 10 min |

WhatsApp is always on **and is the automatic fallback**: if the other two are
empty or fail, the form opens a prefilled WhatsApp message rather than losing the
lead. You can go live today with only the phone number set.

Set up the Sheet before you spend on ads — you cannot optimise campaigns you
aren't measuring.

---

## 4. Hosting on mumbaihomes.co.in

**Recommended: Cloudflare Pages.** Free, unlimited bandwidth, free SSL, and its
India edge locations mean fast loads for Mumbai traffic — which matters when
you're paying per click.

1. Push this folder to a GitHub repo (or drag-and-drop the folder in the
   Cloudflare dashboard).
2. Cloudflare Pages → Create project → connect the repo. Build command: *none*.
   Output directory: `/`.
3. Custom domains → add `mumbaihomes.co.in` and `www.mumbaihomes.co.in`.
4. At your registrar, change the nameservers to the two Cloudflare gives you.
   Propagation is usually under an hour.
5. SSL/TLS → set to **Full**. Enable "Always use HTTPS".

Netlify (drag the folder onto app.netlify.com/drop) works identically if you
prefer it. Either way, **do not** put this on shared cPanel hosting — you gain
nothing and lose the CDN.

### Multiple projects on one domain

Since each project is just a data file, run them as subdirectories:

```
mumbaihomes.co.in/                    → current flagship project
mumbaihomes.co.in/veena-borivali/     → copy of the folder, different data file
mumbaihomes.co.in/next-project/
```

Copy the folder, point its `index.html` at its own data file, done. Landing-page
URLs that name the project also convert better on Google Ads.

---

## 5. Before you spend money on marketing

Do these in order. Skipping any of them wastes ad budget.

**Legal — do this first.**
- The MahaRERA number currently reads "Coming Soon". Under RERA §11(2), you
  cannot advertise a registered project without displaying its registration
  number. **Do not run paid ads until the number is on the page.**
- Get Veena's written sign-off on the copy, pricing and images. Your site is a
  first-party developer site (unlike the PropX8 reference site, which is an
  affiliate microsite) — that's a real advantage in buyer trust, but it means
  the claims are the developer's responsibility and must be theirs, not
  approximated.
- Do **not** reuse the reference site's RERA agent number or its images. Those
  belong to PropX8.

**Tracking.** Add GA4 and the Meta Pixel just before `</body>` in `index.html`.
`js/app.js` already fires `generate_lead` (GA4) and `Lead` (Meta) on every
successful submission — you only need to paste the base snippets and the events
start flowing. Also connect Google Search Console.

**Test on a real phone, on mobile data.** Not desktop, not WiFi. Tap Call, tap
WhatsApp, submit both forms, confirm the lead lands. Roughly 90% of your traffic
will be Android on 4G.

**Then run traffic.** In rough order of cost-per-lead for Mumbai residential:

1. **Google Search Ads** on high-intent terms — "veena developers borivali",
   "new project borivali west", "2 bhk borivali west price". Expensive per click
   but the buyer is already looking.
2. **Meta lead ads** to a lookalike of your Sheet's converted leads. Cheapest at
   volume, lower intent — expect to call more people per booking.
3. **Google Business Profile** for the site office, plus **99acres /
   MagicBricks / Housing.com** listings pointing back here.
4. **Organic** — the page already ships FAQ and Residence structured data, so it
   is eligible for rich results. That builds over months, not weeks.

**Budget honestly.** Mumbai residential lead costs run roughly ₹300–₹1,500 per
lead depending on channel and ticket size, and at a ₹2.4 Cr price point a lead is
not a booking — expect a long ratio. Start at ₹500–1,000/day for two weeks,
measure cost-per-*qualified*-lead from the Sheet, then scale only what works.
Don't scale before you have that number.

---

## 6. Notes on how it's built

- **Mobile-first.** Sticky Call / Brochure / WhatsApp bar, swipeable hero,
  scroll-snap gallery, horizontally scrollable location tabs, and the pricing
  table reflows into stacked cards below 560px rather than scrolling sideways.
  Inputs are 16px so iOS doesn't zoom on focus.
- **One form definition** feeds the hero, the modal and the site-visit band, so
  changes to lead handling are made once.
- **The auto-popup fires once per session**, after 25 seconds. Resist making it
  more aggressive — it costs more in bounces than it gains in leads.
- All data-file content is HTML-escaped before rendering.
- External requests are limited to Google Fonts and the Maps iframe. Everything
  else is local.
