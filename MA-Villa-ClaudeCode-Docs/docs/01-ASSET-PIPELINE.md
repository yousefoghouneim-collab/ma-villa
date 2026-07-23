# 01 · ASSET PIPELINE

> **Save at:** `MA Villa/docs/01-ASSET-PIPELINE.md`
> **Run this first and completely.** Nothing else works until it is done.

---

## WHY THIS STEP EXISTS

The supplied filenames contain three things that break a deployed website:

| Problem | Example | Breaks |
|---|---|---|
| Spaces | `Hero Video.mp4` | URLs — becomes `Hero%20Video.mp4`, fragile |
| Parentheses | `breath (Cue 5).mp3` | URLs — `(` and `)` need escaping |
| Uppercase | `C01.png` | Vercel/Netlify run Linux, which **is** case-sensitive. Works on your Mac, 404s in production. |

This is the single most common way a project like this dies after deploy. Fix it once,
at the start, in one script.

---

## STEP 1 — CREATE THE STRUCTURE

Run from the project root
(`/Users/rozbehmobile/Downloads/The Crew Dubai 2023/AI Projects/MA Villa`):

```bash
mkdir -p site/css site/js/vendor site/assets/media site/assets/video \
         site/audio/music site/audio/sfx
```

---

## STEP 2 — COPY AND NORMALISE THE ARTWORK

Panels are already correctly named. Cut-outs need lowercasing.

```bash
# 26 panels — straight copy
cp "MA Villa Visuals"/a??.jpeg site/assets/media/

# 6 cut-outs — force lowercase filenames
for f in "MA Villa Visuals"/C0?.png; do
  cp "$f" "site/assets/media/$(basename "$f" | tr 'A-Z' 'a-z')"
done

# drone
cp "MA Villa Visuals/drone.png" site/assets/media/

# Full Storyboard.jpeg is a reference sheet for you — DO NOT copy it into site/
```

**Verify — must print 33:**
```bash
ls site/assets/media | wc -l
```

**Verify no uppercase survived — must print nothing:**
```bash
ls site/assets/media | grep '[A-Z]'
```

---

## STEP 3 — COPY AND RENAME THE MUSIC

Strip the spaces and parentheses. The cue key becomes the filename.

```bash
cp "Music/intro (Cue 1).mp3"  site/audio/music/intro.mp3
cp "Music/demo (Cue 2).mp3"   site/audio/music/demo.mp3
cp "Music/build (Cue 3).mp3"  site/audio/music/build.mp3
cp "Music/rise (Cue 4).mp3"   site/audio/music/rise.mp3
cp "Music/breath (Cue 5).mp3" site/audio/music/breath.mp3
cp "Music/finale (Cue 6).mp3" site/audio/music/finale.mp3
```

**Verify — must print 6:**
```bash
ls site/audio/music | wc -l
```

---

## STEP 4 — COPY THE SFX

These are already clean lowercase with underscores. Straight copy.

```bash
cp "SFX Library"/*.mp3 site/audio/sfx/
```

**Verify — must print 29:**
```bash
ls site/audio/sfx | wc -l
```

Note: 29 is correct. The full spec called for 48; 19 are not yet produced. See
`docs/05-AUDIO-WIRING.md` for exactly which, and what to do about it. **Do not invent
filenames to fill the gaps** — only wire files that exist.

---

## STEP 5 — ENCODE THE HERO VIDEO ⚠️ CRITICAL

**This is the step that determines whether the hero feels silky or broken.**

A standard MP4 stores one full keyframe every ~250 frames and rebuilds everything
between them from differences. When you scrub, the browser must decode from the last
keyframe forward to reach your target frame — so seeking stutters badly.

The fix is to re-encode so **every frame is a keyframe** (`-g 1`). The file gets
roughly 3–5× larger, which is completely acceptable for a short hero and is what makes
scrubbing instant.

Check the source first:
```bash
ffprobe -v error -show_entries stream=width,height,r_frame_rate,duration \
        -of default=noprint_wrappers=1 "Hero Video.mp4"
```

### Desktop master — all-keyframe, 1080×1080

```bash
ffmpeg -i "Hero Video.mp4" \
  -an \
  -vf "scale=1080:1080:flags=lanczos" \
  -c:v libx264 -profile:v high -pix_fmt yuv420p \
  -g 1 -keyint_min 1 -sc_threshold 0 \
  -crf 20 \
  -movflags +faststart \
  site/assets/video/hero.mp4
```

### Mobile variant — smaller, cheaper to decode

