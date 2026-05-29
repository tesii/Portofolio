/* ============================================================
   Patience Kabatesi — Portfolio Script
   ============================================================ */

console.log(
  "%c✦ Patience Kabatesi · Portfolio",
  "color:#f97316;font-size:18px;font-weight:800;letter-spacing:1px;"
);

/* ============================================================
   1. SCROLL PROGRESS BAR
   ============================================================ */

const progressBar = document.createElement('div');
progressBar.className = 'scroll-progress';
document.body.prepend(progressBar);

window.addEventListener('scroll', () => {
  const max   = document.documentElement.scrollHeight - window.innerHeight;
  const pct   = max > 0 ? (window.scrollY / max) * 100 : 0;
  progressBar.style.width = pct + '%';
}, { passive: true });

/* ============================================================
   2. NAVBAR — scroll shadow + hide-on-scroll-down
   ============================================================ */

const navbar     = document.querySelector('.navbar');
let   lastScroll = 0;

window.addEventListener('scroll', () => {
  const y = window.scrollY;

  navbar.classList.toggle('scrolled', y > 60);

  // hide when scrolling down past 200px, reveal on scroll up
  if (y > 200) {
    navbar.style.transform = y > lastScroll ? 'translateY(-100%)' : 'translateY(0)';
  } else {
    navbar.style.transform = 'translateY(0)';
  }

  lastScroll = y;
}, { passive: true });

/* ============================================================
   3. ACTIVE NAV LINK
   ============================================================ */

const allSections = document.querySelectorAll('section[id], header[id]');
const navAnchors  = document.querySelectorAll('.nav-links a');

function setActiveLink() {
  let current = '';
  allSections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navAnchors.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
  });
}

window.addEventListener('scroll', setActiveLink, { passive: true });
setActiveLink();

/* ============================================================
   4. SMOOTH SCROLL (nav + any in-page anchor)
   ============================================================ */

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = (navbar?.offsetHeight ?? 64) + 8;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    // close mobile menu if open
    navLinksEl?.classList.remove('open');
    hamburgerBtn?.classList.remove('active');
    document.body.style.overflow = '';
  });
});

/* ============================================================
   5. HAMBURGER MENU (mobile)
   ============================================================ */

const hamburgerBtn = document.querySelector('.hamburger');
const navLinksEl   = document.querySelector('.nav-links');

