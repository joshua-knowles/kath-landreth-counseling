# Assets

No real images have been supplied yet. Placeholder image slots exist in:

- `index.html` — hero image slot (photo of practice space or Kath)
- `about.html` — portrait slot (photo of Kath)

Each placeholder is a dashed-border box with descriptive fallback text
instead of a real `<img>`, so there's nothing broken to see before real
photos are supplied. When real images are added:

1. Save them in this `assets/` folder (e.g. `assets/hero.jpg`, `assets/kath-portrait.jpg`).
2. Replace the corresponding `.hero-image-slot` / `.portrait-slot` `<div>`
   with an `<img>` tag, and write real, descriptive `alt` text (not the
   placeholder text currently in the code comments).
3. Keep image file sizes reasonable (compress/resize before adding) since
   this is a static site with no build-time image optimisation pipeline.
