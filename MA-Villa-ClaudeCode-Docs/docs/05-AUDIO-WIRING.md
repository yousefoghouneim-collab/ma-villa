# 05 · AUDIO WIRING

> **Save at:** `MA Villa/docs/05-AUDIO-WIRING.md`
> **Creates:** `site/js/audio.js` + the audio sections of `site/js/main.js`

---

## THE ARCHITECTURE — unchanged from the reference

Three channels, all through Howler:

| Channel | Behaviour |
|---|---|
| **Music** | one at a time, crossfaded 1500ms, `loop:true` |
| **SFX** | one-shots from a cached pool, fired at `top 90%`, `once:true` |
| **Beds** | looping ambience, **max 2 concurrent**, oldest force-faded |

The 2-bed cap is important and already implemented — it stops the mix turning to mud
when sections overlap. Do not raise it.

---

## MUSIC — `site/js/audio.js`

Six cues, all present and correctly named after the pipeline step.

```js
const musicVol = db(-3) * 0.75;

const musicHowls = {
  intro:  new Howl({ src:['audio/music/intro.mp3'],  loop:true, volume:musicVol, preload:true }),
  demo:   new Howl({ src:['audio/music/demo.mp3'],   loop:true, volume:musicVol, preload:true }),
  build:  new Howl({ src:['audio/music/build.mp3'],  loop:true, volume:musicVol, preload:true }),
  rise:   new Howl({ src:['audio/music/rise.mp3'],   loop:true, volume:musicVol, preload:true }),
  breath: new Howl({ src:['audio/music/breath.mp3'], loop:true, volume:musicVol, preload:true }),
  finale: new Howl({ src:['audio/music/finale.mp3'], loop:true, volume:musicVol, preload:true })
};
```

Everything else in `audio.js` — `playMusic`, `fadeOut`, `hardStop`, `playSfx`,
`startBed`, `stopBed`, the `db()` helper — is copied from the reference **verbatim**.
It works; do not refactor it.

`AudioEngine.start(withSound)` plays `intro`. That fires on the gate click, so the
intro cue scores the hero video as well as Act I. That is intended.

---

## THE CUE CHAIN — `site/js/main.js`

Each cue switches when a specific image reaches **screen centre**. `onEnterBack`
restores the previous cue so scrolling upward is scored correctly too.

```js
const MUSIC_CHAIN = [
  { id:'img-a04', cue:'demo',   back:'intro'  },   // first strike
  { id:'img-a10', cue:'build',  back:'demo'   },   // rebar
  { id:'img-a14', cue:'rise',   back:'build'  },   // façade
  { id:'img-a21', cue:'breath', back:'rise'   },   // snagging
  { id:'img-a24', cue:'finale', back:'breath' }    // the reveal
];

MUSIC_CHAIN.forEach(step => {
  const img = document.getElementById(step.id);
  if(!img) return;
  ScrollTrigger.create({
    trigger: img,
    start: 'center center',
    onEnter:     ()=> AudioEngine.playMusic(step.cue, 1500),
    onEnterBack: ()=> AudioEngine.playMusic(step.back, 1500)
  });
});

const endcardEl = document.querySelector('.endcard');
if(endcardEl){
  ScrollTrigger.create({
    trigger: endcardEl, start:'top bottom', once:true,
    onEnter: ()=> AudioEngine.fadeOut(3000)
  });
}
```

**`start:'center centre'` matters.** Firing at `top 90%` would switch the music before
the image is properly on screen and the cue change would feel early. Leave it.

---

## ⚠️ SFX INVENTORY — 29 OF 48 DELIVERED

**19 files specified in the SFX brief have not been produced.** Wire only what exists.
Referencing a missing file fills the console with 404s and Howler will retry them.

### ✅ PRESENT — 29 files, wire all of these

```
crane_beep              demo_breaker_loop       demo_debris_settle
demo_dust_bloom         demo_excavator_idle     demo_first_strike
demo_wall_collapse      door_home_new           door_villa_old
exc_bucket_dig          exc_earth_dump          exc_tracks_move
formwork_strike         pour_concrete           pour_vibrator
pump_boom               rebar_ring              rebar_tie
steps_home_soft         steps_villa_hard        survey_peg
tone_concrete_raw       tone_dubai_far          tone_home_alive
tone_plot_wind          tone_site_dawn          tone_site_live
tone_studio_b8          tone_villa_empty
```

