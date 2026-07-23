/* ========== MA VILLA — Main Controller ========== */

/* --- Lenis smooth scroll (desktop + mobile) --- */
const lenis = new Lenis({ duration:1.2, smoothWheel:true, touchMultiplier:1.5, smoothTouch:true });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time)=>{ lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

/* --- Gate: LOCK body scroll while gate is open --- */
document.body.classList.add('gate-open');

const sndBtn = document.getElementById('snd');
function setSndUI(v){
  sndBtn.textContent = v ? 'SOUND ON' : 'SOUND OFF';
  sndBtn.classList.toggle('on', v);
}

function closeGate(){
  document.getElementById('gate').classList.add('gone');
  document.body.classList.remove('gate-open');
  window.scrollTo(0, 0);
  lenis.scrollTo(0, {immediate:true});

  if(window.__heroUnlock) window.__heroUnlock();   // unlock hero seeking on iOS

  setTimeout(()=> ScrollTrigger.refresh(), 100);
}

document.getElementById('gy').onclick = ()=>{
  setSndUI(AudioEngine.start(true));
  closeGate();
};
document.getElementById('gn').onclick = ()=>{
  AudioEngine.start(false);
  setSndUI(false);
  closeGate();
};
sndBtn.onclick = ()=> setSndUI(AudioEngine.toggle());

document.querySelector('.browse').addEventListener('click', (e)=>{
  e.preventDefault();
  AudioEngine.hardStop();
  Howler.stop();
  const hv = document.getElementById('herovid');
  if(hv) hv.currentTime = 0;                        // reset the hero for a replay
  window.scrollTo(0, 0);
  lenis.scrollTo(0, {immediate:true});
  document.body.classList.add('gate-open');
  document.getElementById('gate').classList.remove('gone');
});

document.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape'){ AudioEngine.mute(); setSndUI(false); }
});

/* --- Progress bar --- */
window.addEventListener('scroll', ()=>{
  const h = document.documentElement;
  const p = scrollY / (h.scrollHeight - innerHeight);
  document.getElementById('bar').style.width = (p*100)+'%';
}, {passive:true});

