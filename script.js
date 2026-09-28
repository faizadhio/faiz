const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;

$('#year').textContent = new Date().getFullYear();

// ---- Years of experience, counted from the start of Faiz's career ----
const CAREER_START = 2019;
const YEARS = new Date().getFullYear() - CAREER_START;
const WORDS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
  'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen', 'Twenty'];
$$('.yrs').forEach(el => {
  el.textContent = el.dataset.format === 'word' ? (WORDS[YEARS] || YEARS) : YEARS;
});
$$('.yrs-count').forEach(el => { el.dataset.to = YEARS; el.textContent = YEARS; });

// ---- Screenshot data (used by gallery rails and lightbox) ----
const SHOTS = [
  ['telkomsel-1', 'MyTelkomsel', 'Personalized package recommendations'],
  ['qita-1', 'Qita by BRI', 'All your finances in one place'],
  ['gomamam-1', 'GoMamam', 'Scroll. Click. Delivered.'],
  ['telkomsel-2', 'MyTelkomsel', 'Recommendations after checkout'],
  ['qita-2', 'Qita by BRI', 'Fully online account opening'],
  ['gomamam-2', 'GoMamam', 'Restaurants across Brunei'],
  ['telkomsel-3', 'MyTelkomsel', 'Spam and scam protection'],
  ['qita-3', 'Qita by BRI', 'Unified portfolio'],
  ['gomamam-3', 'GoMamam', 'Groceries to your doorstep'],
  ['telkomsel-4', 'MyTelkomsel', 'Digital services hub'],
  ['qita-4', 'Qita by BRI', 'Bill reminders and payments'],
  ['gomamam-4', 'GoMamam', 'Electronics at your fingertips'],
  ['qita-5', 'Qita by BRI', 'Home with balance and quick actions'],
].map(([file, app, caption]) => ({ src: `assets/shots/${file}.webp`, app, caption }));

function fillRail(el, list) {
  const make = (s, hidden) => {
    const b = document.createElement('button');
    b.className = 'shot rail-shot';
    b.dataset.src = s.src;
    if (hidden) { b.tabIndex = -1; b.setAttribute('aria-hidden', 'true'); }
    b.innerHTML = `<img src="${s.src}" alt="${s.app}: ${s.caption}" loading="lazy"><span>${s.app}</span>`;
    return b;
  };
  // Two copies so the loop is seamless
  list.forEach(s => el.appendChild(make(s)));
  list.forEach(s => el.appendChild(make(s, true)));
}
fillRail($('#railA'), SHOTS.slice(0, 7));
fillRail($('#railB'), SHOTS.slice(6).concat(SHOTS.slice(0, 1)));

// ---- Split hero headline into words for a staggered entrance ----
const h1 = $('.split');
if (h1) {
  let i = 0;
  const wrap = node => {
    if (node.nodeType === 3) {
      const frag = document.createDocumentFragment();
      node.textContent.split(/(\s+)/).forEach(part => {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
        const w = document.createElement('span');
        w.className = 'word';
        w.style.setProperty('--i', i++);
        w.innerHTML = node.parentElement.closest('.grad') ? `<span class="grad">${part}</span>` : `<span>${part}</span>`;
        frag.appendChild(w);
      });
      node.replaceWith(frag);
    } else {
      [...node.childNodes].forEach(wrap);
    }
  };
  [...h1.childNodes].forEach(wrap);
  requestAnimationFrame(() => h1.classList.add('in'));
}

// Stagger tag chips inside cards
$$('.stagger').forEach(t => [...t.children].forEach((c, i) => c.style.setProperty('--k', i)));

// ---- Reveal on scroll ----
const onReveal = el => {
  el.classList.add('in');
  $$('.count', el).forEach(countUp);
};
if (reduceMotion || !('IntersectionObserver' in window)) {
  $$('.reveal').forEach(onReveal);
} else {
  document.documentElement.classList.add('js-reveal');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      onReveal(e.target);
      io.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach(el => io.observe(el));
}