if (hamburgerBtn && navLinksEl) {
  hamburgerBtn.addEventListener('click', () => {
    const open = navLinksEl.classList.toggle('open');
    hamburgerBtn.classList.toggle('active', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // close on outside click
  document.addEventListener('click', e => {
    if (!hamburgerBtn.contains(e.target) && !navLinksEl.contains(e.target)) {
      navLinksEl.classList.remove('open');
      hamburgerBtn.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

/* ============================================================
   6. INTERSECTION OBSERVER — fade-in sections
   ============================================================ */

const fadeEls = document.querySelectorAll(
  '.section-header, .about-text, .project-card, .skills div, .contact a'
);

fadeEls.forEach(el => {
  el.style.opacity   = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity .65s ease, transform .65s ease';
});

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (!entry.isIntersecting) return;
    setTimeout(() => {
      entry.target.style.opacity   = '1';
      entry.target.style.transform = 'translateY(0)';
    }, i * 80);
    fadeObserver.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

fadeEls.forEach(el => fadeObserver.observe(el));

/* ============================================================
   7. IMAGE SLIDER (Project 1)
   ============================================================ */

/* ============================================================
   MULTI PROJECT SLIDERS (FIXED)
   ============================================================ */

class Slider {
  constructor(sliderEl) {
    this.slider = sliderEl;
    this.track = sliderEl.querySelector('.slider-track');
    this.slides = sliderEl.querySelectorAll('img');
    this.index = 0;

    this.prevBtn = sliderEl.querySelector('.sl-prev');
    this.nextBtn = sliderEl.querySelector('.sl-next');

    this.init();
  }

  init() {
    if (!this.track || !this.slides.length) return;

    // Buttons
    this.prevBtn?.addEventListener('click', () => this.move(-1));
    this.nextBtn?.addEventListener('click', () => this.move(1));

    // Auto slide (optional per slider)
    this.startAuto();
  }

  move(dir) {
    this.index = (this.index + dir + this.slides.length) % this.slides.length;
    this.track.style.transform = `translateX(-${this.index * 100}%)`;
  }

  startAuto() {
    setInterval(() => {
      this.move(1);
    }, 4000);
  }
}

/* INIT ALL SLIDERS */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('.slider').forEach(sliderEl => {
    new Slider(sliderEl);
  });
});

// auto-advance every 4 s
/* ============================================================
   PROJECT 3 VIDEO SLIDER
   ============================================================ */

class VideoSlider {
  constructor(root) {
    this.root = root;
    this.track = root.querySelector('.video-track');
    this.slides = root.querySelectorAll('.video-slide');
    this.index = 0;

    this.prevBtn = root.querySelector('.sl-prev');
    this.nextBtn = root.querySelector('.sl-next');

    this.init();
  }

  init() {
    if (!this.track || !this.slides.length) return;

    this.prevBtn?.addEventListener('click', () => this.move(-1));
    this.nextBtn?.addEventListener('click', () => this.move(1));

    this.update();
  }

  move(dir) {
    this.index = (this.index + dir + this.slides.length) % this.slides.length;
    this.update();
  }

  update() {
    // move slider
    this.track.style.transform = `translateX(-${this.index * 100}%)`;

    // pause all videos
    this.slides.forEach(v => v.pause());

    // play active video
    const active = this.slides[this.index];
    active.currentTime = 0;
    active.play().catch(() => {});
  }
}

/* INIT VIDEO SLIDER */
document.addEventListener("DOMContentLoaded", () => {
  const el = document.querySelector('#video-slider-3');
  if (el) new VideoSlider(el);
});
  // Toggle Light/Dark Mode
  const toggleButton = document.getElementById('mode-toggle');
  const body = document.body;
  const iconSpan = document.getElementById('mode-icon');

  // Initialize based on system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    body.classList.add('light');
    iconSpan.textContent = '☀️';
  } else {
    body.classList.add('dark');
    iconSpan.textContent = '🌙';
  }

  toggleButton.addEventListener('click', () => {
    if (body.classList.contains('light')) {
      body.classList.remove('light');
      body.classList.add('dark');
      iconSpan.textContent = '🌙';
    } else {
      body.classList.remove('dark');
      body.classList.add('light');
      iconSpan.textContent = '☀️';
    }
  });
/* ============================================================
   8. CURSOR TRAIL
   ============================================================ */

(function initCursorTrail() {
  // skip on touch devices
  if (window.matchMedia('(hover: none)').matches) return;

  const style = document.createElement('style');
  style.textContent = `
    .c-trail {
      position: fixed;
      width: 8px; height: 8px;
      border-radius: 50%;
      background: rgba(249,115,22,.75);
      pointer-events: none;
      transform: translate(-50%,-50%);
      z-index: 9999;
      transition: opacity .4s ease;
      mix-blend-mode: screen;
    }
  `;
  document.head.appendChild(style);

  const pool = [];

  document.addEventListener('mousemove', ({ clientX: x, clientY: y }) => {
    const dot = document.createElement('div');
    dot.className = 'c-trail';
    dot.style.left = x + 'px';
    dot.style.top  = y + 'px';
    document.body.appendChild(dot);
    pool.push(dot);

    if (pool.length > 18) pool.shift()?.remove();

    requestAnimationFrame(() => {
      setTimeout(() => {
        dot.style.opacity = '0';
        setTimeout(() => dot.remove(), 400);
      }, 80);
    });
  }, { passive: true });
})();

/* ============================================================
   9. PARTICLES
   ============================================================ */

(function initParticles() {
  const style = document.createElement('style');
  style.textContent = `
    .particles-wrap {
      position: fixed; inset: 0;
      pointer-events: none; z-index: -1;
      overflow: hidden;
    }
    .p-dot {
      position: absolute;
      width: 5px; height: 5px;
      border-radius: 50%;
      background: rgba(249,115,22,.18);
      animation: floatDot linear infinite;
    }
    @keyframes floatDot {
      0%   { transform: translateY(0)   translateX(0);    opacity: .6; }
      50%  { transform: translateY(-35px) translateX(14px); opacity: .3; }
      100% { transform: translateY(0)   translateX(-14px); opacity: .6; }
    }
  `;
  document.head.appendChild(style);

  const wrap = document.createElement('div');
  wrap.className = 'particles-wrap';

  for (let i = 0; i < 40; i++) {
    const dot = document.createElement('div');
    dot.className = 'p-dot';
    dot.style.left              = Math.random() * 100 + '%';
    dot.style.top               = Math.random() * 100 + '%';
    dot.style.animationDelay    = (Math.random() * 12) + 's';
    dot.style.animationDuration = (Math.random() * 12 + 10) + 's';
    wrap.appendChild(dot);
  }

  document.body.appendChild(wrap);
})();

/* ============================================================
   10. SKILLS — staggered hover glow on load
   ============================================================ */

document.querySelectorAll('.skills div').forEach((el, i) => {
  el.style.transitionDelay = (i * 40) + 'ms';
});

console.log("%c✦ All systems go.", "color:#f97316;font-weight:700;");