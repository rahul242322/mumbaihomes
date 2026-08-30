/* ============================================================================
   app.js — all behaviour. Runs after render.js has built the DOM.
   ========================================================================== */
(function () {
  'use strict';

  var P = window.PROJECT;
  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };

  /* ------------------------------------------------------ contact links */

  function waHref(source) {
    var msg = 'Hi, I am interested in ' + P.brand.projectName + ' by ' + P.brand.developer +
      ' at ' + P.brand.locality + '. Please share the price sheet, floor plans and brochure.' +
      (source ? ' (via ' + source + ')' : '');
    return 'https://wa.me/' + P.contact.whatsapp + '?text=' + encodeURIComponent(msg);
  }

  function wireContacts(root) {
    $$('.js-tel', root).forEach(function (el) { el.href = 'tel:' + P.contact.phone; });
    $$('.js-wa', root).forEach(function (el) {
      el.href = waHref(el.dataset.source);
      el.target = '_blank';
      el.rel = 'noopener';
    });
  }
  wireContacts();

  /* --------------------------------------------------- header + mobile nav */

  var header = $('#siteHeader'), nav = $('#nav'), navToggle = $('#navToggle');

  window.addEventListener('scroll', function () {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  }, { passive: true });

  navToggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });

  /* --------------------------------------------------------- hero slider */

  /* Auto-advance only — no arrows, dots or swipe by design. */
  (function slider() {
    var root = $('#heroSlider');
    if (!root) return;
    var slides = $$('.slide', root), i = 0, timer;

    function show(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach(function (s, k) {
        var on = k === i;
        s.classList.toggle('active', on);
        var v = s.querySelector('video');
        // Only the visible video plays — keeps mobile data and battery sane.
        if (v) { on ? v.play().catch(function () {}) : v.pause(); }
      });
    }

    function start() { stop(); timer = setInterval(function () { show(i + 1); }, 5000); }
    function stop() { clearInterval(timer); }

    // Pause while the tab is hidden so slides don't race through in the background.
    document.addEventListener('visibilitychange', function () {
      document.hidden ? stop() : start();
    });

    show(0);
    if (slides.length > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) start();
  })();

  /* --------------------------------------------------------- location tabs */

  $$('.loc-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      var i = tab.dataset.i;
      $$('.loc-tab').forEach(function (t) { t.classList.toggle('active', t === tab); });
      $$('.loc-panel').forEach(function (p) { p.classList.toggle('active', p.dataset.i === i); });
    });
  });

  /* ------------------------------------------------------ gallery carousel */

  /* Shared by the gallery (one row of tiles) and the amenities (two rows in
     one frame). Both advance by exactly one column. */
  function makeCarousel(rootSel, itemSel, interval, opts) {
    var root = $(rootSel);
    if (!root) return;
    opts = opts || {};
    var track = $('.car-track', root);

    // One tile plus the gap, so each advance lands on a tile edge.
    function step() {
      var item = $(itemSel, track);
      if (!item) return Math.max(240, track.clientWidth * 0.6);
      var gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap) || 16;
      return item.offsetWidth + gap;
    }

    function advance() {
      var atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
      track.scrollTo({ left: atEnd ? 0 : track.scrollLeft + step(), behavior: 'smooth' });
    }

    var timer = null, visible = false;

    // Always restart the countdown, so becoming visible gives a full interval
    // rather than inheriting whatever was left of a previous one.
    function start() {
      stop();
      if (!visible || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      timer = setInterval(advance, interval || 3500);
    }
    function stop() { clearInterval(timer); timer = null; }

    // Hand control back to the visitor when they actually drive the carousel,
    // and resume once they have moved on.
    function pauseFor(ms) {
      stop();
      clearTimeout(pauseFor.t);
      pauseFor.t = setTimeout(start, ms || 7000);
    }

    $('.prev', root).addEventListener('click', function () {
      track.scrollBy({ left: -step(), behavior: 'smooth' }); pauseFor();
    });
    $('.next', root).addEventListener('click', function () {
      track.scrollBy({ left: step(), behavior: 'smooth' }); pauseFor();
    });

    if (opts.pauseOnHover) {
      root.addEventListener('mouseenter', stop);
      root.addEventListener('mouseleave', start);
    }

    // Only a sideways gesture is the visitor driving this carousel. Scrolling
    // the page vertically with the pointer over it is not, and treating it as
    // such was silently killing autoplay for seconds at a time.
    track.addEventListener('wheel', function (e) {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) pauseFor(9000);
    }, { passive: true });

    var tx = 0, ty = 0;
    track.addEventListener('touchstart', function (e) {
      tx = e.touches[0].clientX; ty = e.touches[0].clientY;
    }, { passive: true });
    track.addEventListener('touchmove', function (e) {
      if (Math.abs(e.touches[0].clientX - tx) > Math.abs(e.touches[0].clientY - ty)) pauseFor(9000);
    }, { passive: true });

    document.addEventListener('visibilitychange', function () {
      document.hidden ? stop() : start();
    });

    // Run only while the carousel is on screen. threshold 0 so it arms the
    // moment any part of it appears — a tall frame needs a lot of scrolling
    // before 25% of it is visible.
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        visible ? start() : stop();
      }, { threshold: 0 }).observe(root);
    } else {
      visible = true;
      start();
    }
  }

  makeCarousel('#galleryCarousel', '.car-item', 3000, { pauseOnHover: true });
  // Amenities keep moving even under the pointer — it is a scanning strip,
  // not something visitors stop to inspect.
  makeCarousel('#amenityCarousel', '.amenity', 2000, { pauseOnHover: false });

  /* --------------------------------------------------------------- lightbox */

  (function lightbox() {
    var box = $('#lightbox'), idx = 0;
    var items = P.gallery.filter(function (g) { return g.src; });

    function render() {
      var g = items[idx];
      box.innerHTML =
        '<div class="lb-backdrop" data-close></div>' +
        '<button class="lb-close" data-close aria-label="Close">×</button>' +
        '<button class="lb-nav prev" aria-label="Previous">‹</button>' +
        '<figure class="lb-figure">' +
          (g.type === 'video'
            ? '<video src="' + g.src + '" controls autoplay playsinline></video>'
            : '<img src="' + g.src + '" alt="' + (g.alt || '') + '">') +
          '<figcaption>' + (g.alt || '') + '</figcaption>' +
        '</figure>' +
        '<button class="lb-nav next" aria-label="Next">›</button>';
      $$('[data-close]', box).forEach(function (el) { el.addEventListener('click', close); });
      $('.lb-nav.prev', box).addEventListener('click', function () { go(-1); });
      $('.lb-nav.next', box).addEventListener('click', function () { go(1); });
    }
    function go(d) { idx = (idx + d + items.length) % items.length; render(); }
    function open(i) {
      if (!items.length) return;          // nothing but placeholders yet
      idx = i; render(); box.hidden = false; document.body.classList.add('no-scroll');
    }
    function close() { box.hidden = true; box.innerHTML = ''; document.body.classList.remove('no-scroll'); }

    $$('.js-lightbox').forEach(function (el) {
      var openThis = function () { open(+el.dataset.i); };
      el.addEventListener('click', openThis);
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openThis(); }
      });
    });

    document.addEventListener('keydown', function (e) {
      if (box.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    });
  })();

  /* ------------------------------------------------------------------ modal */

  var modal = $('#modal'), lastFocus = null;

  modal.innerHTML =
    '<div class="modal-backdrop" data-close></div>' +
    '<div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="modalTitle">' +
      '<button class="modal-close" data-close aria-label="Close">×</button>' +
      '<h2 id="modalTitle">Enquire Now</h2>' +
      '<p class="lead-sub" id="modalSub">Register here and avail the best offers.</p>' +
      window.leadFormHTML('Modal') +
    '</div>';
  wireContacts(modal);

  function openModal(source, config, title) {
    lastFocus = document.activeElement;
    var form = $('.lead-form', modal);
    form.dataset.source = source || 'Modal';
    $('#modalTitle').textContent = title || 'Enquire Now';
    if (config) {
      var sel = form.configuration;
      // Preselect only if the button names a configuration we actually list.
      if ([].some.call(sel.options, function (o) { return o.value === config; })) sel.value = config;
    }
    modal.hidden = false;
    document.body.classList.add('no-scroll');
    form.name.focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove('no-scroll');
    if (lastFocus) lastFocus.focus();
  }

  $$('[data-close]', modal).forEach(function (el) { el.addEventListener('click', closeModal); });

  $$('.js-open-modal').forEach(function (b) {
    b.addEventListener('click', function () {
      openModal(b.dataset.source, b.dataset.config, b.textContent.trim());
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
  });

  // Keep focus inside the dialog while it is open.
  modal.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var f = $$('button, input, select, textarea, a[href]', modal).filter(function (el) { return el.offsetParent; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  /* Fires once, 6 seconds after landing. Once only per session — after this
     the modal opens solely from the Enquire / Request buttons. */
  (function autoPopup() {
    var KEY = 'lead-popup-shown';
    try {
      if (sessionStorage.getItem(KEY)) return;
    } catch (err) { return; }          // private mode — skip rather than nag
    setTimeout(function () {
      if (!modal.hidden || document.body.classList.contains('submitted')) return;
      try { sessionStorage.setItem(KEY, '1'); } catch (err) {}
      openModal('Auto Popup', null, 'Enquire Now');
    }, 6000);
  })();

  /* ------------------------------------------------------------ lead forms */

  function validate(form) {
    var ok = true;
    $$('[required]', form).forEach(function (f) {
      var valid = f.type === 'checkbox' ? f.checked : (f.value.trim() !== '' && f.checkValidity());
      f.classList.toggle('invalid', !valid);
      if (!valid && ok) { f.focus(); ok = false; }
    });
    return ok;
  }

  function collect(form) {
    return {
      submittedAt:   new Date().toISOString(),
      name:          form.name.value.trim(),
      phone:         '+91' + form.phone.value.trim(),
      email:         form.email ? form.email.value.trim() : '',
      configuration: form.configuration ? (form.configuration.value || 'Not specified') : 'Not specified',
      project:       P.brand.projectName + ' — ' + P.brand.locality,
      source:        form.dataset.source || 'Website',
      page:          location.href,
      referrer:      document.referrer || 'direct',
      // Stored with every lead so there is a record of exactly what was
      // agreed to, alongside the submittedAt timestamp.
      consent:       window.CONSENT_TEXT || 'Agreed to be contacted'
    };
  }

  // Each channel resolves false instead of throwing, so one dead channel
  // never blocks the others.
  function sendEmail(lead) {
    if (!P.leads.web3formsKey) return Promise.resolve(false);
    return fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(Object.assign({
        access_key: P.leads.web3formsKey,
        subject: 'New lead — ' + lead.project + ' (' + lead.configuration + ')',
        from_name: 'Website Enquiry'
      }, lead))
    }).then(function (r) { return r.ok; }).catch(function () { return false; });
  }

  // no-cors means the response is opaque: a resolved promise only proves the
  // request left the browser. Check the Sheet itself when testing.
  function sendSheet(lead) {
    if (!P.leads.sheetsUrl) return Promise.resolve(false);
    return fetch(P.leads.sheetsUrl, {
      method: 'POST', mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(lead)
    }).then(function () { return true; }).catch(function () { return false; });
  }

  function track(lead) {
    // Fires only if you have added GA4 / Meta Pixel to index.html.
    if (window.gtag) window.gtag('event', 'generate_lead', { source: lead.source, config: lead.configuration });
    if (window.fbq)  window.fbq('track', 'Lead', { content_name: lead.project });
  }

  $$('.lead-form').forEach(function (form) {
    form.addEventListener('input', function (e) { e.target.classList.remove('invalid'); });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = $('.form-status', form);
      var submit = $('button[type=submit]', form);
      var original = submit.textContent;

      status.className = 'form-status';
      status.textContent = '';

      if (!validate(form)) {
        status.className = 'form-status err';
        status.textContent = 'Please enter your name, a valid 10-digit mobile number, and leave the consent box ticked.';
        return;
      }

      var lead = collect(form);
      submit.disabled = true;
      submit.textContent = 'Sending…';

      Promise.all([sendEmail(lead), sendSheet(lead)]).then(function (r) {
        submit.disabled = false;
        submit.textContent = original;
        track(lead);
        document.body.classList.add('submitted');

        if (r.some(Boolean)) {
          status.className = 'form-status ok';
          status.textContent = 'Thank you, ' + lead.name.split(' ')[0] + '. The sales team will call you shortly.';
          form.reset();
          setTimeout(function () { if (!modal.hidden) closeModal(); }, 2600);
        } else {
          // No channel configured, or every channel failed — hand the lead to
          // WhatsApp so it is never silently lost.
          status.className = 'form-status ok';
          status.textContent = 'Opening WhatsApp to send your enquiry…';
          var text = 'New enquiry — ' + lead.project +
            '\nName: ' + lead.name +
            '\nPhone: ' + lead.phone +
            (lead.email ? '\nEmail: ' + lead.email : '') +
            '\nConfiguration: ' + lead.configuration +
            '\nSource: ' + lead.source;
          window.open('https://wa.me/' + P.contact.whatsapp + '?text=' + encodeURIComponent(text),
                      '_blank', 'noopener');
        }
      });
    });
  });

  /* ------------------------------------------------------- reveal on scroll */

  if ('IntersectionObserver' in window &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    $$('.sec-head, .hl-grid li, .amenity, .plan-card, .stat-row div, .table-wrap, .about-grid > div')
      .forEach(function (el) { el.classList.add('reveal'); io.observe(el); });
  }
})();
