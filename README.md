# MA VILLA — Interactive Storyboard

A single-page, scroll-driven story about the demolition of an old villa and the
construction of a new mansion for **Mariam Azmy**, co-founder of **Innovo**,
designed by **B8 Architecture**.

Two parts, one continuous scroll:

1. **Hero** — a scroll-scrubbed film. Scroll position *is* the video playhead; the
   page stays pinned until the last frame, then dissolves to white.
2. **Storyboard** — a 40-beat comic in 5 acts (villa comes down → home goes up),
   scored by six music cues and ambient/one-shot sound, with the demolished-villa
   and finished-home walkthroughs mirrored (beats 4 ↔ 36).

No build step. Static HTML + CSS + vanilla JS with five vendored libraries
(Lenis, GSAP, ScrollTrigger, Howler, three.js).

## Run locally

```bash
python3 tools/serve.py        # serves ./site with HTTP Range support on :8000
```

> Use `tools/serve.py`, **not** `python3 -m http.server`. The built-in server does
> not answer Range requests, so the hero video appears frozen locally (the browser
> can't seek it). Production hosts (Vercel/Netlify) support Range, so this only
> affects local testing.

## Deploy

```bash
npx vercel --prod            # reads vercel.json → outputDirectory: site
```

## Structure

```
site/                    ← everything that ships
├── index.html           40 beats + gate + hero markup
├── _headers             cache + security headers (Netlify; harmless on Vercel)
├── css/style.css        warm-white design system
├── js/
│   ├── vendor/          three, howler, lenis, gsap, ScrollTrigger (pinned versions)
│   ├── dust.js          three.js ambient construction dust
│   ├── audio.js         Howler engine — 6 music cues, SFX, ambient beds
│   ├── hero.js          scroll-scrubbed video (pinned)
│   └── main.js          scroll wiring, music chain, SFX/bed triggers
├── assets/
│   ├── media/           a01–a26, c01–c06, drone
│   └── video/           hero.mp4 (all-keyframe), hero-mobile.mp4, hero-poster.jpg
└── audio/{music,sfx}/
tools/                   serve.py (range dev server), sample_palette.py
MA-Villa-ClaudeCode-Docs/  the six build briefs
```

The hero videos are re-encoded all-keyframe (`-g 1`) so scrubbing seeks instantly.

## Before this ships to Innovo

- **Copy:** every number is a placeholder (plot size, 618 days, pour volume, snag
  counts, cable length, Plot 44) and the three interview quotes / names are drafts.
- **Audio:** 19 SFX are unproduced; two are real gaps — `light_switch` (beat 32)
  and `impact_title` (beat 11) currently play silent.
- **Clearances:** Mariam/B8 approvals, music platform commercial terms, Innovo
  logo + exact brand colour vs the `--accent` amber.

See `MA-Villa-ClaudeCode-Docs/docs/06-QA-CHECKLIST.md` for the full list.

---
© 2026 Innovo. All artwork, music and text are protected works.
