// Depth over grain: a faint, slowly moving mesh gradient in the accent family
// (Paper Shaders, WebGL2) with fine film grain sits under the soft-depth
// hairlines. The lines take their tint from the colour beneath them, and the
// travelling light borrows it, so line and haze read as one surface.
import { ShaderMount, meshGradientFragmentShader } from '@paper-design/shaders';

const OVERSCAN = 40; // the haze is larger than the field, so a shift never shows an edge
const HAZE_SPEED = 0.3; // shader time runs at 30% of real time
const STILL_FRAME = 21000; // a composed moment for reduced motion

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const smooth = (a, b, x) => { const u = clamp((x - a) / (b - a)); return u * u * (3 - 2 * u); };
const ease = (x) => (x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2);
const mix = (p, q, u) => p.map((v, i) => v + (q[i] - v) * u);
const css = ([r, g, b], a) => `rgb(${r | 0} ${g | 0} ${b | 0} / ${Math.max(0, a).toFixed(3)})`;
const rnd = Math.random;

// far -> near: density (px^2 per point), drift px/s, pointer parallax px,
// scroll parallax, alpha, line width, link cap.
const LAYERS = [
  { den: 24000, max: 40, v: 3, par: 5, scr: 0.22, a: 0.75, w: 1, cap: 7 },
  { den: 34000, max: 28, v: 5, par: 11, scr: 0.1, a: 0.85, w: 0.8, cap: 6 },
  { den: 50000, max: 18, v: 8, par: 20, scr: 0, a: 1, w: 1, cap: 5 },
].map((l) => ({ ...l, nodes: [], links: new Map(), R: 1, px: 0, py: 0, oy: 0 }));

