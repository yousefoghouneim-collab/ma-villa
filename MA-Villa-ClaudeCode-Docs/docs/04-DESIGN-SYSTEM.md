# 04 · DESIGN SYSTEM

> **Save at:** `MA Villa/docs/04-DESIGN-SYSTEM.md`
> **Creates:** `site/css/style.css`

---

## THE BRIEF

The reference projects are dark: slate `#0B1417` with a cold aqua accent. **This
project inverts that.** White, warm, cheerful — a house being built for someone, not a
machine being installed in a factory.

Warm is the operative word. Do not use a cold or clinical white. The subject is warm
stone in Dubai light, and the neutrals should sit in that world: white with a faint
sand undertone, ink that is warm charcoal rather than blue-black, and an accent taken
from the artwork itself.

---

## ⚠️ FIRST — SAMPLE THE REAL ARTWORK

The palette below is a considered default, but **the artwork is the authority and I
have not seen it.** Before writing the CSS, sample the actual images and adjust the
accent to match.

Save as `tools/sample_palette.py` and run it:

```python
#!/usr/bin/env python3
"""Sample the dominant colours from the delivered artwork."""
from PIL import Image
import glob, collections

paths = sorted(glob.glob("site/assets/media/a*.jpeg"))
counter = collections.Counter()

for p in paths:
    im = Image.open(p).convert("RGB")
    im.thumbnail((120, 120))
    for px in im.getdata():
        # ignore near-white and near-black so we find real hues
        if sum(px) > 720 or sum(px) < 90:
            continue
        counter[tuple(v // 24 * 24 for v in px)] += 1

print(f"sampled {len(paths)} panels\n")
print("dominant colours:")
for (r, g, b), n in counter.most_common(14):
    print(f"  #{r:02X}{g:02X}{b:02X}   {n:>8,}")
```

```bash
pip install pillow --break-system-packages -q
python3 tools/sample_palette.py
```

Read the output. If the artwork's warmest recurring hue is clearly not amber — if it
skews green, blue or rose — **replace `--accent` with a darkened version of what the
art actually uses.** Then re-check the contrast (see below). Matching the interface to
the artwork is the single biggest factor in whether this looks designed or assembled.

---

## TOKENS

```css
:root{
  /* --- surfaces --- */
  --paper:      #FFFFFF;   /* page background                         */
  --card:       #FDFCFA;   /* panels + bubbles — a hair warm off-white */
  --wash:       #F7F4F0;   /* "me" bubbles, subtle fills               */
  --line:       #E6E0D8;   /* hairlines, borders                       */

  /* --- text --- */
  --ink:        #15100C;   /* headings + body — WARM charcoal          */
  --grey:       #5A514A;   /* captions, secondary                      */
  --steel:      #8A7F76;   /* meta, timestamps, labels                 */

  /* --- accent --- */
  --accent:     #A8611C;   /* deep amber — links, kickers, rules       */
  --accent-lift:#C07A22;   /* large display type only                  */
  --accent-soft:rgba(168,97,28,.10);

  /* --- warmth --- */
  --glow:       rgba(214,164,90,.14);   /* warm radial for .warm pins   */
}
```

### Verified contrast — do not substitute without re-checking

| Token | On white | Verdict |
|---|---|---|
| `--ink` `#15100C` | **18.9 : 1** | passes everywhere |
| `--grey` `#5A514A` | **7.75 : 1** | passes body text |
| `--accent` `#A8611C` | **4.78 : 1** | passes body text — use for all small text |
| `--accent-lift` `#C07A22` | 3.47 : 1 | **large display only** (24px+/bold) |
| `--steel` `#8A7F76` | 3.9 : 1 | **large or non-essential meta only** |

`--steel` is used for timestamps and labels in the reference at 9–11px, which fails
WCAG AA. That is acceptable for decorative metadata but do not put anything the
visitor must read in it.

**Avoid `#D97757`.** It is the default terracotta that appears in a great deal of
AI-generated design and reads as a tell. `#A8611C` is deeper, warmer, passes contrast
for body text, and belongs to the stone-and-sand world of the subject.

---

## WHAT CHANGES FROM THE REFERENCE CSS

Start from the reference `style.css` — it is 163 lines and every mechanic in it is
needed. Change only these, and change all of them.

