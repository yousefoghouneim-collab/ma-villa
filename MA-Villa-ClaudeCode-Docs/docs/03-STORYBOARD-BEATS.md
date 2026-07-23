# 03 · STORYBOARD — THE 40 BEATS

> **Save at:** `MA Villa/docs/03-STORYBOARD-BEATS.md`
> **Creates:** `site/index.html`

---

## THE STORY

Five acts. A villa is demolished so a home can be built.

| Act | Title | Beats |
|---|---|---|
| I | What Was Here Before | 1–14 |
| II | Out of the Ground | 15–21 |
| III | The Bones Become a Building | 22–27 |
| IV | The Last Ten Percent | 28–33 |
| V | Home | 34–40 |

**The spine:** the protagonist is Mariam. The building is what changes; she is why it
changes. B8 and the technical lead are witnesses who explain what it costs.

**The one structural device that matters most:** beats 4 and 36 are a mirror. She walks
the empty old villa; she walks the finished home. Same blocking, same camera, different
house. The score mirrors it too (`intro` and `finale` share a melody), and so does the
sound (`tone_villa_empty` → `tone_home_alive`, `steps_villa_hard` → `steps_home_soft`).
**Everything in this project bends toward that pair. Do not weaken it.**

---

## COPY RULES — READ BEFORE WRITING ANY TEXT

The artwork is finished and dense. Text is support, not narration.

- Captions: **8–14 words. Hard ceiling.**
- Many beats carry **no text at all**. That is intentional. Do not fill them.
- Act cards: a two- or three-word title only.
- Never describe what is visible in the image. If the panel shows a concrete pour, do
  not write "the concrete was poured."
- The copy below is **approved and final**. Use it verbatim. Do not expand, embellish,
  or add subheadings.

Every number in this copy is a placeholder pending real project data — flagged in
`docs/06-QA-CHECKLIST.md`.

---

## STRUCTURAL CLASSES — carry from the reference exactly

| Class | Use |
|---|---|
| `.beat` | standard section |
| `.beat.pbeat` | section containing one panel |
| `.beat.chapter` / `.actcard` / `.endcard` | title cards |
| `.pinwrap` + `.pin` | pinned full-screen moment |
| `.pinwrap.warm` | pinned, with warm radial glow |
| `.beat.cascade` | stacked bubble volley |
| `.beat.floatbeat` | full-width travelling element (drone) |
| `.beat.conversation-beat` | sequential typed exchange |
| `.beat.whisper` | centred cut-out + quote |
| `.trip` | three-panel row |
| `.panel.pop` | image card, animates in |
| `.cutout[data-drift]` | character hanging off panel corner |
| `.bubble.me` / `.bubble.them` / `.thesis` / `.spec` | message cards |
| `.cap` / `.narr` / `.kicker` / `.reveal` | text elements |

---

## THE BEAT TABLE

`BED` = looping ambience (`data-bed-*`) · `SFX` = one-shot (`data-sfxwire`) ·
`♪` = music cue switch · `★` = do not compromise this beat

---

### ACT I — WHAT WAS HERE BEFORE

**BEAT 1** · `.beat.chapter` · rings background
```
kicker : ACT ONE
h1     : What Was Here Before
chsub  : MA VILLA — an Innovo story
```

**BEAT 2** · `.beat`
```
narr : Before anything could be built, something had to go.
```

**BEAT 3** · `.beat.pbeat` — `a01.jpeg` + cut-out `c01.png`
```
cap : Still a house. Already scheduled.
BED : tone_dubai_far  (-22dB)
```

**BEAT 4 ★** · `.beat.pbeat` — `a02.jpeg` + cut-out `c01.png` — **MIRROR OPEN**
```
cap : She walked it one last time.
BED : tone_villa_empty  (-20dB)
SFX : door_villa_old (-8dB) → then steps_villa_hard (-12dB, delay 700ms)
```
> The hollow room tone is the whole point of this beat. It must be audible.

**BEAT 5** · `.beat`
```
narr.small : Every wall here becomes the ground under a better one.
```

