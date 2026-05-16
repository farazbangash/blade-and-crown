/* ============================================
   PREMIER CUTS — Main JS
   ============================================ */

/* ---- NAV: scroll effect ---- */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ---- MOBILE MENU ---- */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen);
  // Animate bars
  const bars = hamburger.querySelectorAll('span');
  if (isOpen) {
    bars[0].style.transform = 'translateY(6.5px) rotate(45deg)';
    bars[1].style.opacity = '0';
    bars[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
  } else {
    bars[0].style.transform = '';
    bars[1].style.opacity = '';
    bars[2].style.transform = '';
  }
});

// Close mobile menu on link click
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    const bars = hamburger.querySelectorAll('span');
    bars[0].style.transform = '';
    bars[1].style.opacity = '';
    bars[2].style.transform = '';
  });
});

/* ---- SCROLL REVEAL ---- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger siblings within same parent
      const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal:not(.visible)'));
      const idx = siblings.indexOf(entry.target);
      const delay = idx >= 0 ? idx * 80 : 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ---- SMOOTH SCROLL for anchor links ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80; // nav height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ---- GALLERY: simple lightbox-style highlight ---- */
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    item.style.outline = '2px solid var(--gold)';
    setTimeout(() => { item.style.outline = ''; }, 600);
  });
});

/* ---- SERVICE CARDS: subtle tilt on hover ---- */
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(600px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg) translateY(-2px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ---- REVIEW CARDS: pause auto-scroll on hover ---- */
// Simple entrance stagger for review cards on load
const reviewCards = document.querySelectorAll('.review-card');
reviewCards.forEach((card, i) => {
  card.style.transitionDelay = `${i * 60}ms`;
});

/* ---- BACK TO TOP smooth ---- */
document.querySelector('.back-top')?.addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ---- ACTIVE NAV LINK on scroll ---- */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${id}` ? 'var(--gold)' : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* ---- HERO: subtle parallax on scroll ---- */
const heroBg = document.querySelector('.hero-bg');
window.addEventListener('scroll', () => {
  if (window.scrollY < window.innerHeight) {
    heroBg.style.transform = `translateY(${window.scrollY * 0.25}px)`;
  }
}, { passive: true });

/* ---- STAT COUNTERS: animate numbers on reveal ---- */
function animateCounter(el, target, duration = 1200) {
  const start = performance.now();
  const isFloat = target % 1 !== 0;
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = isFloat ? (target * ease).toFixed(1) : Math.round(target * ease);
    el.textContent = current + (el.dataset.suffix || '');
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const raw = el.textContent.trim();
      // Parse number from strings like "500+", "4.9★", "6"
      const num = parseFloat(raw.replace(/[^0-9.]/g, ''));
      const suffix = raw.replace(/[0-9.]/g, '');
      if (!isNaN(num)) {
        el.dataset.suffix = suffix;
        animateCounter(el, num);
      }
      statObserver.unobserve(el);
    }
  });
}, { threshold: 0.6 });

document.querySelectorAll('.stat-num').forEach(el => statObserver.observe(el));

console.log('%cPremier Cuts 💈', 'font-size:18px;color:#C9A84C;font-weight:bold;');
console.log('%cBuilt as a template for barber shop clients.', 'color:#888;font-size:12px;');
