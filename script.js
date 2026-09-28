// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Reveal elements as they scroll into view
const revealed = document.querySelectorAll('.reveal');
if (reduceMotion || !('IntersectionObserver' in window)) {
  revealed.forEach(el => el.classList.add('in'));
} else {
  document.documentElement.classList.add('js-reveal');
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in');
      entry.target.querySelectorAll('.count').forEach(countUp);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealed.forEach(el => io.observe(el));
}

// Count numbers up from zero
function countUp(el) {
  const to = Number(el.dataset.to);
  const start = performance.now();
  const duration = 1200;
  const tick = now => {
    const t = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(to * (1 - Math.pow(1 - t, 3)));
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// Gentle 3D tilt on the hero phone following the pointer
const tilt = document.querySelector('.tilt');
if (tilt && !reduceMotion && window.matchMedia('(pointer: fine)').matches) {
  window.addEventListener('pointermove', e => {
    const x = e.clientX / window.innerWidth - 0.5;
    const y = e.clientY / window.innerHeight - 0.5;
    tilt.style.transform = `rotateY(${x * 14 - 8}deg) rotateX(${-y * 10 + 4}deg)`;
  });
}

// Shrink the nav once the page is scrolled
const nav = document.querySelector('.nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 12);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();
