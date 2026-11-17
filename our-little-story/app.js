(() => {
  'use strict';
  const data = window.STORY_DATA;
  const $ = (selector, root = document) => root.querySelector(selector);
  const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

  $('#hero-placeholder').textContent = data.heroPlaceholder;
  if (data.boyfriendName) document.title = `Bizim Hikâyemiz · ${data.boyfriendName}`;

  const prelude = $('#prelude-slides');
  data.introSlides.forEach((slide, index) => {
    const article = document.createElement('article');
    article.className = `prelude-slide reveal ${index % 2 ? 'slide-offset' : ''}`;
    article.style.setProperty('--reveal-delay', `${Math.min(index * 110, 330)}ms`);
    article.innerHTML = `<div class="slide-rail"><span class="slide-index">0${index + 1}</span><span class="slide-line"></span></div><div class="prelude-copy"><p class="eyebrow">${escapeHtml(slide.kicker)}</p><h3>${escapeHtml(slide.title)}</h3><p>${escapeHtml(slide.text)}</p></div><span class="slide-ghost" aria-hidden="true">0${index + 1}</span>`;
    prelude.append(article);
  });

  const startDate = data.relationshipStartDate && new Date(`${data.relationshipStartDate}T12:00:00`);
  if (startDate && !Number.isNaN(startDate.getTime())) {
    $('#since-note').textContent = `Hikâyemiz ${startDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })} tarihinde başladı`;
  }

  const timeline = $('#timeline');
  data.memories.forEach((memory, index) => {
    const article = document.createElement('article');
    article.dataset.memoryIndex = index;
    article.className = `timeline-entry reveal ${index % 2 ? 'from-right' : 'from-left'}`;
    article.style.setProperty('--reveal-delay', `${Math.min(index * 100, 300)}ms`);
    article.innerHTML = `<div class="timeline-marker" aria-hidden="true"><span>0${index + 1}</span><i></i></div><div class="memory-card"><div class="memory-card-top"><span class="memory-date">${escapeHtml(memory.date)}</span><span class="memory-heart" aria-hidden="true">♡</span></div><div class="memory-card-content"><div class="memory-note"><span class="note-overline">${escapeHtml(memory.label || 'o günden bir not')}</span><p>${escapeHtml(memory.photoText)}</p></div><div class="memory-copy"><h3>${escapeHtml(memory.title)}</h3><p>${escapeHtml(memory.shortDescription || memory.description)}</p><button class="text-button" type="button" data-memory="${index}" aria-label="Bana tıkla, beni oku: ${escapeHtml(memory.title)}">BANA TIKLA, BENİ OKU <span aria-hidden="true">↗</span></button></div></div></div>`;
    timeline.append(article);
  });

  $('#love-letter').textContent = data.finalLoveLetter;
  $('#signature').textContent = `— ${data.signature}`;
  if (data.finalGreeting) $('#ending .eyebrow').textContent = data.finalGreeting;

  const memoryDialog = $('#memory-dialog');
  timeline.addEventListener('click', event => {
    const button = event.target.closest('[data-memory]');
    if (!button) return;
    const memory = data.memories[Number(button.dataset.memory)];
    $('#dialog-date').textContent = memory.date;
    $('#dialog-title').textContent = memory.title;
    $('#dialog-description').textContent = memory.description;
    $('#dialog-placeholder').textContent = memory.photoText;
    memoryDialog.showModal();
  });
  $('[data-close-dialog]').addEventListener('click', () => memoryDialog.close());
  memoryDialog.addEventListener('click', event => { if (event.target === memoryDialog) memoryDialog.close(); });

  const themeColor = $('meta[name="theme-color"]');
  const updateTheme = () => {
    const color = window.scrollY >= $('#color-door').offsetTop - window.innerHeight * 0.6 ? '#f5efe7' : '#070707';
    if (themeColor.content !== color) themeColor.content = color;
  };
  window.addEventListener('scroll', updateTheme, { passive: true });
  updateTheme();

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reducedMotion) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
  } else {
    document.querySelectorAll('.reveal').forEach(element => element.classList.add('is-visible'));
  }
})();

