# MA VILLA — Interactive Storyboard

> **Save this file at:**
> `/Users/rozbehmobile/Downloads/The Crew Dubai 2023/AI Projects/MA Villa/CLAUDE.md`

You are building a hybrid comic + scroll-animation web experience about the demolition
of an old villa and the construction of a new mansion for **Mariam Azmy**, co-founder
of **Innovo**, designed by **B8 Architecture**.

Read every file in `docs/` before writing code. Build in the order given in
§5 of this file.

---

## 1. WHAT THIS IS

A single-page, scroll-driven story in two parts:

1. **HERO** — a scroll-scrubbed video (the visitor scrolls, the video plays; the page
   does not move past it until the video finishes), then a soft dissolve into…
2. **STORYBOARD** — a 40-beat comic in 5 acts, built on the exact engine used by the
   two reference projects in `Code refernce/`.

There is no build step. It is a static site: HTML, CSS, vanilla JS, four vendored
libraries. It deploys to Vercel or Netlify by pointing at `site/`.

---

## 2. THE SOURCE MATERIAL YOU HAVE

Everything is already produced. You are assembling, not creating.

| What | Where | Count |
|---|---|---|
| Panel artwork | `MA Villa Visuals/a01.jpeg … a26.jpeg` | 26 |
| Character cut-outs (transparent PNG) | `MA Villa Visuals/C01.png … C06.png` | 6 |
| Drone element (transparent PNG) | `MA Villa Visuals/drone.png` | 1 |
| Storyboard overview (reference only — **do not ship**) | `MA Villa Visuals/Full Storyboard.jpeg` | 1 |
| Hero video (1:1 square) | `Hero Video.mp4` | 1 |
| Music cues | `Music/*.mp3` | 6 |
| Sound effects | `SFX Library/*.mp3` | 29 |
| Engine references | `Code refernce/` | 2 projects |

**Do not modify anything in those source folders.** Copy into `site/` and work there.

---

## 3. THE ENGINE — do not reinvent it

Both reference projects in `Code refernce/` run the *same* engine. Their `css/style.css`,
`js/dust.js` and `js/audio.js` are byte-for-byte identical; only `js/main.js` wiring
differs. Treat it as a proven template.

```
Lenis 1.0.42          smooth scroll
GSAP 3.12.5           animation
GSAP ScrollTrigger    scroll binding
Howler 2.2.4          audio
three.js r128         ambient dust particles
```

**Vendor all five locally** into `site/js/vendor/`. Do not use CDN links — the
references use CDNs and it makes the piece fail offline and adds latency. Install with:

```bash
cd /tmp && npm pack three@0.128.0 howler@2.2.4 @studio-freight/lenis@1.0.42 gsap@3.12.5
```
then extract and copy `three.min.js`, `howler.min.js`, `lenis.min.js`, `gsap.min.js`,
`ScrollTrigger.min.js`.

### The five mechanics that define the look

Copy these from the reference exactly — they are why it feels the way it feels.

1. **The "pop"** — `back.out(1.6)` easing animating scale + rotation + Y together. The
   overshoot is the snap. Never replace with a fade.
2. **Random tilt seed** — each `.pop` gets `--rot` of alternating ±1–2.4°, set in JS.
   Nothing sits square. This is the scattered-photo feel.
3. **Self-triggering** — every `.pop` / `.reveal` triggers on **itself** entering the
   viewport at `top 90%`, never on its parent section. The reference has a comment
   saying so. Obey it, or elements animate off-screen.
4. **Cut-out drift** — characters are absolutely positioned hanging *off* the panel
   corner (`right:-20px; bottom:-20px`) and drift on a sine wave. Stickers on a photo.
5. **Audio tied to images, not sections** — music switches when a specific image hits
   screen centre; SFX fire at `top 90%`.

---

## 4. WHAT IS DIFFERENT FROM THE REFERENCES

Four deliberate departures. These are the brief.