### ❌ MISSING — 19 files

| File | Beat | Impact | Priority |
|---|---|---|---|
| `light_switch` | 32 | **★★ severe** — Act IV's entire payoff | **1** |
| `impact_title` | 11 | **★★ severe** — the pinned title lands silent | **2** |
| `cam_shutter` | 8, 21, 37 | ★ high — all three interviews are silent | **3** |
| `craft_stone_set` | 25 | ★ high — craft triptych is silent | **4** |
| `craft_wood_plane` | 25 | ★ high | 4 |
| `craft_plaster_trowel` | 25 | ★ high | 4 |
| `snag_wipe` | 29 | ★ high | 5 |
| `drone_pass_by` | 13 | high — the drone flies silently | 6 |
| `pen_tick` | 18, 30 | medium — substituted, see below | 7 |
| `whoosh_transition` | hero, 11, 27, 35 | medium — used by the hero handover | 7 |
| `furniture_unwrap` | 31 | medium | 8 |
| `furniture_place` | 31 | medium | 8 |
| `keys_on_stone` | 39 | low | 9 |
| `paper_drawings` | 6, 7 | low | 9 |
| `tape_rec_start` | 7, 21 | low | 9 |
| `block_lay` | 23 | low | 9 |
| `mep_conduit` | 24 | low | 9 |
| `drill_burst` | 24 | low | 9 |
| `drone_hover` | 13 | low | 9 |

**Build the piece without them.** Silence is a legitimate state — several of these
beats read fine quiet, and beat 29 arguably reads *better* quiet. But `light_switch`
and `impact_title` are genuine holes: they are the two loudest emotional moments in
the film and both currently play nothing. Flag these to the producer.

### Interim substitutions — only these two

| Missing | Substitute | Where | Rationale |
|---|---|---|---|
| `pen_tick` | `rebar_tie` @ -6dB | beat 18 cascade, beat 30 | small metallic tick; reads as a pen on a clipboard and stays diegetic |
| `whoosh_transition` | `tone_dubai_far` @ -16dB | hero handover | soft airy pad; covers the seam without announcing itself |

**Do not substitute anywhere else.** A wrong sound is worse than no sound — the single
biggest failure of the reference audio was a Gmail notification chime playing under an
interview quote.

---

## SFX MAP — implement exactly this

Declared inline on the section via `data-sfxwire`, matching the reference's pattern.
The engine fires on the section's first `.pop`/`.panel`/`.bubble`/`figure` child.

```html
<!-- BEAT 4 — mirror open -->
<section class="beat pbeat" data-bed-villa
  data-sfxwire='{"file":"door_villa_old.mp3","db":-8,
                 "then":{"file":"steps_villa_hard.mp3","db":-12,"delay":700}}'>

<!-- BEAT 9 — first strike -->
<section class="beat pbeat" data-bed-demo
  data-sfxwire='{"file":"demo_first_strike.mp3","db":-2}'>

<!-- BEAT 10 — collapse -->
<section class="beat"
  data-sfxwire='{"file":"demo_wall_collapse.mp3","db":-4,
                 "then":{"file":"demo_debris_settle.mp3","db":-10,"delay":1200}}'>

<!-- BEAT 12 — the silence beat -->
<section class="beat pbeat" data-bed-plot
  data-sfxwire='{"file":"survey_peg.mp3","db":-10}'>

<!-- BEAT 14 — excavation -->
<section class="beat pbeat" data-bed-exc
  data-sfxwire='{"file":"exc_bucket_dig.mp3","db":-8,
                 "then":{"file":"exc_earth_dump.mp3","db":-10,"delay":900}}'>

<!-- BEAT 16 — rebar -->
<section class="beat pbeat"
  data-sfxwire='{"file":"rebar_tie.mp3","db":-8,
                 "then":{"file":"rebar_ring.mp3","db":-6,"delay":800}}'>

<!-- BEAT 17 — the pour -->
<section class="beat pbeat" data-bed-pour
  data-sfxwire='{"file":"pour_vibrator.mp3","db":-10}'>

<!-- BEAT 19 — crane -->
<section class="beat pbeat"
  data-sfxwire='{"file":"crane_beep.mp3","db":-14}'>

<!-- BEAT 36 — mirror close -->
<section class="beat pbeat" data-bed-home
  data-sfxwire='{"file":"door_home_new.mp3","db":-10,
                 "then":{"file":"steps_home_soft.mp3","db":-14,"delay":700}}'>
```