Phones cannot seek a 1080² all-intra file smoothly. Ship a 720² version.

```bash
ffmpeg -i "Hero Video.mp4" \
  -an \
  -vf "scale=720:720:flags=lanczos" \
  -c:v libx264 -profile:v main -pix_fmt yuv420p \
  -g 1 -keyint_min 1 -sc_threshold 0 \
  -crf 23 \
  -movflags +faststart \
  site/assets/video/hero-mobile.mp4
```

### Poster frame — shown while the video loads, and used for reduced-motion

```bash
ffmpeg -i "Hero Video.mp4" -vf "select=eq(n\,0),scale=1080:1080" \
  -vframes 1 -q:v 2 site/assets/video/hero-poster.jpg
```

**Flags explained** — do not drop any of them:

| Flag | Why |
|---|---|
| `-g 1 -keyint_min 1` | every frame a keyframe — **the whole point** |
| `-sc_threshold 0` | stops ffmpeg inserting its own scene-cut keyframes |
| `-an` | strips audio; the hero is scored by the music engine, not the video |
| `-movflags +faststart` | moves the index to the front so playback can begin before full download |
| `-pix_fmt yuv420p` | Safari refuses to decode anything else |

**Sanity check the result:**
```bash
ls -lh site/assets/video/
ffprobe -v error -select_streams v -show_entries frame=key_frame \
        -of csv=p=0 site/assets/video/hero.mp4 | sort | uniq -c
```
The second command must show **only `1`s**. If any `0` appears, the encode failed and
scrubbing will stutter — re-run it.

**If the file exceeds ~40 MB**, raise `-crf` to 23–26 and re-encode. Do not compromise
`-g 1` to save size; drop resolution or quality instead.

---

## STEP 6 — VENDOR THE LIBRARIES

```bash
cd /tmp && rm -rf vend && mkdir vend && cd vend
npm pack three@0.128.0 howler@2.2.4 @studio-freight/lenis@1.0.42 gsap@3.12.5
for f in *.tgz; do tar xzf "$f"; mv package "${f%%-*}_pkg"; done
```

Then copy into the project (adjust the `_pkg` folder names ffmpeg produced):

```
three_pkg/build/three.min.js        → site/js/vendor/three.min.js
howler_pkg/dist/howler.min.js       → site/js/vendor/howler.min.js
studio_pkg/dist/lenis.min.js        → site/js/vendor/lenis.min.js
gsap_pkg/dist/gsap.min.js           → site/js/vendor/gsap.min.js
gsap_pkg/dist/ScrollTrigger.min.js  → site/js/vendor/ScrollTrigger.min.js
```

Load them in `index.html` in this exact order — ScrollTrigger depends on GSAP:

```html
<script src="js/vendor/three.min.js"></script>
<script src="js/vendor/howler.min.js"></script>
<script src="js/vendor/lenis.min.js"></script>
<script src="js/vendor/gsap.min.js"></script>
<script src="js/vendor/ScrollTrigger.min.js"></script>
<script src="js/dust.js"></script>
<script src="js/audio.js"></script>
<script src="js/hero.js"></script>
<script src="js/main.js"></script>
```

---

## STEP 7 — DEPLOY CONFIG

`MA Villa/vercel.json`:
```json
{ "outputDirectory": "site" }
```

`site/_headers` (Netlify; harmless on Vercel):
```
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin

/index.html
  Cache-Control: no-store

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/audio/*
  Cache-Control: public, max-age=31536000, immutable
```

---

## FINAL VERIFICATION

Run this before moving on. Every line must pass.

```bash
echo "panels:  $(ls site/assets/media/a*.jpeg 2>/dev/null | wc -l)  (expect 26)"
echo "cutouts: $(ls site/assets/media/c*.png  2>/dev/null | wc -l)  (expect 6)"
echo "drone:   $(ls site/assets/media/drone.png 2>/dev/null | wc -l)  (expect 1)"
echo "music:   $(ls site/audio/music/*.mp3 2>/dev/null | wc -l)  (expect 6)"
echo "sfx:     $(ls site/audio/sfx/*.mp3 2>/dev/null | wc -l)  (expect 29)"
echo "video:   $(ls site/assets/video/* 2>/dev/null | wc -l)  (expect 3)"
echo "vendor:  $(ls site/js/vendor/*.js 2>/dev/null | wc -l)  (expect 5)"
echo "uppercase leaks: $(ls site/assets/media | grep -c '[A-Z]')  (expect 0)"
echo "spaces in names: $(find site -name '* *' | wc -l)  (expect 0)"
```