**BEAT 6** · `.beat` — bubble `.me`
```
meta : THE BRIEF · FROM MARIAM   |   DAY 000
p    : I want to feel the land from inside the house.
```

**BEAT 7** · `.beat.pbeat` — `a03.jpeg` + cut-out `c03.png`
```
cap : B8 got one sentence. They spent a year on it.
BED : tone_studio_b8  (-18dB)
```

**BEAT 8** · `.beat` — bubble `.them.thesis`
```
meta : B8 ARCHITECTURE   |   INTERVIEW 01
p    : The first sketch survived. That never happens.
p    : The hard part was the ground.
```

**BEAT 9 ★** · `.beat.pbeat` — `a04.jpeg` · **♪ demo** (trigger `id="img-a04"`)
```
cap : Then the first strike.
BED : demo_breaker_loop (-8dB) + demo_excavator_idle (-14dB)
SFX : demo_first_strike (-2dB)
```

**BEAT 10** · `.beat` — `.trip` triptych: `a05` `a06` `a07`
```
cap : Eleven years of walls, gone in an afternoon.
SFX : demo_wall_collapse (-4dB) → then demo_debris_settle (-10dB, delay 1200ms)
      + demo_dust_bloom (-12dB, delay 400ms)
```

**BEAT 11 ★** · `.pinwrap#zero` — pinned letter cascade
```
zpre  : And by evening the plot read:
zline : N O T H I N G   B U T   L A N D .
zpost : — surveyed, cleared, silent —
BED   : tone_plot_wind (-14dB)
```
> Letters reveal at 60ms intervals via the reference's existing `#zero` routine.
> Colour: use the accent, **not** red — see `docs/04-DESIGN-SYSTEM.md`.

**BEAT 12 ★** · `.beat.pbeat` — `a08.jpeg` — **THE SILENCE BEAT**
```
cap : A blank page, 1,400 square metres wide.
BED : tone_plot_wind (-14dB)
SFX : survey_peg (-10dB)
```
> Every other beat has machines. This one is wind over sand and nothing else. Do not
> add ambience here. The emptiness is the effect.

**BEAT 13** · `.beat.floatbeat` — `drone.png` travelling left→right on scroll scrub
```
kicker : AERIAL SURVEY · PLOT 44
```
> Uses the reference's `[data-fly]` scrub routine unchanged, with `id="img-drone"`.
> **No SFX** — `drone_pass_by.mp3` has not been produced yet. Leave silent rather
> than substituting something wrong.

**BEAT 14** · `.beat.pbeat` — `a09.jpeg` + cut-out `c05.png`
```
cap : The machines cut the shape of the future into the dirt.
BED : exc_tracks_move (-14dB) + demo_excavator_idle (-16dB)
SFX : exc_bucket_dig (-8dB) → then exc_earth_dump (-10dB, delay 900ms)
```

---

### ACT II — OUT OF THE GROUND

**BEAT 15** · `.beat.actcard`
```
kicker   : ACT TWO
h2       : Out of the Ground
actextra : FOUNDATION · STRUCTURE
```

**BEAT 16** · `.beat.pbeat` — `a10.jpeg` · **♪ build** (trigger `id="img-a10"`)
```
cap : First it was steel.
SFX : rebar_tie (-8dB) → then rebar_ring (-6dB, delay 800ms)
```

**BEAT 17** · `.beat.pbeat` — `a11.jpeg`
```
cap : The pour started at 4 AM and did not stop.
BED : pour_concrete (-8dB) + pump_boom (-12dB)
SFX : pour_vibrator (-10dB)
```

