# 06 · QA CHECKLIST

> **Save at:** `MA Villa/docs/06-QA-CHECKLIST.md`
> Work through this before declaring the build done. Do not skip the scripted tests —
> they catch the failures that are invisible by eye.

---

## A · AUTOMATED — run these first

```bash
cd site && python3 -m http.server 8000 &
```

### A1 · Every referenced asset resolves

```bash
cd site && python3 - <<'PY'
import re, os
h = open('index.html').read()
missing = [s for s in re.findall(r'(?:src|href)="((?:assets|audio|js|css)/[^"]+)"', h)
           if not os.path.exists(s.split('?')[0])]
print("MISSING:", missing or "none ✅")
PY
```
Must print `none`. A single broken path means a silent panel or a dead sound.

### A2 · No uppercase or spaces anywhere in `site/`

```bash
cd site && echo "uppercase: $(find assets audio -name '*[A-Z]*' | wc -l)  (expect 0)"
          echo "spaces:    $(find . -name '* *' | wc -l)  (expect 0)"
```
Passing locally on macOS proves nothing — this is what breaks after deploy.

### A3 · Only existing SFX are wired

```bash
cd site && python3 - <<'PY'
import re, os
h = open('index.html').read(); j = open('js/main.js').read() + open('js/hero.js').read()
want = set(re.findall(r'"file":"([\w.]+\.mp3)"', h)) | set(re.findall(r"playSfx\('([\w.]+\.mp3)'", j)) | set(re.findall(r"startBed\('([\w.]+\.mp3)'", j))
gone = [f for f in want if not os.path.exists('audio/sfx/'+f)]
print(f"wired {len(want)} sfx · MISSING FILES:", gone or "none ✅")
PY
```

### A4 · The five music trigger IDs exist

```bash
cd site && python3 - <<'PY'
import re
h = open('index.html').read()
need = ['img-a04','img-a10','img-a14','img-a21','img-a24']
have = set(re.findall(r'id="(img-[\w-]+)"', h))
print("MISSING TRIGGERS:", [n for n in need if n not in have] or "none ✅")
PY
```
If any are missing, the score never changes and the whole piece plays one cue.

### A5 · All 33 artworks are placed

```bash
cd site && python3 - <<'PY'
import re
h = open('index.html').read()
used = set(re.findall(r'assets/media/([\w.]+)', h))
need = {f'a{i:02d}.jpeg' for i in range(1,27)} | {f'c{i:02d}.png' for i in range(1,7)} | {'drone.png'}
print("UNUSED ART:", sorted(need-used) or "none ✅")
print("BAD REFS  :", sorted(used-need) or "none ✅")
PY
```

### A6 · Console is clean and cues fire in order

```bash
pip install playwright --break-system-packages -q && playwright install chromium
python3 - <<'PY'
from playwright.sync_api import sync_playwright
import time
with sync_playwright() as p:
    b = p.chromium.launch(args=["--use-gl=swiftshader","--autoplay-policy=no-user-gesture-required"])
    pg = b.new_page(viewport={"width":1440,"height":900})
    errs, logs = [], []
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.on("console", lambda m: (errs if m.type=="error" else logs).append(m.text))
    pg.goto("http://localhost:8000", wait_until="networkidle"); time.sleep(1)
    pg.click("#gy"); time.sleep(1.5)
    H = pg.evaluate("document.documentElement.scrollHeight")
    for i in range(0,101,2):
        pg.evaluate(f"window.scrollTo(0,{int(H*i/100)})"); time.sleep(0.12)
    time.sleep(1)
    print("CUES:", [l for l in logs if "MUSIC" in l])
    print("ERRORS:", [e for e in errs if "X-Frame" not in e] or "none ✅")
    b.close()
PY
```

**Expected cue order — exactly this:**
```
intro → demo → build → rise → breath → finale → fade out
```
Any other order, or a missing cue, means a trigger ID is wrong or an image never
reaches screen centre.

---

## B · THE HERO — by hand, on a real machine

| # | Check | Pass condition |
|---|---|---|
| B1 | Video fills the viewport | **no letterbox bars on any side**, at 1280×720, 1440×900, 1920×1080 and 390×844 |
| B2 | Scrolling scrubs the video | picture advances with the wheel; page stays put |
| B3 | Scroll up | video runs **backward** smoothly |
| B4 | Page does not advance early | storyboard is unreachable until the last frame |
| B5 | Smoothness | no stutter on a fast flick — **if it stutters, the encode is wrong, re-check `-g 1`** |
| B6 | Handover | dissolves to white and into the Act One card with no flash, jump or dark frame |
| B7 | Reduced motion | with the OS setting on, hero is a static poster and the page scrolls straight past |
| B8 | Resize mid-hero | no layout break; pin recalculates |
| B9 | Reload mid-hero | video seeks to the correct frame for the restored scroll position |

