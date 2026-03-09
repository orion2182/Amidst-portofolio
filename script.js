// ===== Typing Animation =====
const typingTexts = [
  'Red Team Operator',
  'CTF Player',
  'Bug Hunter',
  'Security Researcher',
  'DevOps Enthusiast'
];

let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingEl = document.getElementById('typingText');

function typeEffect() {
  const currentText = typingTexts[textIndex];

  if (isDeleting) {
    typingEl.textContent = currentText.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typingEl.textContent = currentText.substring(0, charIndex + 1);
    charIndex++;
  }

  let speed = isDeleting ? 40 : 80;

  if (!isDeleting && charIndex === currentText.length) {
    speed = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    textIndex = (textIndex + 1) % typingTexts.length;
    speed = 500;
  }

  setTimeout(typeEffect, speed);
}

typeEffect();

// ===== Navbar Scroll =====
const navbar = document.getElementById('navbar');
const heroBg = document.querySelector('.hero-bg img');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);

  // Parallax hero background
  if (heroBg && window.scrollY < window.innerHeight) {
    heroBg.style.transform = `translateY(${window.scrollY * 0.3}px) scale(1.05)`;
  }
});

// ===== Mobile Menu Toggle =====
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('open');
  navToggle.classList.toggle('active');
});

// Close menu on link click
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    navToggle.classList.remove('active');
  });
});

// ===== Active Nav Link =====
const sections = document.querySelectorAll('section[id]');

function updateActiveNav() {
  const scrollY = window.scrollY + 100;

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-menu a[href="#${id}"]`);

    if (link) {
      if (scrollY >= top && scrollY < top + height) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    }
  });
}

window.addEventListener('scroll', updateActiveNav);

// ===== Scroll Reveal =====
function revealOnScroll() {
  const reveals = document.querySelectorAll('.reveal');
  const windowHeight = window.innerHeight;

  reveals.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < windowHeight - 80) {
      el.classList.add('visible');
    }
  });
}

// Add reveal class to elements
document.addEventListener('DOMContentLoaded', () => {
  const revealSelectors = [
    '.skill-category',
    '.cert-card',
    '.ctf-card',
    '.lab-card',
    '.contact-card',
    '.about-grid',
    '.bounty-placeholder'
  ];

  revealSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${i * 0.1}s`;
    });
  });

  revealOnScroll();
});

window.addEventListener('scroll', revealOnScroll);

// ===== Counter Animation =====
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');

  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-count'));
    const rect = counter.getBoundingClientRect();

    if (rect.top < window.innerHeight && !counter.dataset.animated) {
      counter.dataset.animated = 'true';

      if (target === 0) {
        counter.textContent = '0';
        return;
      }

      let current = 0;
      const step = Math.max(1, Math.floor(target / 30));
      const interval = setInterval(() => {
        current += step;
        if (current >= target) {
          counter.textContent = target;
          clearInterval(interval);
        } else {
          counter.textContent = current;
        }
      }, 50);
    }
  });
}

window.addEventListener('scroll', animateCounters);

// ===== CTF Filter =====
const filterBtns = document.querySelectorAll('.filter-btn');
const ctfCards = document.querySelectorAll('.ctf-card');
const ctfEmpty = document.getElementById('ctfEmpty');
const ctfGrid = document.getElementById('ctfGrid');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');
    let visibleCount = 0;

    ctfCards.forEach(card => {
      if (filter === 'all' || card.getAttribute('data-category') === filter) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    ctfEmpty.style.display = visibleCount === 0 ? 'block' : 'none';
    ctfGrid.style.display = visibleCount === 0 ? 'none' : '';
  });
});