function countUp(el) {
  const to = Number(el.dataset.to);
  if (reduceMotion) { el.textContent = to; return; }
  const start = performance.now();
  const tick = now => {
    const t = Math.min((now - start) / 1200, 1);
    el.textContent = Math.round(to * (1 - Math.pow(1 - t, 3)));
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// ---- Rotating text in the hero pill ----
const rot = $('.rotator');
if (rot) {
  const items = $$('span', rot);
  let k = 0;
  items[0].classList.add('on');
  if (!reduceMotion) {
    setInterval(() => {
      items[k].classList.remove('on');
      items[k].classList.add('off');
      const prev = items[k];
      setTimeout(() => prev.classList.remove('off'), 600);
      k = (k + 1) % items.length;
      items[k].classList.add('on');
    }, 2800);
  }
}

// ---- Typing Swift code in the editor ----
const CODE = [
  ['k', 'struct'], [' '], ['t', 'Faiz'], [': '], ['t', 'iOSDeveloper'], [' {\n'],
  ['  '], ['k', 'let'], [' role = '], ['s', '"Senior iOS Developer"'], ['\n'],
  ['  '], ['k', 'let'], [' experience = '], ['n', String(YEARS)], ['.'], ['f', 'years'], ['\n'],
  ['  '], ['k', 'let'], [' shipped = ['], ['s', '"MyTelkomsel"'], [', '], ['s', '"Qita by BRI"'], [', '], ['s', '"GoMamam"'], [']\n'],
  ['  '], ['k', 'let'], [' stack: ['], ['t', 'Skill'], ['] = [.'], ['f', 'swift'], [', .'], ['f', 'swiftUI'], [', .'], ['f', 'uiKit'], [', .'], ['f', 'flutter'], [']\n\n'],
  ['  '], ['k', 'func'], [' '], ['f', 'build'], ['(_ idea: '], ['t', 'Idea'], [') '], ['k', 'async'], [' -> '], ['t', 'App'], [' {\n'],
  ['    '], ['k', 'let'], [' spec = '], ['k', 'await'], [' '], ['f', 'understand'], ['(idea.users)\n'],
  ['    '], ['k', 'return'], [' '], ['f', 'ship'], ['(spec, architecture: .'], ['f', 'clean'], [', tests: .'], ['f', 'always'], [')\n'],
  ['  }\n}'],
];
const typed = $('#typed');
function renderCode(chars) {
  let out = '', left = chars;
  for (const [cls, txt = cls] of CODE.map(p => p.length === 1 ? [null, p[0]] : p)) {
    if (left <= 0) break;
    const piece = txt.slice(0, left);
    left -= piece.length;
    const esc = piece.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    out += cls ? `<span class="${cls}">${esc}</span>` : esc;
  }
  typed.innerHTML = out;
}
if (typed) {
  const total = CODE.reduce((n, p) => n + (p[1] ?? p[0]).length, 0);
  if (reduceMotion) renderCode(total);
  else {
    let started = false;
    new IntersectionObserver((entries, obs) => {
      if (!entries[0].isIntersecting || started) return;
      started = true; obs.disconnect();
      let c = 0;
      const step = () => {
        c += 2;
        renderCode(c);
        if (c < total) setTimeout(step, 18 + Math.random() * 30);
      };
      step();
    }, { threshold: 0.4 }).observe(typed);
  }
}

// ---- Scroll-driven effects: progress bar, nav, roadmap fill, parallax ----
const nav = $('.nav');
const bar = $('.progress');
const roadmap = $('.roadmap');
const fans = $$('.fan');
let ticking = false;
function onScroll() {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
  nav.classList.toggle('scrolled', y > 12);
  if (roadmap) {
    const r = roadmap.getBoundingClientRect();
    const p = Math.min(Math.max((innerHeight * 0.6 - r.top) / r.height, 0), 1);
    roadmap.style.setProperty('--fill', p);
  }
  if (!reduceMotion) {
    fans.forEach(f => {
      const r = f.getBoundingClientRect();
      const c = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
      f.style.setProperty('--py', `${c * -40}px`);
    });
  }
  ticking = false;
}
window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
onScroll();

// ---- Pointer effects (desktop only) ----
if (finePointer && !reduceMotion) {
  // Spotlight that follows the cursor inside cards
  document.addEventListener('pointermove', e => {
    const card = e.target.closest('.spot');
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  });

  // Hero phone tilt
  const tilt = $('.tilt');
  window.addEventListener('pointermove', e => {
    const x = e.clientX / innerWidth - 0.5;
    const y = e.clientY / innerHeight - 0.5;
    if (tilt) tilt.style.transform = `rotateY(${x * 14 - 8}deg) rotateX(${-y * 10 + 4}deg)`;
  });

  // Screenshot fans lean toward the cursor
  fans.forEach(f => {
    f.addEventListener('pointermove', e => {
      const r = f.getBoundingClientRect();
      f.style.setProperty('--rx', `${((e.clientY - r.top) / r.height - 0.5) * -10}deg`);
      f.style.setProperty('--ry', `${((e.clientX - r.left) / r.width - 0.5) * 14}deg`);
    });
    f.addEventListener('pointerleave', () => { f.style.setProperty('--rx', '0deg'); f.style.setProperty('--ry', '0deg'); });
  });

  // Magnetic buttons
  $$('.magnetic').forEach(b => {
    b.addEventListener('pointermove', e => {
      const r = b.getBoundingClientRect();
      b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
    });
    b.addEventListener('pointerleave', () => { b.style.transform = ''; });
  });
}

// ---- Lightbox ----
const lb = $('#lightbox');
const lbImg = $('img', lb);
const lbCap = $('figcaption', lb);
let lbIndex = 0;
let lastFocus = null;
function openLightbox(src) {
  lbIndex = Math.max(0, SHOTS.findIndex(s => s.src === src));
  showShot();
  lastFocus = document.activeElement;
  lb.hidden = false;
  requestAnimationFrame(() => lb.classList.add('open'));
  document.body.style.overflow = 'hidden';
  $('.lb-close', lb).focus();
}
function closeLightbox() {
  lb.classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => { lb.hidden = true; }, reduceMotion ? 0 : 250);
  if (lastFocus) lastFocus.focus();
}
function showShot() {
  const s = SHOTS[lbIndex];
  lbImg.src = s.src;
  lbImg.alt = `${s.app}: ${s.caption}`;
  lbCap.innerHTML = `<b>${s.app}</b> · ${s.caption}`;
}
const move = d => { lbIndex = (lbIndex + d + SHOTS.length) % SHOTS.length; showShot(); };
document.addEventListener('click', e => {
  const shot = e.target.closest('.shot');
  if (shot) openLightbox(shot.dataset.src);
});
$('.lb-close', lb).addEventListener('click', closeLightbox);
$('.prev', lb).addEventListener('click', () => move(-1));
$('.next', lb).addEventListener('click', () => move(1));
lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
document.addEventListener('keydown', e => {
  if (lb.hidden) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') move(-1);
  if (e.key === 'ArrowRight') move(1);
});
