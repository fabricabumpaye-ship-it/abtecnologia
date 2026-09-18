document.getElementById('year').textContent = new Date().getFullYear();

// Carrossel do topo
(() => {
  const root = document.getElementById('carousel');
  if (!root) return;

  const slides = [...root.querySelectorAll('.carousel-slide')];
  const dots = [...root.querySelectorAll('.dot')];
  const prevBtn = root.querySelector('.carousel-arrow.prev');
  const nextBtn = root.querySelector('.carousel-arrow.next');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let current = 0;
  let timer = null;
  const AUTOPLAY_MS = reduceMotion ? 8000 : 4500;

  function goTo(index) {
    const next = (index + slides.length) % slides.length;
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    dots[current].setAttribute('aria-selected', 'false');
    current = next;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    dots[current].setAttribute('aria-selected', 'true');
  }

  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
  }
  function start() {
    if (slides.length < 2) return;
    stop();
    timer = setInterval(() => goTo(current + 1), AUTOPLAY_MS);
  }

  nextBtn?.addEventListener('click', () => { goTo(current + 1); start(); });
  prevBtn?.addEventListener('click', () => { goTo(current - 1); start(); });
  dots.forEach(dot => {
    dot.addEventListener('click', () => { goTo(Number(dot.dataset.index)); start(); });
  });

  const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (supportsHover) {
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
  }

  // Swipe em telas de toque
  let touchStartX = 0;
  root.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  root.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) goTo(current + (dx < 0 ? 1 : -1));
    start();
  }, { passive: true });

  start();
})();
