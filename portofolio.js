/* ============================================================
   portfolio.js — Patience Kabatesi Portfolio
   Features:
     1. Theme toggle  (dark ↔ light, persisted in localStorage)
     2. Image sliders (supports multiple .project-slider on page)
     3. Scroll-reveal (.reveal elements fade in on scroll)
     4. Active nav link highlight on scroll
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     1. THEME TOGGLE
     Expects: <button class="theme-toggle"> in the navbar
              with two child icons:
                <svg class="icon-moon">…</svg>
                <svg class="icon-sun">…</svg>
     ---------------------------------------------------------- */
  const THEME_KEY = 'pk-theme';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }

  function initTheme() {
    // Respect OS preference if nothing is saved
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) {
      applyTheme(saved);
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      applyTheme('light');
    }
    // else stays dark (CSS default)
  }

  function bindThemeToggle() {
    const btn = document.querySelector('.theme-toggle');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      applyTheme(current === 'light' ? 'dark' : 'light');
    });
  }

  /* ----------------------------------------------------------
     2. IMAGE SLIDERS
     Each slider needs:
       <div class="project-slider">
         <div class="slider-track">          ← (or .sliders-track)
           <img src="…">
           <img src="…">
           …
         </div>
         <button class="slider-btn prev">‹</button>
         <button class="slider-btn next">›</button>
         <!-- dots are injected automatically -->
       </div>
     ---------------------------------------------------------- */
  function buildSlider(wrapper) {
    // Support both class names used in the original HTML
    const track = wrapper.querySelector('.slider-track, .sliders-track');
    if (!track) return;

    const slides  = Array.from(track.querySelectorAll('img, .slide'));
    const total   = slides.length;
    if (total <= 1) return;

    const prevBtn = wrapper.querySelector('.slider-btn.prev');
    const nextBtn = wrapper.querySelector('.slider-btn.next');

    let current = 0;
    let autoTimer;

    // ── dot container
    const dotsEl = document.createElement('div');
    dotsEl.className = 'slider-dots';
    slides.forEach((_, i) => {
      const d = document.createElement('div');
      d.className = 'dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', `Slide ${i + 1}`);
      d.addEventListener('click', () => goTo(i));
      dotsEl.appendChild(d);
    });
    wrapper.appendChild(dotsEl);

    function updateDots() {
      dotsEl.querySelectorAll('.dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }

    function goTo(index) {
      current = (index + total) % total;
      track.style.transform = `translateX(-${current * 100}%)`;
      updateDots();
    }

    function startAuto() {
      autoTimer = setInterval(() => goTo(current + 1), 4000);
    }

    function stopAuto() {
      clearInterval(autoTimer);
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });

    // Touch / swipe support
    let touchStartX = 0;
    wrapper.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
    wrapper.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        stopAuto();
        goTo(diff > 0 ? current + 1 : current - 1);
        startAuto();
      }
    });

    // Pause on hover
    wrapper.addEventListener('mouseenter', stopAuto);
    wrapper.addEventListener('mouseleave', startAuto);

    startAuto();
  }

  function initSliders() {
    document.querySelectorAll('.project-slider').forEach(buildSlider);
  }

  /* ----------------------------------------------------------
     3. SCROLL REVEAL
     Any element with class="reveal" fades in when it enters
     the viewport.  Add stagger via CSS animation-delay if
     you want — or add data-delay="200" (ms) to the element.
     ---------------------------------------------------------- */
  function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const el    = entry.target;
          const delay = parseInt(el.dataset.delay || '0', 10);
          setTimeout(() => el.classList.add('visible'), delay);
          observer.unobserve(el);
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach(el => observer.observe(el));
  }

  /* ----------------------------------------------------------
     4. ACTIVE NAV HIGHLIGHT
     Watches each section and marks the matching nav link
     .active when that section is in the viewport.
     ---------------------------------------------------------- */
  function initActiveNav() {
    const sections = document.querySelectorAll('section[id], div[id]');
    const links    = document.querySelectorAll('.nav-links a[href^="#"]');
    if (!sections.length || !links.length) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const id = entry.target.getAttribute('id');
          links.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
          });
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }   // fires when section is centred in view
    );

    sections.forEach(s => observer.observe(s));
  }

  /* ----------------------------------------------------------
     INIT — runs after DOM is ready
     ---------------------------------------------------------- */
  function init() {
    initTheme();
    bindThemeToggle();
    initSliders();
    initScrollReveal();
    initActiveNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();