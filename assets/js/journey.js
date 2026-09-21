/* Section seams. Each chapter closes on a question. As it scrolls in, a guide
   cursor sketches the next chapter's subject in one continuous line, then runs
   that same line across the fold, lands on the chapter's ◆ and selects its
   heading the way a design tool would.
   Scrolling always belongs to the visitor: nothing here moves the page. */
(() => {
  const seams = [...document.querySelectorAll('.seam')];
  if (!seams.length) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const NS = 'http://www.w3.org/2000/svg';
  const clamp = v => Math.max(0, Math.min(1, v));
  const svgEl = (name, cls) => {
    const n = document.createElementNS(NS, name);
    n.setAttribute('class', cls);
    return n;
  };
  // Layout position, deliberately blind to transforms: the headings this line
  // lands on are still mid-.reveal (translated 22px) when they are first measured.
  const pagePos = node => {
    let x = 0, y = 0;
    for (let n = node; n; n = n.offsetParent) { x += n.offsetLeft; y += n.offsetTop; }
    return {x, y};
  };

  /* ---------- pen: glyphs are authored in a 100-unit box, emitted in seam pixels ---------- */
  function pen(scale, tx, ty) {
    let d = '', px = 0, py = 0;
    const X = x => +(x * scale + tx).toFixed(1), Y = y => +(y * scale + ty).toFixed(1);
    const api = {
      M(x, y) { d += `M${X(x)} ${Y(y)}`; px = x; py = y; return api; },
      L(x, y) { d += `L${X(x)} ${Y(y)}`; px = x; py = y; return api; },
      Q(a, b, x, y) { d += `Q${X(a)} ${Y(b)} ${X(x)} ${Y(y)}`; px = x; py = y; return api; },
      C(a, b, c, e, x, y) { d += `C${X(a)} ${Y(b)} ${X(c)} ${Y(e)} ${X(x)} ${Y(y)}`; px = x; py = y; return api; },
      // quarter-circle cubics; angles in degrees, screen-clockwise when dir is 1
      arc(cx, cy, r, from, quarters, dir = 1) {
        const k = .5523 * r, rad = a => a * Math.PI / 180;
        for (let i = 0, a0 = from; i < quarters; i++, a0 += 90 * dir) {
          const a1 = a0 + 90 * dir;
          const p0 = [cx + r * Math.cos(rad(a0)), cy + r * Math.sin(rad(a0))];
          const p1 = [cx + r * Math.cos(rad(a1)), cy + r * Math.sin(rad(a1))];
          api.C(p0[0] - dir * k * Math.sin(rad(a0)), p0[1] + dir * k * Math.cos(rad(a0)),
                p1[0] + dir * k * Math.sin(rad(a1)), p1[1] - dir * k * Math.cos(rad(a1)), p1[0], p1[1]);
        }
        return api;
      },
      get d() { return d; },
      get point() { return {x: X(px), y: Y(py)}; }
    };
    return api;
  }

  // One unbroken stroke each. The return value is the direction the line leaves in.
  const glyphs = {
    globe(p) {       // equator last, so the line leaves from its western edge
      p.M(90, 50).arc(50, 50, 40, 0, 1)
        .C(26, 76, 26, 24, 50, 10).C(74, 24, 74, 76, 50, 90)
        .arc(50, 50, 40, 90, 3).Q(50, 62, 10, 50);
      return [-.35, 1];
    },
    window(p) {      // browser chrome, toolbar rule, then a line of content
      p.M(92, 36).L(92, 24).Q(92, 16, 84, 16).L(16, 16).Q(8, 16, 8, 24).L(8, 36).L(92, 36)
        .L(92, 78).Q(92, 86, 84, 86).L(16, 86).Q(8, 86, 8, 78).L(8, 36);
      return [-.7, .7];
    },
    phone(p) {
      p.M(72, 80).L(72, 86).Q(72, 95, 63, 95).L(37, 95).Q(28, 95, 28, 86).L(28, 80).L(72, 80)
        .L(72, 14).Q(72, 5, 63, 5).L(37, 5).Q(28, 5, 28, 14).L(28, 80);
      return [-.6, 1];
    },
    clock(p) {       // hour hand, minute hand out to nine, then the face, wound backwards
      p.M(50, 26).L(50, 50).L(10, 50).arc(50, 50, 40, 180, 4, -1);
      return [-.2, 1];
    },
    squiggle(p) {    // the design squiggle: a tangle that resolves into one clean line
      p.M(92, 26).C(64, -4, 56, 92, 84, 82).C(108, 72, 74, 8, 60, 40)
        .C(50, 66, 80, 88, 66, 62).C(56, 42, 42, 38, 45, 58)
        .C(47, 72, 35, 68, 33, 57).C(31, 48, 25, 56, 18, 56).C(10, 56, 4, 62, 2, 76);
      return [-.15, 1];
    },
    star(p) {        // the five-stroke star, finishing on its lower-left point
      p.M(24.1, 87.6).L(50, 8).L(75.9, 87.6).L(8.2, 38.4).L(91.8, 38.4).L(24.1, 87.6);
      return [-.8, .6];
    },
    bubble(p) {      // speech bubble, ending on the tip of its tail
      p.M(18, 94).L(36, 74).L(84, 74).Q(92, 74, 92, 66).L(92, 20).Q(92, 12, 84, 12)
        .L(16, 12).Q(8, 12, 8, 20).L(8, 66).Q(8, 74, 16, 74).L(21, 74).L(18, 94);
      return [-.4, 1];
    },
    question(p) {    // hook, stem, and the dot as one small loop
      p.M(30, 32).C(30, 4, 72, 4, 72, 30).C(72, 50, 50, 48, 50, 70).L(50, 80).arc(50, 87, 7, 270, 5, -1);
      return [-.35, 1];
    },
    person(p) {      // right shoulder, neck, head, left shoulder
      p.M(90, 94).C(90, 70, 72, 58, 50, 58).L(50, 50).arc(50, 30, 20, 90, 4)
        .L(50, 58).C(28, 58, 10, 70, 10, 94);
      return [-.3, 1];
    }
  };

  const entries = seams.map(seam => {
    const target = document.getElementById(seam.hash.slice(1));
    const slot = seam.querySelector('.seam-glyph');
    if (!target || !slot) return null;
    const dot = target.querySelector('.eyebrow .dot');
    const anchor = dot || target.querySelector('[data-seam-anchor]') || target;
    if (dot) dot.classList.add('seam-dot');
    const label = target.getAttribute('aria-labelledby');
    const heading = target.querySelector('h2') || (label && document.getElementById(label));

    // question → word spans, so it can ink in as it is read
    const q = seam.querySelector('.seam-q');
    const words = q.textContent.trim().split(/\s+/).map(text => {
      const w = document.createElement('span');
      w.className = 'sw';
      w.textContent = text;
      return w;
    });
    q.textContent = '';
    words.forEach((w, i) => q.append(i ? ' ' : '', w));

    const svg = svgEl('svg', 'seam-thread');
    svg.setAttribute('aria-hidden', 'true');
    const parts = {
      ghost: svgEl('path', 'st-ghost'), line: svgEl('path', 'st-line'),
      probe: svgEl('path', 'st-probe'),
      a2: svgEl('rect', 'st-a2'), ring: svgEl('circle', 'st-ring')
    };
    parts.line.setAttribute('pathLength', '1');
    svg.append(...Object.values(parts));

    const cursor = document.createElement('span');
    cursor.className = 'seam-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    cursor.innerHTML = '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M2.2 1.4 13.6 6.6l-4.9 1.5-2.1 4.7z"/></svg><b></b>';
    cursor.lastChild.textContent = seam.dataset.label || '';

    // the selection the cursor leaves on the next heading
    const sel = document.createElement('span');
    sel.className = 'seam-sel';
    sel.setAttribute('aria-hidden', 'true');
    sel.innerHTML = '<i></i><i></i><i></i><i></i><b></b>';
    seam.append(svg, sel, cursor);

    return {seam, slot, dot, anchor, heading, words, parts, cursor, sel,
      draw: glyphs[seam.dataset.glyph] || glyphs.globe,
      p: 0, len: 0, split: .5, gy: 0, ey: 0, xy: 0, docked: false};
  }).filter(Boolean);

  const set = (node, attrs) => { for (const k in attrs) node.setAttribute(k, attrs[k]); };

  function measure(e) {
    const o = pagePos(e.seam), g = pagePos(e.slot), a = pagePos(e.anchor);
    const size = e.slot.offsetWidth;
    const p = pen(size / 100, g.x - o.x, g.y - o.y);
    const [ux, uy] = e.draw(p);
    const glyphD = p.d, exit = p.point;
    const ex = e.dot ? a.x - o.x + e.anchor.offsetWidth / 2 : a.x - o.x - 16;
    const ey = a.y - o.y + e.anchor.offsetHeight / 2;
    const reach = Math.hypot(ex - exit.x, ey - exit.y);
    // dive below the seam's copy first, then sweep in and settle onto the ◆ from its upper side
    const k1 = Math.max(70, reach * .32), k2 = Math.max(48, (ey - exit.y) * .5);
    const lean = Math.sign(exit.x - ex) * Math.min(200, Math.abs(exit.x - ex) * .28);
    const d = `${glyphD}C${(exit.x + ux * k1).toFixed(1)} ${(exit.y + uy * k1).toFixed(1)} ${(ex + lean).toFixed(1)} ${(ey - k2).toFixed(1)} ${ex} ${ey}`;
    const {ghost, line, probe, a2, ring} = e.parts;
    ghost.setAttribute('d', d);
    line.setAttribute('d', d);
    probe.setAttribute('d', glyphD);
    set(a2, {x: ex - 7, y: ey - 7, width: 14, height: 14, transform: `rotate(45 ${ex} ${ey})`});
    set(ring, {cx: ex, cy: ey, r: 9});
    e.len = ghost.getTotalLength();
    e.split = probe.getTotalLength() / e.len;   // share of the stroke spent sketching
    e.gy = g.y - o.y; e.xy = exit.y; e.ey = ey;
    e.flipAt = e.seam.offsetWidth - 190;

    if (e.heading) {   // hug the heading's text, not its full-width block
      const h = pagePos(e.heading), box = e.heading.getBoundingClientRect();
      const range = document.createRange();
      range.selectNodeContents(e.heading);
      const text = range.getBoundingClientRect();
      const w = Math.min(text.width, e.heading.offsetWidth), pad = 8;
      Object.assign(e.sel.style, {
        left: (h.x - o.x + (text.left - box.left) - pad) + 'px',
        top: (h.y - o.y - pad + 2) + 'px',
        width: (w + pad * 2) + 'px',
        height: (e.heading.offsetHeight + pad * 2 - 4) + 'px'
      });
      e.sel.lastChild.textContent = `${Math.round(w)} × ${e.heading.offsetHeight}`;
    }
  }

  function paint(e) {
    const p = e.p;
    e.seam.style.setProperty('--p', p.toFixed(4));
    const pt = e.parts.ghost.getPointAtLength(e.len * p);
    e.cursor.style.transform = `translate(${pt.x.toFixed(1)}px,${pt.y.toFixed(1)}px)`;
    e.cursor.classList.toggle('is-flip', pt.x > e.flipAt);
    e.cursor.classList.toggle('is-on', p > .01 && p < .992);
    // while it sketches, the pointer works alone; its name tag joins for the journey
    // ...and steps aside again before it would cover the eyebrow it is landing on
    e.cursor.classList.toggle('is-tagged', p > e.split && p < .9);
    const docked = p >= .992;
    if (docked !== e.docked && (docked || p < .9)) {
      e.docked = docked;
      e.seam.classList.toggle('is-docked', docked);
      if (e.dot) e.dot.classList.toggle('is-lit', docked);
    }
  }

  // returns true while the eased value is still catching up with the scroll position
  function step(e, snap) {
    const top = e.seam.getBoundingClientRect().top, vh = innerHeight;
    const read = clamp((vh * .94 - top) / (vh * .36));
    e.words.forEach((w, i) => w.classList.toggle('on', read > (i + .5) / e.words.length));
    let goal = 1;
    if (!reduced.matches) {
      const sketch = clamp((vh * .9 - (top + e.gy)) / (vh * .34));
      const travel = sketch < 1 ? 0 : clamp((vh * .66 - (top + e.xy)) / (vh * .16 + (e.ey - e.xy)));
      goal = e.split * sketch + (1 - e.split) * travel;
    }
    const gap = goal - e.p;
    e.p = snap || reduced.matches || Math.abs(gap) < .002 ? goal : e.p + gap * .18;
    paint(e);
    return e.p !== goal;
  }

  const visible = new Set();
  let raf = 0;
  function tick() {
    raf = 0;
    let more = false;
    visible.forEach(e => { if (step(e)) more = true; });
    if (more) raf = requestAnimationFrame(tick);
  }
  const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
  const remeasure = () => { entries.forEach(measure); kick(); };

  if ('IntersectionObserver' in window) {
    // the line hangs well below its seam, so keep painting while that part is on screen
    const io = new IntersectionObserver(changes => {
      changes.forEach(change => {
        const e = entries.find(item => item.seam === change.target);
        if (change.isIntersecting) { measure(e); visible.add(e); }
        else { visible.delete(e); step(e, true); }
      });
      kick();
    }, {rootMargin: '700px 0px 200px 0px'});
    entries.forEach(e => io.observe(e.seam));
  } else entries.forEach(e => visible.add(e));

  addEventListener('scroll', kick, {passive: true});
  addEventListener('resize', remeasure, {passive: true});
  addEventListener('load', remeasure);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(remeasure);
  reduced.addEventListener('change', remeasure);
  remeasure();
})();
