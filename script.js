// ==========================================
// AMIDST VOID — BENTO DASHBOARD SCRIPTS
// ==========================================

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. REAL-TIME CLOCK ---
  const clockEl = document.getElementById('clockText');
  function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    if (clockEl) clockEl.textContent = `${h}:${m}:${s}`;
  }
  setInterval(updateClock, 1000);
  updateClock();

  // --- 2. TYPING ANIMATION ---
  const typingTexts = [
    'Initializing payload...',
    'Bypassing WAF...',
    'Dumping hashes...',
    'Root shell acquired.'
  ];
  let textIdx = 0, charIdx = 0, deleting = false;
  const typingEl = document.getElementById('typingText');

  function typeEffect() {
    if (!typingEl) return;
    const txt = typingTexts[textIdx];
    if (deleting) { typingEl.textContent = txt.substring(0, --charIdx); }
    else          { typingEl.textContent = txt.substring(0, ++charIdx); }

    let speed = deleting ? 35 : 75;
    if (!deleting && charIdx === txt.length) { speed = 2000; deleting = true; }
    else if (deleting && charIdx === 0) { deleting = false; textIdx = (textIdx + 1) % typingTexts.length; speed = 400; }
    setTimeout(typeEffect, speed);
  }
  typeEffect();

  // --- 3. STAT COUNTERS ---
  document.querySelectorAll('.stat-counter').forEach(el => {
    const target = parseInt(el.dataset.count);
    if (target === 0) { el.textContent = '0'; return; }
    let cur = 0;
    const step = Math.max(1, Math.floor(target / 25));
    const interval = setInterval(() => {
      cur += step;
      if (cur >= target) { el.textContent = target; clearInterval(interval); }
      else { el.textContent = cur; }
    }, 40);
  });

  // --- 4. MODAL OPEN / CLOSE (CTF, Projects) ---
  document.querySelectorAll('.btn-open-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      const dialog = document.getElementById(btn.dataset.target);
      if (dialog) { dialog.showModal(); dialog.style.display = 'flex'; }
    });
  });

  document.querySelectorAll('.js-modal-close').forEach(btn => {
    btn.addEventListener('click', e => {
      const d = e.target.closest('dialog');
      if (d) { d.close(); d.style.display = ''; }
    });
  });

  // Close modal on backdrop click
  document.querySelectorAll('dialog.glass-modal').forEach(dialog => {
    dialog.addEventListener('click', e => {
      if (e.target === dialog) { dialog.close(); dialog.style.display = ''; }
    });
  });

  // --- 5. MODAL FILTERING (CTF & Projects, scoped to each modal) ---
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const body = e.target.closest('.modal-body');
      if (!body) return;

      body.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      let visible = 0;

      body.querySelectorAll('.ctf-card').forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.style.display = match ? '' : 'none';
        if (match) visible++;
      });

      const empty = body.querySelector('.ctf-empty');
      if (empty) empty.style.display = visible === 0 ? 'block' : 'none';
    });
  });

  // --- 6. IFRAME VIEWER (Floating Writeup Window) ---
  const viewerModal  = document.getElementById('viewer-modal');
  const viewerFrame  = document.getElementById('viewerFrame');
  const viewerTitle  = document.getElementById('viewerTitleText');
  const viewerLoading = document.getElementById('viewerLoading');
  const viewerClose  = document.getElementById('viewerClose');

  function openViewer(url, title) {
    if (!viewerModal) return;
    viewerTitle.textContent = title || 'Write-up';
    viewerFrame.style.display = 'none';
    viewerLoading.classList.add('active');
    viewerFrame.src = url;
    viewerModal.showModal();

    viewerFrame.onload = () => {
      viewerLoading.classList.remove('active');
      viewerFrame.style.display = 'block';
    };
  }

  function closeViewer() {
    if (!viewerModal) return;
    viewerModal.close();
    viewerFrame.src = '';
    viewerFrame.style.display = 'none';
    viewerLoading.classList.remove('active');
  }

  if (viewerClose) viewerClose.addEventListener('click', closeViewer);

  // Close viewer on backdrop
  if (viewerModal) {
    viewerModal.addEventListener('click', e => {
      if (e.target === viewerModal) closeViewer();
    });
  }

  // Intercept ALL .ctf-link clicks that point to a writeup file
  document.addEventListener('click', e => {
    const link = e.target.closest('.ctf-link, .list-item');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || href === '#' || href.startsWith('http')) return;

    // Only intercept local writeup files
    if (href.includes('writeups/') || href.endsWith('.html')) {
      e.preventDefault();
      // Extract a nice title from the link's parent card
      const card = link.closest('.ctf-card, .list-item');
      let title = 'Write-up';
      if (card) {
        const h4 = card.querySelector('h4, .ctf-title');
        if (h4) title = h4.textContent;
      }
      openViewer(href, title);
    }
  });

  // --- 7. COPY EMAIL ---
  const copyBtn = document.getElementById('copyEmailBtn');
  const toast = document.getElementById('toast');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('amidst@proton.me').then(() => {
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2500);
      }).catch(() => {
        // Fallback
        const t = document.createElement('textarea');
        t.value = 'amidst@proton.me'; document.body.appendChild(t);
        t.select(); document.execCommand('copy'); document.body.removeChild(t);
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2500);
      });
    });
  }

  // --- 8. PARTICLES CANVAS ---
  const canvas = document.getElementById('particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    window.addEventListener('resize', resize);
    resize();

    const pts = [];
    for (let i = 0; i < 25; i++) {
      pts.push({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.4,
        vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
        a: Math.random() * 0.35 + 0.08
      });
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of pts) {
        ctx.globalAlpha = p.a;
        ctx.fillStyle = '#00deb4';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
      }
      requestAnimationFrame(draw);
    }
    draw();
  }

});