| # | Selector | Change | Why |
|---|---|---|---|
| 1 | `:root` | replace the whole block with the tokens above | the palette |
| 2 | `body` | `background:var(--paper); color:var(--ink)` | was dark |
| 3 | `.vig` | invert to `rgba(255,255,255,.85)` at the edges | a dark vignette on white is a grey smear |
| 4 | `.grain` | opacity `.07` → **`.035`**, add `mix-blend-mode:multiply` | on white, grain at .07 reads as video noise, not paper |
| 5 | `.panel` | `box-shadow:0 24px 60px rgba(21,16,12,.10), 0 2px 6px rgba(21,16,12,.04)` | the reference's `rgba(0,0,0,.5)` is a black bruise on white |
| 6 | `.cutout` | `drop-shadow(0 12px 18px rgba(21,16,12,.22))` | same reason, softer |
| 7 | `.zline` | `color:var(--accent)` — **not red** | see below |
| 8 | `#zero .pin` | radial glow → `var(--accent-soft)` | matches |
| 9 | `.warm .pin` | radial glow → `var(--glow)` | warm, not orange-grey |
| 10 | `#chrome`, `#snd` | remove `mix-blend-mode:screen`; give `#snd` `background:rgba(255,255,255,.7)` + `backdrop-filter:blur(6px)` | screen blend is invisible on white |
| 11 | `.bubble.me` | `background:var(--wash); border-color:var(--line)` | was a dark teal fill |
| 12 | `#gate .yes` | `background:var(--accent); color:#fff` | contrast |
| 13 | `.badge` | `background:var(--accent)` + matching pulse rgba | the red alert badge is off-brief |
| 14 | `.cap` | `color:var(--grey)` | was near-white |

### On the red

The reference uses `#FF6666` for `0% HUMAN ERROR` because that beat is a warning. Our
equivalent beat — `NOTHING BUT LAND.` — is not a warning. It is a clearing, a blank
page, the moment before building starts. **Render it in `--accent`, not red.** The
second reference project made exactly this change for the same reason. Red on a white
cheerful palette reads as an error state.

---

## TYPOGRAPHY

Keep the reference's three-face system. It is well judged and the roles are clear.

| Face | Role | Weights |
|---|---|---|
| **Poppins** | display + body | 300, 400, 600, 700 |
| **Caveat** | captions (`.cap`, `.wquote`) — the handwritten voice | 500, 600 |
| **IBM Plex Mono** | kickers, meta, timestamps, `.zline` | 400, 500 |

```html
<link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,600;0,700;1,300&family=Caveat:wght@500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
```

The Caveat captions are the piece's warmth — a human hand annotating a technical
document. On the new white palette they matter more than they did on slate, because
there is less atmosphere doing the work. Keep them at `--grey`, not `--ink`; they
should feel like pencil, not print.

Scale is unchanged from the reference:

```css
.narr        clamp(20px, 3vw, 30px)
.narr.small  clamp(16px, 2vw, 21px)
.cap         clamp(20px, 2.6vw, 28px)   /* Caveat */
.chapter h1  clamp(44px, 8vw, 92px)
.actcard h2  clamp(44px, 8vw, 92px)
.endcard h2  clamp(60px, 10vw, 120px)
.zline       clamp(30px, 7vw, 76px)     /* Plex Mono */
.kicker      12px / .3em tracking       /* Plex Mono */
```

---

## THE DUST LAYER

`js/dust.js` needs two colour changes and nothing else. On slate the particles glowed
lighter than the background; on white they must be **darker** than the background or
they are invisible.

```js
// layer 1 — fine motes  (was 0x9EF3EE @ 0.5)
const mat  = new THREE.PointsMaterial({
  color:0xA8611C, size:0.05, transparent:true, opacity:0.30, depthWrite:false });

// layer 2 — coarse motes (was 0x6F8695 @ 0.25)
const mat2 = new THREE.PointsMaterial({
  color:0x8A7F76, size:0.11, transparent:true, opacity:0.22, depthWrite:false });
```

Geometry, particle count (420), scroll-driven rotation and camera bob all stay exactly
as written. On white it reads as fine construction dust hanging in the air, which is
precisely right for the subject.

---

## MOTION

Unchanged from the reference. These values are tuned and should not be adjusted.

```
.pop      opacity .6s ease, transform .9s cubic-bezier(.22,1,.36,1)
          GSAP: back.out(1.6), duration .9
.reveal   opacity .8s ease, transform .8s ease
          GSAP: power2.out, duration .8
.bubble   clip-path .6s cubic-bezier(.22,1,.36,1)   /* scratch-in wipe */
trigger   start:'top 90%', once:true, on the element itself
tilt      ±1–2.4° random per .pop, set in JS
```

---

## ACCESSIBILITY FLOOR

Non-negotiable, and the reference already covers most of it:

```css
@media (prefers-reduced-motion: reduce){
  #stage{transform:none!important}
  .pop,.reveal,.zline span{transition:none!important;opacity:1!important;transform:none!important}
  .bubble{clip-path:none!important;transition:none!important}
  .grain{animation:none}
  #herowrap{height:100vh!important}     /* extend to the hero */
}
```

Plus: visible keyboard focus on the gate buttons and the sound toggle
(`outline:2px solid var(--accent); outline-offset:2px`), real `alt` text on every
panel image, and `alt=""` on decorative cut-outs.