**B5 diagnostic** — confirms the encode:
```bash
ffprobe -v error -select_streams v -show_entries frame=key_frame \
        -of csv=p=0 site/assets/video/hero.mp4 | sort | uniq -c
```
Must show only `1`s.

---

## C · MOBILE — a real phone, not devtools

| # | Check | Pass |
|---|---|---|
| C1 | iOS Safari — hero scrubs | works (needs the `__heroUnlock()` gate hook) |
| C2 | Video never goes fullscreen | `playsinline` present |
| C3 | `hero-mobile.mp4` is served | check the network tab |
| C4 | Audio plays after the gate tap | Howler unlock fires |
| C5 | Panels fit | `.panel` at `min(680px, 94vw)` |
| C6 | Cut-outs do not overflow | 70px at `<600px` |
| C7 | 3D tilt is off | `#stage{transform:none}` on coarse pointers |
| C8 | URL-bar collapse | `100svh` prevents the hero jumping |

---

## D · CONTENT — the part that gets a project pulled

**Every number in the copy is a placeholder invented for the draft.** Replace before
this goes anywhere near Innovo:

- [ ] Plot size — *"1,400 square metres"*
- [ ] Build duration — *"618 days"* (appears twice: beats 33, 40)
- [ ] Pour volume — *"1,180 m³"*
- [ ] Snag counts — *"1,247 / 1,247 / 0"*
- [ ] Cable length — *"nine kilometres"*
- [ ] Site-log days — 012 / 019 / 048 / 090 / 140
- [ ] Plot name — *"Plot 44"*
- [ ] Age of the demolished villa — *"eleven years"*
- [ ] Snag list date — *"DAY 611"*

**Names and titles:**
- [ ] B8 Architecture lead — name and exact title
- [ ] Head of Technical — name and exact title
- [ ] Mariam Azmy's title as she wants it written

**Quotes — all three are placeholders written to fit the beat.** Replace with real
interview lines, and **keep them the same length**; the bubbles are sized for two short
lines and a 40-word quote breaks the rhythm.
- [ ] B8 (beat 8)
- [ ] Head of Technical (beat 21)
- [ ] Mariam (beat 37)
- [ ] The whisper line (beat 38)

**Clearances:**
- [ ] Mariam has approved being depicted and quoted
- [ ] B8 Architecture credited as they wish
- [ ] Music/SFX platform terms permit commercial client use
- [ ] Innovo logo asset + exact brand colour confirmed against `--accent`

---

## E · THE THINGS THAT MATTER MOST

If everything else passes and these fail, the piece has not landed.

- [ ] **The mirror.** Beats 4 and 36 back to back — hollow/hard versus warm/damped.
      Same footsteps, opposite rooms. This is the film.
- [ ] **The silence.** Beat 12 is wind over sand and nothing else. Every other beat has
      machines. If you added ambience here, remove it.
- [ ] **The pop.** Panels overshoot and settle. If they fade, `back.out(1.6)` was lost.
- [ ] **Nothing animates off-screen.** Scroll fast, then slowly — every panel should
      still animate as it arrives, never having already fired.
- [ ] **Text is short.** No caption over 14 words. If one grew, cut it.
- [ ] **The white is warm.** Compare against pure `#FFFFFF` in a swatch — the cards
      should read faintly warm, not blue.

---

## F · MISSING AUDIO — carry forward

19 SFX are unproduced (`docs/05-AUDIO-WIRING.md`). Two are severe:

- [ ] **`light_switch.mp3`** — beat 32, Act IV's payoff, currently silent
- [ ] **`impact_title.mp3`** — beat 11, the pinned title lands with no weight

Ship without them if the deadline demands it, but log both as known gaps rather than
letting them pass unnoticed.

---

## G · DEPLOY

```bash
npx vercel --prod          # reads vercel.json → outputDirectory: site
```

Post-deploy, on the live URL:
- [ ] Hard-refresh — all 33 images load (case-sensitivity check, the classic killer)
- [ ] Hero video streams and scrubs
- [ ] All six music cues load
- [ ] Test on a phone over cellular, not wifi — check hero weight is tolerable
