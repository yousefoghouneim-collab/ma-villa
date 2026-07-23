# 02 · HERO — SCROLL-SCRUBBED VIDEO

> **Save at:** `MA Villa/docs/02-HERO-VIDEO.md`
> **Creates:** `site/js/hero.js` + hero markup in `index.html` + hero CSS

---

## THE BEHAVIOUR

Reference: `loftthirtyone.com`.

1. Visitor dismisses the sound gate.
2. The hero video fills the entire viewport — **no letterboxing, no bars, edge to edge.**
3. As they scroll, the video **plays forward frame by frame**. Scroll up, it plays
   backward. The video is not playing on its own; scroll position *is* the playhead.
4. **The page does not move past the hero until the video reaches its last frame.**
5. When it does, a soft dissolve hands over to the storyboard.

The video never autoplays and never plays on a timer. Scroll is the transport.

---

## THE THREE THINGS THAT MAKE OR BREAK IT

**1 · All-keyframe encoding.** Covered in `docs/01-ASSET-PIPELINE.md` step 5. Without
`-g 1` the browser must decode forward from a distant keyframe on every seek and the
whole effect stutters. If the hero feels laggy, check this first — it is the cause 90%
of the time.

**2 · Never assign `currentTime` straight from scroll.** Scroll events are spiky. Feed
scroll into a *target*, and ease the actual playhead toward it on every animation
frame. That interpolation is the difference between mechanical and silky.

**3 · Pin, don't fake it.** Use GSAP's `pin: true` on a tall wrapper. Do not try to
lock scroll with `overflow:hidden` and manual wheel listeners — it breaks trackpad
momentum, breaks mobile, and fights Lenis.

---

## MARKUP

Goes in `index.html` immediately **after** the `#gate` div and immediately **before**
`<main id="stage">`.

```html
<!-- ============ HERO — scroll-scrubbed video ============ -->
<section id="herowrap" aria-label="Introduction film">
  <div id="heropin">
    <video id="herovid"
           playsinline
           webkit-playsinline
           muted
           preload="auto"
           poster="assets/video/hero-poster.jpg">
      <source id="herosrc" src="assets/video/hero.mp4" type="video/mp4">
    </video>
    <div id="herofade"></div>
    <div id="heroscroll">SCROLL</div>
  </div>
</section>
```

- `muted` is **mandatory** — browsers block programmatic control of unmuted video.
- `playsinline` + `webkit-playsinline` stop iOS hijacking it into fullscreen.
- `#herofade` is the white dissolve into the storyboard.
- No `controls`, no `loop`, no `autoplay`.

---

## CSS

Add to `site/css/style.css`.

```css
/* ============ HERO ============ */
#herowrap{
  position:relative;
  z-index:6;
  /* height is set by JS from the video duration */
}
#heropin{
  position:relative;
  width:100vw;
  height:100vh;
  height:100svh;              /* mobile: ignores the collapsing URL bar */
  overflow:hidden;
  background:var(--paper);
}

/* 1:1 video filling any viewport with zero edges.
   object-fit:cover crops the overflow — on a wide screen the top and bottom
   of the square are cropped, on a tall phone the sides are. Never letterboxed. */
#herovid{
  position:absolute;
  top:50%; left:50%;
  transform:translate(-50%,-50%);
  min-width:100%;
  min-height:100%;
  width:auto; height:auto;
  object-fit:cover;
  pointer-events:none;
  user-select:none;
  -webkit-user-drag:none;
}

/* white dissolve into the storyboard */
#herofade{
  position:absolute; inset:0;
  background:var(--paper);
  opacity:0;
  pointer-events:none;
  will-change:opacity;
}

#heroscroll{
  position:absolute;
  bottom:26px; left:50%;
  transform:translateX(-50%);
  font-family:'IBM Plex Mono',monospace;
  font-size:10px; letter-spacing:.3em;
  color:#fff;
  mix-blend-mode:difference;
  animation:bob 2s ease-in-out infinite;
  transition:opacity .4s;
  pointer-events:none;
}

@media (prefers-reduced-motion: reduce){
  #herowrap{height:100vh!important}
  #heropin{position:relative}
  #heroscroll{animation:none}
}
```