**BEAT 18** · `.beat.cascade#cascade` — five bubbles, alternating me/them
```
c0 .me    SITE LOG | DAY 012   →  Raft poured. 1,180 m³.
c1 .them  QA       | DAY 019   →  Cube tests passed.
c2 .me    SITE LOG | DAY 048   →  Ground floor slab.
c3 .them  QA       | DAY 090   →  First floor. On programme.
c4 .me    SITE LOG | DAY 140   →  Topped out.
cap : A house gets built twice — once in drawings, once in the log.
SFX : rebar_tie, per bubble, staggered 140ms, pitch +12.5% each step
```
> The reference's cascade routine already does the stagger and pitch rise. Point it at
> `rebar_tie.mp3` instead of `notify.mp3` — a small metallic tick reads as a pen tick
> and keeps it diegetic. Swap to `pen_tick.mp3` when produced.

**BEAT 19** · `.beat.pbeat` — `a12.jpeg`
```
cap : Same altitude, same path, every visit.
SFX : crane_beep (-14dB)
```

**BEAT 20** · `.beat.pbeat` — `a13.jpeg` + cut-out `c04.png`
```
cap : You could walk the rooms before they were rooms.
BED : tone_concrete_raw (-14dB)
```

**BEAT 21** · `.beat.conversation-beat` — sequential typed exchange
```
order 1 .me      Q · INTERVIEW 02 | HEAD OF TECHNICAL
                 What are you proudest of?
order 2 .them.thesis  HEAD OF TECHNICAL | ON SITE
                 The things nobody will ever see.
                 They're inside the walls now.
order 3 narr.small : Everything that makes this house work is already invisible.
```
> Uses the reference's typing routine. Currently silent — the typewriter SFX is wrong
> for a spoken interview, and `cam_shutter.mp3` is not yet produced. Leave it silent;
> the sequential reveal carries it.

---

### ACT III — THE BONES BECOME A BUILDING

**BEAT 22** · `.beat.actcard`
```
kicker   : ACT THREE
h2       : The Bones Become a Building
actextra : ENVELOPE · FIT-OUT
```

**BEAT 23** · `.beat.pbeat` — `a14.jpeg` · **♪ rise** (trigger `id="img-a14"`)
```
cap : Openings became windows. Gaps became rooms.
BED : tone_site_live (-10dB)
```

**BEAT 24** · `.beat.pbeat` — `a15.jpeg`
```
cap : Nine kilometres of cable, never to be seen again.
```
> No SFX available. Silent.

**BEAT 25** · `.beat` — `.trip` triptych: `a16` `a17` `a18`
```
cap : Stone. Timber. Plaster.
BED : tone_site_live (-14dB)
```
> The three `craft_*` sounds are not yet produced. This beat is designed around them
> and is noticeably weaker without. Flagged as priority in `docs/05-AUDIO-WIRING.md`.

**BEAT 26** · `.beat.pbeat` — `a19.jpeg` + cut-out `c02.png`
```
cap : She came in a hard hat and said almost nothing.
BED : tone_site_live (-12dB)
```

**BEAT 27** · `.pinwrap.warm#firstroom` — pinned, `a20.jpeg` as `.panel.big`
```
kicker : THE FIRST FINISHED ROOM
cap    : One room, done. Everyone came to look at it.
BED    : tone_site_dawn (-16dB)
```

---

### ACT IV — THE LAST TEN PERCENT

**BEAT 28** · `.beat.actcard`
```
kicker   : ACT FOUR
h2       : The Last Ten Percent
actextra : SNAGGING · FURNISHING
```

**BEAT 29** · `.beat.pbeat` — `a21.jpeg` · **♪ breath** (trigger `id="img-a21"`)
```
cap : The site went quiet.
```
> `snag_wipe.mp3` not yet produced. Silent — which suits the beat.

**BEAT 30** · `.beat` — bubble `.them.spec`
```
meta : SNAG LIST · FINAL   |   DAY 611
p    : Items raised: 1,247
p    : Items closed: 1,247
p    : Open: 0
```

**BEAT 31** · `.beat.pbeat` — `a22.jpeg`
```
cap : The rooms filled up in an afternoon.
```

**BEAT 32 ★** · `.beat.pbeat` — `a23.jpeg`
```
cap : At 6:40 on a Thursday, somebody found the switch.
```
> **This beat is missing its payoff.** `light_switch.mp3` is the single best sound in
> the piece and has not been produced. Until it exists this beat plays silent. Make it
> the top audio priority.