function init(root, hero) {
  const html = document.documentElement;
  const hazeEl = root.querySelector('.gg-haze');
  const cvF = root.querySelector('.gg-far');
  const cvN = root.querySelector('.gg-near');
  const cF = cvF.getContext('2d');
  const cN = cvN.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = matchMedia('(pointer: coarse)').matches;

  let W = 0, H = 0, dpr = 1, theme = null;
  let quietBox = { x: 0, y: 0, rx: 1, ry: 1 };
  const ptr = { x: -1e4, y: -1e4, cx: null, cy: null, on: 0, to: 0 };
  let glint = null, nextGlint = 0, last = 0, raf = 0, odd = false;
  let visible = !document.hidden, inView = true;

  // Haze geometry, mirrored on the CPU so lines can sample the colour under them.
  const haze = { mount: null, frame: reduce ? STILL_FRAME : 4000, w: 1, h: 1, S: 1, scale: 1, offX: 0, offY: 0, tx: 0, ty: 0, kx: 0, ky: 0, spots: [] };

  const readTheme = () => {
    const s = getComputedStyle(html);
    const nums = (name) => s.getPropertyValue(name).split(/[\s,/]+/).filter(Boolean).map(Number);
    theme = {
      line: nums('--field-line'),
      acc: nums('--field-accent'),
      k: Number.parseFloat(s.getPropertyValue('--field-k')) || 0.2,
      tint: Number.parseFloat(s.getPropertyValue('--haze-tint')) || 0,
      grain: Number.parseFloat(s.getPropertyValue('--haze-grain')) || 0,
      colours: [1, 2, 3, 4, 5].map((i) => nums(`--haze-${i}`)),
      dark: html.dataset.theme === 'dark',
    };
    haze.mount?.setUniforms({
      u_colors: theme.colours.map(([r, g, b, a]) => [r / 255, g / 255, b / 255, a]),
      u_colorsCount: theme.colours.length,
      u_grainOverlay: theme.grain,
    });
  };

  // Quiet zone behind the name, lead and CTAs: lines there drop to a fraction
  // of their strength. A squircle, so it hugs the text block.
  const quiet = (x, y) => {
    const q = quietBox;
    const e = (((x - q.x) / q.rx) ** 4 + ((y - q.y) / q.ry) ** 4) ** 0.25;
    const f = W < 700 ? 0.42 : 0.22; // on phones the text spans the field
    return f + (1 - f) * smooth(0.8, 1.3, e);
  };

  // --- Haze -----------------------------------------------------------------
  // Colour spot positions, the same formula as Paper's mesh gradient.
  const updateSpots = () => {
    const t = 0.5 * (haze.frame * 1e-3 + 41.5);
    haze.spots = theme.colours.map((c, i) => {
      const a = i * 0.37, b = 0.6 + ((i / 3) % 1) * 0.9, k = 0.8 + (((i + 1) / 4) % 1);
      return { x: 0.5 + 0.5 * Math.sin(t * b + a), y: 0.5 + 0.5 * Math.cos(t * k + a * 1.5), c };
    });
  };

  // Approximate haze colour and coverage at a field point (no warp or grain).
  const sampleHaze = (x, y) => {
    if (!haze.mount) return { rgb: theme.acc, a: 0 }; // the CSS fallback haze does not tint lines
    const px = x + OVERSCAN - haze.tx, py = y + OVERSCAN - haze.ty;
    const u = ((px - haze.w / 2) / haze.S - haze.offX) / haze.scale + 0.5;
    const v = ((haze.h / 2 - py) / haze.S + haze.offY) / haze.scale + 0.5;
    let r = 0, g = 0, b = 0, a = 0, sum = 0;
    for (const s of haze.spots) {
      const w = 1 / (Math.hypot(u - s.x, v - s.y) ** 3.5 + 1e-3);
      const [cr, cg, cb, ca] = s.c;
      r += cr * ca * w; g += cg * ca * w; b += cb * ca * w; a += ca * w; sum += w;
    }
    return a > 0 ? { rgb: [r / a, g / a, b / a], a: a / sum } : { rgb: theme.acc, a: 0 };
  };

  const mountHaze = () => {
    try {
      haze.mount = new ShaderMount(hazeEl, meshGradientFragmentShader, {
        u_colors: theme.colours.map(([r, g, b, a]) => [r / 255, g / 255, b / 255, a]),
        u_colorsCount: theme.colours.length,
        u_distortion: 0.5,
        u_swirl: 0.1,
        u_grainMixer: 0,
        u_grainOverlay: theme.grain,
        u_fit: 1,
        u_scale: haze.scale,
        u_rotation: 0,
        u_offsetX: haze.offX,
        u_offsetY: haze.offY,
        u_originX: 0.5,
        u_originY: 0.5,
        u_worldWidth: 0,
        u_worldHeight: 0,
      }, { alpha: true, premultipliedAlpha: true, antialias: false, powerPreference: 'low-power' },
      0, haze.frame, 1, haze.w * haze.h * dpr * dpr);
      haze.mount.canvasElement.addEventListener('webglcontextlost', () => {
        haze.mount?.dispose();
        haze.mount = null;
        root.classList.add('no-gl');
      });
    } catch {
      // No WebGL2: a static CSS haze stands in, and the lines carry on.
      hazeEl.querySelector('canvas')?.remove();
      haze.mount = null;
      root.classList.add('no-gl');
    }
  };

  // --- Geometry -------------------------------------------------------------
  const measure = () => {
    const r0 = root.getBoundingClientRect();
    const lead = hero.querySelector('.lead').getBoundingClientRect();
    const top = hero.querySelector('h1').getBoundingClientRect().top - 12;
    const bot = hero.querySelector('.home-cta').getBoundingClientRect().bottom;
    const pic = hero.querySelector('.portrait').getBoundingClientRect();
    root.style.height = `${Math.round(bot - r0.top + 56)}px`;
    quietBox = { x: lead.left + lead.width / 2 - r0.left, y: (top + bot) / 2 - r0.top, rx: lead.width / 2 + 28, ry: (bot - top) / 2 + 24 };

    const w = root.clientWidth, h = root.clientHeight;
    const resized = w !== W || Math.abs(h - H) > 40;
    W = w; H = h;
    dpr = Math.min(2, window.devicePixelRatio || 1);
    cvN.width = W * dpr; cvN.height = H * dpr;
    cvF.width = W; cvF.height = H; // the far layer is blurred anyway

    // The haze centres just below the portrait, so the glow behind it seems
    // to spread outwards into the hero.
    const gx = pic.left + pic.width / 2 - r0.left + OVERSCAN;
    const gy = pic.top + pic.height * 0.8 - r0.top + OVERSCAN;
    haze.w = W + 2 * OVERSCAN; haze.h = H + 2 * OVERSCAN;
    haze.S = Math.min(haze.w, haze.h);
    haze.scale = (2 * Math.min(0.44 * W, 540)) / haze.S;
    haze.offX = (gx - haze.w / 2) / haze.S;
    haze.offY = (gy - haze.h / 2) / haze.S;
    hazeEl.style.setProperty('--gx', `${gx}px`);
    hazeEl.style.setProperty('--gy', `${gy}px`);
    if (haze.mount) {
      haze.mount.setMaxPixelCount(haze.w * haze.h * dpr * dpr);
      haze.mount.setUniforms({ u_scale: haze.scale, u_offsetX: haze.offX, u_offsetY: haze.offY });
    }
    if (resized) seed();
  };

  // --- Hairlines --------------------------------------------------------------
  const dist = (l, i, j) => { const p = l.nodes[i], q = l.nodes[j]; return Math.hypot(p.x - q.x, p.y - q.y); };
  const key = (i, j) => i * 128 + j;

  // Opens links between free pairs in range. chance=1 is the initial seeding,
  // where links start mid-life so the field does not assemble itself on arrival.
  const spawn = (l, chance, initial = false) => {
    const degree = new Map();
    const bump = (i) => degree.set(i, (degree.get(i) ?? 0) + 1);
    let live = 0;
    for (const k of l.links.values()) if (k.phase < 3) { bump(k.i); bump(k.j); live++; }
    const n = l.nodes.length;
    for (let i = 0; i < n && live < l.cap; i++) {
      for (let j = i + 1; j < n && live < l.cap; j++) {
        if (l.links.has(key(i, j)) || (degree.get(i) ?? 0) > 1 || (degree.get(j) ?? 0) > 1) continue;
        if (dist(l, i, j) > l.R * 0.85 || rnd() > chance) continue;
        const a = initial ? 0.45 + rnd() * 0.55 : 0;
        l.links.set(key(i, j), { i, j, phase: initial ? 1 : 0, t: 0, d: initial ? 800 + rnd() * 7000 : 2600 + rnd() * 1800, a, a0: a });
        bump(i); bump(j); live++;
      }
    }
  };

  // Jittered grid per layer so points never clump.
  const seed = () => {
    for (const l of LAYERS) {
      const n = Math.max(4, Math.min(l.max, Math.round((W * H) / l.den)));
      const cols = Math.ceil(Math.sqrt((n * W) / H)), rows = Math.ceil(n / cols);
      l.R = 1.15 * Math.sqrt((W * H) / n);
      l.links.clear();
      l.nodes = Array.from({ length: n }, (_, i) => ({
        x: (((i % cols) + 0.15 + rnd() * 0.7) / cols) * W,
        y: ((Math.floor(i / cols) + 0.15 + rnd() * 0.7) / rows) * H,
        h: rnd() * Math.PI * 2,
        s: rnd() * 99,
      }));
      spawn(l, 1, true);
    }
  };

  const tickLinks = (l, dt, t) => {
    const f = dt / 1000, m = 60;
    l.nodes.forEach((p, i) => {
      p.h += Math.sin(t / 5000 + p.s) * 0.25 * f;
      p.x += Math.cos(p.h) * l.v * f;
      p.y += Math.sin(p.h) * l.v * f;
      let wrapped = true;
      if (p.x < -m) p.x = W + m; else if (p.x > W + m) p.x = -m;
      else if (p.y < -m) p.y = H + m; else if (p.y > H + m) p.y = -m;
      else wrapped = false;
      if (wrapped) for (const [k, link] of l.links) if (link.i === i || link.j === i) l.links.delete(k);
    });
    for (const [k, link] of l.links) {
      link.t += dt;
      if (link.phase < 2 && dist(l, link.i, link.j) > l.R * 1.1) Object.assign(link, { phase: 2, t: 0, d: 2400, a0: link.a });
      if (link.phase === 0) {
        link.a = ease(Math.min(1, link.t / link.d));
        if (link.t >= link.d) Object.assign(link, { phase: 1, t: 0, d: 3000 + rnd() * 6000 });
      } else if (link.phase === 1) {
        if (link.t >= link.d) Object.assign(link, { phase: 2, t: 0, d: 2600 + rnd() * 2000, a0: link.a });
      } else if (link.phase === 2) {
        link.a = link.a0 * (1 - ease(Math.min(1, link.t / link.d)));
        if (link.t >= link.d) Object.assign(link, { phase: 3, t: 0, d: 4000 + rnd() * 8000, a: 0 });
      } else if (link.t >= link.d) {
        l.links.delete(k);
      }
    }
    spawn(l, f * 0.3);
  };

  const ends = (l, link) => {
    const p = l.nodes[link.i], q = l.nodes[link.j];
    return [p.x + l.px, p.y + l.oy, q.x + l.px, q.y + l.oy];
  };

  // A light sets off along a settled link on the mid or near layer: the one
  // nearest (x, y) after a tap, otherwise one that sits in coloured haze.
  const launch = (x, y) => {
    let best = null, bd = Infinity;
    for (const l of [LAYERS[1], LAYERS[2]]) {
      for (const [k, link] of l.links) {
        if (link.phase !== 1 || link.a < 0.5) continue;
        const [x1, y1, x2, y2] = ends(l, link);
        const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
        const s = x == null ? rnd() * (2 - quiet(mx, my)) * (1.4 - sampleHaze(mx, my).a) : Math.hypot(mx - x, my - y);
        if (s < bd) { bd = s; best = { l, k, t: 0, d: 2000 + rnd() * 900, rev: rnd() < 0.5 }; }
      }
    }
    if (best && (x == null || bd < 420)) glint = best;
  };

  const segDist = (x, y, x1, y1, x2, y2) => {
    const dx = x2 - x1, dy = y2 - y1;
    const u = clamp(((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy || 1));
    return Math.hypot(x - x1 - u * dx, y - y1 - u * dy);
  };

  const drawLayer = (c, l, s) => {
    c.setTransform(s, 0, 0, s, 0, 0);
    c.lineCap = 'round';
    c.lineWidth = l.w;
    for (const [k, link] of l.links) {
      if (link.a < 0.004) continue;
      const [x1, y1, x2, y2] = ends(l, link);
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      let A = link.a * (1 - smooth(l.R * 0.9, l.R * 1.1, Math.hypot(x2 - x1, y2 - y1))) * theme.k * l.a;
      const qm = quiet(mx, my);
      let lift = 1.6 * ptr.on * (1 - smooth(0, 190, segDist(ptr.x, ptr.y, x1, y1, x2, y2)));
      if (glint?.l === l && glint.k === k) lift += 0.9 * Math.sin((Math.PI * glint.t) / glint.d);
      A *= 1 + lift * qm * qm; // brightening never lifts a line that sits behind text
      // The line takes on the haze colour beneath it.
      const hz = sampleHaze(mx, my);
      const rgb = mix(theme.line, hz.rgb, clamp(hz.a * theme.tint));
      const g = c.createLinearGradient(x1, y1, x2, y2);
      g.addColorStop(0, css(rgb, A * 0.35 * quiet(x1, y1)));
      g.addColorStop(0.5, css(rgb, A * qm));
      g.addColorStop(1, css(rgb, A * 0.35 * quiet(x2, y2)));
      c.strokeStyle = g;
      c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke();
    }
  };

  const drawGlint = (c, pos, env, still = false) => {
    const { l, k, rev } = glint;
    const link = l.links.get(k);
    let [x1, y1, x2, y2] = ends(l, link);
    if (rev) [x1, y1, x2, y2] = [x2, y2, x1, y1];
    const len = Math.hypot(x2 - x1, y2 - y1) || 1, tail = Math.min(0.45, 70 / len);
    const hx = x1 + (x2 - x1) * pos, hy = y1 + (y2 - y1) * pos;
    const s0 = Math.max(0, pos - tail), tx = x1 + (x2 - x1) * s0, ty = y1 + (y2 - y1) * s0;
    const fade = quiet(hx, hy), a = env * link.a * fade * fade;
    const hz = sampleHaze(hx, hy);
    const rgb = mix(theme.acc, hz.rgb, clamp(hz.a * 1.4)); // the light is the haze's own colour
    const g = c.createLinearGradient(tx, ty, hx, hy);
    g.addColorStop(0, css(rgb, 0));
    g.addColorStop(1, css(rgb, a * 0.9));
    c.strokeStyle = g; c.lineWidth = 1.25;
    c.beginPath(); c.moveTo(tx, ty); c.lineTo(hx, hy); c.stroke();
    if (still) return; // a still frame keeps the lit stroke, not a resting dot
    const r = theme.dark ? 14 : 12, h = c.createRadialGradient(hx, hy, 0, hx, hy, r);
    h.addColorStop(0, css(rgb, a * (theme.dark ? 0.3 : 0.25)));
    h.addColorStop(1, css(rgb, 0));
    c.globalCompositeOperation = theme.dark ? 'lighter' : 'source-over';
    c.fillStyle = h; c.fillRect(hx - r, hy - r, r * 2, r * 2);
    c.globalCompositeOperation = 'source-over';
  };

  const render = () => {
    cF.setTransform(1, 0, 0, 1, 0, 0); cF.clearRect(0, 0, cvF.width, cvF.height);
    cN.setTransform(1, 0, 0, 1, 0, 0); cN.clearRect(0, 0, cvN.width, cvN.height);
    drawLayer(cF, LAYERS[0], 1);
    drawLayer(cN, LAYERS[1], dpr);
    drawLayer(cN, LAYERS[2], dpr);
    if (glint) {
      const u = glint.t / glint.d;
      drawGlint(cN, ease(u), Math.sin(Math.PI * u));
    }
  };

  // --- Loop -------------------------------------------------------------------
  const tick = (dt, t) => {
    for (const l of LAYERS) tickLinks(l, dt, t);
    // Pointer presence eases in and out; parallax and the haze follow slowly.
    ptr.on += (ptr.to - ptr.on) * Math.min(1, dt / (ptr.to ? 400 : 1100));
    const sy = window.scrollY, follow = Math.min(1, dt / 900);
    const nx = ptr.to ? ptr.x / W - 0.5 : 0, ny = ptr.to ? ptr.y / H - 0.5 : 0;
    for (const l of LAYERS) {
      l.px += (nx * l.par - l.px) * follow;
      l.py += (ny * l.par * 0.6 - l.py) * follow;
      l.oy = l.py + sy * l.scr;
    }
    // The haze leans towards the pointer, and a tap nudges it towards the touch.
    const decay = Math.exp(-dt / 1400);
    haze.kx *= decay; haze.ky *= decay;
    const hx = nx * 34 + haze.kx, hy = ny * 22 + haze.ky;
    const hf = Math.min(1, dt / 1300);
    haze.tx += (hx - haze.tx) * hf;
    haze.ty += (hy - haze.ty) * hf;
    hazeEl.style.translate = `${haze.tx.toFixed(2)}px ${haze.ty.toFixed(2)}px`;

    haze.frame += dt * HAZE_SPEED;
    updateSpots();
    if (glint) { glint.t += dt; if (glint.t > glint.d || !glint.l.links.has(glint.k)) glint = null; }
    if (!glint && t > nextGlint) { launch(); nextGlint = t + 5000 + rnd() * 5000; }
  };

  const loop = () => {
    if (visible && inView && !reduce) { if (!raf) raf = requestAnimationFrame(frame); }
    else if (raf) { cancelAnimationFrame(raf); raf = 0; last = 0; }
  };

  function frame(t) {
    raf = 0; loop();
    if (coarse && t - last < 31) return; // ~30 fps on touch devices
    const dt = last ? Math.min(64, t - last) : 16;
    last = t;
    if (ptr.cx != null) {
      const r = root.getBoundingClientRect();
      ptr.x = ptr.cx - r.left; ptr.y = ptr.cy - r.top;
    }
    tick(dt, t);
    render();
    // The haze moves slowly: on fine pointers it redraws every other frame.
    odd = !odd;
    if (haze.mount && (coarse || odd)) haze.mount.setFrame(haze.frame);
  }

  // Reduced motion: one composed still - haze at a set moment, links mid-life,
  // one light resting on a line to the right of the text.
  const still = () => {
    haze.frame = STILL_FRAME;
    haze.mount?.setFrame(STILL_FRAME);
    updateSpots();
    for (const l of LAYERS) { l.px = 0; l.py = 0; l.oy = 0; }
    let best = null, bq = -Infinity;
    for (const l of [LAYERS[2], LAYERS[1]]) {
      for (const [k, link] of l.links) {
        link.a = Math.max(link.a, 0.7);
        const [x1, y1, x2, y2] = ends(l, link);
        const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
        const v = -Math.hypot(mx - quietBox.x - quietBox.rx - 60, my - quietBox.y + quietBox.ry * 0.3) - (quiet(mx, my) < 0.7 ? 400 : 0);
        if (v > bq) { bq = v; best = { l, k, t: 0, d: 1, rev: false }; }
      }
    }
    glint = best;
    render();
    if (glint) drawGlint(cN, 0.62, 0.8, true);
  };

  // The portrait glow is pure CSS; pause it with the field.
  const portrait = hero.querySelector('.portrait');
  const pauseGlow = () => portrait?.classList.toggle('is-paused', !visible || !inView);

  const start = () => {
    readTheme();
    measure();
    updateSpots();
    mountHaze();
    if (reduce) still();
    root.classList.add('is-on');
    nextGlint = performance.now() + 2500;
    loop();

    new MutationObserver(() => { readTheme(); if (reduce) still(); }).observe(html, { attributes: true, attributeFilter: ['data-theme'] });
    let timer = 0;
    const remeasure = () => {
      clearTimeout(timer);
      timer = setTimeout(() => { measure(); if (reduce) still(); }, 150);
    };
    new ResizeObserver(remeasure).observe(hero);
    window.addEventListener('resize', remeasure);
    document.addEventListener('visibilitychange', () => { visible = !document.hidden; loop(); pauseGlow(); });
    new IntersectionObserver(([e]) => { inView = e.isIntersecting; loop(); pauseGlow(); }).observe(root);

    // Mouse: gentle parallax, nearby lines brighten, the haze leans in.
    document.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch') return;
      ptr.cx = e.clientX; ptr.cy = e.clientY;
      const r = root.getBoundingClientRect();
      ptr.to = e.clientY < r.bottom && e.clientY > r.top ? 1 : 0;
    }, { passive: true });
    document.documentElement.addEventListener('pointerleave', () => { ptr.to = 0; });
    // Tap or click on open hero space: lines there brighten, the haze drifts
    // towards the touch, and a light sets off along the nearest line.
    document.addEventListener('pointerdown', (e) => {
      if (reduce || e.target.closest('a,button,nav,input,summary,.social-links')) return;
      const r = root.getBoundingClientRect();
      if (e.clientY > r.bottom) return;
      ptr.cx = e.clientX; ptr.cy = e.clientY;
      ptr.x = e.clientX - r.left; ptr.y = e.clientY - r.top;
      ptr.on = 1; ptr.to = e.pointerType === 'touch' ? 0 : 1;
      haze.kx = clamp((ptr.x - W / 2) * 0.08, -40, 40);
      haze.ky = clamp((ptr.y - H / 2) * 0.08, -28, 28);
      launch(ptr.x, ptr.y);
    }, { passive: true });
  };

  // After load, so the field never competes with the portrait for LCP.
  const later = () => (window.requestIdleCallback ?? setTimeout)(start, { timeout: 600 });
  if (document.readyState === 'complete') later(); else window.addEventListener('load', later, { once: true });
}

const fieldRoot = document.getElementById('gg-field');
const heroSection = document.querySelector('.hero-section');
if (fieldRoot && heroSection) init(fieldRoot, heroSection);
