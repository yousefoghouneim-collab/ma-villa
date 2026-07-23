/* ========== Audio Engine (Howler.js) ========== */
/* Architecture unchanged from the reference: Music (one at a time, crossfaded),
   SFX (one-shots from a cache), Beds (looping ambience, max 2 concurrent). */
const AudioEngine = (function(){
  let soundOn = false;
  let currentMusicKey = null;
  let currentHowl = null;
  let currentSoundId = null;

  function db(d){ return Math.pow(10, d/20); }

  const musicVol = db(-3) * 0.75;

  /* Music: six cues, each loops until switched */
  const musicHowls = {
    intro:  new Howl({ src:['audio/music/intro.mp3'],  loop:true, volume:musicVol, preload:true }),
    demo:   new Howl({ src:['audio/music/demo.mp3'],   loop:true, volume:musicVol, preload:true }),
    build:  new Howl({ src:['audio/music/build.mp3'],  loop:true, volume:musicVol, preload:true }),
    rise:   new Howl({ src:['audio/music/rise.mp3'],   loop:true, volume:musicVol, preload:true }),
    breath: new Howl({ src:['audio/music/breath.mp3'], loop:true, volume:musicVol, preload:true }),
    finale: new Howl({ src:['audio/music/finale.mp3'], loop:true, volume:musicVol, preload:true })
  };

  /* SFX cache */
  const sfxCache = {};
  function getSfx(file){
    if(!sfxCache[file]){
      sfxCache[file] = new Howl({
        src: ['audio/sfx/' + file],
        volume: 0.7,
        preload: true
      });
    }
    return sfxCache[file];
  }

  function playMusic(key, fadeMs){
    if(!soundOn) return;
    fadeMs = fadeMs || 1500;

    // Same track already playing — skip
    if(currentMusicKey === key && currentHowl && currentHowl.playing(currentSoundId)) return;

    console.log('[MUSIC] switching to', key);

    // Stop old track with fade
    if(currentHowl){
      const oldH = currentHowl;
      const oldId = currentSoundId;
      oldH.fade(musicVol, 0, fadeMs, oldId);
      setTimeout(()=>{ oldH.stop(oldId); }, fadeMs + 100);
    }

    // Play new track
    const h = musicHowls[key];
    if(!h) return;
    const id = h.play();
    h.volume(0, id);
    h.fade(0, musicVol, fadeMs, id);

    currentHowl = h;
    currentSoundId = id;
    currentMusicKey = key;
  }

  function fadeOut(duration){
    duration = duration || 3000;
    if(!currentHowl) return;
    console.log('[MUSIC] fade out');
    const h = currentHowl, id = currentSoundId;
    h.fade(musicVol, 0, duration, id);
    setTimeout(()=>{ h.stop(id); }, duration + 100);
    currentHowl = null;
    currentSoundId = null;
    currentMusicKey = null;
  }

  function hardStop(){
    if(!currentHowl) return;
    currentHowl.stop(currentSoundId);
    currentHowl = null;
    currentSoundId = null;
    currentMusicKey = null;
  }

  /* SFX — quieter than the reference: no upward doubling, and a lower
     ceiling so no one-shot can ever hit full volume and jump out of the mix. */
  function playSfx(file, vol, rate){
    if(!soundOn) return;
    const h = getSfx(file);
    const id = h.play();
    h.volume(Math.min((vol || 0.5) * 0.8, 0.5), id);
    if(rate) h.rate(rate, id);
  }

  /* Ambient beds */
  const activeBeds = [];
  function startBed(file, vol){
    if(!soundOn) return null;
    const h = getSfx(file);
    const id = h.play();
    h.volume(0, id);
    h.fade(0, Math.min((vol || 0.15) * 1.5, 0.8), 300, id);
    h.loop(true, id);
    const bed = {howl:h, id:id};
    activeBeds.push(bed);
    if(activeBeds.length > 2){
      const oldest = activeBeds.shift();
      oldest.howl.fade(oldest.howl.volume(oldest.id), 0, 300, oldest.id);
      setTimeout(()=>{ oldest.howl.stop(oldest.id); }, 350);
    }
    return bed;
  }
  function stopBed(bed){
    if(!bed) return;
    bed.howl.fade(bed.howl.volume(bed.id), 0, 300, bed.id);
    setTimeout(()=>{ bed.howl.stop(bed.id); }, 350);
    const idx = activeBeds.indexOf(bed);
    if(idx > -1) activeBeds.splice(idx, 1);
  }

  return {
    start(withSound){
      soundOn = withSound;
      if(soundOn) playMusic('intro', 1200);
      return soundOn;
    },
    toggle(){
      soundOn = !soundOn;
      Howler.volume(soundOn ? 0.9 : 0);
      return soundOn;
    },
    mute(){ soundOn = false; Howler.volume(0); },
    isOn(){ return soundOn; },
    playMusic, hardStop, fadeOut, playSfx, startBed, stopBed, db
  };
})();