Beats 10 and 25 also want `demo_dust_bloom` (-12dB, delay 400ms) and
`formwork_strike` (-12dB) respectively — the reference's `then` object supports only
one chained sound, so add a second `fireSfxOnce()` call for these rather than nesting.

### Cascade — beat 18

Point the reference's existing cascade routine at `rebar_tie`:

```js
document.querySelectorAll('#cascade [data-cds]').forEach((el, i) => {
  ScrollTrigger.create({
    trigger: el, start:'top 90%', once:true,
    onEnter: ()=>{
      if(sfxFired.has(el)) return;
      sfxFired.add(el);
      setTimeout(()=> AudioEngine.playSfx(
        'rebar_tie.mp3', AudioEngine.db(-6), 1 + i*0.125), i*140);
    }
  });
});
```

Five ticks, staggered 140ms, each pitched 12.5% higher than the last. It reads as
milestones stacking up.

---

## AMBIENT BEDS

```js
const BEDS = {
  'data-bed-villa':  [['tone_villa_empty.mp3',  -20]],
  'data-bed-home':   [['tone_home_alive.mp3',   -22]],
  'data-bed-plot':   [['tone_plot_wind.mp3',    -14]],
  'data-bed-far':    [['tone_dubai_far.mp3',    -22]],
  'data-bed-studio': [['tone_studio_b8.mp3',    -18]],
  'data-bed-site':   [['tone_site_live.mp3',    -10]],
  'data-bed-dawn':   [['tone_site_dawn.mp3',    -16]],
  'data-bed-raw':    [['tone_concrete_raw.mp3', -14]],
  'data-bed-demo':   [['demo_breaker_loop.mp3',  -8], ['demo_excavator_idle.mp3', -14]],
  'data-bed-exc':    [['exc_tracks_move.mp3',   -14], ['demo_excavator_idle.mp3', -16]],
  'data-bed-pour':   [['pour_concrete.mp3',      -8], ['pump_boom.mp3',           -12]]
};

Object.entries(BEDS).forEach(([attr, layers]) => {
  document.querySelectorAll('[' + attr + ']').forEach(el => {
    let beds = [];
    ScrollTrigger.create({
      trigger: el, start:'top 60%', end:'bottom 40%',
      onEnter: ()=>{
        if(beds.length) return;
        beds = layers.map(([f, d]) => AudioEngine.startBed(f, AudioEngine.db(d)));
      },
      onLeave:     ()=>{ beds.forEach(AudioEngine.stopBed); beds = []; },
      onLeaveBack: ()=>{ beds.forEach(AudioEngine.stopBed); beds = []; }
    });
  });
});
```

This is a tidier version of the reference's repeated per-bed blocks. Behaviour is
identical — same triggers, same fades, same 2-bed cap inside `startBed`.

**Bed assignments by beat:**

| Bed | Beats |
|---|---|
| `far` | 3, 35 |
| `villa` | 4 |
| `studio` | 7 |
| `demo` | 9 |
| `plot` | 11, 12 |
| `exc` | 14 |
| `pour` | 17 |
| `raw` | 20 |
| `site` | 23, 25, 26 |
| `dawn` | 27 |
| `home` | 36, 39 |

---

## THE MIRROR — verify this by ear

Beats 4 and 36 are the piece. Scroll to each and listen:

**Beat 4** — hollow, hard, ringing. Footsteps slap and echo. A dry door creak.
**Beat 36** — warm, damped, close. Footsteps are swallowed. The door is near-silent.

Same performance, different room. If they do not feel like opposites, check that the
bed is actually playing (`AudioEngine.isOn()` in the console) and that the dB values
above have not drifted.

---

## MOBILE UNLOCK

Carry the reference's Howler unlock verbatim:

```js
(function(){
  function unlock(){
    if(Howler.ctx && Howler.ctx.state === 'suspended') Howler.ctx.resume();
    document.removeEventListener('touchstart', unlock);
    document.removeEventListener('touchend', unlock);
  }
  document.addEventListener('touchstart', unlock, {passive:true});
  document.addEventListener('touchend', unlock, {passive:true});
})();
```

---

## LICENSING

The music and SFX are bespoke to this project, so unlike the reference builds there is
nothing to clear — **provided** the generation platform's terms grant commercial rights
for a named-client deliverable. Confirm that before delivery. Platforms differ, and
this is going out under Innovo's name.
