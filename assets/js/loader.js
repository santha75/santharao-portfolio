/* ============================================================
   Intro title card.

   The identity — portrait, name, designation, positioning line,
   ownership arc — assembles once and then STAYS for the whole
   intro. Only the proof slot beneath it rotates. That's the
   difference between a long intro that's readable and one that
   cuts between screens: nothing the reader is mid-sentence on
   ever gets taken away from them.

   Plays in full on every visit, by request. There is no session
   guard — a refresh gets the whole thing again. ?nointro on the
   URL skips it while you're working on the page body.

   Dismissable at any point (Esc / Skip / click / scroll).
   ============================================================ */
(function(){
  var loader = document.getElementById('pageLoader');
  var card   = document.getElementById('plCard');
  if(!loader || !card) return;

  document.body.classList.add('pl-lock');

  var NAME = 'SANTHARAO NOWPADA';
  /* The gap is structure, not a character to decode — a scrambling space
     reads as a third word. Rendered as nbsp so the flex item keeps width. */
  function glyph(i){ return NAME[i] === ' ' ? '\u00A0' : NAME[i]; }

  /* ---------- the proof rotator ----------
     One claim per beat, each a number the reader can hold. Keep `label`
     under ~40 chars so it stays on one line on a phone. Adding or removing
     a beat automatically retimes the whole intro — see FLOOR below. */
  var BEATS = [
    { n:'−25%',   label:'design-to-dev handoff',  who:'Brightcone.ai' },
    { n:'100K+',  label:'users on the platform',  who:'RunCode.io' },
    { n:'2023',   label:'Startup of the Year',    who:'HackerNoon' },
    { n:'11+ years', label:'clinical · enterprise AI · dev platforms', who:'' },
    { n:'04',     label:'countries — clients and teams',            who:'' }
  ];

  /* Timing. The card assembles over ~2.05s:

        0.75s  portrait settled
        0.90s  name resolved out of the scramble
        1.35s  ring closes  ┐ overlapping, so the card grows into
        1.45s  role settled ┘ place rather than ticking through steps
        1.75s  quote settled
        2.05s  ownership arc lands

     LEAD then holds the finished card briefly before the first proof beat,
     so the identity registers on its own terms first.

     BEAT is the read budget per proof. Comfortable reading is ~200-250wpm;
     at 1.7s a six-word beat lands around 210wpm with time to spare. Do not
     drop this below ~1.2s — that's where beats stop being read and start
     being flicker, which is what killed the original six-beat reel.

     FLOOR is derived, not typed, so the intro can never fall out of sync
     with the beat list. */
  var LEAD  = 2600;
  var BEAT  = 1700;
  var FLOOR = LEAD + BEATS.length * BEAT;    // 5 beats -> 11.1s
  var CEILING = FLOOR + 1500;                // hard cap if an asset is slow
  var DECODE  = 900;                         // ms for the name to resolve
  var GRACE   = 1500;                        // before incidental gestures can dismiss

  /* ?nointro skips straight past — the intro is 11s and sitting through it
     on every reload while editing the page body is punishing. */
  var skipAll = /(^|[?&#])nointro(=|&|$)/.test(location.search + location.hash);
  var reduce  = window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  var instant = skipAll || reduce;

  if(instant) loader.classList.add('pl-quick');

  /* ---------- teardown ---------- */
  var srEl = document.getElementById('plSr');
  var timers = [], ended = false;
  function at(fn, ms){ timers.push(setTimeout(fn, ms)); }

  function finish(){
    if(ended) return;
    ended = true;
    timers.forEach(clearTimeout); timers.length = 0;
    loader.removeEventListener('click', dismiss);
    window.removeEventListener('keydown', onKey);
    window.removeEventListener('wheel', dismiss);
    window.removeEventListener('touchmove', dismiss);
    /* The card lifts out faster (.55s) than the veil behind it (.85s), so the
       hero is already showing through as the card clears rather than the
       whole screen dissolving as one flat sheet. */
    loader.classList.add('pl-out', 'done');
    document.body.classList.remove('pl-lock');
    if(srEl) srEl.textContent = 'Portfolio ready.';
    // main.js holds the hero globe until this fires — see createNightGlobe calls
    window.dispatchEvent(new CustomEvent('pl:done'));
    setTimeout(function(){ if(loader.parentNode) loader.parentNode.removeChild(loader); }, 900);
  }

  /* ---------- dismiss ----------
     Deliberate exits — Esc, or the Skip button — always work, instantly, and
     at this length that matters more than usual. Incidental ones are held
     until the card has assembled, so a trackpad's inertial scroll can't kill
     the intro in the first 200ms. */
  var armed = false;
  function dismiss(){ if(armed) finish(); }
  function onKey(e){ if(e.key==='Escape'||e.key==='Enter'||e.key===' '||e.key==='Spacebar') finish(); }

  var skipBtn = document.getElementById('plSkip');
  if(skipBtn) skipBtn.addEventListener('click', finish);  // also bubbles to loader; finish() is idempotent
  loader.addEventListener('click', dismiss);
  window.addEventListener('keydown', onKey);
  window.addEventListener('wheel', dismiss, {passive:true});
  window.addEventListener('touchmove', dismiss, {passive:true});
  at(function(){ armed = true; }, GRACE);

  /* ---------- the card ---------- */
  if(srEl) srEl.textContent = 'Loading portfolio.';
  loader.classList.add('act-card');
  card.classList.add('on');

  var host = document.getElementById('plName');
  var out  = NAME.split('').map(function(ch){
    var s = document.createElement('span');
    s.textContent = ch === ' ' ? '\u00A0' : '_';
    host.appendChild(s); return s;
  });

  if(instant){
    out.forEach(function(s,i){ s.textContent = glyph(i); if(NAME[i] !== ' ') s.className = 'on'; });
    at(finish, 400);
    return;
  }

  var caret = document.createElement('span');
  caret.className = 'pl-caret'; caret.textContent = '|'; host.appendChild(caret);

  /* Driven by elapsed time, not tick count, so a busy main thread makes the
     decode coarser rather than longer — it always lands in DECODE ms. */
  var pool = 'ABCDEFGHJKLMNPQRSTUVWXYZ#/><*+'.split('');
  var d0 = Date.now();
  (function tick(){
    if(ended) return;
    var p = Math.min(1, (Date.now()-d0)/DECODE);
    var resolved = Math.round(p*out.length);
    out.forEach(function(s,i){
      if(NAME[i] === ' ') return;
      if(i<resolved){ s.textContent = NAME[i]; s.className = 'on'; }
      else{ s.textContent = pool[(Math.random()*pool.length)|0]; s.className = ''; }
    });
    if(p>=1) return;
    at(tick, 55);
  })();

  /* ---------- build + run the proof beats ----------
     Built up front and cross-faded by class, so nothing is constructed on
     the frame it needs to animate. */
  var slot = document.getElementById('plBeats');
  var beatEls = BEATS.map(function(b){
    var el = document.createElement('div');
    el.className = 'pl-beat';
    el.innerHTML = '<span class="pl-beat-n">' + b.n + '</span>'
                 + '<span class="pl-beat-l">' + b.label
                 + (b.who ? ' <b>' + b.who + '</b>' : '') + '</span>';
    if(slot) slot.appendChild(el);
    return el;
  });

  var stepEl = document.getElementById('plStep');
  var fillEl = document.getElementById('plFill');
  var railEl = document.getElementById('plRail');
  var totEl  = document.getElementById('plTotal');
  function pad(n){ return (n<10?'0':'') + n; }
  if(totEl) totEl.textContent = pad(BEATS.length);
  /* The fill crosses one beat's worth of track per beat, linearly, so it
     reads as continuous travel rather than five jumps. */
  if(fillEl) fillEl.style.transitionDuration = BEAT + 'ms';
  if(railEl) at(function(){ railEl.classList.add('on'); }, 2300);

  beatEls.forEach(function(el, i){
    at(function(){
      if(i) beatEls[i-1].className = 'pl-beat out';
      el.className = 'pl-beat in';
      if(stepEl) stepEl.textContent = pad(i+1);
      if(fillEl) fillEl.style.width = ((i+1)/BEATS.length*100).toFixed(1) + '%';
      if(srEl)   srEl.textContent = BEATS[i].n + ' ' + BEATS[i].label;
    }, LEAD + i*BEAT);
  });

  /* ---------- hold on what's actually loading ----------
     The card is set in the display face and ends on the portrait; those are
     the two things worth waiting for. Everything else arrives behind it.
     In practice FLOOR dominates at this length — this only matters on a
     genuinely slow connection. */
  var t0 = Date.now();
  function ready(){
    var jobs = [];
    if(document.fonts && document.fonts.ready) jobs.push(document.fonts.ready);
    var img = card.querySelector('.pl-portrait img');
    if(img && !img.complete){
      jobs.push(new Promise(function(res){
        img.addEventListener('load',  res, {once:true});
        img.addEventListener('error', res, {once:true});   // a missing portrait must not hold the page
      }));
    }
    return jobs.length ? Promise.all(jobs) : Promise.resolve();
  }

  function leave(){ at(finish, Math.max(0, FLOOR - (Date.now()-t0))); }
  ready().then(leave, leave);

  at(finish, CEILING);   // safety net — never let it stick
})();