/* --- Board tilt — VERY subtle --- */
(function(){
  const stage = document.getElementById('stage');
  if(matchMedia('(pointer:coarse)').matches || matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  let tx=0,ty=0,cx=0,cy=0;
  document.addEventListener('mousemove', (e)=>{
    tx = (e.clientX/innerWidth - 0.5);
    ty = (e.clientY/innerHeight - 0.5);
  });
  document.addEventListener('mouseleave', ()=>{ tx=0; ty=0; });
  (function loop(){
    cx += (tx - cx) * 0.01;
    cy += (ty - cy) * 0.01;
    stage.style.transformOrigin = '50% ' + (scrollY + innerHeight/2) + 'px';
    stage.style.transform = 'rotateY('+(cx*0.8)+'deg) rotateX('+(-cy*0.5)+'deg)';
    requestAnimationFrame(loop);
  })();
})();

/* --- Cutout drift — minimal --- */
const drifts = document.querySelectorAll('[data-drift]');
(function driftLoop(t){
  drifts.forEach((d,i)=>{
    d.style.transform = 'translateY('+(Math.sin(t*0.0005+i)*2)+'px) rotate('+(Math.sin(t*0.0003+i)*0.5)+'deg)';
  });
  requestAnimationFrame(driftLoop);
})(0);

/* --- Random rotation seed per panel — nothing sits square --- */
document.querySelectorAll('.pop').forEach((p,i)=>{
  p.style.setProperty('--rot', ((i%2?1:-1)*(1+(i%3)*0.7))+'deg');
});

/* --- GSAP ScrollTrigger --- */
gsap.registerPlugin(ScrollTrigger);

/*
 * REVEAL RULE: Every .pop and .reveal triggers based on ITSELF entering viewport,
 * not its parent section. This ensures nothing animates until it's actually visible.
 */
document.querySelectorAll('.beat:not(.conversation-beat) .pop, .dstage .pop').forEach((el, i) => {
  gsap.to(el, {
    opacity:1, scale:1, rotation:0, y:0,
    duration:0.9, ease:'back.out(1.6)',
    scrollTrigger:{ trigger:el, start:'top 90%', once:true, onEnter:()=>el.classList.add('in') }
  });
});

document.querySelectorAll('.beat:not(.conversation-beat) .reveal, .dstage .reveal').forEach(el => {
  gsap.to(el, {
    opacity:1, y:0, duration:0.8, ease:'power2.out',
    scrollTrigger:{ trigger:el, start:'top 90%', once:true }
  });
});

/* --- BUBBLE SCRATCH-IN — trigger on the bubble itself (silent; SFX handled elsewhere) --- */
document.querySelectorAll('.bubble:not([data-conv-order])').forEach(bubble => {
  ScrollTrigger.create({
    trigger: bubble,
    start: 'top 90%',
    once: true,
    onEnter: ()=>{
      const delay = bubble.dataset.cds !== undefined
        ? parseFloat(bubble.className.match(/c(\d)/)?.[1] || 0) * 0.2 : 0;
      setTimeout(()=>{
        bubble.classList.add('scratched');
      }, delay * 1000);
    }
  });
});

/* --- CONVERSATION BEAT: sequential typing (beat 21) — silent, the reveal carries it --- */
(function(){
  const convBeat = document.querySelector('.conversation-beat');
  if(!convBeat) return;
  const bubble1 = convBeat.querySelector('[data-conv-order="1"]');
  const bubble2 = convBeat.querySelector('[data-conv-order="2"]');
  const narrEl = convBeat.querySelector('[data-conv-order="3"]');

  function typeInBubble(bubble, cb){
    const ps = [...bubble.querySelectorAll('p')];
    const texts = ps.map(p => p.textContent);
    ps.forEach(p => p.textContent = '');
    gsap.to(bubble, {opacity:1, scale:1, rotation:0, y:0, duration:0.5, ease:'back.out(1.4)'});
    bubble.classList.add('scratched');
    let pi=0, ci=0;
    (function tick(){
      if(pi >= ps.length){ if(cb) cb(); return; }
      ps[pi].textContent = texts[pi].slice(0, ++ci);
      if(ci >= texts[pi].length){ pi++; ci=0; }
      setTimeout(tick, 24);
    })();
  }

  ScrollTrigger.create({
    trigger: convBeat, start:'top 70%', once:true,
    onEnter: ()=>{
      typeInBubble(bubble1, ()=>{
        setTimeout(()=>{
          typeInBubble(bubble2, ()=>{
            setTimeout(()=>{
              gsap.to(narrEl, {opacity:1, y:0, duration:0.8, ease:'power2.out'});
            }, 400);
          });
        }, 500);
      });
    }
  });
})();

/* --- NOTHING BUT LAND — letters reveal FAST on section enter (accent, not red).
       impact_title.mp3 is unproduced, so this lands silent for now (docs/05). --- */
(function(){
  const wrap = document.getElementById('zero');
  if(!wrap) return;
  const spans = wrap.querySelectorAll('.zline span');
  const post = wrap.querySelector('.zpost');

  ScrollTrigger.create({
    trigger: wrap,
    start: 'top 80%',
    once: true,
    onEnter: ()=>{
      spans.forEach((s, i) => {
        setTimeout(()=>{
          s.classList.add('in');
          if(i === spans.length - 1){
            post.classList.add('in');
          }
        }, i * 60);
      });
    }
  });
})();

/* --- DRONE: far left → far right on scroll scrub, fades out --- */
(function(){
  const flyEl = document.querySelector('[data-fly]');
  if(!flyEl) return;
  const section = flyEl.closest('.floatbeat');

  flyEl.style.left = '0px';
  flyEl.style.transform = 'translate(-100%, -50%) rotate(-4deg)';

  ScrollTrigger.create({
    trigger: section,
    start: 'top 90%',
    end: 'bottom 10%',
    scrub: true,
    onUpdate: (self) => {
      const p = self.progress;
      const w = section.offsetWidth;
      const planeW = flyEl.offsetWidth;
      const startX = -planeW;
      const endX = w;
      const x = startX + p * (endX - startX);
      const bob = Math.sin(p * Math.PI * 3) * 10;
      flyEl.style.left = x + 'px';
      flyEl.style.transform = 'translateY(calc(-50% + ' + bob + 'px)) rotate(-4deg)';
      flyEl.style.opacity = p > 0.8 ? Math.max(0, 1 - (p - 0.8) / 0.15) : 1;
    }
  });
})();

/* ===== MUSIC — six cues, each tied to a specific image reaching screen centre ===== */
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

/* ===== SFX TRIGGERS — each fires when its own element is visible ===== */
const sfxFired = new WeakSet();

function fireSfxOnce(el, file, vol, opts){
  opts = opts || {};
  ScrollTrigger.create({
    trigger: el, start: 'top 90%', once:true,
    onEnter: ()=>{
      if(sfxFired.has(el)) return;
      sfxFired.add(el);
      AudioEngine.playSfx(file, vol, opts.rate);
      if(opts.then){
        setTimeout(()=> AudioEngine.playSfx(opts.then.file, opts.then.vol, opts.then.rate), opts.then.delay||250);
      }
    }
  });
}

// Wire SFX — trigger on the first visible child, not the section
document.querySelectorAll('[data-sfxwire]').forEach(el => {
  const cfg = JSON.parse(el.dataset.sfxwire);
  if(cfg.file){
    const triggerEl = el.querySelector('.pop, .panel, .bubble, .badge, figure') || el;
    fireSfxOnce(triggerEl, cfg.file, AudioEngine.db(cfg.db||-4), {
      rate: cfg.rate,
      then: cfg.then ? {file:cfg.then.file, vol:AudioEngine.db(cfg.then.db||-4), delay:cfg.then.delay, rate:cfg.then.rate} : null
    });
  }
});

// Additional (second) chained SFX — the reference `then` supports only one,
// so beats that want a second one-shot declare data-sfxadd (docs/05: beat 10 dust bloom)
document.querySelectorAll('[data-sfxadd]').forEach(el => {
  const cfg = JSON.parse(el.dataset.sfxadd);
  if(!cfg.file) return;
  const triggerEl = el.querySelector('.pop, .panel, .bubble, figure') || el;
  ScrollTrigger.create({
    trigger: triggerEl, start:'top 90%', once:true,
    onEnter: ()=> setTimeout(
      ()=> AudioEngine.playSfx(cfg.file, AudioEngine.db(cfg.db||-4), cfg.rate), cfg.delay||0)
  });
});

// Cascade ticks — beat 18. Point at rebar_tie: a pen tick as milestones stack up.
document.querySelectorAll('#cascade [data-cds]').forEach((el, i) => {
  ScrollTrigger.create({
    trigger: el, start:'top 90%', once:true,
    onEnter: ()=>{
      if(sfxFired.has(el)) return;
      sfxFired.add(el);
      setTimeout(()=> AudioEngine.playSfx('rebar_tie.mp3', AudioEngine.db(-6), 1 + i*0.125), i*140);
    }
  });
});

/* ===== AMBIENT LOOP BEDS — max 2 concurrent, enforced inside startBed ===== */
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

/* ===== MOBILE: unlock Howler audio context on first touch ===== */
(function(){
  function unlock(){
    if(Howler.ctx && Howler.ctx.state === 'suspended') Howler.ctx.resume();
    document.removeEventListener('touchstart', unlock);
    document.removeEventListener('touchend', unlock);
  }
  document.addEventListener('touchstart', unlock, {passive:true});
  document.addEventListener('touchend', unlock, {passive:true});
})();

/* ===== DETERRENTS — casual-copy protection ===== */
const DETERRENTS = true;
const DEVTOOLS_DETECT = false;

if(DETERRENTS){
  /* 1. Right-click / drag / save on MEDIA ONLY */
  document.querySelectorAll('.panel img, .cutout img, .flyer img').forEach(img => {
    img.addEventListener('contextmenu', e => e.preventDefault());
    img.addEventListener('dragstart', e => e.preventDefault());
    img.style.webkitUserSelect = 'none';
    img.style.userSelect = 'none';
    img.setAttribute('draggable', 'false');
  });

  /* 2. Block common DevTools/save shortcuts */
  addEventListener('keydown', e => {
    if(!DETERRENTS) return;
    const k = e.key.toLowerCase();
    const block =
      e.key === 'F12' ||
      ((e.ctrlKey||e.metaKey) && e.shiftKey && ['i','j','c'].includes(k)) ||
      ((e.ctrlKey||e.metaKey) && ['u','s'].includes(k));
    if(block){ e.preventDefault(); return false; }
  });

  /* 3. DevTools-open detection — OFF by default */
  if(DEVTOOLS_DETECT){
    let open = false;
    const threshold = 170;
    setInterval(() => {
      const w = window.outerWidth - window.innerWidth;
      const h = window.outerHeight - window.innerHeight;
      const now = w > threshold || h > threshold;
      if(now && !open){ open = true; document.body.classList.add('inspect-blur'); }
      if(!now && open){ open = false; document.body.classList.remove('inspect-blur'); }
    }, 1000);
  }
}
