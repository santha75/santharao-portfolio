/* ============================================================
   Hero (portrait variant) + section guide.

   Four jobs, in order:
     1. Word-by-word headline reveal, and the outlined third line
        that fills in as the reader scrolls or hovers.
     2. Pointer depth on the portrait stage — tilt, drifting cursor
        tags, grid lines that light up around the cursor — and the
        "pick a path" notes.
     3. The continuity element: past a certain scroll depth the
        portrait leaves its frame as a fixed clone, arcs across the
        page and docks into the guide's avatar at the bottom right.
     4. The section guide itself — open/close, current section,
        page-progress ring.
   Everything degrades: no fine pointer = no tilt/spotlight; reduced
   motion = static headline, no flight, guide simply appears once the
   hero has scrolled away.
   ============================================================ */
(function(){
  'use strict';
  const hero=document.querySelector('.hero[data-hero="portrait"]');
  if(!hero) return;
  const reduced=matchMedia('(prefers-reduced-motion:reduce)');
  const fine=matchMedia('(hover:hover) and (pointer:fine)');
  const simpleMotion=matchMedia('(max-width:860px), (hover:none)');
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const lerp=(a,b,t)=>a+(b-a)*t;
  const HDR=68;

  /* ---------- 1. headline ---------- */
  const title=document.getElementById('heroTitle');
  const outlineWords=title?[...title.querySelectorAll('.hl-outline .hw>span')]:[];
  // split every non-flip word into characters (each carries its own beat)
  if(title){
    title.querySelectorAll('.hw:not(.hw-flip)>span').forEach(word=>{
      const chars=[...word.textContent];
      word.textContent='';
      chars.forEach((ch,i)=>{
        const c=document.createElement('i');
        c.className='hc'; c.style.setProperty('--c',i); c.textContent=ch;
        word.appendChild(c);
      });
      word.classList.add('is-split');
    });
  }
  let started=false;
  function start(){
    if(started) return; started=true;
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      hero.classList.add('is-in');
      setTimeout(()=>hero.classList.add('is-set'),3200);
    }));
  }
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(start);
  setTimeout(start,700);

  const copy=hero.querySelector('.hero-copy');
  function fillOutline(){
    const p=clamp(window.scrollY/300,0,1);
    const n=outlineWords.length||1;
    outlineWords.forEach((w,i)=>{
      const f=clamp((p-i/n)*n,0,1);
      w.style.setProperty('--fill',(f*100).toFixed(1)+'%');
    });
    if(copy && !reduced.matches) copy.style.setProperty('--copy-y',(window.scrollY*.12).toFixed(1)+'px');
  }

  /* ---------- 1b. the numbers ---------- */
  // Outlined numerals count up once the row is on screen and the intro loader
  // is gone, then ink in (.is-inked). Hovering one replays it.
  (function(){
    const read=document.getElementById('heroRead');
    if(!read) return;
    const figs=[...read.querySelectorAll('[data-count]')].map(el=>({
      el,cell:el.closest('.hs'),end:parseInt(el.dataset.count,10),pad:parseInt(el.dataset.pad||'0',10),text:el.textContent,raf:0
    }));
    function run(f,dur,delay){
      cancelAnimationFrame(f.raf);
      if(reduced.matches){ f.el.textContent=f.text; f.cell.classList.add('is-inked'); return; }
      f.cell.classList.remove('is-inked');
      const t0=performance.now()+delay;
      f.el.textContent=String(0).padStart(f.pad,'0');
      const frame=now=>{
        const p=clamp((now-t0)/dur,0,1), e=1-Math.pow(1-p,3);
        f.el.textContent=String(Math.round(e*f.end)).padStart(f.pad,'0');
        if(p<1) f.raf=requestAnimationFrame(frame);
        else{ f.el.textContent=f.text; f.cell.classList.add('is-inked'); }
      };
      f.raf=requestAnimationFrame(frame);
    }
    let live=false;
    function go(){
      if(live) return; live=true;
      // hold each figure's final width (fonts are in by now) so nothing shuffles while it runs
      figs.forEach(f=>{ f.el.style.display='inline-block'; f.el.style.minWidth=f.el.getBoundingClientRect().width.toFixed(1)+'px'; });
      figs.forEach((f,i)=>run(f,1200,200+i*140));
    }
    function arm(){
      if(!('IntersectionObserver' in window)){ go(); return; }
      const io=new IntersectionObserver(es=>{ if(es.some(e=>e.isIntersecting)){ io.disconnect(); go(); } },{threshold:.35});
      io.observe(read);
    }
    const loaderUp=document.getElementById('pageLoader');
    if(!loaderUp || loaderUp.classList.contains('done')) arm();
    else{
      let armed=false;
      const once=()=>{ if(armed) return; armed=true; arm(); };
      window.addEventListener('pl:done',once,{once:true});
      setTimeout(once,9000);
    }
    if(fine.matches) figs.forEach(f=>f.cell.addEventListener('pointerenter',()=>{ if(live) run(f,650,0); }));
  })();

  /* ---------- 2. pointer depth ---------- */
  const stage=hero.querySelector('.portrait-stage');
  const grid=hero.querySelector('.hero-grid');
  const tags=[...hero.querySelectorAll('.cursor-tag,.portrait-stamp')];
  if(fine.matches && !reduced.matches){
    let raf=0,last=null;
    function apply(){
      raf=0; const e=last; if(!e) return;
      const r=hero.getBoundingClientRect();
      const nx=(e.clientX-r.left)/r.width-.5, ny=(e.clientY-r.top)/r.height-.5;
      if(stage){
        stage.style.setProperty('--portrait-y',(nx*9).toFixed(2)+'deg');
        stage.style.setProperty('--portrait-x',(-ny*7).toFixed(2)+'deg');
      }
      tags.forEach((t,i)=>{
        const k=i%2?-14:18;
        t.style.setProperty('--px',(nx*k).toFixed(1)+'px');
        t.style.setProperty('--py',(ny*k).toFixed(1)+'px');
      });
      if(grid){
        grid.style.setProperty('--gx',(e.clientX-r.left).toFixed(0)+'px');
        grid.style.setProperty('--gy',(e.clientY-r.top).toFixed(0)+'px');
      }
    }
    hero.addEventListener('pointermove',e=>{ last=e; if(!raf) raf=requestAnimationFrame(apply); },{passive:true});
    hero.addEventListener('pointerleave',()=>{
      if(stage){ stage.style.removeProperty('--portrait-y'); stage.style.removeProperty('--portrait-x'); }
      tags.forEach(t=>{ t.style.removeProperty('--px'); t.style.removeProperty('--py'); });
      if(grid){ grid.style.removeProperty('--gx'); grid.style.removeProperty('--gy'); }
    });
  }
  // "pick a path": each card previews where it goes
  const note=document.getElementById('portraitNote');
  if(note){
    const idle=note.textContent;
    hero.querySelectorAll('.portrait-paths a[data-portrait-note]').forEach(a=>{
      const show=()=>{ note.textContent=a.dataset.portraitNote; };
      const hide=()=>{ note.textContent=idle; };
      a.addEventListener('pointerenter',show); a.addEventListener('focus',show);
      a.addEventListener('pointerleave',hide); a.addEventListener('blur',hide);
    });
  }

  /* ---------- 3 + 4. flight and guide ---------- */
  const guide=document.getElementById('sectionGuide');
  const photo=hero.querySelector('.portrait-photo');
  const avatar=guide?guide.querySelector('.guide-avatar img'):null;
  let flight=null, shown=false, landed=false;
  if(guide){
    guide.hidden=false;
    guide.classList.add('is-hidden');
  }
  function showGuide(on){
    if(!guide || on===shown) return;
    shown=on;
    guide.classList.toggle('is-hidden',!on);
    if(on && !landed && !reduced.matches){ landed=true; guide.classList.add('is-landed'); }
    if(!on) guide.classList.remove('is-landed'), landed=false;
  }
  function buildFlight(){
    if(flight || !photo) return;
    flight=document.createElement('div');
    flight.className='portrait-flight';
    flight.setAttribute('aria-hidden','true');
    const img=photo.querySelector('img'); if(img) flight.appendChild(img.cloneNode());
    const cap=photo.querySelector('.portrait-caption'); if(cap) flight.appendChild(cap.cloneNode(true));
    document.body.appendChild(flight);
  }
  let m=null;   // measured geometry, refreshed on resize
  function measure(){
    if(!photo || !avatar) return;
    // the guide is measured in its resting pose, not the shrunken hidden one
    const prevT=guide.style.transform, prevTr=guide.style.transition;
    guide.style.transition='none'; guide.style.transform='none';
    const ar=avatar.getBoundingClientRect();
    guide.style.transform=prevT; guide.style.transition=prevTr;
    // the pill is measured at rest too: it pops in from scale(0) and widens on hover
    const prevP=photo.style.cssText;
    photo.style.cssText+=';transition:none!important;transform:none!important;width:auto';
    photo.style.width='';
    const pr=photo.getBoundingClientRect();
    photo.style.cssText=prevP;
    const hr=hero.getBoundingClientRect();
    const vh=window.innerHeight, y=window.scrollY;
    const photoTop=pr.top+y, heroBottom=hr.bottom+y;
    // lift-off once the pill is about to slide under the header, never before
    // the hero is a third scrolled; landing as the hero's bottom edge passes
    const s0=Math.max(0, Math.min(heroBottom*.3, photoTop-HDR-40));
    const s1=Math.max(s0+320, heroBottom-HDR);
    const cs=getComputedStyle(photo);
    m={
      s0,s1,
      left:pr.left, top:photoTop, w:pr.width, h:pr.height,
      rTop:parseFloat(cs.borderTopLeftRadius)||pr.width/2,
      rBot:parseFloat(cs.borderBottomLeftRadius)||24,
      ax:ar.left, ay:ar.top, aw:ar.width||42, ah:ar.height||42,
    };
  }
  const easeIO=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
  function fly(){
    if(!m) return;
    const y=window.scrollY;
    const p=clamp((y-m.s0)/(m.s1-m.s0),0,1);
    if(reduced.matches || simpleMotion.matches){
      hero.classList.remove('is-flying');
      if(flight) flight.classList.remove('is-on');
      showGuide(p>=1);
      return;
    }
    if(p<=0){
      hero.classList.remove('is-flying');
      if(flight) flight.classList.remove('is-on');
      showGuide(false);
      return;
    }
    if(p>=1){
      hero.classList.add('is-flying');
      if(flight) flight.classList.remove('is-on');
      showGuide(true);
      return;
    }
    buildFlight();
    hero.classList.add('is-flying');
    showGuide(false);
    flight.classList.add('is-on');
    // Two-leg path so the tile never crosses the reading column: it slides
    // sideways into the right margin while shrinking to avatar size, then
    // rides down that margin to the guide. Rotation levels out on leg one.
    const easeOut=t=>1-Math.pow(1-t,3);
    const ex=easeOut(clamp(p/.38,0,1));                       // leg 1: x + size + tilt
    const ey=easeIO(clamp((p-.25)/.75,0,1));                  // leg 2: y
    const es=easeOut(clamp(p/.5,0,1));
    const w=lerp(m.w,m.aw,es), h=lerp(m.h,m.ah,es);
    const left=lerp(m.left,m.ax,ex)-(w-lerp(m.w,m.aw,ex))/2;
    // never slide under the header: hold just below it until leg two takes over
    const top=Math.max(HDR+14, lerp(m.top-y,m.ay,ey)-(h-lerp(m.h,m.ah,ey))/2);
    const r0=Math.min(m.rTop,m.w/2,m.h/2), r1=Math.min(m.rBot,m.w/2,m.h/2);
    const rt=lerp(r0,w/2,es), rb=lerp(r1,w/2,es);
    const rot=lerp(-6,0,ex);
    flight.style.width=w.toFixed(1)+'px'; flight.style.height=h.toFixed(1)+'px';
    flight.style.transform='translate3d('+left.toFixed(1)+'px,'+top.toFixed(1)+'px,0) rotate('+rot.toFixed(2)+'deg)';
    flight.style.borderRadius=rt.toFixed(1)+'px '+rt.toFixed(1)+'px '+rb.toFixed(1)+'px '+rb.toFixed(1)+'px';
    flight.style.setProperty('--cap',clamp(1-p*2.2,0,1).toFixed(3));
    flight.style.setProperty('--cs',(w/m.w).toFixed(3));
  }

  // guide: open/close, current section, progress ring
  if(guide){
    const toggle=document.getElementById('guideToggle');
    const panel=document.getElementById('guidePanel');
    const close=guide.querySelector('.guide-close');
    const current=document.getElementById('guideCurrent');
    const links=[...guide.querySelectorAll('.guide-links a')];
    const setOpen=on=>{
      if(!toggle || !panel) return;
      panel.hidden=!on;
      toggle.setAttribute('aria-expanded',String(on));
      if(on) (links.find(a=>a.getAttribute('aria-current'))||links[0]||toggle).focus();
    };
    if(toggle) toggle.addEventListener('click',()=>setOpen(panel.hidden));
    if(close) close.addEventListener('click',()=>{ setOpen(false); toggle && toggle.focus(); });
    document.addEventListener('keydown',e=>{ if(e.key==='Escape' && panel && !panel.hidden){ setOpen(false); toggle && toggle.focus(); } });
    document.addEventListener('click',e=>{ if(panel && !panel.hidden && !guide.contains(e.target)) setOpen(false); });
    links.forEach(a=>a.addEventListener('click',()=>setOpen(false)));

    // current section = the guide link whose target was last to cross the reading line
    const targets=links.map(a=>document.querySelector(a.getAttribute('href'))).filter(Boolean);
    const footer=document.querySelector('footer');
    function spy(){
      const line=window.innerHeight*.35;
      let best=null;
      targets.forEach(t=>{ if(t.getBoundingClientRect().top<=line) best=t; });
      links.forEach(a=>{
        const on=best && a.getAttribute('href')==='#'+best.id;
        if(on) a.setAttribute('aria-current','location'); else a.removeAttribute('aria-current');
        if(on && current) current.textContent=a.textContent.replace(/^\d+/,'').replace(/[↗]/g,'').trim();
      });
      const doc=document.documentElement;
      const prog=clamp(window.scrollY/Math.max(1,doc.scrollHeight-window.innerHeight),0,1)*100;
      guide.style.setProperty('--guide-progress',prog.toFixed(1)+'%');
      // ride up over the footer instead of sitting on its copyright line
      const lift=footer?Math.max(0,window.innerHeight-footer.getBoundingClientRect().top):0;
      guide.style.setProperty('--guide-lift',lift.toFixed(0)+'px');
    }
    window.addEventListener('scroll',spy,{passive:true});
    spy();
  }

  let ticking=false;
  function onScroll(){
    if(ticking) return; ticking=true;
    requestAnimationFrame(()=>{ ticking=false; fillOutline(); fly(); });
  }
  function onResize(){ measure(); onScroll(); }
  window.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',onResize,{passive:true});
  reduced.addEventListener('change',onResize);
  simpleMotion.addEventListener('change',onResize);
  if(document.fonts && document.fonts.ready) document.fonts.ready.then(onResize);
  const pimg=photo?photo.querySelector('img'):null;
  if(pimg && !pimg.complete) pimg.addEventListener('load',onResize,{once:true});
  window.addEventListener('load',onResize,{once:true});
  onResize();
})();
