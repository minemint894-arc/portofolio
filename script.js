/* ============================================================
   E-Portofolio Abdul Fitrah Mine — Teknik Kelistrikan
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ── Mobile menu ───────────────────────────────────── */
  const menuToggle = $('#menuToggle');
  const mobileOverlay = $('#mobileOverlay');
  const mobilePanel = $('#mobilePanel');
  const mobileClose = $('#mobileClose');

  const openMobileMenu = () => {
    if (mobileOverlay) mobileOverlay.classList.add('open');
    if (mobilePanel) {
      mobilePanel.classList.add('open');
      mobilePanel.setAttribute('aria-hidden', 'false');
    }
    document.body.style.overflow = 'hidden';
  };

  const closeMobileMenu = () => {
    if (mobileOverlay) mobileOverlay.classList.remove('open');
    if (mobilePanel) {
      mobilePanel.classList.remove('open');
      mobilePanel.setAttribute('aria-hidden', 'true');
    }
    document.body.style.overflow = '';
  };

  if (menuToggle) menuToggle.addEventListener('click', openMobileMenu);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileMenu);
  if (mobileClose) mobileClose.addEventListener('click', closeMobileMenu);
  $$('.mobile-link').forEach((link) => link.addEventListener('click', closeMobileMenu));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMobileMenu();
  });

  /* ── Scroll reveal ─────────────────────────────────── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  $$('.reveal-up, .reveal-scale, .reveal-slide-l, .reveal-slide-r').forEach((el) => {
    revealObserver.observe(el);
  });

  /* ── Scroll spy for nav highlight ──────────────────── */
  const navLinks = $$('.nav-link');
  const spyTargets = $$('main section[id], footer[id]');

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = `#${entry.target.id}`;
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === id);
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  spyTargets.forEach((section) => spyObserver.observe(section));

  /* ── Navbar state on scroll ────────────────────────── */
  const navbar = $('#navbar');
  const syncNavbar = () => {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  syncNavbar();
  window.addEventListener('scroll', syncNavbar, { passive: true });

  /* ── Hero toggle switches ──────────────────────────── */
  $$('.toggle').forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const pressed = toggle.getAttribute('aria-pressed') === 'true';
      toggle.setAttribute('aria-pressed', String(!pressed));
    });
  });

  /* ── Footer year ───────────────────────────────────── */
  const year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());
});
