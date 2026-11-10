/* ==========================================================================
   Portal de Poá Open Mall — interações
   Zero dependências. Tudo degrada bem se o JS falhar.
   ========================================================================== */

(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------------------------------------------------------------
     1. Preloader + entrada do hero
     --------------------------------------------------------------- */
  function bootHero() {
    var pre = $('#preloader');
    document.body.classList.add('is-ready');
    if (!pre) return;
    pre.classList.add('is-done');
    window.setTimeout(function () { pre.remove(); }, 800);
  }

  window.addEventListener('load', function () {
    window.setTimeout(bootHero, reduced ? 0 : 450);
  });
  // rede de segurança: se o load demorar demais, libera a tela assim mesmo
  window.setTimeout(bootHero, 3500);

  /* ---------------------------------------------------------------
     2. Reveal no scroll
     --------------------------------------------------------------- */
  var revealables = $$('.reveal');
  revealables.forEach(function (el) {
    var d = el.getAttribute('data-delay');
    if (d) el.style.setProperty('--d', d + 'ms');
  });

  if ('IntersectionObserver' in window && !reduced) {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        revealIO.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });

    revealables.forEach(function (el) { revealIO.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------------------------------------------------------------
     3. Header + barra de progresso + link ativo
     --------------------------------------------------------------- */
  var header   = $('#header');
  var progress = $('#scrollProgress');
  var navLinks = $$('.nav__link');
  var sections = navLinks
    .map(function (a) { return a.hash ? $(a.hash) : null; })
    .filter(Boolean);

  var ticking = false;

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;

    if (header) header.classList.toggle('is-stuck', y > 40);

    if (progress) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = 'scaleX(' + (h > 0 ? Math.min(y / h, 1).toFixed(4) : 0) + ')';
    }

    // seção ativa no menu
    var current = null;
    sections.forEach(function (sec) {
      if (sec.getBoundingClientRect().top <= window.innerHeight * 0.38) current = sec.id;
    });
    navLinks.forEach(function (a) {
      a.classList.toggle('is-current', current !== null && a.hash === '#' + current);
    });

    // parallax leve
    if (!reduced) {
      $$('[data-parallax]').forEach(function (el) {
        var rate = parseFloat(el.getAttribute('data-parallax')) || 0.2;
        el.style.transform = 'translate3d(0,' + (y * rate).toFixed(1) + 'px,0)';
      });
    }

    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(onScroll);
  }, { passive: true });
  onScroll();

  /* ---------------------------------------------------------------
     4. Menu mobile
     --------------------------------------------------------------- */
  var burger = $('#burger');
  var nav    = $('#nav');

  function closeMenu() {
    if (!nav || !burger) return;
    nav.classList.remove('is-open');
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Abrir menu');
    document.body.classList.remove('is-locked');
  }

  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
      document.body.classList.toggle('is-locked', open);
    });

    $$('a', nav).forEach(function (a) { a.addEventListener('click', closeMenu); });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ---------------------------------------------------------------
     5. Contadores do hero
     --------------------------------------------------------------- */
  function runCounter(el) {
    var to    = parseInt(el.getAttribute('data-to'), 10) || 0;
    var plain = el.hasAttribute('data-plain'); // anos não levam separador
    var dur   = 1500;
    var start = null;

    if (reduced) { el.textContent = to; return; }

    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = Math.round(to * eased);
      el.textContent = plain ? String(val) : val.toLocaleString('pt-BR');
      if (p < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }

  var counters = $$('.count');
  if (counters.length) {
    if ('IntersectionObserver' in window) {
      var countIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          runCounter(e.target);
          countIO.unobserve(e.target);
        });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { countIO.observe(el); });
    } else {
      counters.forEach(runCounter);
    }
  }

  /* ---------------------------------------------------------------
     6. Linha do tempo — traço que preenche conforme o scroll
     --------------------------------------------------------------- */
  var timeline = $('#timeline');

  if (timeline && !reduced) {
    var fillTimeline = function () {
      var r = timeline.getBoundingClientRect();
      var vh = window.innerHeight;
      var p = (vh * 0.6 - r.top) / r.height;
      timeline.style.setProperty('--tl-fill', Math.max(0, Math.min(p, 1)).toFixed(3));
    };
    window.addEventListener('scroll', fillTimeline, { passive: true });
    window.addEventListener('resize', fillTimeline);
    fillTimeline();

    if ('IntersectionObserver' in window) {
      var tlIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          e.target.classList.toggle('is-in', e.isIntersecting);
        });
      }, { rootMargin: '-35% 0px -45% 0px' });
      $$('.tl', timeline).forEach(function (el) { tlIO.observe(el); });
    }
  }

  /* ---------------------------------------------------------------
     7. Filtro das novidades
     --------------------------------------------------------------- */
  var filters = $$('.filter');
  var cards   = $$('.news-card');

  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var cat = btn.getAttribute('data-filter');

      filters.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-selected', on ? 'true' : 'false');
      });

      cards.forEach(function (card, i) {
        var show = cat === 'todos' || card.getAttribute('data-cat') === cat;
        card.classList.toggle('is-hidden', !show);
        if (show && !reduced) {
          card.classList.remove('is-in');
          card.style.setProperty('--d', (i * 60) + 'ms');
          // força reflow para reiniciar a transição
          void card.offsetWidth;
          card.classList.add('is-in');
        }
      });
    });
  });

  /* ---------------------------------------------------------------
     8. Tilt nos cards (só em ponteiro fino)
     --------------------------------------------------------------- */
  if (!reduced && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
    $$('.tilt').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width  - 0.5;
        var y = (e.clientY - r.top)  / r.height - 0.5;
        el.style.transform =
          'perspective(900px) rotateX(' + (-y * 4).toFixed(2) + 'deg) rotateY(' +
          (x * 4).toFixed(2) + 'deg) translateY(-6px)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });

    /* botões magnéticos */
    $$('.magnetic').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2)  * 0.22;
        var y = (e.clientY - r.top  - r.height / 2) * 0.3;
        el.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }

  /* ---------------------------------------------------------------
     9. Formulário "Quero ser lojista"
     --------------------------------------------------------------- */
  var form = $('#lojistaForm');

  if (form) {
    var phone = $('#telefone');
    if (phone) {
      phone.addEventListener('input', function () {
        var v = phone.value.replace(/\D/g, '').slice(0, 11);
        var out = v;
        if (v.length > 6) {
          out = '(' + v.slice(0, 2) + ') ' + v.slice(2, v.length - 4) + '-' + v.slice(-4);
        } else if (v.length > 2) {
          out = '(' + v.slice(0, 2) + ') ' + v.slice(2);
        } else if (v.length) {
          out = '(' + v;
        }
        phone.value = out;
      });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var ok = true;
      $$('[required]', form).forEach(function (f) {
        var valid = f.checkValidity() && String(f.value).trim() !== '';
        f.classList.toggle('is-invalid', !valid);
        if (!valid && ok) { f.focus(); ok = false; }
      });
      if (!ok) return;

      /* TODO: trocar pelo endpoint real (Formspree, API própria, etc.)
         fetch('/api/lojista', { method:'POST', body: new FormData(form) }) */

      var msg = $('#formOk');
      if (msg) msg.hidden = false;
      form.reset();
      $$('.is-invalid', form).forEach(function (f) { f.classList.remove('is-invalid'); });
    });
  }

  /* ---------------------------------------------------------------
     10. Ano no rodapé
     --------------------------------------------------------------- */
  var ano = $('#ano');
  if (ano) ano.textContent = new Date().getFullYear();

})();