**Why the `min-width/min-height` technique rather than plain `object-fit:cover`:**
both work, but this combination is more reliable across older Safari when the element
is inside a transformed/pinned parent. Keep both.

---

## `site/js/hero.js`

Load **after** the vendor libraries and **before** `main.js`.

```js
/* ================================================================
   HERO — scroll-scrubbed video
   Scroll position drives video.currentTime. The section is pinned,
   so the page cannot advance until the video reaches its last frame.
   ================================================================ */
(function(){
  const wrap   = document.getElementById('herowrap');
  const pin    = document.getElementById('heropin');
  const video  = document.getElementById('herovid');
  const src    = document.getElementById('herosrc');
  const fade   = document.getElementById('herofade');
  const hint   = document.getElementById('heroscroll');
  if(!wrap || !video) return;

  /* ---- tuning ---- */
  const SCROLL_PER_SECOND = 700;   // px of scroll per second of video
  const EASE              = 0.12;  // playhead smoothing (lower = smoother/laggier)
  const FADE_START        = 0.90;  // progress at which the white dissolve begins

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = matchMedia('(max-width: 760px)').matches;

  /* Serve the lighter file to phones — a 1080² all-intra file
     is too expensive for mobile decoders to seek smoothly. */
  if(isMobile){
    src.src = 'assets/video/hero-mobile.mp4';
    video.load();
  }

  /* Reduced motion: no scrub. Show the poster, let the page scroll past. */
  if(reduced){
    video.removeAttribute('preload');
    wrap.style.height = '100vh';
    return;
  }

  let targetTime = 0;
  let playhead   = 0;
  let ready      = false;

  function init(){
    if(ready) return;
    const duration = video.duration;
    if(!duration || !isFinite(duration)) return;
    ready = true;

    /* Total scroll distance = video length × px-per-second.
       The pin holds the viewport still for exactly this distance. */
    const scrollLength = Math.round(duration * SCROLL_PER_SECOND);
    wrap.style.height = (scrollLength + window.innerHeight) + 'px';

    ScrollTrigger.create({
      trigger: wrap,
      start: 'top top',
      end:   '+=' + scrollLength,
      pin: pin,
      pinSpacing: false,          // wrap already reserves the height
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        targetTime = self.progress * duration;

        /* dissolve to white over the last 10% */
        const f = self.progress < FADE_START ? 0
                : (self.progress - FADE_START) / (1 - FADE_START);
        fade.style.opacity = f;
        if(hint) hint.style.opacity = self.progress > 0.03 ? 0 : 1;
      }
    });

    ScrollTrigger.refresh();
  }

  /* Ease the real playhead toward the scroll-derived target every frame.
     This — not the scroll handler — is what makes it feel smooth. */
  gsap.ticker.add(() => {
    if(!ready) return;
    playhead += (targetTime - playhead) * EASE;
    if(Math.abs(targetTime - playhead) < 0.0015) return;
    if(video.readyState >= 2){
      try { video.currentTime = playhead; } catch(e){}
    }
  });

  video.addEventListener('loadedmetadata', init);
  if(video.readyState >= 1) init();

  /* iOS will not allow seeking until the element has been "played" once.
     The sound-gate click is our user gesture — consume it here.
     main.js calls window.__heroUnlock() inside closeGate(). */
  window.__heroUnlock = function(){
    const p = video.play();
    if(p && p.then) p.then(()=>{ video.pause(); video.currentTime = 0; })
                     .catch(()=>{});
    else { video.pause(); video.currentTime = 0; }
  };

  addEventListener('resize', () => {
    if(ready) ScrollTrigger.refresh();
  }, {passive:true});
})();
```

---

## HOOKING IT TO THE GATE

In `main.js`, inside the existing `closeGate()` function, add the unlock call:

```js
function closeGate(){
  document.getElementById('gate').classList.add('gone');
  document.body.classList.remove('gate-open');
  window.scrollTo(0, 0);
  lenis.scrollTo(0, {immediate:true});

  if(window.__heroUnlock) window.__heroUnlock();   // ← ADD THIS

  setTimeout(()=> ScrollTrigger.refresh(), 100);
}
```

This is important and easy to miss. iOS blocks `currentTime` assignment on a video
that has never been played. The gate button click is a genuine user gesture, so
calling `play()` then immediately `pause()` there unlocks seeking for the rest of the
session. Without it the hero is frozen on iPhone.

Also add to the "Read it again" handler so a replay resets the hero:

```js
document.querySelector('.browse').addEventListener('click', (e)=>{
  e.preventDefault();
  AudioEngine.hardStop();
  Howler.stop();
  const hv = document.getElementById('herovid');
  if(hv) hv.currentTime = 0;                        // ← ADD THIS
  window.scrollTo(0, 0);
  lenis.scrollTo(0, {immediate:true});
  document.body.classList.add('gate-open');
  document.getElementById('gate').classList.remove('gone');
});
```

---

## THE HANDOVER INTO THE STORYBOARD

The dissolve is already handled — `#herofade` reaches full white at the end of the
pin, and the storyboard's first beat (the Act One chapter card) sits on the same white
background. The seam is invisible because both sides are `var(--paper)`.

**Do not add a slide, wipe, zoom or push transition.** The brief is that it must not
feel odd or laggy; a cross-dissolve to a matching background is the one transition
that cannot draw attention to itself.

One optional refinement, worth doing: fire the soft whoosh as the fade completes, so
the handover has a sound.

```js
// in hero.js, inside the ScrollTrigger config
let handed = false;
// ...inside onUpdate:
if(self.progress > 0.97 && !handed){
  handed = true;
  if(window.AudioEngine) AudioEngine.playSfx('tone_dubai_far.mp3', AudioEngine.db(-16));
}
```

Use `whoosh_transition.mp3` here instead once it has been produced — see
`docs/05-AUDIO-WIRING.md`.

---

## TUNING

| Symptom | Fix |
|---|---|
| Hero takes too long to get through | lower `SCROLL_PER_SECOND` to 450–550 |
| Video races past too fast | raise it to 900–1100 |
| Playback feels mushy / lags behind the finger | raise `EASE` to 0.18–0.22 |
| Playback feels mechanical and steppy | lower `EASE` to 0.08 |
| Stutters on a fast scroll | the encode is wrong — re-check `-g 1` |
| Black flash before first frame | poster is missing or the path is wrong |

Rule of thumb: aim for the whole hero to take **3–6 viewport heights** of scrolling.
At the default 700 px/s that means a 6–12 second video. If yours is much longer,
lower the constant rather than making people scroll for a minute.

---

## IF IT IS STILL NOT SMOOTH ENOUGH

The bulletproof fallback used by Apple's product pages is a **frame sequence**: export
the video as numbered JPEGs and draw them to a `<canvas>`. It cannot stutter, because
there is no video decoder involved — but it costs far more bandwidth and memory.

Only reach for this if the all-keyframe MP4 has genuinely been tried and rejected.

```bash
mkdir -p site/assets/video/frames
ffmpeg -i "Hero Video.mp4" -vf "fps=25,scale=1080:1080" \
       -q:v 4 site/assets/video/frames/f%04d.jpg
```

Then preload all frames into an array of `Image` objects and, in the same
`onUpdate`/ticker structure above, `ctx.drawImage(frames[i], …)` where
`i = Math.round(progress * (frames.length - 1))`. Everything else — the pin, the
easing, the fade — stays exactly as written.

Budget check before committing to it: 25 fps × 10 s = 250 frames ≈ 25–40 MB. Acceptable
on desktop broadband, punishing on mobile data. If you go this route, keep the MP4
path for mobile and use frames only on desktop.