| | Reference | This project |
|---|---|---|
| **Palette** | dark slate `#0B1417` | **white / cheerful** — see `docs/04-DESIGN-SYSTEM.md` |
| **Opening** | straight into the comic | **scroll-scrubbed hero video first** — see `docs/02-HERO-VIDEO.md` |
| **Text volume** | heavy narration | **minimal** — the art carries it, see below |
| **Assets** | placeholder dummies | **final artwork supplied** |

### Text is minimal — this matters

The visuals are finished and dense. Do not write paragraphs. Per beat: a short caption
of **8–14 words maximum**, and many beats get **no text at all**. Act cards get two or
three words. The exact approved copy for all 40 beats is in
`docs/03-STORYBOARD-BEATS.md` — use it verbatim, do not expand on it.

---

## 5. BUILD ORDER

Work through these in sequence. Each doc is self-contained.

| Step | Doc | Output |
|---|---|---|
| 1 | `docs/01-ASSET-PIPELINE.md` | assets renamed + copied into `site/` |
| 2 | `docs/04-DESIGN-SYSTEM.md` | `site/css/style.css` |
| 3 | `docs/03-STORYBOARD-BEATS.md` | `site/index.html` |
| 4 | `docs/05-AUDIO-WIRING.md` | `site/js/audio.js` + audio wiring in `main.js` |
| 5 | `docs/02-HERO-VIDEO.md` | `site/js/hero.js` + hero markup |
| 6 | `docs/06-QA-CHECKLIST.md` | verified build |

**Do step 1 first and completely.** The source filenames contain spaces, parentheses
and mixed case that will break on deployment. Nothing else will work until they are
normalised.

---

## 6. TARGET STRUCTURE

```
MA Villa/
├── CLAUDE.md                    ← this file
├── docs/                        ← the six briefs
├── Hero Video.mp4               ← SOURCE, do not touch
├── MA Villa Visuals/            ← SOURCE, do not touch
├── Music/                       ← SOURCE, do not touch
├── SFX Library/                 ← SOURCE, do not touch
├── Code refernce/               ← SOURCE, do not touch
├── vercel.json
└── site/                        ← EVERYTHING YOU BUILD GOES HERE
    ├── index.html
    ├── _headers
    ├── css/style.css
    ├── js/
    │   ├── vendor/{three,howler,lenis,gsap,ScrollTrigger}.min.js
    │   ├── dust.js              ← from reference, recoloured
    │   ├── audio.js             ← from reference, cues remapped
    │   ├── hero.js              ← NEW — scroll-scrubbed video
    │   └── main.js              ← from reference, rewired
    ├── assets/
    │   ├── media/               ← a01–a26, c01–c06, drone
    │   └── video/               ← hero.mp4, hero-mobile.mp4, hero-poster.jpg
    └── audio/{music,sfx}/
```

`vercel.json` is one line: `{ "outputDirectory": "site" }`

---

## 7. RUN AND VERIFY

```bash
cd site && python3 -m http.server 8000
```

Must be served over **http**, not `file://`, or audio is blocked by the browser.

Before declaring done, work through `docs/06-QA-CHECKLIST.md` in full. It contains the
acceptance tests, including a scripted check that the six music cues fire in order.

---

## 8. THINGS THAT WILL BITE YOU

- **Filename case.** Source cut-outs are `C01.png` uppercase. macOS does not care;
  Vercel's Linux filesystem does. Normalise everything to lowercase in step 1.
- **Spaces and parentheses** in `Hero Video.mp4` and `Music/breath (Cue 5).mp3` break
  URLs. Rename in step 1.
- **Video seeking is janky unless re-encoded.** A normal MP4 has keyframes every ~250
  frames. Scrubbing needs every frame to be a keyframe. `docs/02-HERO-VIDEO.md` has the
  exact ffmpeg command — this is the single most important step for smoothness.
- **19 SFX are missing** from the supplied library. Wire only what exists; never
  reference a file that is not there or the console fills with 404s.
  `docs/05-AUDIO-WIRING.md` lists exactly what is present, what is absent, and what to
  substitute in the meantime.
- **`prefers-reduced-motion`** must disable the dust, the tilt and the scrub. The
  reference already handles this in CSS — carry it over and extend it to the hero.