**BEAT 33** · `.beat`
```
narr.small : 618 days. One afternoon of demolition. The rest was patience.
```

---

### ACT V — HOME

**BEAT 34** · `.beat.actcard`
```
kicker   : ACT FIVE
h2       : Home
actextra : THE SAME PLOT
```

**BEAT 35** · `.beat.pbeat` — `a24.jpeg` as `.panel.big` · **♪ finale** (trigger `id="img-a24"`)
```
cap : Same light. Same angle. Same plot.
BED : tone_dubai_far (-22dB)
```
> Same bed as beat 3 deliberately — the *exterior* is unchanged. Only the interior
> transforms. That restraint is what sells the mirror.

**BEAT 36 ★** · `.beat.pbeat` — `a25.jpeg` + cut-out `c01.png` — **MIRROR CLOSE**
```
cap : Same steps. Same doorways. Nothing else the same.
BED : tone_home_alive (-22dB)
SFX : door_home_new (-10dB) → then steps_home_soft (-14dB, delay 700ms)
```
> Mirrors beat 4 exactly: same cut-out, same SFX pattern, same delays. Warm and damped
> where beat 4 was hollow and hard.

**BEAT 37** · `.beat` — bubble `.them.thesis`
```
meta : MARIAM AZMY · CO-FOUNDER, INNOVO   |   INTERVIEW 03
p    : I was the client and the company on the same project.
p    : The company was harder to please.
```

**BEAT 38** · `.beat.whisper` — cut-out `c06.png` centred, `.wpair`
```
wline  : On the last day the architect asked when it started feeling like home.
wquote : "The day you tore down the other one."
```

**BEAT 39** · `.beat.pbeat` — `a26.jpeg`
```
cap : She stopped walking through it and started living in it.
BED : tone_home_alive (-24dB)
```

**BEAT 40** · `.beat.endcard` — rings background
```
h2         : innovo
kicker     : WE BUILD WHERE SOMETHING ELSE STOOD.
chsub      : Plot 44 · 618 days · 1 house
browse     : Read it again…
copyright  : © 2026 Innovo. All artwork, music and text are protected works.
♪          : fadeOut(3000) on entering
```

---

## ASSET USAGE — verify all 33 are placed

| Asset | Beat(s) |
|---|---|
| `a01`–`a26` | 3, 4, 7, 9, 10×3, 12, 14, 16, 17, 19, 20, 23, 24, 25×3, 26, 27, 29, 31, 32, 35, 36, 39 |
| `c01` | 3, 4, **36** |
| `c02` | 26 |
| `c03` | 7 |
| `c04` | 20 |
| `c05` | 14 |
| `c06` | 38 |
| `drone` | 13 |

All 26 panels, all 6 cut-outs and the drone are used exactly once except `c01`, which
appears three times — deliberately, because reusing Mariam's cut-out is what ties the
mirror together.

---

## REQUIRED `id` ATTRIBUTES

These five image IDs drive the music chain. **If they are missing or renamed, the score
does not change and the piece plays one cue from start to finish.**

```html
<img id="img-a04" src="assets/media/a04.jpeg" …>   <!-- ♪ demo   -->
<img id="img-a10" src="assets/media/a10.jpeg" …>   <!-- ♪ build  -->
<img id="img-a14" src="assets/media/a14.jpeg" …>   <!-- ♪ rise   -->
<img id="img-a21" src="assets/media/a21.jpeg" …>   <!-- ♪ breath -->
<img id="img-a24" src="assets/media/a24.jpeg" …>   <!-- ♪ finale -->
<img id="img-drone" src="assets/media/drone.png" …>
```

Every `<img>` also needs `loading="lazy"` and a real `alt`.

---

## GATE COPY

```
kicker : AN INNOVO STORY · INTERACTIVE STORYBOARD
h1     : MA <em>VILLA.</em>
p      : A villa comes down so a home can go up. Best experienced with sound.
buttons: [Start with sound] [No sound thanks]
```
