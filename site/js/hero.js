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

  /* ---- tuning ----
     Source hero is 21.4s @ 30fps. The default 700 px/s would demand ~16
     viewport-heights of scrolling; lowered to 350 so the whole hero takes
     roughly 7 screens — long enough to feel deliberate, short enough not
     to strand the visitor. See docs/02-HERO-VIDEO.md "TUNING". */
  const SCROLL_PER_SECOND = 350;   // px of scroll per second of video
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
  let handed     = false;

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

        /* soft handover sound as the fade completes — substitutes the
           unproduced whoosh_transition.mp3 with tone_dubai_far (docs/05) */
        if(self.progress > 0.97 && !handed){
          handed = true;
          if(window.AudioEngine) AudioEngine.playSfx('tone_dubai_far.mp3', AudioEngine.db(-16));
        }
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
