  // sticky nav state
  const hdr=document.getElementById('hdr');
  const onScroll=()=>hdr.classList.toggle('scrolled',window.scrollY>24);
  onScroll();window.addEventListener('scroll',onScroll,{passive:true});

  // scroll reveal
  const io=new IntersectionObserver((entries)=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});
  },{threshold:0.12,rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.reveal').forEach((el,i)=>{
    el.style.transitionDelay=(Math.min(i%6,5)*55)+'ms';
    io.observe(el);
  });

  /* ---------- FEEDBACK — night flight scene ---------- */
  (function(){
    const root=document.getElementById('af'); if(!root) return;
    const winRow=root.querySelector('.af-windows');
    const coRail=root.querySelector('.af-corail');
    const qtext=root.querySelector('.af-qtext');
    const qwho=root.querySelector('.af-who');
    const qrole=root.querySelector('.af-role');
    const qli=root.querySelector('.af-li');
    const barFill=root.querySelector('.af-st-bar i');
    const barPlane=root.querySelector('.af-st-plane');

    /* ===================================================================
       EDIT ME — real, permissioned testimonials. Wrap a phrase in <b>...</b>
       to accent it in lime. `logo` is the company mark and `photo` is the
       passenger's real headshot — every entry must have one; there is no
       illustrated fallback, so a broken path leaves an empty window.

       STATUS: names, titles, companies, photos and LinkedIn URLs are REAL.
       Every QUOTE is a DRAFT written here — nobody has said these words yet.
       Get each person's sign-off before this goes live; don't publish an
       attributed quote the person hasn't approved.

       `photoPos` is an optional per-headshot object-position override (the
       window shows the top ~76% of a square photo, which suits a normal
       head-and-shoulders crop; set it when a photo is framed differently).
       =================================================================== */
    const TESTIMONIALS=[
      { quote:'Eleven years, and I never once had to explain the business problem twice. Santharao took PieTrack from a pile of modules to a product — one system our engineers could build against and our customers could actually learn — then did it again on RunCode, for <b>100,000+ developers</b>. He trained every designer we hired, and the standard he set outlasted him.',
        name:'Aswani Kumar', role:'Founder & CEO', company:'MicroPyramid \u00b7 RunCode.io',
        li:'https://www.linkedin.com/in/ashwin1231/',
        photo:'assets/img/people/aswani-kumar.png',
        logo:'<svg class="lg" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 1.5l4.5 9h-9zM3.7 7h4.6"/></svg>' },
      { quote:'He gave our AI product a spine. Santharao turned a tangle of agent workflows into dashboards enterprise buyers actually trust — and built the design system underneath, so three verticals shipped without three redesigns. He <b>cut our design-to-dev handoff by about a quarter</b>.',
        name:'Naresh Vemparala', role:'Co-Founder & COO', company:'Brightcone.ai', li:'https://www.linkedin.com/in/naresh-vemparala/',
        photo:'assets/img/people/naresh.png',
        logo:'<svg class="lg" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 1.5l4.5 9h-9z"/></svg>' },
      { quote:'In clinical decision support the interface has to earn a pharmacist\'s trust before the model does. He got Formulary IQ\'s savings analysis down to something a committee could act on in one screen — then handed it over as <b>production HTML/CSS across three breakpoints</b>.',
        name:'Tulasee Rao Chintha', role:'CTO & Co-Founder', company:'InpharmD \u00b7 Yanthraa', li:'https://www.linkedin.com/in/tulaseeraochintha/',
        photo:'assets/img/people/tulasee.png',
        logo:'<svg class="lg" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 1.5v9M1.5 6h9"/></svg>' },
      { quote:'Worked across our US and India teams like the timezones didn\'t exist. He took R-Clinic\'s consultation flow apart and put it back together so clinicians and patients each got a view that made sense — then did the same for RedRiver One. <b>Senior, calm, and invested in outcomes</b> rather than pixels.',
        name:'Balaji Krishnammagaru', role:'Founder', company:'MedOnGo \u00b7 TECLEVER \u00b7 Jansankalp', li:'https://www.linkedin.com/in/krishnammagaru/',
        photo:'assets/img/people/balaji.png', photoPos:'center 50%',
        logo:'<svg class="lg" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 1l5 5-5 5-5-5z"/></svg>' },
      { quote:'A rare designer who hands an engineer validated, production HTML/CSS. On InnPro he\'d already caught the edge cases in the browser — three role-scoped apps, <b>80+ screens, and almost nothing bounced back</b> in review.',
        name:'Srikanth Polineni', role:'Founder', company:'InnPro', li:'https://www.linkedin.com/in/srikanthpolineni/',
        photo:'assets/img/people/srikanth.png',
        logo:'<svg class="lg" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M1 10l5-8 5 8"/></svg>' }
    ];

    const REDUCE=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    const HOLD=5200;
    const LI='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.3c0-1.27-.02-2.9-1.77-2.9-1.77 0-2.04 1.38-2.04 2.8V21h-4z"/></svg>';

    const wins=[], cos=[];
    TESTIMONIALS.forEach((d,i)=>{
      const b=document.createElement('button');
      b.className='af-win'; b.type='button'; b.setAttribute('role','tab'); b.setAttribute('aria-selected','false');
      b.setAttribute('aria-label', d.name+' \u2014 '+d.role+', '+d.company);
      b.innerHTML='<span class="af-port"><span class="af-dotup"></span>'+
                  (d.photo?'<img class="af-photo" src="'+d.photo+'" alt="" loading="lazy" decoding="async"'+(d.photoPos?' style="--photo-pos:'+d.photoPos+'"':'')+' onerror="this.remove()">':'')+'</span>'+
                  '<span class="af-rolelab"><i></i>'+d.role+'</span>';
      b.addEventListener('click',()=>go(i));
      winRow.appendChild(b); wins.push(b);

      if(i){ const s=document.createElement('span'); s.className='af-sep'; s.setAttribute('aria-hidden','true'); s.textContent='\u2022'; coRail.appendChild(s); }
      const c=document.createElement('button');
      c.className='af-co'; c.type='button'; c.setAttribute('role','tab'); c.setAttribute('aria-selected','false');
      c.innerHTML=d.logo+d.company;
      c.addEventListener('click',()=>go(i));
      coRail.appendChild(c); cos.push(c);
    });

    let idx=-1, visible=false, paused=false, timer=null, swapT=null;

    function paint(i){
      const d=TESTIMONIALS[i];
      qtext.innerHTML=d.quote;
      qwho.textContent=d.name;
      qrole.textContent=d.role+' \u00b7 '+d.company;
      if(d.li){ qli.style.display=''; qli.href=d.li; qli.innerHTML=LI+' LinkedIn'; }
      else qli.style.display='none';
      wins.forEach((w,k)=>w.setAttribute('aria-selected', k===i?'true':'false'));
      cos.forEach((c,k)=>c.setAttribute('aria-selected', k===i?'true':'false'));
      const pct=((i+1)/TESTIMONIALS.length)*100;
      if(barFill) barFill.style.width=pct+'%';
      if(barPlane) barPlane.style.left=pct+'%';
    }
    function go(i){
      i=((i%TESTIMONIALS.length)+TESTIMONIALS.length)%TESTIMONIALS.length;
      if(i===idx){ schedule(); return; }
      idx=i;
      if(REDUCE){ paint(i); schedule(); return; }
      root.classList.add('is-swapping');
      clearTimeout(swapT);
      swapT=setTimeout(()=>{ paint(i); root.classList.remove('is-swapping'); }, 230);
      schedule();
    }
    function schedule(){
      clearTimeout(timer); if(REDUCE) return;
      timer=setTimeout(()=>{ (!paused && visible) ? go(idx+1) : schedule(); }, HOLD);
    }

    const pause=()=>{paused=true}; const resume=()=>{paused=false;schedule()};
    root.addEventListener('mouseenter',pause);
    root.addEventListener('mouseleave',resume);
    root.addEventListener('focusin',pause);
    root.addEventListener('focusout',resume);
    [winRow,coRail].forEach(el=>el.addEventListener('keydown',e=>{
      if(e.key==='ArrowRight'||e.key==='ArrowDown'){e.preventDefault();go(idx+1);(el===coRail?cos:wins)[idx].focus();}
      else if(e.key==='ArrowLeft'||e.key==='ArrowUp'){e.preventDefault();go(idx-1);(el===coRail?cos:wins)[idx].focus();}
    }));
    const vio=new IntersectionObserver(es=>es.forEach(en=>{
      visible=en.isIntersecting; if(visible) schedule(); else clearTimeout(timer);
    }),{threshold:.25});
    vio.observe(root);
    document.addEventListener('visibilitychange',()=>{document.hidden?pause():resume();});

    idx=0; paint(0);
  })();


  /* ---------- FAQ accordion (smooth, single-open, accessible) ---------- */
  (function(){
    const items=[...document.querySelectorAll('.faq-item')];
    if(!items.length) return;
    items.forEach(item=>{
      const btn=item.querySelector('.faq-q');
      btn.addEventListener('click',()=>{
        const isOpen=item.classList.contains('open');
        items.forEach(o=>{
          o.classList.remove('open');
          o.querySelector('.faq-q').setAttribute('aria-expanded','false');
        });
        if(!isOpen){
          item.classList.add('open');
          btn.setAttribute('aria-expanded','true');
        }
      });
    });
  })();

  /* ---------- WORK: layered stacking depth (soft dim, minimal shrink) ---------- */
  (function(){
    const stack=document.getElementById('workstack'); if(!stack) return;
    const cards=[...stack.querySelectorAll('.wcard')]; if(!cards.length) return;
    if(window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    const clip=(v,a,b)=>v<a?a:v>b?b:v;
    let wtop=104, wstep=13;
    function readVars(){
      const cs=getComputedStyle(stack);
      wtop=parseFloat(cs.getPropertyValue('--wtop'))||104;
      wstep=parseFloat(cs.getPropertyValue('--wstep'))||13;
    }
    let ticking=false;
    function update(){
      ticking=false;
      const vh=window.innerHeight;
      for(let i=0;i<cards.length;i++){
        /* depth = how buried this card is under the cards stacked on top of it */
        let depth=0;
        for(let j=i+1;j<cards.length;j++){
          const nr=cards[j].getBoundingClientRect();
          const jStick=wtop + j*wstep;
          const cov=clip((vh - nr.top)/(vh - jStick), 0, 1);
          depth+=cov;
          if(cov<1) break;
        }
        const d=Math.min(depth,2.4);
        if(d>0.001){
          /* gentle: cards keep their size (~2.5% max), depth reads via dim + peek */
          const scale=(1 - d*0.011).toFixed(4);
          const bright=(1 - Math.min(d*0.075,0.28)).toFixed(3);
          cards[i].style.transform='scale('+scale+')';
          cards[i].style.filter='brightness('+bright+')';
        } else {
          cards[i].style.transform='';
          cards[i].style.filter='';
        }
      }
    }
    function onScroll(){ if(!ticking){ ticking=true; requestAnimationFrame(update); } }
    readVars();
    window.addEventListener('scroll',onScroll,{passive:true});
    window.addEventListener('resize',()=>{ readVars(); update(); },{passive:true});
    update();
  })();

  /* ---------- WORK: sticky title bar — scroll-spy + click-to-scroll ---------- */
  (function(){
    const nav=document.getElementById('workNav');
    const stack=document.getElementById('workstack');
    if(!nav || !stack) return;
    const navList=nav.querySelector('.work-nav-list');
    const links=[...nav.querySelectorAll('a')];
    const cards=[...stack.querySelectorAll('.wcard')];
    if(!links.length || !cards.length) return;

    function vars(){
      const cs=getComputedStyle(stack);
      return {
        wtop:parseFloat(cs.getPropertyValue('--wtop'))||150,
        wstep:parseFloat(cs.getPropertyValue('--wstep'))||13
      };
    }

    // the bubble nub under the bar — slides to sit beneath the active title
    const tail=nav.querySelector('.work-nav-tail');
    function placeTail(){
      if(!tail) return;
      const a=links.find(l=>l.classList.contains('is-active'));
      if(!a){ tail.classList.remove('is-on'); return; }
      const nr=nav.getBoundingClientRect(), ar=a.getBoundingClientRect();
      const x=ar.left - nr.left + ar.width/2;
      // hide the nub while the active pill is scrolled out of the bar (mobile overflow)
      const inView = x > 6 && x < nr.width - 6;
      nav.style.setProperty('--tailx', x.toFixed(1)+'px');
      tail.classList.toggle('is-on', inView);
      // stem length = the live distance down to whichever card is at the front
      const front=cards[Math.max(0,current)]||cards[0];
      const gap=front.getBoundingClientRect().top - nr.bottom;
      nav.style.setProperty('--tailgap', (inView && gap>6 && gap<80 ? gap : 0).toFixed(1)+'px');
    }

    function setActive(i){
      links.forEach(a=> a.classList.toggle('is-active', a.dataset.i===String(i)));
      // only nudge the bar horizontally when it actually overflows (mobile)
      if(navList.scrollWidth > navList.clientWidth + 2){
        const a=links.find(l=>l.dataset.i===String(i));
        if(a) a.scrollIntoView({block:'nearest',inline:'center',behavior:'smooth'});
      }
      placeTail();
    }

    // Which card is at the FRONT of the deck = highest-index card whose flow-top
    // has reached its own pin line (--wtop + i*--wstep). That's the one on top.
    let ticking=false, current=-1;
    function spy(){
      ticking=false;
      const {wtop,wstep}=vars();
      const stackTop=stack.getBoundingClientRect().top; // viewport top of stack
      let cur=0;
      cards.forEach((c,i)=>{
        const cardTop=stackTop + c.offsetTop;           // flow-position viewport top
        if(cardTop <= wtop + i*wstep + 1) cur=+c.dataset.i;
      });
      if(cur!==current){ current=cur; setActive(cur); }
      placeTail();   // the stem tracks the deck every frame, not just on change
    }
    function onScroll(){ if(!ticking){ ticking=true; requestAnimationFrame(spy); } }
    window.addEventListener('scroll',onScroll,{passive:true});
    window.addEventListener('resize',()=>{ onScroll(); placeTail(); },{passive:true});
    // keep the nub glued to its pill while the bar scrolls sideways / settles
    navList.addEventListener('scroll',placeTail,{passive:true});
    if(document.fonts && document.fonts.ready) document.fonts.ready.then(placeTail);

    // click a title → glide that card to the front of the deck
    links.forEach(a=>{
      a.addEventListener('click',e=>{
        e.preventDefault();
        const card=document.querySelector(a.getAttribute('href'));
        if(!card) return;
        const {wtop,wstep}=vars();
        const i=+a.dataset.i;
        const stackDocTop=stack.getBoundingClientRect().top + window.scrollY;
        const y=stackDocTop + card.offsetTop - (wtop + i*wstep);
        window.scrollTo({top:y,behavior:'smooth'});
        current=i; setActive(i);
        history.replaceState(null,'',a.getAttribute('href'));
      });
    });

    spy();
  })();
  /* ---------- CAREER DIAL ---------- */
  (function(){
    const ARC0 = 10, ARC1 = 170, C = 320;
    const REDUCE = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

    const ERAS = [
      {name:'Micropyramid Informatics', span:'Apr 2013 — Sep 2024'},
      {name:'Independent Engagements',  span:'Oct 2024 — Dec 2024'},
      {name:'Yanthraa Information Systems', span:'Jan 2025 — Jul 2026'},
      {name:'Medongo · R-Clinic', span:'2026'}
    ];

    const CH = [
      { era:0, mark:'2013', when:'2013 — 2016',
        role:'Junior → UI Designer', co:'Micropyramid Informatics',
        thesis:'Learning the craft, then learning to engineer it.',
        pts:[
          'Started on the production floor rebuilding screens until I understood why every edge sat where it sat — and learned the habit that still defines me: if I design it, I can build it in HTML and CSS.',
          'Moved from decorating screens to leading with flows, wireframes and IA; shipped responsive front ends for HRM, project-management and e-commerce SaaS across three breakpoints.'
        ],
        tools:[['Ps','Photoshop'],['Ai','Illustrator'],['Bz','Balsamiq']],
        stack:[['H5','HTML5'],['C3','CSS3'],['Bs','Bootstrap'],['Sa','Sass'],['jQ','jQuery']] },

      { era:0, mark:'2017', when:'2017 — 2019',
        role:'Senior UI/UX Designer', co:'Micropyramid Informatics',
        thesis:'Explaining design simply made me design simply.',
        pts:[
          'Began presenting to CTOs and product owners. Any rationale I couldn\u2019t say in one sentence turned out to be a design that didn\u2019t work.',
          'Ran usability sessions and rebuilt dense enterprise dashboards around the single decision each screen exists to serve.'
        ],
        tools:[['Sk','Sketch'],['XD','Adobe XD'],['Fg','Figma'],['In','InVision']],
        stack:[['H5','HTML5'],['C3','CSS3'],['Sa','Sass'],['Bs','Bootstrap']] },

      { era:0, mark:'2020', when:'2020 — 2024',
        role:'UI Lead', co:'Micropyramid Informatics',
        thesis:'Owning the system, multiplying the team.',
        pts:[
          'Built a scalable design system and component library — design-to-development turnaround down 20%, rework down with it.',
          'Mentored 6 designers to pixel-accurate delivery across desktop and responsive breakpoints.',
          'Led UI for RunCode.io: 100,000+ users, HackerNoon Startup of the Year 2023.'
        ],
        tools:[['Fg','Figma'],['FJ','FigJam'],['Zp','Zeplin'],['Pp','Penpot']],
        stack:[['H5','HTML5'],['C3','CSS3'],['Tw','Tailwind'],['Bs','Bootstrap'],['Sa','Sass']] },

      { era:1, mark:'2024', when:'Oct 2024 — Dec 2024',
        role:'Consultant UI/UX Designer', co:'Independent engagements',
        thesis:'Design that had to survive contact with production.',
        pts:[
          'Converted Figma designs into responsive, pixel-perfect HTML/CSS for InnPro, a cloud hotel-management system — 3 modules, ~48 mobile screens.',
          'Built a Bootstrap front end for a customizable e-commerce product across 3 breakpoints.'
        ],
        tools:[['Fg','Figma']],
        stack:[['H5','HTML5'],['C3','CSS3'],['Bs','Bootstrap'],['jQ','jQuery']] },

      { era:2, mark:'2025', when:'Jan 2025 — Jul 2026',
        role:'UI/UX Designer / UI Lead', co:'Yanthraa Information Systems · part-time',
        thesis:'Making AI legible enough to act on.',
        pts:[
          'Lead end-to-end design for Brightcone.ai — automated actions, human-in-the-loop review and recommendations turned into dashboards that surface the decision in seconds.',
          'Built reusable tokens and patterns across product, marketing and sales: ~25% faster design-to-dev handoff.',
          'Partner with leadership on investor and enterprise-sales storytelling.'
        ],
        tools:[['Fg','Figma'],['FM','Figma Make'],['Pp','Penpot'],['Cl','Claude'],['AI','Google AI Studio']],
        stack:[['H5','HTML5'],['C3','CSS3'],['Tw','Tailwind']] },

      { era:3, mark:'2026', when:'2026',
        role:'Consultant', co:'R-Clinic · Medongo',
        thesis:'Care workflows, with nothing in the way.',
        pts:[
          'Refined UI/UX across consultation, pre- and post-consultation modules for a telehealth platform.',
          'Improved usability, visual consistency and workflow efficiency for patients and clinicians alike.'
        ],
        tools:[['Fg','Figma'],['Cl','Claude']],
        stack:[['H5','HTML5'],['C3','CSS3'],['Tw','Tailwind']] }
    ];

    const N = CH.length;
    const track = document.getElementById('clockTrack');
    if(!track) return;
    const wrap   = document.getElementById('dialWrap');
    const panesEl= document.getElementById('dialPanes');
    const railEl = document.getElementById('dialRail');
    const hHour  = document.getElementById('handHour');
    const hMin   = document.getElementById('handMin');
    const progEl = document.getElementById('dialProgress');

    /* ---- geometry ---- */
    const SPAN = (ARC1 - ARC0) / N;
    const slotA = i => ARC0 + SPAN * (i + 0.5);
    const pt = (r,deg)=>{const a=(deg-90)*Math.PI/180;return [C+r*Math.cos(a), C+r*Math.sin(a)];};
    const arcPath=(r,a0,a1)=>{
      const [x0,y0]=pt(r,a0),[x1,y1]=pt(r,a1);
      return `M${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 ${(a1-a0)>180?1:0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
    };
    const eraBounds = e => {
      const idx = CH.map((c,i)=>c.era===e?i:-1).filter(i=>i>=0);
      const a0 = ARC0 + SPAN*idx[0], a1 = ARC0 + SPAN*(idx[idx.length-1]+1);
      return [a0,a1,(a0+a1)/2];
    };
    const ERAGEO = ERAS.map((_,e)=>eraBounds(e));
    /* nudge the hour hand off the minute hand so both stay legible
       on eras that hold a single chapter */
    const HOFF = -4.5;

    /* ---- build dial ---- */
    const NS='http://www.w3.org/2000/svg';
    const mk=(t,at)=>{const n=document.createElementNS(NS,t);for(const k in at)n.setAttribute(k,at[k]);return n;};
    const gT=document.getElementById('dialTicks');
    for(let a=0;a<360;a+=3){
      const live = a>=ARC0-1 && a<=ARC1+1;
      const [x0,y0]=pt(live?266:272,a), [x1,y1]=pt(276,a);
      gT.appendChild(mk('line',{x1:x0,y1:y0,x2:x1,y2:y1,
        stroke:live?'rgba(255,255,255,.34)':'rgba(255,255,255,.07)','stroke-width':live?1.6:1}));
    }
    for(let i=0;i<N;i++){
      const [x0,y0]=pt(254,slotA(i)), [x1,y1]=pt(277,slotA(i));
      gT.appendChild(mk('line',{x1:x0,y1:y0,x2:x1,y2:y1,stroke:'rgba(255,255,255,.62)','stroke-width':3,'stroke-linecap':'round'}));
    }
    const gB=document.getElementById('dialBrackets');
    const brackets=ERAGEO.map(([a0,a1])=>{
      const p=mk('path',{d:arcPath(287,a0+1.4,a1-1.4),fill:'none',
        stroke:'rgba(255,255,255,.16)','stroke-width':2.5,'stroke-linecap':'round'});
      gB.appendChild(p);return p;
    });
    const gL=document.getElementById('dialLabels');
    const labels=CH.map((c,i)=>{
      const [x,y]=pt(226,slotA(i));
      const t=mk('text',{x:x,y:y+4.5,'text-anchor':'middle',fill:'var(--fg-dim)',
        'font-family':'JetBrains Mono, monospace','font-size':'13','font-weight':'500'});
      t.textContent=c.mark;gL.appendChild(t);return t;
    });

    /* ---- build panes + rail ---- */
    const chip=(a,cls)=>`<span class="mk"><b>${a[0]}</b>${a[1]}</span>`;
    panesEl.innerHTML = CH.map((c,i)=>`
      <article class="pane" id="pane-${i}">
        <div class="pane-k">
          <span class="pane-era">${c.co}</span>
          <span class="pane-idx">0${i+1}<i>&thinsp;/&thinsp;0${N}</i></span>
        </div>
        <div class="pane-head">
          <span class="pane-when">${c.when}</span>
          <h3 class="pane-role">${c.role}</h3>
        </div>
        <div class="pane-cols">
          <div class="pane-main">
            <p class="pane-thesis">${c.thesis}</p>
            <ul class="pane-list">${c.pts.map(p=>`<li>${p}</li>`).join('')}</ul>
          </div>
          <aside class="pane-side">
            <div class="kits">
              <div class="kit"><span class="kit-lbl">Toolkit</span><div class="marks">${c.tools.map(chip).join('')}</div></div>
              <div class="kit stack"><span class="kit-lbl">Build stack</span><div class="marks">${c.stack.map(chip).join('')}</div></div>
            </div>
          </aside>
        </div>
      </article>`).join('');
    const panes=[...panesEl.children];
    let paneH=null;
    const measurePanes=()=>{ paneH = panes.map(p=>p.offsetHeight||320); };

    railEl.innerHTML = CH.map((c,i)=>{
      const brk = i>0 && CH[i-1].era!==c.era ? ' newera':'';
      return `<button class="rail-dot${brk}" data-i="${i}" aria-label="${c.when} — ${c.role}"><span></span></button>`;
    }).join('');
    const dots=[...railEl.children];

    /* ---- scroll → position ---- */
    const clamp=(v,a,b)=>v<a?a:v>b?b:v;
    const isNarrow=()=>window.innerWidth<=980;

    function readPos(){
      const vh=window.innerHeight;
      if(isNarrow()){
        const r=panesEl.getBoundingClientRect();
        const denom=r.height/N;
        if(!(denom>0)) return 0;
        const p=(vh*0.46 - r.top)/denom - 0.5;
        return Number.isFinite(p)?clamp(p,0,N-1):0;
      }
      const r=track.getBoundingClientRect();
      const total=track.offsetHeight - vh;
      if(!(total>0)) return 0;                 // track shorter than viewport / not laid out yet
      const p=clamp((-r.top)/total,0,1)*(N-1);
      return Number.isFinite(p)?p:0;
    }

    let cur={m:slotA(0), h:ERAGEO[0][2], t:0}, tgt={m:slotA(0), h:ERAGEO[0][2], t:0};
    let active=-1, tick=0;

    function compute(){
      const pos=readPos();
      if(!Number.isFinite(pos)) return;                 // never index CH with NaN
      const i0=clamp(Math.floor(pos),0,N-1), i1=clamp(i0+1,0,N-1), f=pos-i0;
      tgt.m = slotA(i0) + (slotA(i1)-slotA(i0))*f;
      tgt.h = ERAGEO[CH[i0].era][2] + (ERAGEO[CH[i1].era][2]-ERAGEO[CH[i0].era][2])*f + HOFF;
      tgt.t = ARC0 + (ARC1-ARC0) * ((pos+0.5)/N);

      const idx=clamp(Math.round(pos),0,N-1);
      if(!isNarrow()){
        if(!paneH) measurePanes();
        panes.forEach((p,i)=>{
          const rel=pos-i;                    // >0 = already passed (slides up & out), <0 = upcoming (rises from below)
          let op,dy,bl,sc=1;
          if(rel>=0){                          // active / passed
            op=clamp(1-rel*1.9,0,1);
            dy=rel*-70;
            bl=Math.min(rel,1)*7;
          }else{                               // upcoming — sits fully BELOW the active card, then rises to centre
            const a=-rel;
            const t=Math.min(a,1);             // 0 (at centre) .. 1 (resting below the active card)
            const ah=(paneH&&paneH[idx])||320; // active card height
            const ph=(paneH&&paneH[i])||ah;    // this card's height
            const restDy=ah/2 + ph/2 + 20;     // fully clear of the active card (no overlap → no disturbance)
            dy=t*restDy;
            op = a<=1 ? (1-a*0.62) : Math.max(0,0.38-(a-1)*1.0);
            bl = t*5;
            sc = 1-t*0.05;
          }
          p.style.setProperty('--op', op.toFixed(3));
          p.style.setProperty('--dy', dy.toFixed(1)+'px');
          p.style.setProperty('--bl', bl.toFixed(2)+'px');
          p.style.setProperty('--sc', sc.toFixed(3));
          p.style.zIndex = String(Math.round(op*10)+1);
          p.style.pointerEvents = i===idx ? 'auto':'none';
        });
      }
      if(idx!==active){
        active=idx;
        const era=CH[idx].era;
        dots.forEach((d,i)=>d.classList.toggle('on', i===idx));
        labels.forEach((t,i)=>{
          t.setAttribute('fill', i===idx?'var(--accent)':'var(--fg-dim)');
          t.setAttribute('font-size', i===idx?'14.5':'13');
        });
        brackets.forEach((b,e)=>{
          b.setAttribute('stroke', e===era?'var(--accent)':'rgba(255,255,255,.16)');
          b.setAttribute('stroke-width', e===era?'4':'2.5');
        });
      }
    }

    let last=performance.now();
    function render(now){
      now=now||performance.now();
      const dt=Math.min(now-last,60); last=now;
      const k=REDUCE?1:1-Math.exp(-dt/95);
      cur.m += (tgt.m-cur.m)*k;
      cur.h += (tgt.h-cur.h)*k;
      cur.t += (tgt.t-cur.t)*k;
      tick += dt*0.00042;
      const drift = REDUCE?0:Math.sin(tick)*0.55;
      hMin.setAttribute('transform',`rotate(${(cur.m+drift).toFixed(3)} 320 320)`);
      hHour.setAttribute('transform',`rotate(${(cur.h+drift*0.5).toFixed(3)} 320 320)`);
      progEl.setAttribute('d', arcPath(266, ARC0, Math.max(ARC0+0.4,cur.t)));
      if(!REDUCE && !isNarrow()){
        const p=(cur.t-ARC0)/(ARC1-ARC0);
        wrap.style.setProperty('--ry', (-9 + p*5).toFixed(2)+'deg');
        wrap.style.setProperty('--rx', (4.5 - p*7).toFixed(2)+'deg');
      }
      requestAnimationFrame(render);
    }

    dots.forEach(d=>d.addEventListener('click',()=>{
      const i=+d.dataset.i;
      if(isNarrow()){ panes[i].scrollIntoView({behavior:'smooth',block:'center'}); return; }
      const top=track.getBoundingClientRect().top + window.scrollY;
      const total=track.offsetHeight - window.innerHeight;
      window.scrollTo({top: top + total*(i/(N-1)), behavior:'smooth'});
    }));

    window.addEventListener('scroll', compute, {passive:true});
    window.addEventListener('resize', ()=>{
      if(isNarrow()) panes.forEach(p=>{p.style.cssText='';});
      measurePanes();
      compute();
    });
    compute(); render();
  })();


  /* ---------- HERO: NIGHT-EARTH GLOBE (rebuilt from scratch, flicker-free) ----------
     Design notes (why this version cannot flicker):
       • One continuous rotation at a constant angular velocity. No stop-and-go
         state machine, no eased "hops", no ±breathe oscillation — those were the
         sources that pushed values across visibility thresholds every few frames.
       • The whole canvas is cleared and fully redrawn every frame. No band-clear,
         no CROP edge that could leave residue.
       • The caption is rendered IN the canvas, pinned to a fixed screen anchor,
         and only its TEXT cross-fades when the front-most site changes. Because it
         never moves and lives in the same redrawn frame, there is no DOM element
         to desync and nothing to "jump".
       • Every fade is a smooth smoothstep of a continuous quantity (depth toward
         the viewer). There are no hard on/off thresholds anywhere on screen. */
  function createNightGlobe(host, opts){
    opts=opts||{};
    if(!host) return;
    const BARE=!!opts.bare, RF=opts.rf||0.3485;
    const cv=host.querySelector('canvas'); if(!cv) return; const ctx=cv.getContext('2d');
    const elStats=BARE?null:document.getElementById('hudStats'), elTools=BARE?null:document.getElementById('hudTools');
    const RAD=Math.PI/180;
    const REDUCE=matchMedia('(prefers-reduced-motion:reduce)').matches;

    const HOME=[17.39,78.49];
    /* logoW = the mark's rendered width in px inside a fixed-height box, tuned so
       every wordmark reads at the same optical size (see .logo-mark in main.css).
       Marks live in assets/img/logos/ — trimmed to their ink and light-on-dark. */
    const SITES=[
      { city:'Hyderabad', cc:'India',                proj:'Brightcone.ai',     lat:17.39, lon:78.49,
        logo:'assets/img/logos/brightcone.png', logoW:164,
        stats:[['Decision time','−25%'],['Design handoff','−25%'],['Verticals shipped','3']],
        tools:['Figma','Figma Make','Claude','Tailwind'] },
      { city:'Hyderabad', cc:'India',                proj:'Yanthraa',          lat:17.42, lon:78.45,
        logo:'assets/img/logos/yanthraa.png', logoW:141,
        stats:[['Surfaces','Product · Web · Sales'],['Handoff','−25%'],['Role','UI Lead']],
        tools:['Figma','Figma Make','Penpot','Claude'] },
      { city:'Atlanta',   cc:'United States',        proj:'Formulary IQ',      lat:33.75, lon:-84.39,
        logo:'assets/img/logos/inpharmd.png', logoW:101,
        stats:[['Breakpoints','3'],['Dashboard modules','6'],['Domain','Clinical']],
        tools:['Figma','HTML5','CSS3','Tailwind'] },
      { city:'Mumbai',    cc:'India',                proj:'R-Clinic',          lat:19.08, lon:72.88,
        logo:'assets/img/logos/medongo.png', logoW:128,
        stats:[['Consult modules','3'],['User roles','2'],['Domain','Telehealth']],
        tools:['Figma','Claude','HTML5'] },
      { city:'Hyderabad', cc:'India',                proj:'RunCode.io',        lat:17.45, lon:78.34,
        logo:'assets/img/logos/colaberry.png', logoW:114,
        stats:[['Users served','100K+'],['Award','2023']],
        tools:['Figma','Sass','Bootstrap','jQuery'] },
      { city:'Dubai',     cc:'United Arab Emirates', proj:'InnPro',            lat:25.20, lon:55.27,
        logo:'assets/img/logos/innpro.png', logoW:38, logoIcon:true,
        stats:[['Mobile screens','48'],['Modules','3'],['Handoff','HTML/CSS']],
        tools:['Figma','HTML5','Bootstrap'] },
      { city:'Dallas',    cc:'United States',        proj:'RedRiver One',      lat:32.78, lon:-96.80,
        logo:'assets/img/logos/redriver_w.png', logoW:172,
        stats:[['Domain','Rental discovery'],['Market','Texas · DFW'],['Build','Responsive']],
        tools:['Figma','Claude Code','ChatGPT'] },
      { city:'Bengaluru', cc:'India',                proj:'refactored.ai',     lat:12.97, lon:77.59,
        logo:'assets/img/logos/refactored.png', logoW:129,
        stats:[['Design system','v2'],['Components','40+'],['Domain','Dev Tooling']],
        tools:['Figma','Claude','Tailwind'] },
      { city:'Hyderabad', cc:'India',                proj:'Ezmedtech.ai',      lat:17.36, lon:78.52,
        logo:'assets/img/logos/ezmedtech.svg', logoW:122,
        stats:[['Care modules','5'],['Domain','MedTech'],['Handoff','HTML/CSS']],
        tools:['Figma','HTML5','CSS3'] },
      { city:'Hyderabad', cc:'India',                proj:'Veridx.ai',         lat:17.43, lon:78.38,
        logo:'assets/img/logos/veridx.png', logoW:130,
        stats:[['Dashboards','Role-based'],['Domain','Legal-Tech'],['Data density','High']],
        tools:['Figma','HTML5','CSS3'] },
      { city:'Hyderabad', cc:'India',                proj:'Pietrack',          lat:17.38, lon:78.41,
        logo:'assets/img/logos/micropyramid.svg', logoW:225,
        stats:[['Enterprise modules','3'],['Breakpoints','3'],['Designers mentored','6']],
        tools:['Adobe XD','HTML5','CSS3','SCSS','Bootstrap'] },
      { city:'Sydney',    cc:'Australia',              proj:'Pulse Healthcare',  lat:-33.87, lon:151.21,
        logo:'assets/img/logos/pulse.png', logoW:66, logoIcon:true,
        stats:[['Domain','Medical supplies'],['Region','Australia'],['Breakpoints','3']],
        tools:['Figma','Figma Make','AI Tools'] }
    ];
    /* short client tags used by the logo strip below (index-matched to SITES) */
    const CLIENT_TAGS=['AI Workflow','Design System','Formulary IQ','Telehealth','Dev Platform','Mobile · UAE','Rentals · Texas','Dev Tooling','MedTech','Legal-Tech','Workforce','Med Supplies'];

    const v3=(la,lo)=>{const a=la*RAD,b=lo*RAD,c=Math.cos(a);
      return [c*Math.sin(b), Math.sin(a), c*Math.cos(b)];};

    /* major metros [lat, lon, magnitude 1-3] — continents emerge from the light
       clusters, as in a night photo of Earth */
    const CITY=[
      [40.7,-74.0,3],[34.1,-118.2,3],[41.9,-87.6,3],[43.7,-79.4,2],[19.4,-99.1,3],
      [29.8,-95.4,2],[25.8,-80.2,2],[33.7,-84.4,2],[32.8,-96.8,2],[47.6,-122.3,2],
      [37.8,-122.4,2],[42.4,-71.1,2],[38.9,-77.0,2],[40.0,-75.2,2],[33.4,-112.1,2],
      [39.7,-105.0,1],[45.5,-73.6,2],[49.3,-123.1,1],[42.3,-83.0,1],[45.0,-93.3,1],
      [20.7,-103.3,1],[25.7,-100.3,1],[23.1,-82.4,1],[14.6,-90.5,1],[9.0,-79.5,1],
      [36.2,-115.1,1],[35.2,-80.8,1],[27.9,-82.5,1],[29.4,-98.5,1],[39.1,-84.5,1],
      [-23.5,-46.6,3],[-22.9,-43.2,3],[-34.6,-58.4,3],[-12.0,-77.0,2],[4.7,-74.1,2],
      [-33.5,-70.7,2],[10.5,-66.9,2],[-15.8,-47.9,1],[-19.9,-44.0,1],[-30.0,-51.2,1],
      [-0.2,-78.5,1],[-34.9,-56.2,1],[-13.0,-38.5,1],[-8.05,-34.9,1],[6.2,-75.6,1],
      [51.5,-0.1,3],[48.9,2.35,3],[40.4,-3.7,3],[41.4,2.2,2],[52.5,13.4,3],
      [41.9,12.5,2],[45.5,9.2,2],[48.2,16.4,2],[52.2,21.0,2],[52.4,4.9,2],
      [50.8,4.35,2],[48.1,11.6,2],[53.6,10.0,2],[50.1,8.7,2],[47.4,8.5,1],
      [50.1,14.4,2],[47.5,19.0,2],[44.4,26.1,2],[50.5,30.5,2],[55.8,37.6,3],
      [59.9,30.3,2],[59.3,18.1,2],[59.9,10.8,1],[55.7,12.6,2],[60.2,24.9,1],
      [53.3,-6.3,1],[38.7,-9.1,2],[38.0,23.7,2],[41.0,29.0,3],[53.5,-2.2,2],
      [52.5,-1.9,2],[45.8,4.8,1],[40.9,14.3,2],[42.7,23.3,1],[44.8,20.5,1],
      [53.9,27.6,1],[56.9,24.1,1],[45.1,7.7,1],[43.3,5.4,1],[51.2,6.8,2],
      [30.0,31.2,3],[6.5,3.4,3],[-4.3,15.3,2],[-26.2,28.0,2],[-33.9,18.4,2],
      [-1.3,36.8,2],[33.6,-7.6,2],[36.8,3.1,2],[36.8,10.2,1],[9.0,38.7,2],
      [5.6,-0.2,1],[5.3,-4.0,1],[-6.8,39.3,1],[15.6,32.5,1],[-8.8,13.2,1],
      [14.7,-17.4,1],[-29.9,31.0,1],[32.9,13.2,1],[31.2,29.9,1],[12.0,8.5,1],
      [25.2,55.3,3],[24.7,46.7,2],[35.7,51.4,3],[33.3,44.4,2],[21.5,39.2,2],
      [32.1,34.8,2],[31.9,35.9,1],[25.3,51.5,1],[29.4,48.0,1],[24.5,54.4,1],
      [39.9,32.9,2],[41.3,69.2,2],[43.2,76.9,1],[40.4,49.9,1],[24.9,67.0,3],
      [31.5,74.3,3],[33.7,73.1,1],[34.5,69.2,1],[36.2,37.1,1],[38.4,27.1,1],
      [28.6,77.2,3],[19.1,72.9,3],[12.97,77.6,3],[17.4,78.5,3],[13.1,80.3,3],
      [22.6,88.4,3],[18.5,73.9,2],[23.0,72.6,2],[26.9,75.8,2],[26.8,81.0,2],
      [21.2,72.8,2],[26.4,80.3,1],[21.1,79.1,1],[10.0,76.3,1],[17.7,83.3,1],
      [20.3,85.8,1],[22.7,75.9,1],[11.0,77.0,1],[23.8,90.4,3],[22.4,91.8,2],
      [6.9,79.9,1],[27.7,85.3,1],[30.9,75.9,1],[25.6,85.1,1],[19.9,75.3,1],
      [35.7,139.7,3],[34.7,135.5,3],[35.2,137.0,2],[43.1,141.3,1],[33.6,130.4,2],
      [37.6,127.0,3],[35.2,129.1,2],[39.9,116.4,3],[31.2,121.5,3],[23.1,113.3,3],
      [22.5,114.1,3],[30.7,104.1,2],[29.6,106.5,2],[30.6,114.3,2],[34.3,108.9,2],
      [39.1,117.2,2],[30.3,120.2,2],[32.1,118.8,2],[41.8,123.4,2],[45.8,126.6,1],
      [22.3,114.2,3],[25.0,121.5,2],[14.6,121.0,3],[-6.2,106.8,3],[-7.3,112.7,2],
      [13.8,100.5,3],[10.8,106.7,3],[21.0,105.8,2],[3.1,101.7,2],[1.35,103.8,2],
      [16.8,96.2,1],[11.6,104.9,1],[3.6,98.7,1],[10.3,123.9,1],[36.1,120.4,1],
      [24.5,118.1,1],[26.1,119.3,1],[38.9,121.6,1],[43.8,125.3,1],[36.7,117.0,1],
      [-33.9,151.2,2],[-37.8,145.0,2],[-27.5,153.0,1],[-31.95,115.9,1],
      [-36.9,174.8,1],[-34.9,138.6,1]
    ];

    const COAST_S='-596 -800,-602 -810,-623 -809,-645 -809,-657 -806,-640 -803,-619 -804,-611 -800,-596 -800;-1592 -795,-1611 -796,-1624 -793,-1637 -786,-1612 -784,-1602 -787,-1592 -795;-452 -780,-439 -785,-434 -795,-449 -803,-465 -806,-484 -808,-505 -810,-529 -810,-542 -806,-519 -799,-510 -796,-499 -788,-487 -780,-467 -778,-452 -780;-1212 -735,-1199 -737,-1187 -735,-1202 -741,-1216 -740,-1226 -737,-1212 -735;-1256 -735,-1240 -739,-1259 -737,-1273 -735,-1256 -735;-990 -719,-979 -721,-968 -720,-982 -725,-994 -724,-1008 -725,-1018 -723,-1004 -719,-990 -719;-685 -710,-688 -722,-700 -723,-711 -725,-724 -725,-742 -724,-750 -717,-739 -713,-721 -712,-717 -703,-712 -690,-703 -689,-695 -696,-687 -705,-685 -710;-1800 -847,-1791 -841,-1773 -845,-1762 -841,-1744 -845,-1731 -841,-1700 -839,-1690 -841,-1670 -846,-1642 -848,-1619 -851,-1581 -854,-1552 -851,-1509 -853,-1485 -856,-1459 -853,-1431 -850,-1468 -845,-1501 -843,-1509 -839,-1536 -837,-1530 -828,-1545 -818,-1568 -811,-1544 -812,-1521 -810,-1506 -813,-1489 -810,-1472 -807,-1464 -803,-1481 -797,-1495 -794,-1516 -793,-1534 -792,-1553 -791,-1573 -784,-1581 -780,-1584 -769,-1570 -773,-1553 -772,-1537 -771,-1529 -775,-1513 -774,-1500 -772,-1487 -769,-1476 -766,-1461 -765,-1462 -754,-1449 -752,-1428 -753,-1416 -751,-1402 -751,-1389 -750,-1375 -747,-1364 -745,-1352 -743,-1337 -744,-1323 -743,-1309 -745,-1296 -745,-1282 -743,-1269 -744,-1254 -745,-1240 -745,-1226 -745,-1211 -745,-1197 -745,-1187 -742,-1175 -740,-1162 -742,-1150 -741,-1139 -737,-1129 -744,-1113 -744,-1101 -748,-1087 -749,-1076 -752,-1061 -751,-1049 -749,-1034 -750,-1020 -751,-1006 -753,-1013 -742,-1025 -741,-1033 -734,-1016 -728,-1003 -728,-991 -729,-981 -732,-963 -736,-950 -735,-937 -733,-924 -732,-914 -734,-901 -733,-892 -726,-884 -730,-873 -732,-860 -731,-852 -735,-839 -735,-827 -736,-815 -739,-807 -735,-793 -735,-779 -734,-769 -736,-749 -739,-739 -737,-728 -734,-716 -733,-702 -731,-689 -730,-680 -728,-671 -720,-676 -712,-682 -705,-684 -693,-676 -685,-677 -673,-667 -666,-654 -659,-646 -656,-636 -649,-620 -646,-607 -641,-592 -637,-578 -633,-586 -642,-598 -642,-613 -645,-625 -651,-621 -662,-637 -665,-649 -671,-657 -680,-648 -687,-640 -689,-628 -696,-623 -704,-615 -711,-614 -720,-610 -728,-608 -737,-620 -744,-633 -746,-644 -753,-659 -756,-672 -758,-684 -760,-698 -762,-706 -766,-722 -767,-740 -766,-756 -767,-772 -767,-754 -773,-743 -776,-765 -781,-779 -784,-768 -795,-754 -803,-732 -804,-714 -807,-700 -810,-682 -813,-657 -815,-633 -817,-616 -820,-597 -824,-587 -828,-570 -829,-554 -826,-536 -823,-515 -820,-498 -817,-473 -817,-448 -818,-428 -821,-408 -814,-382 -813,-363 -811,-344 -809,-323 -808,-301 -806,-286 -803,-297 -796,-316 -793,-337 -795,-356 -795,-358 -783,-339 -779,-322 -777,-310 -774,-298 -771,-289 -767,-275 -765,-262 -764,-239 -762,-225 -761,-212 -759,-200 -757,-189 -754,-175 -751,-166 -748,-157 -745,-165 -739,-154 -731,-144 -730,-133 -727,-123 -724,-115 -720,-103 -713,-91 -713,-74 -717,-69 -709,-58 -710,-43 -715,-30 -713,-18 -712,-7 -712,9 -713,19 -711,30 -710,41 -709,52 -706,63 -705,71 -702,85 -701,95 -700,103 -705,120 -706,134 -700,147 -700,159 -700,170 -699,182 -699,193 -699,204 -700,215 -701,226 -707,237 -705,248 -705,260 -705,271 -705,281 -703,292 -702,300 -699,310 -698,320 -697,333 -688,349 -687,362 -692,372 -692,386 -698,397 -695,409 -689,420 -686,429 -685,441 -683,457 -678,474 -677,483 -674,499 -671,508 -669,518 -662,536 -659,545 -658,554 -659,564 -660,573 -667,581 -670,599 -674,614 -680,624 -680,641 -674,650 -676,660 -677,669 -679,679 -679,689 -679,697 -690,686 -699,678 -703,691 -707,684 -714,699 -723,710 -721,719 -713,731 -707,739 -699,756 -697,766 -696,776 -695,784 -687,801 -681,809 -679,821 -674,838 -673,847 -672,857 -671,868 -671,880 -662,888 -670,897 -671,906 -672,916 -671,926 -672,935 -672,950 -672,967 -672,978 -672,987 -671,997 -672,1009 -666,1028 -656,1042 -660,1062 -669,1072 -670,1081 -670,1092 -668,1102 -667,1111 -664,1129 -661,1144 -661,1156 -667,1167 -667,1186 -672,1198 -673,1209 -672,1223 -666,1232 -665,1241 -666,1252 -667,1261 -666,1270 -666,1279 -667,1288 -668,1297 -666,1308 -664,1318 -664,1329 -664,1339 -663,1348 -662,1351 -653,1359 -660,1366 -668,1375 -670,1386 -669,1399 -669,1408 -668,1421 -668,1431 -668,1444 -668,1455 -669,1460 -676,1477 -681,1488 -684,1501 -686,1515 -687,1525 -689,1536 -689,1552 -688,1568 -694,1580 -695,1592 -696,1608 -702,1627 -707,1638 -707,1649 -708,1661 -708,1673 -708,1684 -710,1695 -712,1705 -714,1711 -721,1701 -729,1693 -737,1680 -738,1661 -744,1650 -751,1638 -759,1635 -767,1641 -775,1647 -782,1666 -783,1652 -789,1637 -791,1618 -792,1609 -797,1603 -806,1611 -813,1625 -821,1637 -824,1651 -827,1666 -830,1689 -833,1723 -840,1732 -844,1760 -842,1783 -845,-1800 -847;-678 -538,-665 -545,-651 -547,-665 -552,-681 -556,-692 -555,-710 -551,-723 -545,-733 -540,-747 -528,-738 -530,-724 -537,-711 -541,-703 -529,-693 -525,-683 -531,-678 -538;-585 -511,-577 -515,-594 -522,-607 -523,-600 -513,-592 -515,-585 -511;703 -497,687 -498,689 -488,705 -491,703 -497;1454 -408,1464 -411,1477 -408,1484 -421,1479 -432,1469 -436,1454 -427,1447 -412,1454 -408;1730 -409,1740 -409,1742 -418,1732 -430,1731 -439,1715 -442,1706 -459,1698 -464,1684 -466,1667 -462,1670 -451,1683 -441,1697 -436,1705 -430,1716 -418,1721 -410,1730 -409;1746 -362,1753 -372,1768 -379,1780 -376,1783 -386,1772 -391,1769 -401,1760 -413,1752 -417,1752 -405,1738 -395,1746 -388,1747 -374,1743 -365,1731 -352,1743 -353,1746 -362;1671 -222,1662 -221,1648 -211,1642 -204,1650 -205,1658 -211,1666 -217,1671 -222;-1800 -166,1794 -168,-1800 -161,-1800 -166;501 -136,502 -148,504 -157,499 -165,494 -180,490 -191,485 -205,479 -224,475 -238,471 -249,454 -256,440 -250,437 -236,433 -228,434 -213,444 -201,442 -190,440 -174,444 -162,455 -160,469 -152,477 -146,479 -137,488 -131,492 -120,498 -129,501 -136;1436 -138,1439 -145,1449 -146,1453 -154,1455 -163,1462 -178,1464 -190,1475 -195,1482 -200,1487 -206,1497 -223,1507 -224,1509 -235,1516 -241,1529 -253,1531 -261,1531 -273,1536 -281,1535 -290,1531 -304,1529 -316,1524 -326,1517 -330,1513 -338,1507 -352,1501 -364,1500 -374,1483 -378,1474 -382,1463 -390,1455 -386,1445 -381,1436 -388,1427 -385,1416 -383,1406 -380,1400 -374,1396 -361,1381 -356,1382 -344,1368 -353,1375 -341,1378 -329,1370 -338,1360 -349,1352 -345,1346 -332,1330 -320,1313 -315,1295 -316,1282 -319,1271 -323,1261 -322,1251 -327,1242 -330,1237 -339,1222 -340,1213 -338,1199 -340,1190 -345,1180 -351,1166 -350,1156 -344,1150 -336,1157 -329,1157 -316,1152 -306,1150 -295,1146 -285,1140 -273,1135 -265,1134 -256,1142 -263,1137 -250,1135 -238,1137 -225,1146 -218,1155 -215,1167 -207,1182 -204,1193 -200,1209 -197,1217 -187,1223 -178,1230 -164,1234 -173,1238 -161,1249 -151,1257 -145,1266 -140,1278 -143,1290 -149,1299 -136,1306 -125,1317 -123,1326 -121,1318 -113,1330 -114,1344 -120,1353 -122,1363 -120,1367 -129,1361 -137,1354 -147,1363 -156,1376 -162,1383 -168,1393 -174,1402 -177,1411 -168,1414 -158,1417 -150,1415 -137,1418 -127,1419 -119,1421 -110,1429 -118,1435 -128,1436 -138;1207 -102,1190 -96,1199 -94,1208 -100,1207 -102;1244 -101,1236 -104,1240 -93,1250 -89,1259 -84,1270 -83,1259 -91,1251 -94,1244 -101;1179 -81,1189 -83,1180 -89,1167 -90,1176 -84,1179 -81;1229 -81,1213 -89,1199 -88,1207 -82,1220 -85,1229 -81;1599 -83,1586 -78,1596 -80,1599 -83;1086 -68,1105 -69,1126 -69,1145 -78,1157 -84,1146 -88,1135 -83,1126 -84,1115 -83,1106 -81,1094 -77,1083 -78,1065 -74,1054 -69,1061 -59,1073 -60,1081 -63,1086 -68;1559 -68,1547 -59,1547 -50,1555 -62,1559 -68;1520 -55,1508 -61,1497 -63,1489 -60,1498 -55,1508 -55,1516 -48,1520 -55;1305 -31,1292 -34,1279 -34,1294 -28,1305 -31;1531 -45,1524 -38,1514 -30,1522 -32,1530 -40,1531 -45;1341 -12,1344 -28,1355 -34,1363 -23,1374 -17,1383 -17,1392 -21,1410 -26,1427 -33,1446 -39,1453 -44,1460 -55,1476 -61,1470 -67,1481 -80,1487 -91,1500 -97,1508 -103,1498 -104,1489 -103,1479 -101,1471 -95,1460 -81,1447 -76,1439 -79,1434 -90,1426 -93,1410 -91,1401 -83,1391 -81,1376 -84,1380 -76,1384 -62,1379 -54,1360 -45,1337 -35,1330 -41,1320 -28,1331 -25,1322 -22,1309 -14,1319 -7,1340 -8,1341 -12;1252 14,1244 4,1227 4,1211 4,1202 2,1209 -14,1233 -6,1224 -15,1215 -19,1225 -32,1232 -47,1226 -56,1227 -45,1217 -49,1209 -36,1210 -26,1204 -41,1204 -55,1194 -54,1197 -45,1195 -35,1188 -28,1193 -14,1198 2,1209 13,1229 9,1241 9,1251 16,1252 14;1287 11,1286 3,1284 -8,1277 -3,1274 10,1279 22,1286 15,1287 11;1058 -59,1047 -59,1039 -50,1026 -42,1014 -28,1009 -21,1001 -7,993 2,990 10,986 18,977 25,972 33,964 39,954 50,975 52,984 43,991 36,1006 21,1017 21,1025 14,1031 6,1038 1,1034 -7,1044 -11,1049 -23,1061 -31,1059 -43,1058 -59;1179 18,1190 9,1178 8,1175 -8,1166 -15,1165 -25,1161 -40,1149 -41,1138 -34,1121 -35,1110 -30,1101 -16,1091 -5,1090 4,1091 13,1097 20,1112 19,1114 27,1130 31,1137 39,1146 49,1155 54,1162 61,1167 69,1176 64,1183 57,1192 54,1184 50,1179 41,1173 32,1180 23,1179 18;1264 84,1265 72,1262 63,1258 73,1257 60,1242 62,1242 74,1233 74,1221 69,1223 80,1235 87,1246 85,1255 90,1263 88,1264 84;812 62,803 60,799 68,797 82,801 98,808 93,818 75,816 65,812 62;1240 103,1233 93,1224 97,1229 109,1241 112,1240 103;1185 93,1172 84,1177 91,1184 97,1190 104,1195 114,1190 100,1185 93;1255 122,1258 110,1253 104,1245 109,1249 118,1243 126,1252 125,1255 122;1213 185,1222 185,1225 171,1223 163,1215 151,1223 142,1240 138,1241 125,1233 130,1220 138,1211 136,1210 145,1201 150,1199 164,1204 176,1207 185,1213 185;-656 182,-666 180,-658 184,-656 182;-769 179,-778 179,-769 184,-762 179,-769 179;-726 199,-717 197,-708 199,-700 196,-693 190,-683 186,-692 184,-701 182,-710 183,-724 182,-735 182,-745 183,-734 185,-723 187,-728 195,-726 199;1103 187,1095 182,1087 185,1086 194,1102 201,1110 197,1103 187;-797 228,-783 225,-771 217,-762 212,-749 207,-742 203,-750 199,-763 200,-778 199,-771 204,-781 207,-787 216,-802 218,-818 222,-828 227,-835 222,-845 218,-838 228,-825 231,-814 231,-797 228;1212 228,1207 220,1202 228,1207 245,1215 253,1218 244,1212 228;1346 341,1342 332,1333 333,1324 330,1329 341,1339 344,1346 341;346 357,340 351,330 346,323 351,337 354,346 357;237 357,250 354,263 353,247 349,235 353,237 357;155 382,152 374,143 370,124 376,137 380,148 381,155 382;92 412,98 405,97 392,88 389,84 404,92 412;1410 371,1406 363,1403 351,1390 347,1372 346,1358 335,1351 346,1333 344,1322 339,1310 339,1320 331,1313 315,1302 314,1304 323,1294 333,1304 336,1319 348,1326 354,1346 357,1357 355,1367 373,1389 378,1401 394,1399 406,1414 414,1419 400,1410 382,1410 371;96 422,88 416,87 426,96 422;1439 442,1453 444,1455 433,1441 430,1432 420,1416 427,1411 416,1400 416,1398 426,1403 433,1414 434,1417 448,1431 445,1439 442;-637 465,-620 464,-629 460,-641 464,-637 465;-618 491,-636 494,-645 499,-629 497,-618 493,-618 491;-1235 485,-1257 488,-1268 495,-1281 500,-1273 506,-1258 503,-1249 495,-1239 491,-1235 485;-561 507,-568 498,-555 499,-545 496,-535 492,-530 482,-531 467,-542 468,-542 478,-554 469,-563 476,-573 476,-593 476,-592 485,-584 491,-574 507,-559 516,-561 507;-1327 540,-1317 541,-1321 530,-1312 522,-1322 526,-1331 534,-1327 540;1436 507,1447 490,1432 493,1426 479,1435 468,1421 460,1419 468,1420 478,1419 489,1422 510,1416 519,1417 533,1426 538,1433 527,1432 518,1436 507;-68 523,-86 517,-100 518,-92 529,-97 539,-83 547,-76 551,-57 546,-62 539,-68 523;127 556,121 548,110 554,124 561,127 556;-1530 571,-1540 567,-1547 575,-1538 578,-1526 579,-1530 571;-30 586,-41 576,-31 577,-20 577,-22 569,-31 560,-21 559,-11 546,2 533,17 527,10 518,5 508,-8 508,-25 505,-36 502,-45 503,-58 502,-43 512,-34 514,-50 516,-42 523,-46 535,-31 534,-36 546,-48 548,-50 558,-62 568,-58 578,-50 586,-30 586;-1656 599,-1668 599,-1657 603,-1656 599;-819 627,-831 622,-840 625,-832 629,-819 629,-819 627;-1717 638,-1705 637,-1697 634,-1687 633,-1695 630,-1707 634,-1716 633,-1717 638;-852 657,-839 651,-828 648,-816 645,-808 641,-825 637,-841 636,-855 631,-872 635,-864 640,-859 657,-852 657;-145 665,-136 651,-149 644,-178 637,-187 635,-200 636,-228 640,-218 644,-240 649,-222 651,-243 656,-237 663,-221 664,-206 657,-191 663,-178 660,-162 665,-145 665;-759 671,-770 671,-768 681,-759 683,-751 676,-759 671;-1800 690,-1775 682,-1749 672,-1743 663,-1719 669,-1699 660,-1709 655,-1725 654,-1726 645,-1739 643,-1760 649,-1772 655,-1784 654,-1799 659,-1800 650,1800 650,1787 645,1774 646,1783 641,1789 633,1795 626,1774 625,1746 618,1737 617,1721 609,1707 603,1689 606,1663 598,1649 597,1635 599,1620 582,1632 576,1631 562,1621 561,1617 553,1604 543,1600 532,1585 530,1582 519,1568 510,1560 532,1554 554,1559 568,1568 574,1584 581,1601 593,1619 603,1637 611,1645 626,1633 625,1627 616,1601 605,1593 618,1567 614,1542 598,1550 591,1528 589,1513 588,1498 597,1485 592,1455 593,1422 590,1390 571,1351 547,1367 546,1382 538,1399 542,1413 531,1414 522,1406 512,1405 500,1401 484,1386 470,1369 451,1355 440,1349 434,1335 428,1323 433,1309 426,1300 419,1297 409,1286 402,1275 398,1284 386,1292 374,1295 356,1282 349,1274 345,1265 344,1266 357,1261 367,1262 377,1253 377,1250 385,1254 394,1243 399,1229 396,1221 392,1211 389,1214 398,1222 404,1208 406,1196 399,1190 393,1180 392,1181 381,1189 374,1208 379,1217 375,1225 369,1211 367,1197 356,1192 349,1202 344,1206 334,1212 325,1219 317,1213 307,1221 298,1217 282,1204 271,1196 257,1187 245,1173 236,1159 228,1148 227,1138 225,1118 216,1108 214,1104 203,1096 210,1085 217,1067 207,1059 198,1064 180,1074 167,1083 161,1089 153,1093 134,1092 117,1084 110,1072 104,1064 95,1052 86,1051 99,1043 105,1035 106,1026 122,1017 126,1008 126,1001 134,1000 123,995 108,992 100,999 92,1003 83,1005 74,1016 67,1024 61,1034 49,1033 37,1035 28,1042 16,1026 20,1014 28,1007 39,1002 53,1001 65,995 73,985 84,986 99,988 114,985 131,978 148,976 161,972 169,954 157,942 160,945 173,943 182,935 194,924 207,920 217,914 228,905 228,903 218,894 220,882 217,870 215,865 202,851 195,839 183,832 177,822 170,817 163,808 160,800 151,802 138,799 121,799 104,789 95,783 89,775 80,766 89,761 103,757 113,749 127,746 140,735 160,731 179,728 192,728 204,726 214,712 208,692 221,682 237,671 247,664 254,645 252,629 252,615 251,596 254,585 256,574 257,570 270,557 270,547 265,535 268,525 276,515 279,509 288,501 301,489 303,480 300,484 286,488 277,495 271,502 263,505 253,513 261,516 252,516 242,526 242,540 241,547 248,554 254,561 261,564 249,574 239,587 236,594 227,594 217,585 204,577 197,572 189,565 181,557 179,548 169,536 167,524 164,512 152,496 147,487 140,474 136,459 133,450 127,435 126,433 138,429 148,427 157,427 168,418 178,412 187,409 195,402 202,391 213,391 226,385 237,375 243,369 256,363 266,356 274,351 281,348 290,342 278,331 284,324 299,327 287,333 277,341 261,348 250,357 239,367 222,372 210,371 198,375 186,384 180,390 168,393 159,412 145,423 133,431 127,427 117,435 113,441 104,456 107,466 108,475 111,484 114,493 114,503 117,511 120,510 112,508 103,506 92,501 81,495 68,486 53,477 42,466 29,456 20,441 11,431 3,420 -9,416 -17,406 -25,401 -33,396 -43,387 -59,394 -68,392 -77,395 -91,400 -101,404 -118,406 -126,406 -142,405 -154,395 -167,385 -171,374 -176,363 -187,352 -196,347 -205,352 -213,354 -221,355 -231,355 -241,342 -248,330 -254,327 -261,326 -275,322 -288,313 -294,306 -304,301 -311,289 -322,282 -328,275 -332,264 -336,252 -338,236 -338,226 -339,215 -343,207 -344,196 -348,184 -340,179 -326,182 -317,176 -307,171 -299,163 -286,156 -278,150 -261,144 -239,144 -227,139 -217,134 -209,128 -197,118 -181,116 -167,118 -158,121 -149,125 -135,133 -125,137 -113,134 -104,129 -92,129 -76,122 -63,119 -50,111 -40,101 -30,94 -21,88 -11,93 3,93 12,96 23,94 37,87 44,75 44,59 43,50 56,43 63,27 63,11 59,-5 53,-20 47,-29 50,-40 52,-58 50,-75 43,-90 48,-99 56,-108 61,-114 68,-124 73,-131 82,-137 95,-146 102,-151 110,-161 115,-167 124,-167 136,-171 144,-167 156,-166 167,-161 181,-163 191,-163 201,-171 210,-170 219,-163 227,-160 237,-151 245,-148 256,-138 266,-131 276,-117 281,-109 288,-96 299,-98 312,-94 320,-87 332,-77 337,-62 351,-52 358,-36 354,-26 352,-12 357,-1 359,15 366,32 368,48 369,63 371,73 371,84 369,95 374,102 367,110 371,106 359,108 348,103 338,111 333,127 328,139 327,152 323,157 314,166 312,180 308,191 303,201 310,201 322,209 327,229 326,239 320,249 319,265 316,275 313,284 310,297 312,310 316,320 309,330 310,343 312,348 321,351 331,355 339,360 346,361 358,356 366,347 368,340 362,325 361,317 366,306 367,297 361,287 367,276 367,270 377,263 382,268 390,273 404,288 405,292 412,311 411,323 417,335 420,352 420,369 413,383 409,395 411,404 410,416 415,415 426,403 431,387 443,375 447,367 452,382 462,391 470,382 471,368 467,358 466,350 463,355 454,365 455,352 449,339 444,325 453,336 459,317 463,307 466,296 453,288 449,286 437,277 426,281 416,290 413,276 410,264 402,254 409,237 407,244 401,233 400,230 390,240 382,231 379,232 364,217 368,213 376,207 388,202 396,194 403,194 414,189 423,175 428,160 435,152 442,149 451,140 448,131 457,123 454,126 441,135 436,140 428,151 420,162 417,175 409,184 404,169 404,172 394,161 380,161 390,154 400,147 406,136 412,121 417,112 424,105 429,102 439,89 444,78 438,65 431,46 434,31 431,30 419,21 412,8 410,1 401,-3 393,-5 383,-14 374,-21 367,-34 367,-44 367,-54 359,-62 364,-75 371,-84 370,-88 383,-94 394,-90 402,-88 412,-90 426,-80 437,-68 436,-54 436,-43 434,-19 434,-12 460,-22 471,-30 476,-45 480,-33 489,-16 486,-19 498,-10 493,13 501,16 509,25 511,38 516,47 531,61 535,71 537,81 535,86 544,81 555,81 565,94 572,106 577,103 569,107 561,96 555,99 546,109 544,120 542,136 541,148 541,164 545,176 549,186 547,197 544,213 552,211 560,216 574,225 578,233 570,243 578,234 586,246 595,259 596,269 594,280 595,291 600,281 605,263 604,245 601,229 598,213 607,215 617,211 626,224 638,247 649,239 660,222 657,212 650,198 636,178 627,171 613,178 606,188 601,179 590,168 587,164 570,159 561,147 562,141 554,129 554,126 563,118 574,110 589,104 595,84 583,71 581,57 586,53 597,50 620,59 626,86 635,105 645,124 659,148 678,164 686,192 698,214 703,230 702,245 710,264 710,282 712,313 705,300 702,311 696,321 699,338 693,365 691,403 679,411 675,400 663,384 660,339 668,348 659,349 644,362 641,371 643,396 645,404 648,398 655,421 665,430 664,440 661,445 668,437 674,435 686,463 682,456 676,463 667,479 669,502 680,537 689,547 681,573 685,588 689,599 683,611 689,600 695,635 695,649 692,685 681,682 691,669 695,667 707,685 719,692 728,726 728,718 714,728 704,726 690,737 684,713 663,724 662,739 668,751 678,749 690,738 691,744 706,731 714,749 721,753 713,764 712,759 719,776 723,797 723,815 717,806 726,805 736,823 739,847 738,868 739,860 745,872 751,883 751,903 756,929 758,959 761,989 764,1008 764,1020 773,1044 777,1061 774,1047 771,1070 770,1082 767,1111 767,1133 762,1141 758,1128 750,1102 745,1121 738,1130 740,1140 736,1156 738,1188 736,1232 730,1254 736,1270 736,1286 730,1285 720,1297 712,1313 708,1323 718,1339 714,1356 717,1375 713,1399 715,1391 724,1405 728,1495 722,1504 716,1530 708,1570 710,1590 709,1598 705,1609 694,1623 696,1641 697,1659 695,1678 696,1696 687,1708 690,1700 697,1736 698,1757 699,1786 694,-1800 690;491 413,496 406,494 394,489 383,501 374,508 369,523 367,538 370,537 379,539 390,534 400,529 409,539 406,547 410,540 416,529 419,525 428,513 431,509 440,513 452,522 454,530 453,532 462,520 468,512 470,500 466,491 464,477 456,467 446,476 437,486 418,491 413;-956 691,-976 691,-998 694,-989 697,-972 699,-963 695,-956 691;-1800 715,1800 708,1789 708,-1800 715;-1800 715,-1790 716,-1776 713,-1787 709,-1800 708,-1800 715;-905 695,-905 685,-892 693,-880 686,-873 672,-863 679,-856 688,-855 699,-841 698,-826 697,-813 692,-820 681,-813 676,-833 664,-847 663,-858 666,-870 652,-885 641,-899 640,-907 636,-919 628,-932 620,-942 609,-946 601,-947 589,-932 588,-928 578,-923 571,-909 573,-890 569,-880 565,-873 560,-861 557,-850 553,-834 552,-823 551,-824 543,-821 533,-814 522,-799 512,-786 526,-791 541,-798 547,-782 551,-771 558,-765 565,-773 581,-785 588,-773 599,-778 608,-781 623,-757 623,-747 622,-738 624,-729 621,-717 615,-696 611,-693 590,-684 588,-677 582,-662 588,-652 599,-638 594,-625 582,-614 570,-605 558,-596 552,-580 549,-569 538,-558 533,-557 521,-571 514,-588 511,-600 502,-617 501,-639 503,-654 503,-664 502,-672 495,-685 491,-700 477,-711 468,-703 470,-687 483,-666 491,-651 492,-642 487,-651 481,-648 470,-632 457,-615 459,-605 470,-598 459,-610 453,-633 447,-642 443,-654 435,-662 445,-644 453,-660 453,-671 451,-680 443,-691 440,-701 437,-707 430,-705 418,-719 413,-729 412,-737 409,-722 411,-733 406,-743 405,-749 389,-754 380,-759 372,-762 383,-763 370,-757 356,-764 348,-774 345,-781 339,-791 335,-803 325,-813 314,-813 300,-810 292,-805 280,-801 269,-801 258,-807 251,-813 256,-822 267,-827 275,-827 286,-837 299,-851 296,-864 304,-875 303,-884 304,-896 302,-892 293,-902 291,-916 297,-925 296,-938 297,-947 295,-956 287,-966 283,-974 274,-973 262,-975 250,-978 229,-977 219,-972 206,-965 199,-959 188,-948 186,-935 184,-920 187,-908 193,-905 207,-896 213,-885 215,-877 215,-868 213,-874 203,-876 190,-883 185,-883 176,-884 165,-889 159,-879 159,-869 158,-860 160,-850 160,-841 156,-831 150,-834 140,-836 131,-837 119,-837 109,-830 100,-822 92,-814 88,-805 91,-796 96,-785 94,-777 89,-768 86,-761 93,-755 106,-743 111,-734 112,-726 117,-718 124,-714 115,-716 104,-717 91,-710 99,-714 110,-702 114,-689 114,-682 109,-673 105,-662 106,-649 101,-631 107,-619 107,-627 104,-616 99,-608 94,-602 86,-591 80,-585 73,-575 63,-559 58,-550 60,-540 58,-529 54,-518 46,-511 36,-505 19,-499 10,-507 2,-486 -2,-486 -12,-478 -6,-466 -9,-449 -16,-446 -27,-434 -24,-415 -29,-400 -29,-385 -37,-372 -48,-356 -51,-349 -67,-351 -90,-370 -110,-377 -122,-384 -130,-390 -138,-389 -157,-392 -172,-396 -183,-398 -196,-408 -209,-409 -219,-418 -224,-431 -230,-446 -234,-465 -241,-476 -249,-485 -259,-485 -272,-487 -282,-496 -292,-507 -310,-516 -318,-527 -332,-534 -338,-549 -350,-562 -349,-571 -344,-584 -339,-572 -353,-567 -364,-577 -382,-592 -387,-612 -389,-623 -388,-623 -402,-627 -410,-638 -412,-647 -408,-650 -421,-638 -420,-644 -429,-652 -435,-653 -445,-665 -450,-673 -456,-666 -470,-656 -472,-660 -481,-672 -487,-678 -499,-687 -503,-688 -518,-682 -524,-695 -523,-708 -529,-710 -538,-726 -535,-737 -528,-749 -523,-750 -510,-756 -487,-752 -477,-741 -469,-756 -466,-747 -458,-744 -441,-732 -445,-727 -424,-737 -434,-740 -418,-737 -399,-735 -383,-736 -372,-726 -355,-719 -339,-714 -324,-717 -309,-714 -301,-715 -289,-709 -276,-707 -257,-704 -236,-701 -214,-702 -198,-704 -183,-714 -178,-734 -164,-752 -153,-760 -146,-764 -138,-771 -122,-781 -104,-790 -84,-798 -72,-805 -65,-809 -57,-814 -47,-803 -34,-798 -27,-810 -22,-809 -11,-804 -3,-801 8,-789 14,-787 23,-775 33,-773 47,-775 56,-775 67,-782 75,-784 84,-791 90,-802 83,-803 74,-811 78,-821 82,-835 84,-839 93,-847 99,-857 99,-859 109,-865 118,-872 125,-875 133,-885 132,-898 135,-906 139,-917 141,-934 156,-947 162,-961 158,-973 159,-989 166,-1008 172,-1017 176,-1025 180,-1035 183,-1050 193,-1057 204,-1053 214,-1057 223,-1069 238,-1079 245,-1093 256,-1093 264,-1104 272,-1112 279,-1122 290,-1128 300,-1131 312,-1142 315,-1147 302,-1136 291,-1130 284,-1125 275,-1116 267,-1113 257,-1107 248,-1098 238,-1099 228,-1110 240,-1117 245,-1122 255,-1128 263,-1136 266,-1145 271,-1142 281,-1149 293,-1159 302,-1167 316,-1171 325,-1179 336,-1191 341,-1204 344,-1217 362,-1225 376,-1237 390,-1244 403,-1242 411,-1242 420,-1241 437,-1239 455,-1241 469,-1244 477,-1231 480,-1226 471,-1225 482,-1228 490,-1249 500,-1274 508,-1280 517,-1291 528,-1305 543,-1311 552,-1320 555,-1322 564,-1335 572,-1341 581,-1350 582,-1366 582,-1378 585,-1399 595,-1408 597,-1426 601,-1440 600,-1459 605,-1471 609,-1482 607,-1497 597,-1506 594,-1517 592,-1514 607,-1503 610,-1519 607,-1526 601,-1540 594,-1533 589,-1542 581,-1553 577,-1563 574,-1581 565,-1596 556,-1612 554,-1622 550,-1631 547,-1648 544,-1638 550,-1629 553,-1618 559,-1606 560,-1587 570,-1577 576,-1570 589,-1582 586,-1591 584,-1600 586,-1614 587,-1621 593,-1625 600,-1638 598,-1647 603,-1654 611,-1661 615,-1649 626,-1638 632,-1623 635,-1608 638,-1615 644,-1625 646,-1635 646,-1650 644,-1664 647,-1681 657,-1667 661,-1645 666,-1617 661,-1625 667,-1637 671,-1644 676,-1654 680,-1668 684,-1644 689,-1632 694,-1619 703,-1609 704,-1590 709,-1581 708,-1566 714,-1551 711,-1543 707,-1522 708,-1507 704,-1497 705,-1476 702,-1457 701,-1436 702,-1421 699,-1410 697,-1391 695,-1375 690,-1365 689,-1356 693,-1344 696,-1329 695,-1314 699,-1298 702,-1284 700,-1274 704,-1258 695,-1244 702,-1231 696,-1215 698,-1199 694,-1176 690,-1162 688,-1152 689,-1139 684,-1153 679,-1135 677,-1108 678,-1099 680,-1089 674,-1078 679,-1088 683,-1070 687,-1053 686,-1043 680,-1032 681,-1015 676,-999 678,-984 678,-977 686,-961 682,-961 673,-955 681,-942 691,-953 697,-965 701,-964 712,-952 719,-939 718,-929 713,-915 702,-924 697,-905 695;-1142 731,-1124 730,-1111 725,-1099 730,-1090 726,-1082 717,-1084 731,-1075 732,-1065 731,-1054 727,-1048 717,-1028 705,-1010 700,-1027 695,-1042 689,-1060 692,-1071 691,-1090 688,-1120 686,-1133 685,-1152 693,-1161 692,-1173 700,-1151 702,-1137 702,-1124 704,-1143 706,-1165 705,-1179 705,-1161 713,-1177 713,-1194 716,-1186 723,-1152 733,-1142 731;-1045 734,-1054 728,-1069 735,-1053 736,-1045 734;-763 731,-773 729,-784 729,-795 727,-809 733,-781 737,-763 731;-866 732,-858 725,-849 733,-823 738,-806 727,-788 724,-778 728,-756 722,-742 718,-722 716,-712 709,-688 705,-679 701,-670 692,-688 687,-665 681,-649 678,-634 669,-619 669,-639 650,-651 654,-667 664,-680 663,-671 651,-657 646,-647 634,-663 629,-688 637,-674 629,-663 623,-689 623,-710 629,-722 634,-734 642,-748 647,-777 642,-786 646,-779 653,-760 653,-740 655,-739 663,-727 673,-733 681,-748 686,-769 689,-773 698,-782 698,-790 702,-813 697,-849 700,-871 703,-887 704,-895 708,-885 712,-899 712,-902 722,-894 731,-884 735,-858 738,-866 732;-1004 738,-992 736,-974 738,-981 730,-965 726,-967 717,-984 713,-993 714,-1025 725,-1004 727,-1015 734,-1004 738;1436 732,1421 732,1400 733,1408 738,1421 739,1435 735,1436 732;-932 728,-943 720,-954 721,-960 729,-955 739,-945 741,-924 741,-905 739,-920 730,-932 728;-1205 714,-1231 709,-1259 719,-1248 730,-1239 737,-1249 743,-1215 744,-1201 742,-1176 742,-1166 739,-1155 735,-1168 732,-1192 725,-1205 718,-1205 714;1507 751,1496 747,1480 748,1461 752,1482 753,1507 751;-936 750,-956 747,-968 749,-949 756,-940 753,-936 750;1451 756,1443 748,1406 748,1390 746,1370 753,1375 759,1388 761,1415 761,1451 756;-985 767,-977 763,-982 750,-998 749,-1009 751,-1025 756,-1015 763,-1000 766,-986 766,-985 767;-1082 762,-1069 760,-1059 760,-1063 750,-1097 749,-1122 744,-1137 744,-1118 752,-1163 750,-1177 752,-1163 762,-1154 765,-1126 761,-1108 755,-1091 755,-1105 764,-1096 768,-1086 767,-1082 762;575 707,537 708,516 715,525 722,544 736,535 738,559 746,579 756,612 763,645 764,662 768,682 769,646 757,616 753,585 743,570 733,554 724,556 715,575 707;-947 771,-936 768,-916 768,-907 765,-898 758,-878 756,-864 755,-848 757,-828 758,-811 757,-801 753,-819 744,-832 746,-861 744,-881 744,-898 745,-924 748,-929 759,-939 763,-960 764,-971 768,-947 771;-1162 776,-1171 765,-1180 765,-1199 761,-1215 759,-1229 761,-1212 769,-1191 775,-1176 775,-1162 776;-938 775,-962 776,-944 778,-938 775;-1102 777,-1121 774,-1135 777,-1127 781,-1113 782,-1099 780,-1102 777;247 779,225 774,207 777,229 785,247 779;-1097 786,-1109 784,-1125 784,-1115 789,-1097 786;-958 781,-973 778,-986 785,-973 788,-956 784,-958 781;-1001 783,-1013 780,-1029 783,-1052 784,-1042 787,-1054 789,-1035 792,-1008 788,-1001 783;1051 783,994 779,1013 792,1028 793,1054 787,1051 783;183 797,215 790,190 786,185 778,176 776,171 768,159 768,138 774,147 777,132 780,112 789,104 797,132 800,151 797,170 801,183 797;254 804,274 801,259 795,230 794,201 796,185 799,174 803,205 806,219 804,229 807,254 804;511 805,498 804,489 803,476 800,465 802,448 806,468 808,483 808,500 809,515 807,511 805;999 789,978 788,950 790,933 794,925 801,912 803,938 810,959 813,979 807,1002 798,999 789;-870 797,-858 793,-872 790,-890 783,-908 782,-929 783,-940 788,-931 794,-950 794,-961 797,-960 806,-943 810,-924 813,-911 807,-894 805,-878 803,-870 797;-685 831,-658 830,-637 829,-619 826,-643 819,-668 817,-677 815,-655 815,-678 809,-695 806,-712 798,-732 796,-769 793,-755 792,-763 782,-779 779,-798 772,-779 770,-806 762,-832 765,-861 763,-876 764,-895 765,-878 772,-883 779,-850 775,-863 782,-880 784,-872 788,-854 790,-865 797,-842 802,-818 805,-841 806,-876 805,-894 809,-902 813,-914 816,-901 821,-889 821,-870 823,-855 827,-843 826,-832 823,-824 829,-811 830,-793 831,-763 832,-728 832,-707 832,-685 831;-271 835,-208 827,-227 823,-265 823,-319 822,-279 821,-248 818,-229 821,-221 817,-232 812,-206 815,-158 819,-128 817,-163 806,-200 802,-177 801,-189 794,-197 788,-197 776,-185 770,-200 769,-217 766,-198 761,-196 752,-207 752,-194 743,-216 742,-204 738,-222 733,-236 733,-223 726,-243 726,-234 721,-221 715,-218 707,-235 705,-243 709,-255 714,-264 702,-237 702,-223 701,-250 693,-277 685,-307 681,-318 681,-328 677,-342 667,-364 660,-384 657,-398 655,-407 648,-412 635,-428 627,-424 619,-429 611,-434 601,-448 600,-463 609,-483 609,-492 614,-499 624,-516 636,-523 652,-537 661,-540 672,-530 684,-515 687,-509 699,-520 696,-535 693,-547 696,-544 708,-534 708,-514 706,-531 712,-540 715,-550 714,-558 717,-547 726,-561 737,-573 747,-586 751,-613 761,-634 762,-661 761,-685 761,-697 764,-714 770,-688 773,-668 774,-710 776,-733 780,-694 789,-657 794,-680 801,-671 805,-637 812,-622 813,-603 820,-572 822,-541 822,-530 819,-504 824,-480 821,-466 820,-445 817,-469 822,-434 832,-399 832,-386 835,-351 836,-271 835';
    const LAND_S='-547:-715,-658;-514:-742,-583;-481:-713,-663;-448:-730,-684,1688;-415:-698,-654,1461,1725;-382:-708,-666,-624,-582,1433,1769;-349:-714,-673,-633,-593,1177,1419,1459,1499;-316:-715,-676,-638,-599,-560,-521,215,253,292,1183,1222,1261,1338,1377,1416,1455,1493;-283:-676,-638,-601,-563,-526,-488,186,224,261,299,1161,1198,1236,1273,1311,1348,1386,1423,1461,1498;-250:-671,-635,-598,-562,-526,-489,166,203,239,275,312,458,1149,1186,1222,1259,1295,1331,1368,1404,1441,1477,1513;-217:-699,-663,-628,-592,-557,-521,-486,-450,-415,153,189,224,260,296,331,438,473,1183,1219,1254,1290,1325,1361,1397,1432,1468;-184:-687,-652,-618,-583,-548,-513,-478,-444,-409,148,182,217,252,287,321,356,461,1226,1260,1295,1330,1365,1400,1434;-151:-740,-706,-672,-638,-604,-570,-535,-501,-467,-433,-399,148,182,217,251,285,319,353,388,490,1276,1310,1345,1447;-118:-755,-721,-687,-654,-620,-586,-553,-519,-485,-452,-418,-384,155,189,223,256,290,324,358,391,1335;-85:-766,-732,-699,-666,-632,-599,-565,-532,-499,-465,-432,-399,-365,135,169,202,235,269,302,335,369,1203,1270,1470;-52:-806,-773,-740,-706,-673,-640,-607,-574,-541,-508,-475,-441,-408,-375,122,155,188,221,254,288,321,354,387,1050,1381,1414,1447,1514,1547;-19:-776,-743,-710,-677,-644,-611,-578,-545,-512,-479,-446,115,148,181,214,247,280,313,346,379,1040,1106,1139,1205,1337;14:-777,-744,-711,-678,-645,-612,-579,-546,-513,115,148,181,214,247,280,313,346,379,412,445,1006,1039,1105,1138,1171;47:-740,-707,-674,-641,-608,-575,-542,-78,87,120,154,187,220,253,286,319,352,385,418,452,1014,1147,1180;80:-767,-734,-700,-667,-634,-600,-100,-67,-34,0,33,66,99,133,166,199,233,266,299,333,366,399,433,466,499,799,999,1233;113:-858,-723,-689,-151,-117,-84,-50,-16,17,51,85,118,152,185,219,253,286,320,354,387,421,488,758,791,993,1060,1195,1229;146:-913,-879,-845,-163,-129,-95,-61,-27,7,41,76,110,144,178,212,246,280,314,348,382,451,485,758,792,996,1030,1064;179:-1002,-968,-933,-898,-135,-101,-66,-31,3,38,73,107,142,177,211,246,281,315,350,419,454,489,523,558,732,766,801,974,1009,1044,1217;212:-1021,-986,-880,-774,-136,-101,-66,-30,5,41,76,111,147,182,218,253,288,324,359,395,430,465,501,536,571,713,748,784,819,855,925,961,996,1032,1067,1102;245:-1111,-1075,-1038,-1002,-132,-96,-59,-23,13,50,86,122,158,195,231,267,303,340,376,412,448,485,557,702,739,775,811,847,884,920,956,992,1029,1065,1101,1137,1174,1210;278:-1128,-1091,-1054,-1017,-979,-121,-84,-47,-9,28,65,103,140,177,215,252,289,326,364,401,438,476,550,588,625,662,699,737,774,811,849,886,923,961,998,1035,1073,1110,1147,1184;311:-1106,-1068,-1029,-991,-952,-914,-875,-837,-66,-27,11,50,88,127,166,204,243,281,358,397,435,474,512,551,589,628,667,705,744,782,821,859,898,936,975,1013,1052,1090,1129,1168,1206;344:-1160,-1120,-1080,-1040,-1000,-960,-920,-880,-840,-800,-40,0,40,80,360,400,440,480,520,560,600,640,680,720,760,800,840,880,920,960,1000,1040,1080,1120,1160,1200,1320,1360;377:-1216,-1174,-1133,-1091,-1049,-1008,-966,-924,-882,-841,-799,-757,-48,285,327,369,411,452,577,619,661,702,744,786,828,869,911,953,994,1036,1078,1120,1161,1286;410:-1232,-1188,-1144,-1100,-1057,-1013,-969,-925,-882,-838,-794,-751,-51,-7,168,211,255,299,343,430,474,561,605,649,692,736,780,824,867,911,955,998,1042,1086,1130,1173,1217,1261;443:-1201,-1154,-1108,-1062,-1016,-970,-924,-878,-832,-786,-739,-693,-647,-2,44,183,229,275,413,459,505,552,598,644,690,736,782,828,874,920,967,1013,1059,1105,1151,1197,1243,1289,1335,1428;476:-1213,-1164,-1115,-1066,-1017,-968,-919,-870,-821,-772,-723,-674,-577,-528,11,60,109,158,207,255,304,353,402,451,500,549,598,647,696,745,794,843,892,941,990,1038,1087,1136,1185,1234,1283,1332,1381;509:-1224,-1172,-1120,-1067,-1015,-963,-910,-858,-806,-754,-701,-649,-597,-21,31,84,136,188,241,293,345,398,450,502,555,607,659,712,764,816,869,921,973,1026,1078,1130,1183,1235,1287,1339,1392;542:-1292,-1236,-1179,-1123,-1067,-1010,-954,-897,-841,-785,-728,-672,-615,175,231,287,344,400,457,513,569,626,682,739,795,851,908,964,1021,1077,1134,1190,1246,1303,1359,1585;575:-1309,-1247,-1186,-1124,-1063,-1002,-940,-756,-694,-633,104,165,227,288,350,411,472,534,595,657,718,780,841,902,964,1025,1087,1148,1209,1271,1332,1394,1578;608:-1597,-1529,-1462,-1394,-1327,-1259,-1191,-1124,-1056,-988,-718,-447,94,162,229,297,365,432,500,567,635,703,770,838,906,973,1041,1109,1176,1244,1312,1379,1447,1514,1650,1717;641:-1573,-1498,-1422,-1347,-1271,-1196,-1120,-1045,-969,-893,-818,-667,-516,-440,-213,164,240,315,391,466,542,618,693,769,844,920,995,1071,1146,1222,1298,1373,1449,1524,1600,1675,1751;674:-1714,-1628,-1542,-1457,-1371,-1285,-1199,-1113,-1027,-941,-855,-770,-684,-598,-512,-426,-340,-254,-168,-83,3,89,433;707:-1101,-802,-702,-502,-402,-302,297,696,796,896,996,1095,1195,1295,1395,1495;740:-1201,-483,-363,-244,954,1073;773:-599,-449,-299,151,1052';

    const COAST=COAST_S.split(';').map(seg=>{
      const a=seg.split(','), f=new Float32Array(a.length*3);
      for(let i=0;i<a.length;i++){
        const t=a[i], sp=t.indexOf(' ');
        const lo=+t.slice(0,sp)/10*RAD, la=+t.slice(sp+1)/10*RAD, c=Math.cos(la);
        f[i*3]=c*Math.sin(lo); f[i*3+1]=Math.sin(la); f[i*3+2]=c*Math.cos(lo);
      }
      return f;
    });
    const LAND=(function(){
      const v=[];
      for(const band of LAND_S.split(';')){
        const ci=band.indexOf(':'), la=+band.slice(0,ci)/10*RAD, c=Math.cos(la), sy=Math.sin(la);
        for(const t of band.slice(ci+1).split(',')){
          const lo=+t/10*RAD;
          v.push(c*Math.sin(lo), sy, c*Math.cos(lo));
        }
      }
      return new Float32Array(v);
    })();

    /* star field (seeded so it never reshuffles) + orbital dot rings */
    const STARS=[], RINGS=[];
    (function(){
      let sd=771131;
      const rr=()=>{sd=(sd*1103515245+12345)&0x7fffffff; return sd/0x7fffffff;};
      for(let i=0;i<210;i++) STARS.push({x:rr(),y:rr(),r:0.4+rr()*1.1,a:0.10+rr()*0.40,
                                         ph:rr()*6.283,tw:0.4+rr()*1.2});
      for(const [rad,sq,ang,sp] of [[1.09,0.20,-14,0.055],[1.17,0.32,10,-0.041],[1.24,0.12,-27,0.030]]){
        const pts=[];
        for(let i=0;i<118;i++){ const t=i/118*6.2832; pts.push(Math.cos(t),Math.sin(t)*sq,Math.sin(t)); }
        RINGS.push({rad, ca:Math.cos(ang*RAD), sa:Math.sin(ang*RAD), pts:new Float32Array(pts), spin:sp});
      }
    })();

    /* expand each metro into a core plus a little sprawl */
    const LIGHTS=[];
    (function(){
      let seed=20260728;
      const rnd=()=>{seed=(seed*1103515245+12345)&0x7fffffff; return seed/0x7fffffff;};
      for(const c of CITY){
        const mag=c[2];
        LIGHTS.push({v:v3(c[0],c[1]), b:0.72+0.26*mag, s:1.35+0.62*mag,
                     ph:rnd()*6.283, tw:0.5+rnd()*1.1, core:mag>=3});
        const extra=mag>=3?4:mag===2?3:1, sp=0.85+mag*0.8;
        for(let i=0;i<extra;i++){
          LIGHTS.push({v:v3(c[0]+(rnd()-.5)*sp*2, c[1]+(rnd()-.5)*sp*2.7),
                       b:0.30+rnd()*0.44, s:0.85+rnd()*0.85,
                       ph:rnd()*6.283, tw:0.6+rnd()*1.4, core:false});
        }
      }
    })();

    /* ---- geometry / projection ---- */
    let W=0,H=0,CX=0,CY=0,R=0,DPR=1;
    const TILT=-10*RAD, ct=Math.cos(TILT), st=Math.sin(TILT);
    let yaw=-HOME[1]*RAD;                 // radians; Hyderabad faces front at t=0
    let cy_=Math.cos(yaw), sy_=Math.sin(yaw);
    let phase=0;

    function pr(v){
      const x=v[0]*cy_ + v[2]*sy_;
      const z1=-v[0]*sy_ + v[2]*cy_;
      const y=v[1]*ct - z1*st;
      const z=v[1]*st + z1*ct;
      return [CX+R*x, CY-R*y, z];
    }
    const clamp01=x=>x<0?0:x>1?1:x;
    const ss=(e0,e1,x)=>{ const t=clamp01((x-e0)/(e1-e0)); return t*t*(3-2*t); };

    const heroEl=document.querySelector('.hero');
    function splitMode(){ return !!heroEl && heroEl.dataset.hero==='split'; }
    let rightAnchored=false;
    const inClients = BARE || !!host.closest('.clients-band');   // globe is a background here
    function size(){
      const dpr=Math.min(Math.max(window.devicePixelRatio||1,1), 2);
      const cw=host.clientWidth, ch=host.clientHeight;
      if(cw<8||ch<8) return;               // never let the container collapse produce R<1
      DPR=dpr; W=cw; H=ch;
      cv.width=Math.round(W*dpr); cv.height=Math.round(H*dpr);
      cv.style.width=W+'px'; cv.style.height=H+'px';
      rightAnchored = splitMode() && W < H*1.3;   // tall right column (desktop split)
      if(rightAnchored){
        /* full-height globe hugging the right edge: sphere diameter ≈ hero
           height, centre pushed toward the right so ~65% of the disc shows and
           the rest bleeds off-screen. R is capped by width so the left limb
           always stays inside the canvas (needs W ≥ 1.30·R). */
        R = Math.min(H*0.54, W*0.72);
        CX = W - R*0.30;                 // 65% of the sphere visible from the right
        CY = H/2;
      } else if(splitMode()){
        /* stacked band (mobile split): a fuller centred globe */
        CX=W/2; CY=H/2; R=Math.min(W,H)*0.46;
      } else {
        CX=W/2; CY=H/2; R=Math.min(W,H)*RF;
      }
      positionHud();
    }

    /* Anchor the Impact/Toolkit panel to the globe's live left limb so its right
       edge overlaps the sphere (no gap between panel and globe). Recomputed on
       every size()/resize/tab-switch, so it tracks the globe at any viewport. */
    const hudEl=BARE?null:document.getElementById('orbHud');
    function positionHud(){
      if(!hudEl) return;
      if(rightAnchored){
        const hr=host.getBoundingClientRect();       // the canvas/orb box
        const heroR=heroEl.getBoundingClientRect();
        const limbX=hr.left + (CX - R);              // globe left limb, viewport px
        const pw=hudEl.getBoundingClientRect().width || 232;
        const overlap=Math.max(40, R*0.14);          // how far the panel sits over the globe
        let left=limbX + overlap - pw - heroR.left;
        const contentEl=heroEl.querySelector('.hero-mini');
        const minLeft=(contentEl?contentEl.getBoundingClientRect().right - heroR.left:0) + 24;
        if(left<minLeft) left=minLeft;               // never slide under the copy
        hudEl.style.left=Math.round(left)+'px';
        hudEl.style.right='auto';
      } else {
        hudEl.style.left='';                          // hand back to CSS (stacked / center)
        hudEl.style.right='';
      }
    }

    /* ---- HUD (impact + toolkit) ---- */
    const ICO=(p)=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+p+'</svg>';
    const ICON={
      'Figma':        ICO('<rect x="5" y="3" width="7" height="6" rx="3"/><rect x="5" y="9" width="7" height="6" rx="3"/><rect x="5" y="15" width="7" height="6" rx="3"/><circle cx="16" cy="12" r="3"/>'),
      'Figma Make':   ICO('<rect x="4" y="4" width="7" height="6" rx="3"/><rect x="4" y="10" width="7" height="6" rx="3"/><path d="M17 4v6M14 7h6"/><path d="M16 14l1.2 2.6L20 18l-2.8 1.4L16 22l-1.2-2.6L12 18l2.8-1.4z"/>'),
      'Claude':       ICO('<path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4"/>'),
      'Tailwind':     ICO('<path d="M3 9c1.6-3 3.4-4 5.4-3 1.4.7 2 2 3.6 2 2 0 3-1.5 4.5-1.5 1.7 0 3 .8 3.5 2.5"/><path d="M3 16c1.6-3 3.4-4 5.4-3 1.4.7 2 2 3.6 2 2 0 3-1.5 4.5-1.5 1.7 0 3 .8 3.5 2.5"/>'),
      'HTML5':        ICO('<path d="M9.5 7.5L5 12l4.5 4.5M14.5 7.5L19 12l-4.5 4.5"/>'),
      'CSS3':         ICO('<path d="M9.5 4.5C7 4.5 7 8 7 9.5S6 12 4.5 12C6 12 7 12.5 7 14.5S7 19.5 9.5 19.5"/><path d="M14.5 4.5c2.5 0 2.5 3.5 2.5 5s1 2.5 2.5 2.5c-1.5 0-2.5.5-2.5 2.5s0 5-2.5 5"/>'),
      'Sass':         ICO('<path d="M12 3.2s5.6 5 5.6 9.1A5.6 5.6 0 016.4 12.3C6.4 8.2 12 3.2 12 3.2z"/>'),
      'Bootstrap':    ICO('<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><path d="M9.5 8h3.2a2.1 2.1 0 010 4.2H9.5zM9.5 12.2h3.6a2 2 0 010 4H9.5z"/>'),
      'jQuery':       ICO('<path d="M15 7.6c-.9-1-2.2-1.6-3.7-1.6-2.3 0-3.6 1.2-3.6 2.7 0 1.7 1.6 2.3 3.7 2.9 2.4.7 4.1 1.4 4.1 3.4 0 1.8-1.6 3-4 3-1.7 0-3.2-.7-4.1-1.9"/><path d="M12 3.6v16.8"/>'),
      'HTML/CSS':     ICO('<path d="M9.5 7.5L5 12l4.5 4.5M14.5 7.5L19 12l-4.5 4.5"/>'),
      'Penpot':       ICO('<path d="M12 3.4l7.4 5.4-2.8 8.8H7.4L4.6 8.8z"/><path d="M12 3.4v14.2"/>'),
      'Adobe XD':     ICO('<path d="M4.4 7.4l6 9.2M10.4 7.4l-6 9.2"/><path d="M19.6 5.6v11M19.6 10.2h-1.9a3.2 3.2 0 000 6.4h1.9"/>')
    };
    ICON['AI Tools']=ICO('<path d="M9 3.4l1.5 3.3L13.8 8.2l-3.3 1.5L9 13l-1.5-3.3L4.2 8.2l3.3-1.5z"/><path d="M17 12.6l.9 2 2 .9-2 .9-.9 2-.9-2-2-.9 2-.9z"/><path d="M12.4 18.4l.5 1.1 1.1.5-1.1.5-.5 1.1-.5-1.1-1.1-.5 1.1-.5z"/>');
    ICON['Claude Code']=ICO('<rect x="3" y="4.5" width="18" height="15" rx="3"/><path d="M7.5 10l2.4 2.2-2.4 2.2M12.4 14.6h4"/>');
    ICON['ChatGPT']=ICO('<path d="M12 3.6l2.1 1.2a3 3 0 011.5 2.6v1.4l1.2.7a3 3 0 011.5 2.6v2.4l-2.1 1.2a3 3 0 01-3 0L12 14.9l-1.2.8a3 3 0 01-3 0L5.7 14.5v-2.4a3 3 0 011.5-2.6l1.2-.7V7.4a3 3 0 011.5-2.6z"/><path d="M12 9.4v5.5"/>');
    ICON['SCSS']=ICON['Sass'];
    const iconFor=t=>ICON[t]||ICO('<circle cx="12" cy="12" r="3.4"/>');
    function paintHud(s){
      elStats.innerHTML=s.stats.map(r=>
        `<div class="hud-row"><span>${r[0]}</span><b>${r[1]}</b></div>`).join('');
      elTools.innerHTML=`<div class="hud-chips">${s.tools.map(t=>`<i>${iconFor(t)}<u>${t}</u></i>`).join('')}</div>`;
    }
    let hudT=0;
    function swapHud(s){
      if(!elStats||!elTools) return;
      [elStats,elTools].forEach(e=>e.classList.add('out'));
      clearTimeout(hudT);
      hudT=setTimeout(()=>{ paintHud(s); [elStats,elTools].forEach(e=>e.classList.remove('out')); }, 300);
    }

    /* ---- which site is front-most, with hysteresis on the SWITCH only ----
       The tracked site changes only once the previous one has dropped to the
       limb (z<0.02), i.e. while its caption is already fully faded out. So the
       caption text swap and HUD swap always happen under cover of invisibility,
       and can never be seen to jump. */
    let trackedIdx=0, hudIdx=-1;
    let trackPX=0, trackPY=0, trackVis=0;   // active marker screen pos (for the caption leader line)
    let capText='', capNext='', capT=1;   // capT: 0→1 cross-fade progress (1 = settled)
    function siteLabel(s){ return {a:s.proj, b:s.city+', '+s.cc}; }

    function updateTracking(){
      let best=0, bestZ=-2;
      for(let i=0;i<SITES.length;i++){
        const z=pr(v3(SITES[i].lat,SITES[i].lon))[2];
        if(z>bestZ){ bestZ=z; best=i; }
      }
      const zTracked=pr(v3(SITES[trackedIdx].lat,SITES[trackedIdx].lon))[2];
      if(best!==trackedIdx && zTracked<0.02 && bestZ>0.06){
        trackedIdx=best;
      }
      if(hudIdx!==trackedIdx){
        hudIdx=trackedIdx;
        if(!inClients){                      // in clients mode the auto-cycle owns the HUD
          swapHud(SITES[trackedIdx]);
          highlightLogos(trackedIdx);        // keep the logo strip + active label in sync
          const L=siteLabel(SITES[trackedIdx]);
          capNext=L.a+'\u0001'+L.b;          // \u0001 separates bold/muted parts
          if(capText==='') { capText=capNext; capT=1; }  // first paint, no fade
          else capT=0;                       // trigger cross-fade
        }
      }
    }

    /* ---- caption pill, pinned + cross-fading (rendered in-canvas) ---- */
    function roundRect(x,y,w,h,r){
      if(ctx.roundRect){ ctx.beginPath(); ctx.roundRect(x,y,w,h,r); return; }
      ctx.beginPath();
      ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r);
      ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath();
    }
    function measureCap(show,fB,fS){
      const sep=show.indexOf('\u0001');
      const bold=sep>=0?show.slice(0,sep):show, sub=sep>=0?show.slice(sep+1):'';
      ctx.font='600 '+fB.toFixed(1)+'px Inter, system-ui, sans-serif';
      const wB=ctx.measureText(bold).width;
      ctx.font='500 '+fS.toFixed(1)+"px 'JetBrains Mono', ui-monospace, monospace";
      const wS=sub?ctx.measureText(' · '+sub).width:0;
      return {bold,sub,wB,wS,w:wB+wS};
    }
    function drawCapText(m,x,dy,fB,fS,textA){
      ctx.textAlign='left'; ctx.textBaseline='middle';
      ctx.font='600 '+fB.toFixed(1)+'px Inter, system-ui, sans-serif';
      ctx.fillStyle='rgba(255,255,255,'+textA.toFixed(3)+')'; ctx.fillText(m.bold,x,dy+0.5);
      if(m.sub){
        ctx.font='500 '+fS.toFixed(1)+"px 'JetBrains Mono', ui-monospace, monospace";
        ctx.fillStyle='rgba(124,127,129,'+textA.toFixed(3)+')'; ctx.fillText(' · '+m.sub,x+m.wB,dy+0.5);
      }
    }
    function drawCaption(){
      if(inClients) return;             // clients mode uses the DOM 'Now showing' header
      if(!capText) return;
      // opacity gated by how front-facing the tracked site is (smooth, no cutoff)
      const zTracked=pr(v3(SITES[trackedIdx].lat,SITES[trackedIdx].lon))[2];
      const frontA=ss(0.05,0.28,zTracked);
      if(frontA<0.01){ if(capT>=1) capText=capNext; return; }

      const fB=Math.max(12, R*0.030), fS=Math.max(9.5, R*0.023);
      const dot=6, gap=6, padX=Math.max(10,R*0.026), pillH=Math.max(30, R*0.078);

      // during a change, dissolve: old fades 1→0, new fades 0→1, overlapping —
      // no instantaneous glyph swap, so nothing blips
      const changing = capT<1 && capText!==capNext;
      const mCur=measureCap(capText,fB,fS);
      const mNew=changing?measureCap(capNext,fB,fS):null;
      const contentW=dot+gap+Math.max(mCur.w, mNew?mNew.w:0);
      const pillW=contentW+padX*2;
      const anchorX = rightAnchored ? (W - R*0.65) : CX;
      const anchorY = rightAnchored ? (CY - R*0.56) : (CY - R*0.60);
      const cxp=Math.round(anchorX - pillW/2);
      const cyp=Math.round(anchorY - pillH/2);
      const dx=cxp+padX+dot/2, dy=cyp+pillH/2, tx=cxp+padX+dot+gap;

      /* leader line: connect the caption to the active marker so the viewer
         can see exactly which country is being called out. Drawn first (under
         the pill), opacity gated by the same frontness + marker visibility. */
      if(trackVis>0.02 && trackPY>cyp+pillH){
        const lineA=frontA*trackVis;
        const sx=Math.round(anchorX), sy=cyp+pillH;
        ctx.save();
        ctx.globalAlpha=lineA;
        ctx.strokeStyle='rgba(184,239,67,0.55)'; ctx.lineWidth=1.4;
        ctx.setLineDash([2,3]);
        ctx.beginPath(); ctx.moveTo(sx,sy); ctx.lineTo(trackPX,trackPY-6); ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      }

      ctx.save();
      ctx.globalAlpha=frontA;
      roundRect(cxp,cyp,pillW,pillH,pillH/2);
      ctx.fillStyle='rgba(13,15,17,0.94)'; ctx.fill();
      ctx.lineWidth=1; ctx.strokeStyle='rgba(255,255,255,0.14)'; ctx.stroke();
      ctx.beginPath(); ctx.arc(dx,dy,dot/2,0,6.2832);
      ctx.shadowColor='rgba(184,239,67,0.6)'; ctx.shadowBlur=8;
      ctx.fillStyle='#B8EF43'; ctx.fill(); ctx.shadowBlur=0;

      if(changing){
        drawCapText(mCur,tx,dy,fB,fS,1-capT);   // old out
        drawCapText(mNew,tx,dy,fB,fS,capT);      // new in
      } else {
        if(capText!==capNext) capText=capNext;
        drawCapText(mCur,tx,dy,fB,fS,1);
      }
      ctx.restore();
      if(capT>=1 && capText!==capNext) capText=capNext;
    }

    /* ---- orbital dot rings ---- */
    function ringPass(){
      const d=Math.max(.5,0.85*(R/470));
      ctx.fillStyle='rgba(184,239,67,.26)';
      ctx.beginPath();
      for(let k=0;k<RINGS.length;k++){
        const rg=RINGS[k], rr=R*rg.rad, ca=rg.ca, sa=rg.sa;
        const off=phase*rg.spin, co=Math.cos(off), so=Math.sin(off);
        for(let i=0;i<rg.pts.length;i+=3){
          const px=rg.pts[i], py=rg.pts[i+1], pz=rg.pts[i+2];
          const rx=px*co - pz*so, rz=px*so + pz*co;
          const sx=CX+rr*(rx*ca - py*sa), sy2=CY+rr*(rx*sa + py*ca);
          const ax=sx-CX, ay=sy2-CY;
          if(rz<0 && ax*ax+ay*ay < R*R) continue;   // occluded by the globe
          ctx.moveTo(sx+d,sy2); ctx.arc(sx,sy2,d,0,6.2832);
        }
      }
      ctx.fill();
    }

    /* ---- one full frame ---- */
    function draw(){
      if(R<4||W<8||H<8) return;
      ctx.setTransform(DPR,0,0,DPR,0,0);
      ctx.clearRect(0,0,W,H);
      const kk=R/470;

      /* stars (only outside the disc) */
      ctx.globalCompositeOperation='lighter';
      ctx.beginPath();
      for(const s2 of STARS){
        const px=s2.x*W, py=s2.y*H;
        const dx=px-CX, dy=py-CY; if(dx*dx+dy*dy<R*R*1.05) continue;
        const a=s2.a*(0.55+0.45*Math.sin(phase*s2.tw+s2.ph));
        ctx.fillStyle='rgba(196,226,244,'+a.toFixed(3)+')';
        ctx.moveTo(px+s2.r,py); ctx.arc(px,py,s2.r,0,6.2832);
      }
      ctx.fill();
      ctx.globalCompositeOperation='source-over';

      /* clip to the disc for the surface */
      ctx.save(); ctx.beginPath(); ctx.arc(CX,CY,R,0,6.2832); ctx.clip();

      let g=ctx.createRadialGradient(CX-R*.40,CY-R*.46,R*.04,CX,CY,R*1.06);
      g.addColorStop(0,'#112c40'); g.addColorStop(.32,'#071a26'); g.addColorStop(.60,'#040e17');
      g.addColorStop(.84,'#02080f'); g.addColorStop(1,'#010407');
      ctx.fillStyle=g; ctx.fillRect(CX-R,CY-R,R*2,R*2);

      /* coastline path — front-facing segments only. (The old build also
         filled a closed land silhouette with evenodd winding; on a fully
         rotating sphere the back-facing points project onto the limb and the
         even-odd parity of that path inverts large regions every rotation,
         which flashed the whole disc. The landmasses read cleanly from the
         dotted texture + these coastlines, with no fill to invert.) */
      const cpath=new Path2D();
      for(const seg of COAST){
        let up=false;
        for(let i=0;i<seg.length;i+=3){
          const x=seg[i]*cy_ + seg[i+2]*sy_;
          const z1=-seg[i]*sy_ + seg[i+2]*cy_;
          const y=seg[i+1]*ct - z1*st, z=seg[i+1]*st + z1*ct;
          if(z>0.035){ const px=CX+R*x, py=CY-R*y; up?cpath.lineTo(px,py):cpath.moveTo(px,py); up=true; }
          else up=false;
        }
      }

      /* dotted land texture. Depth-bucketed for performance, but with MANY
         buckets (48) so the per-frame brightness step as points migrate
         between buckets is ~2% — below perception. (Coarse bucketing here is
         what made whole continents flash as they rotated.) */
      const LB=48, lb=Array.from({length:LB},()=>[]);
      for(let i=0;i<LAND.length;i+=3){
        const x=LAND[i]*cy_ + LAND[i+2]*sy_;
        const z1=-LAND[i]*sy_ + LAND[i+2]*cy_;
        const y=LAND[i+1]*ct - z1*st, z=LAND[i+1]*st + z1*ct;
        if(z<=0.01) continue;
        lb[Math.min(LB-1,(z*LB)|0)].push(CX+R*x, CY-R*y);
      }
      for(let b=0;b<LB;b++){
        const arr=lb[b]; if(!arr.length) continue;
        const z=(b+.5)/LB, lf=ss(0,0.22,z);
        ctx.fillStyle='rgba(150,190,214,'+((0.05+0.42*z)*lf).toFixed(3)+')';
        ctx.beginPath();
        const r=Math.max(.7,1.9*z*kk);
        for(let i=0;i<arr.length;i+=2){ ctx.moveTo(arr[i]+r,arr[i+1]); ctx.arc(arr[i],arr[i+1],r,0,6.2832); }
        ctx.fill();
      }

      /* coastline: soft bloom + dotted amber */
      ctx.strokeStyle='rgba(255,192,110,.13)'; ctx.lineWidth=Math.max(2.6,4.6*kk); ctx.stroke(cpath);
      ctx.setLineDash([1.8*kk+0.5, 2.4*kk+0.6]);
      ctx.strokeStyle='rgba(255,183,96,.62)'; ctx.lineWidth=Math.max(.9,1.15*kk); ctx.stroke(cpath);
      ctx.setLineDash([]);

      /* city lights, brightness-bucketed (28 levels → ~2% steps), all smooth */
      const B=28, buck=Array.from({length:B},()=>[]), flares=[];
      for(const L of LIGHTS){
        const p=pr(L.v);
        if(p[2]<=0.005) continue;
        const lf=ss(0,0.20,p[2]);
        const tw=0.89+0.11*Math.sin(phase*L.tw*0.6+L.ph);
        const a=clamp01(L.b*tw*(0.20+0.80*Math.pow(p[2],0.8))*lf);
        if(a<0.02) continue;
        buck[Math.min(B-1,(a*B)|0)].push([p[0],p[1],L.s*kk,a]);
        if(L.core){
          const ff=ss(0.22,0.52,p[2]);
          if(ff>0.01) flares.push([p[0],p[1],ff,L.s*kk]);
        }
      }
      ctx.fillStyle='rgba(255,206,138,.065)';
      ctx.beginPath();
      for(let b=0;b<B;b++) for(const q of buck[b]){
        const r=Math.max(.1,q[2]*(0.7+2.5*q[3])); ctx.moveTo(q[0]+r,q[1]); ctx.arc(q[0],q[1],r,0,6.2832);
      }
      ctx.fill();
      ctx.fillStyle='rgba(255,188,116,.06)';
      ctx.beginPath();
      for(const f of flares){ const r=Math.max(.1,f[3]*8*f[2]); ctx.moveTo(f[0]+r,f[1]); ctx.arc(f[0],f[1],r,0,6.2832); }
      ctx.fill();
      for(let b=0;b<B;b++){
        if(!buck[b].length) continue;
        const a=(b+.6)/B;
        ctx.fillStyle='rgba(255,'+Math.round(226-b*1.7)+','+Math.round(176+b*3.2)+','+a.toFixed(3)+')';
        ctx.beginPath();
        for(const q of buck[b]){ const r=Math.max(.6,q[2]); ctx.moveTo(q[0]+r,q[1]); ctx.arc(q[0],q[1],r,0,6.2832); }
        ctx.fill();
      }
      ctx.strokeStyle='rgba(255,240,206,.30)'; ctx.lineWidth=0.8; ctx.beginPath();
      for(const f of flares){
        const l=f[3]*3.6*f[2];
        ctx.moveTo(f[0]-l,f[1]); ctx.lineTo(f[0]+l,f[1]);
        ctx.moveTo(f[0],f[1]-l); ctx.lineTo(f[0],f[1]+l);
      }
      ctx.stroke();

      /* great-circle arc HOME → tracked site, opacity tied to frontness */
      const home=v3(HOME[0],HOME[1]), tgt=v3(SITES[trackedIdx].lat,SITES[trackedIdx].lon);
      const dp=clamp01((home[0]*tgt[0]+home[1]*tgt[1]+home[2]*tgt[2]+1)/2)*2-1;
      const om=Math.acos(Math.max(-1,Math.min(1,dp)));
      const zT=pr(tgt)[2], arcA=ss(0.04,0.30,zT);
      if(om>0.02 && arcA>0.01){
        const sn=Math.sin(om), pts=[];
        for(let i=0;i<=64;i++){
          const t=i/64, k1=Math.sin((1-t)*om)/sn, k2=Math.sin(t*om)/sn;
          const lift=1+0.17*Math.sin(Math.PI*t);
          pts.push(pr([(home[0]*k1+tgt[0]*k2)*lift,(home[1]*k1+tgt[1]*k2)*lift,(home[2]*k1+tgt[2]*k2)*lift]));
        }
        ctx.lineWidth=1.5; ctx.strokeStyle='rgba(184,239,67,'+(0.42*arcA).toFixed(3)+')';
        ctx.beginPath(); let up=false;
        for(const p of pts){ if(p[2]>-0.15){ up?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]); up=true;} else up=false; }
        ctx.stroke();
        const tp=pts[Math.floor((phase*0.38%1)*64)];
        if(tp&&tp[2]>-0.15){
          ctx.fillStyle='rgba(232,255,180,'+(0.95*arcA).toFixed(3)+')';
          ctx.beginPath(); ctx.arc(tp[0],tp[1],2.4,0,6.2832); ctx.fill();
        }
      }

      /* site markers — every marker fades smoothly with its own depth; the
         tracked one gets a bold pin + pulse so the country reads clearly. */
      trackPX=trackPY=0; trackVis=0;
      SITES.forEach((s,i)=>{
        const p=pr(v3(s.lat,s.lon));
        const vis=ss(0.0,0.14,p[2]);
        if(vis<0.02) return;
        const on=i===trackedIdx, al=(0.30+0.7*p[2])*vis;
        const gg=ctx.createRadialGradient(p[0],p[1],0,p[0],p[1],on?26:11);
        gg.addColorStop(0,'rgba(184,239,67,'+((on?.62:.22)*al).toFixed(3)+')');
        gg.addColorStop(1,'rgba(184,239,67,0)');
        ctx.fillStyle=gg; ctx.beginPath(); ctx.arc(p[0],p[1],on?26:11,0,6.2832); ctx.fill();
        if(on){
          trackPX=p[0]; trackPY=p[1]; trackVis=vis;
          /* pulse ring */
          const q=(phase%1.7)/1.7;
          ctx.strokeStyle='rgba(184,239,67,'+(0.55*(1-q)*vis).toFixed(3)+')';
          ctx.lineWidth=1.6; ctx.beginPath();
          ctx.arc(p[0],p[1],Math.max(.3,6+q*30),0,6.2832); ctx.stroke();
          /* crisp static ring */
          ctx.strokeStyle='rgba(184,239,67,'+(0.9*vis).toFixed(3)+')';
          ctx.lineWidth=2; ctx.beginPath(); ctx.arc(p[0],p[1],Math.max(.3,6.5),0,6.2832); ctx.stroke();
          /* filled dot + white core */
          ctx.fillStyle='rgba(184,239,67,'+vis.toFixed(3)+')';
          ctx.beginPath(); ctx.arc(p[0],p[1],Math.max(.3,4.4),0,6.2832); ctx.fill();
          ctx.fillStyle='rgba(245,255,220,'+vis.toFixed(3)+')';
          ctx.beginPath(); ctx.arc(p[0],p[1],Math.max(.3,1.7),0,6.2832); ctx.fill();
        } else {
          ctx.fillStyle='rgba(184,239,67,'+al.toFixed(3)+')';
          ctx.beginPath(); ctx.arc(p[0],p[1],Math.max(.3,2.3),0,6.2832); ctx.fill();
        }
      });

      ctx.restore();   // end disc clip

      /* atmosphere + rim + limb */
      ctx.globalCompositeOperation='lighter';
      let at=ctx.createRadialGradient(CX,CY,0,CX,CY,R*1.22);
      at.addColorStop(0,'rgba(184,239,67,0)');    at.addColorStop(.72,'rgba(184,239,67,0)');
      at.addColorStop(.805,'rgba(184,239,67,.10)');at.addColorStop(.838,'rgba(196,245,120,.30)');
      at.addColorStop(.862,'rgba(140,232,200,.20)');at.addColorStop(.92,'rgba(110,200,220,.07)');
      at.addColorStop(1,'rgba(110,200,220,0)');
      ctx.fillStyle=at; ctx.beginPath();
      ctx.arc(CX,CY,R*1.22,0,6.2832); ctx.arc(CX,CY,R*0.70,0,6.2832);
      ctx.fill('evenodd');
      ctx.globalCompositeOperation='source-over';

      let rim=ctx.createLinearGradient(CX-R*.7,CY-R*.8,CX+R*.7,CY+R*.8);
      rim.addColorStop(0,'rgba(255,255,255,.34)'); rim.addColorStop(.4,'rgba(255,255,255,.08)');
      rim.addColorStop(1,'rgba(255,255,255,.02)');
      ctx.strokeStyle=rim; ctx.lineWidth=1.4;
      ctx.beginPath(); ctx.arc(CX,CY,Math.max(1,R-0.7),0,6.2832); ctx.stroke();

      ctx.strokeStyle='rgba(126,226,214,.30)'; ctx.lineWidth=Math.max(1.1,1.8*kk);
      ctx.beginPath(); ctx.arc(CX,CY,Math.max(1,R-1.6),0,6.2832); ctx.stroke();

      ctx.globalCompositeOperation='lighter';
      ringPass();

      const fpx=CX+R*Math.cos(-52*RAD), fpy=CY+R*Math.sin(-52*RAD);
      let fl=ctx.createRadialGradient(fpx,fpy,0,fpx,fpy,R*0.40);
      fl.addColorStop(0,'rgba(255,232,178,.42)'); fl.addColorStop(.22,'rgba(255,206,128,.16)');
      fl.addColorStop(.55,'rgba(255,190,110,.05)'); fl.addColorStop(1,'rgba(255,190,110,0)');
      ctx.fillStyle=fl; ctx.beginPath(); ctx.arc(fpx,fpy,R*0.40,0,6.2832); ctx.fill();
      ctx.globalCompositeOperation='source-over';

      /* caption last, above everything */
      drawCaption();
    }

    /* ---- clients: build the scrolling strip, auto-highlight one client at a
       time, and let hover pause + hold a client. The globe is just a backdrop. ---- */
    let targetYaw=null, holdUntil=0;                 // (kept for other layouts; unused here)
    let activeIdx=0, autoTimer=null, paused=false;
    const actEl=BARE?null:document.getElementById('hudActive');
    function highlightLogos(idx){
      const nodes=document.querySelectorAll('#logoTrack .logo');
      for(const el of nodes) el.classList.toggle('is-active', +el.dataset.idx===idx);
      if(actEl){ const s=SITES[idx]; actEl.innerHTML='Now showing · <b>'+s.proj+'</b> — '+s.city+', '+s.cc; }
    }
    function selectClient(idx){
      activeIdx=((idx%SITES.length)+SITES.length)%SITES.length;
      swapHud(SITES[activeIdx]);
      highlightLogos(activeIdx);
    }
    function startAuto(){
      if(autoTimer||REDUCE) return;
      autoTimer=setInterval(()=>{ if(!paused && !document.hidden) selectClient(activeIdx+1); }, 2800);
    }
    (function buildLogos(){
      if(BARE) return;
      const track=document.getElementById('logoTrack'); if(!track) return;
      const build=()=>SITES.forEach((s,i)=>{
        const d=document.createElement('div');
        d.className='logo'+(s.logo?' has-mark':'')+(s.logoIcon?' has-icon':''); d.dataset.idx=i;
        /* icon-only marks carry no wordmark, so the name rides alongside them */
        const tag=(s.logoIcon?'<span class="logo-name">'+s.proj+'</span>':'')
          +'<small>'+(CLIENT_TAGS[i]||s.cc)+'</small>';
        d.innerHTML=s.logo
          ? '<img class="logo-mark" style="--mark-w:'+(s.logoW||130)+'" src="'+s.logo+'" alt="'+s.proj+'" loading="lazy" decoding="async"'
            + ' onerror="this.parentNode.classList.remove(\'has-mark\');this.outerHTML=\''+s.proj+'\'">'+tag
          : s.proj+tag;
        d.addEventListener('mouseenter',()=>{ paused=true; selectClient(i); });
        d.addEventListener('click',()=>{ paused=true; selectClient(i); });
        track.appendChild(d);
      });
      build(); build();                              // two copies → seamless -50% loop
      const mq=document.getElementById('logoMarquee');
      if(mq) mq.addEventListener('mouseleave',()=>{ paused=false; });
    })();

    /* ---- clients: swipe / drag the strip, either direction ----
       The CSS keyframe hands the track over to rAF here so a finger (or a
       mouse, or the arrow keys) can push the row forward and back, with the
       flick carrying on and easing back into the ambient right-to-left drift. */
    (function swipeStrip(){
      if(BARE||REDUCE) return;
      const mq=document.getElementById('logoMarquee');
      const track=document.getElementById('logoTrack');
      const hint=document.getElementById('swipeHint');
      if(!mq||!track) return;
      track.classList.add('is-swipe');

      const GAP=parseFloat(getComputedStyle(track).columnGap)||14;
      let period=0, speed=0;                        // one copy's width, and px/sec of drift
      function measure(){
        /* the track holds two copies; one loop = half the run plus the seam gap */
        period=(track.scrollWidth + GAP)/2;
        speed=period/80;                            // same 80s-per-lap tempo as the keyframe
      }
      measure();
      window.addEventListener('resize',measure,{passive:true});
      window.addEventListener('load',measure);

      let pos=0, vel=0, drag=null, moved=0, nudge=0, nudgeT=-1, hinted=false, resume=0;
      const now=()=>performance.now();

      function frame(t){
        const dt=Math.min(64, t-(frame.prev||t)); frame.prev=t;
        if(!drag){
          if(!paused && !document.hidden) pos -= speed*dt/1000;
          if(vel){                                  // flick momentum, decaying to nothing
            pos += vel*dt;
            vel *= Math.pow(0.0025, dt/1000);
            if(Math.abs(vel)<0.004) vel=0;
          }
        }
        if(nudgeT>=0){                              // the one-time "it moves" demo
          const k=(t-nudgeT)/1900;
          if(k>=1){ nudge=0; nudgeT=-1; }
          else nudge=-58*Math.sin(k*2*Math.PI)*(1-k);
        }
        if(period>0){ while(pos<=-period) pos+=period; while(pos>0) pos-=period; }
        track.style.transform='translate3d('+(pos+nudge).toFixed(2)+'px,0,0)';
        if(resume && t>resume){ resume=0; if(!mq.matches(':hover')) paused=false; }
        requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);

      /* ---- pointer drag (mouse, pen and touch through one path) ---- */
      function down(e){
        if(e.button>0) return;
        drag={x:e.clientX, t:now()}; moved=0; vel=0;
        paused=true; dismissHint();
        mq.classList.add('is-dragging');
        try{ mq.setPointerCapture(e.pointerId); }catch(_){}
      }
      function move(e){
        if(!drag) return;
        const dx=e.clientX-drag.x, dt=Math.max(8, now()-drag.t);
        pos+=dx; moved+=Math.abs(dx);
        vel=dx/dt;                                  // px per ms, handed to the momentum decay
        drag.x=e.clientX; drag.t=now();
        if(moved>6) e.preventDefault();
      }
      function up(e){
        if(!drag) return;
        drag=null; mq.classList.remove('is-dragging');
        try{ mq.releasePointerCapture(e.pointerId); }catch(_){}
        if(Math.abs(vel)>2.2) vel=2.2*Math.sign(vel);   // cap a violent flick
        mq.dataset.swiped = moved>6 ? '1' : '';
        resume=now()+1600;                          // let the auto-rotate settle back in
      }
      mq.addEventListener('pointerdown',down);
      mq.addEventListener('pointermove',move,{passive:false});
      mq.addEventListener('pointerup',up);
      mq.addEventListener('pointercancel',up);
      /* a drag that ends on a chip must not read as a click on that client */
      mq.addEventListener('click',e=>{
        if(mq.dataset.swiped==='1'){ e.stopPropagation(); e.preventDefault(); mq.dataset.swiped=''; }
      },true);

      /* ---- trackpad: a two-finger sideways swipe is the desktop gesture ---- */
      mq.addEventListener('wheel',e=>{
        if(Math.abs(e.deltaX)<=Math.abs(e.deltaY)) return;   // vertical stays with the page
        e.preventDefault(); dismissHint();
        pos-=e.deltaX; vel=0;
        paused=true; resume=now()+1200;
      },{passive:false});

      /* ---- keyboard: same row, without a pointer ---- */
      mq.addEventListener('keydown',e=>{
        if(e.key!=='ArrowLeft' && e.key!=='ArrowRight') return;
        e.preventDefault(); dismissHint();
        vel=(e.key==='ArrowLeft'? 1 : -1)*1.1;
        paused=true; resume=now()+1600;
      });

      /* ---- first-run cue: label + a nudge that shows both directions ---- */
      function dismissHint(){
        if(!hint) return;
        hint.classList.remove('is-on');
        hinted=true; nudgeT=-1; nudge=0;
      }
      function showHint(){
        if(hinted||!hint) return;
        hinted=true;
        hint.classList.add('is-on');
        nudgeT=now();
        setTimeout(()=>hint.classList.remove('is-on'), 4200);
      }
      ['pointerdown','wheel','touchstart'].forEach(ev=>
        mq.addEventListener(ev,dismissHint,{passive:true,once:true}));

      if('IntersectionObserver' in window){
        const io=new IntersectionObserver(es=>{
          es.forEach(en=>{ if(en.isIntersecting){ io.disconnect(); setTimeout(showHint,700); } });
        },{threshold:.45});
        io.observe(mq);
      } else setTimeout(showHint,1600);
    })();

    /* ---- loop: continuous rotation that speeds up between clients and eases
       to a slow drift when one is front-and-centre (never fully stops, so it
       stays flicker-free) ---- */
    let last=performance.now(), live=true;
    const OMEGA_BASE = REDUCE?0 : (2*Math.PI/22);   // fast cruise ≈ 22s/rev
    function frame(now){
      if(BARE && !host.isConnected) return;
      const dt=Math.min(now-last,50)/1000; last=now;
      phase+=dt;
      if(capT<1) capT=Math.min(1, capT+dt/0.5);
      if(live){
        if(OMEGA_BASE>0){
          if(targetYaw!=null && now<holdUntil){
            /* a logo was hovered/selected — ease the globe round to that client */
            let d=((targetYaw - yaw + Math.PI)%(2*Math.PI)) - Math.PI;
            yaw += d*Math.min(1, dt*2.8);
            cy_=Math.cos(yaw); sy_=Math.sin(yaw);
          } else {
            targetYaw=null;
            /* how centred is the nearest client right now? */
            let mz=0; for(const s of SITES){ const z=pr(v3(s.lat,s.lon))[2]; if(z>mz) mz=z; }
            const ease=Math.pow(mz<0?0:mz,4);            // ~1 when a client is dead-centre
            const speed=OMEGA_BASE*(0.16+0.84*(1-ease)); // slow to 16% on a client, full between
            yaw -= speed*dt;
            cy_=Math.cos(yaw); sy_=Math.sin(yaw);
          }
        }
        updateTracking();
        draw();
      }
      requestAnimationFrame(frame);
    }

    /* ---- flipping headline (kept) ---- */
    (function(){
      if(BARE) return;
      const box=document.getElementById('flipw'); if(!box) return;
      const inner=box.firstElementChild;
      const WORDS=['understand','rely on','trust','believe in'];
      let k=0, widths=[];
      function measure(){
        const cs=getComputedStyle(box);
        const m=document.createElement('span');
        m.style.cssText='position:absolute;left:-9999px;top:0;white-space:nowrap;visibility:hidden';
        m.style.font=cs.font; m.style.fontWeight=cs.fontWeight;
        m.style.fontSize=cs.fontSize; m.style.fontFamily=cs.fontFamily;
        m.style.letterSpacing=cs.letterSpacing;
        document.body.appendChild(m);
        widths=WORDS.map(w=>{m.textContent=w; return Math.ceil(m.getBoundingClientRect().width)+1;});
        m.remove();
        box.style.width=widths[k]+'px';
      }
      measure();
      if(document.fonts&&document.fonts.ready) document.fonts.ready.then(measure);
      let rz2; window.addEventListener('resize',()=>{clearTimeout(rz2);rz2=setTimeout(measure,150);});
      if(REDUCE) return;
      /* Crossfade, not a swap. The old code hid the word, waited out the exit,
         then revealed the next one — which leaves the slot visibly empty for
         the length of the exit, with the accent underline stranded under
         nothing. Here the outgoing word is lifted out of flow as an absolutely
         positioned ghost, so the incoming word can arrive on the same frame
         and the two cross over each other. The slot is never empty.
         OUT_MS only governs when the spent ghost is dropped from the DOM; it
         just has to outlast .flipi.out's .36s transform in main.css. */
      const OUT_MS=520, HOLD_MS=3300;
      setTimeout(()=>{
        setInterval(()=>{
          const ghost=inner.cloneNode(true);
          ghost.style.cssText='position:absolute;white-space:nowrap;pointer-events:none;'+
            'left:'+inner.offsetLeft+'px;top:'+inner.offsetTop+'px';
          box.appendChild(ghost);

          k=(k+1)%WORDS.length;
          inner.textContent=WORDS[k];
          inner.classList.add('pre');
          void inner.offsetWidth;
          inner.classList.remove('pre');
          /* Width eases on the same beat, so the underline glides between the
             two lengths while both words are on screen. */
          box.style.width=widths[k]+'px';

          void ghost.offsetWidth;
          ghost.classList.add('out');
          setTimeout(()=>ghost.remove(), OUT_MS);
        },HOLD_MS);
      },3400);
    })();

    /* ---- init ---- */
    size();
    if(!BARE){
      paintHud(SITES[activeIdx]); hudIdx=activeIdx;
      highlightLogos(activeIdx);
      startAuto();
      { const L=siteLabel(SITES[trackedIdx]); capText=L.a+'\u0001'+L.b; capNext=capText; capT=1; }
      window.__orbResize=size;
    }
    let rz; window.addEventListener('resize',()=>{clearTimeout(rz);rz=setTimeout(size,120);});
    if('IntersectionObserver' in window){
      new IntersectionObserver(e=>{live=e[0].isIntersecting;},{threshold:0}).observe(host);
    }
    if(REDUCE){ updateTracking(); draw(); }   // one static frame
    requestAnimationFrame(frame);
  }
  /* The hero globe sits behind the intro loader, so running it during the
     intro is a second full-canvas redraw per frame that nobody can see —
     it was costing the loader roughly half its long frames. Hold it until
     the loader signals it's gone, with a timeout so it can never be lost. */
  (function(){
    const hero = ()=>createNightGlobe(document.getElementById('orb'));
    const loaderUp = document.getElementById('pageLoader');
    createNightGlobe(document.getElementById('plOrb'), {bare:true, rf:0.46});
    if(!loaderUp){ hero(); return; }
    let started=false;
    const go=()=>{ if(started) return; started=true; hero(); };
    window.addEventListener('pl:done', go, {once:true});
    setTimeout(go, 9000);
  })();


  /* ---------- HERO DECISION CARD ---------- */
  (function(){
    const pipe=document.getElementById('pipe'); if(!pipe) return;
    const caps=['What the model returns.','What I design.','What the human is accountable for.'];
    const sts=[...pipe.querySelectorAll('.st')];
    const dots=[...document.getElementById('pipeDots').children];
    const cap=document.getElementById('pipeCap');
    const reduce=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    let i=0,timer=null,held=false;

    function show(n){
      i=n;
      sts.forEach((s,k)=>s.classList.toggle('on',k===n));
      dots.forEach((d,k)=>d.classList.toggle('on',k===n));
      cap.textContent=caps[n];
    }
    function play(){ if(reduce||held) return; stop(); timer=setInterval(()=>show((i+1)%3), i===1?4200:3200); }
    function stop(){ if(timer){clearInterval(timer);timer=null;} }

    dots.forEach(d=>d.addEventListener('click',()=>{held=true;stop();show(+d.dataset.s);}));
    pipe.addEventListener('mouseenter',stop);
    pipe.addEventListener('mouseleave',play);
    document.addEventListener('visibilitychange',()=>document.hidden?stop():play());

    // size the body to its tallest state so no step is ever clipped
    const body=pipe.querySelector('.pipe-body');
    function fit(){
      body.style.minHeight='0px';
      const tall=Math.max(...sts.map(s=>s.scrollHeight));
      body.style.minHeight=(tall+42)+'px';
    }
    fit();
    if(document.fonts&&document.fonts.ready) document.fonts.ready.then(fit);
    let rz; window.addEventListener('resize',()=>{clearTimeout(rz);rz=setTimeout(fit,140);});

    if(reduce){show(1);} else {show(0);play();}
  })();


  /* ---------- MOBILE APPS — screen switcher ---------- */
  /* Auto-advances only while the card is on screen, and stops for good the
     moment someone picks a screen themselves — a reel that keeps moving
     under a reader's finger is worse than no reel. */
  (function(){
    const cards=[...document.querySelectorAll('.mob-card')]; if(!cards.length) return;
    const reduce=window.matchMedia('(prefers-reduced-motion:reduce)').matches;

    cards.forEach(card=>{
      const btns=[...card.querySelectorAll('.mob-switch button')];
      const scr=[...card.querySelectorAll('.pscreen')];
      const cap=card.querySelector('.mob-cap');
      if(btns.length<2||!scr.length) return;
      const caps=btns.map(b=>b.dataset.cap||'');
      let i=0,timer=null,held=false,seen=false;

      function show(n){
        i=n;
        scr.forEach((s,k)=>{s.classList.toggle('on',k===n);s.setAttribute('aria-hidden',k===n?'false':'true');});
        btns.forEach((b,k)=>{b.classList.toggle('on',k===n);b.setAttribute('aria-pressed',k===n?'true':'false');});
        if(cap) cap.textContent=caps[n];
      }
      function stop(){ if(timer){clearInterval(timer);timer=null;} }
      function play(){ if(reduce||held||!seen||timer) return; timer=setInterval(()=>show((i+1)%scr.length),4600); }

      btns.forEach((b,k)=>b.addEventListener('click',()=>{held=true;stop();show(k);}));
      card.addEventListener('mouseenter',stop);
      card.addEventListener('mouseleave',play);
      card.addEventListener('focusin',()=>{held=true;stop();});
      document.addEventListener('visibilitychange',()=>document.hidden?stop():play());

      new IntersectionObserver(es=>es.forEach(en=>{
        seen=en.isIntersecting;
        if(seen) play(); else stop();
      }),{threshold:0.3}).observe(card);

      show(0);
    });
  })();
