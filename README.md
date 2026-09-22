# Kath Landreth Counselling & Supervision — website

A simple, static 3-page website for an independent counselling practice.
Plain HTML/CSS/JS, no build step, no framework, no backend, no database.

> **⚠️ This entire project is a placeholder scaffold.** The business
> name, domain, exact services offered, and the final hosting/email
> provider are all **TBD** and marked throughout the codebase — see
> "What's still a placeholder" below before this goes live.

## Structure

```
.
├── index.html        Home / landing page
├── about.html         About Kath + Services + confidentiality/ethics
├── contact.html        Contact form + direct contact details
├── css/style.css       All styling; CSS custom properties in :root
├── js/main.js           Mobile nav toggle + contact form submit handler
├── assets/               Placeholder image slots live in HTML; drop real images here (see assets/README.md)
└── README.md              This file
```

No build tools, package manager, or dependencies are required. Open
`index.html` directly in a browser, or serve the folder with any static
file server, to preview the site.

If you don't have Python or Node installed, `scripts/serve.ps1` is a
small dependency-free PowerShell static file server for local preview
only (it is never deployed):

```powershell
powershell -File scripts/serve.ps1 -Port 4173
```

Then open `http://localhost:4173` in a browser.

## Design system

All colours and fonts are defined as CSS custom properties at the top
of `css/style.css` (`:root { ... }`), each commented as a placeholder.
To re-brand later, edit that one block:

- Palette: warm cream background, muted sage green primary, soft
  terracotta accent — chosen to feel calm and warm rather than
  clinical/corporate. Swap `--color-*` values once real branding exists.
- Typography: system font stacks only (a serif stack for headings, a
  sans-serif stack for body text) — **no third-party font requests**,
  which keeps the site dependency-light and avoids sending visitor
  data to an external font host. If a specific webfont is chosen later,
  self-host the font files rather than loading from a third-party CDN,
  to keep the same privacy posture.

## Data handling & email forwarding (important: read before launch)

The enquiry form on `contact.html` is designed as a **stateless relay**:

- No database, no localStorage/sessionStorage/cookies, no third-party
  CRM. Nothing submitted through the form is ever stored by this
  codebase.
- Fields collected are the minimum needed to start a conversation:
  name, an enquiry type (a dropdown, so Kath knows at a glance whether
  it's about Ministry Supervision or personal counselling), a preferred
  contact method (email or phone), and a free-text message. There is
  deliberately no field implying diagnosis, referral details, or health
  history. The enquiry-type dropdown currently holds generic placeholder
  options ("Ministry Supervision", "Personal counselling", "Not sure
  yet", "Something else") in `contact.html` and should be replaced once
  Kath has a comprehensive service list.
- The form currently points at a **placeholder** Formspree-style
  endpoint (`https://formspree.io/f/YOUR_FORM_ID` in `contact.html`),
  used only as an example of a privacy-respecting form-to-email service
  suited to a static site with no backend.

### TODO before launch

1. **Decide hosting.** The site is plain static files, so it will work
   as-is on GitHub Pages, Netlify, or Vercel. Confirm which one Kath is
   using.
2. **Wire up real email forwarding**, matching that hosting choice:
   - **GitHub Pages** (no server-side capability) → keep using a
     form-to-email service. Replace `YOUR_FORM_ID` in the `<form>`
     `action` attribute in `contact.html` with a real Formspree (or
     similar) form ID, pointed at Kath's real inbox.
   - **Netlify** → simplest option is Netlify Forms: add
     `data-netlify="true"` and a `name` attribute to the `<form>` in
     `contact.html`, remove the Formspree `action` URL, and set up
     Netlify's email notification for that form in the Netlify
     dashboard. Netlify stores submissions in its own dashboard by
     default — if that's not acceptable, use a Netlify Function instead
     that forwards to email and discards the payload.
   - **Vercel** → no built-in form handling; use a small serverless
     function (e.g. `api/contact.js`) that receives the POST, sends an
     email (e.g. via a transactional email API), and does not log or
     persist the message body anywhere. Point the form's `action` at
     that function's URL.
3. **Update `js/main.js`** — it currently detects the placeholder
   `YOUR_FORM_ID` string and shows a "not connected yet" message
   instead of submitting. Once a real endpoint is in place this check
   becomes a no-op and can stay (harmless) or be removed.
4. Re-read the privacy note text in `contact.html` (inside the form)
   and have Kath / a legal reviewer confirm the wording before publishing.

Whatever service is chosen, the requirement is the same: **the
submission is forwarded to Kath's inbox and not retained anywhere
else** — no logs of message content, no analytics on form fields, no
export to a CRM.

## What's still a placeholder

Search the codebase for the literal word `placeholder` (case-insensitive)
and for `TODO` to find every spot that needs real content before launch.
Notably:

- **Business name** — "Kath Landreth Counselling & Supervision" is a
  working title only, flagged inline in the site header/footer.
- **Bio, qualifications, and years of experience** (`about.html`).
- **Full services scope** — only "Ministry Supervision for church
  leaders" (the confirmed speciality) and a generic "General
  Counselling" placeholder are listed; the latter needs real detail.
- **Confidentiality/ethics wording** (`about.html`) — currently generic;
  should be reviewed against Kath's actual professional/ethics body.
- **Contact details** (`contact.html`) — placeholder email/phone.
- **Response-time statement** (`contact.html`) — currently "1–2
  business days" as a placeholder.
- **Images** — see `assets/README.md`; hero and portrait slots are
  dashed placeholder boxes, not real `<img>` tags yet.
- **Domain name** — not yet chosen; nothing in the code assumes a
  specific domain.

## Deploying

### GitHub Pages

1. Push this repo to GitHub.
2. In the repo's Settings → Pages, set the source to the `main` branch,
   root folder.
3. No build step is needed — the static files are served as-is.

### Netlify / Vercel

Either platform can deploy this repo directly with **no build command**
and the **publish directory set to the repo root**, since there's no
bundler or framework involved. See the email-forwarding notes above for
platform-specific form handling.

## Explicitly out of scope (by design, for this build)

- Calendar/scheduling integration
- Payment processing
- Blog / resources section
- Multi-language support
- Any form of client accounts, login, or persistent client records
