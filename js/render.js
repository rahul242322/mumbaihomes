/* ============================================================================
   render.js — builds every section of the page from window.PROJECT.
   No framework. Pure string templates written into the shell in index.html.
   Behaviour (slider, tabs, modal, forms) lives in app.js.
   ========================================================================== */
(function () {
  'use strict';

  var P = window.PROJECT;

  /* ------------------------------------------------------------- helpers */

  // Everything from the data file goes through this before hitting innerHTML.
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function set(id, html) {
    var node = document.getElementById(id);
    if (node) node.innerHTML = html;
  }

  /* Renders an image, a video, or a labelled placeholder when src is empty.
     Placeholders are what let the site look finished before the shoot. */
  function media(m, cls, eager) {
    m = m || {};
    var label = esc(m.alt || m.name || 'Image');
    if (!m.src) {
      return '<div class="' + cls + ' ph"><span>' + label + '</span></div>';
    }
    if (m.type === 'video') {
      return '<video class="' + cls + '" src="' + esc(m.src) + '"' +
             (m.poster ? ' poster="' + esc(m.poster) + '"' : '') +
             ' muted loop playsinline preload="metadata" aria-label="' + label + '"></video>';
    }
    return '<img class="' + cls + '" src="' + esc(m.src) + '" alt="' + label + '"' +
           (eager ? '' : ' loading="lazy" decoding="async"') + '>';
  }

  /* Inline stroke icons. Drawn here rather than pulled from a library so the
     page keeps zero external requests, and they inherit currentColor.
     `icon` in the data file names one of these; anything unrecognised is
     printed as-is, so an emoji still works as a fallback. */
  var ICONS = {
    pool:       'M2 15c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2M2 20c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2M8 13V5a2 2 0 0 1 4 0M16 13V5',
    cinema:     'M3 5h18v14H3zM3 9.5h18M7.5 5v4.5M16.5 5v4.5M10.5 12.5l4.5 2.5-4.5 2.5z',
    banquet:    'M7.5 3h9l-1 6.5a3.5 3.5 0 0 1-7 0zM12 13v7M8.5 20h7',
    kids:       'M12 3a4.5 5.5 0 0 1 0 11 4.5 5.5 0 0 1 0-11zM12 14v2.5M9.5 21c1-2.5 4-2.5 5 0',
    basketball: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 3v18M3 12h18M5.5 5.5c4 4 4 9 0 13M18.5 5.5c-4 4-4 9 0 13',
    tree:       'M12 22v-5M12 17l-4.5-5h9zM12 12L8 7h8zM12 7L9.5 3.5h5z',
    lobby:      'M3 21h18M3 9.5l9-6.5 9 6.5M6 21V10M10 21V10M14 21V10M18 21V10',
    lift:       'M5 3h14v18H5zM9 9l3-3 3 3M9 15l3 3 3-3',
    yoga:       'M12 6.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM12 8.5c-3.2 0-5.5 2.3-5.5 5.5L3.5 17M12 8.5c3.2 0 5.5 2.3 5.5 5.5l3 3M5 20.5h14',
    running:    'M14.5 5.5a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6zM13.5 8.5l-3.5 3 2.5 4-3 6M12.5 15.5l4.5 2 1 4.5M10 11.5L5.5 13',
    gym:        'M4 9v6M20 9v6M7.5 6.5v11M16.5 6.5v11M7.5 12h9',
    bench:      'M3 20h18M5 13h14v3H5zM6 16v4M18 16v4M6 13v-2M18 13v-2',
    road:       'M5 21L7 3M19 21L17 3M12 4v3M12 10.5v3M12 17v3',
    pin:        'M12 21s6.5-5.8 6.5-10.5a6.5 6.5 0 1 0-13 0C5.5 15.2 12 21 12 21zM12 12.5a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4z',
    school:     'M2.5 8.5L12 4.2l9.5 4.3L12 12.8zM6.5 10.8V16c0 1.7 2.5 3 5.5 3s5.5-1.3 5.5-3v-5.2M20 9.5v5',
    health:     'M9.5 3.5h5V9h5.5v5h-5.5v5.5h-5V14H4V9h5.5z',
    shop:       'M4 9h16l-1.2 11H5.2zM4.5 9L6.5 4h11l2 5M9.5 13a2.5 2.5 0 0 0 5 0'
  };

  /* WhatsApp brand glyph — filled, unlike the stroke icons above. */
  var WA_ICON = '<svg class="wa-glyph" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
    '<path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.91-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.42-.08-.12-.27-.2-.57-.34M12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.89 9.89-9.89 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.43 9.89-9.88 9.89m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.69 1.45c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.17-3.49-8.41"/></svg>';

  function icon(name) {
    var d = ICONS[name];
    if (!d) return esc(name || '◆');   // emoji or literal fallback
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" ' +
           'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + d + '"/></svg>';
  }

  function btn(text, source, cls, config) {
    return '<button class="btn ' + (cls || 'btn-primary') + ' js-open-modal" ' +
           'data-source="' + esc(source) + '"' +
           (config ? ' data-config="' + esc(config) + '"' : '') + '>' + esc(text) + '</button>';
  }

  function head(eyebrow, title, sub) {
    return '<div class="sec-head">' +
      (eyebrow ? '<p class="eyebrow">' + esc(eyebrow) + '</p>' : '') +
      '<h2 class="sec-title">' + esc(title) + '</h2>' +
      (sub ? '<p class="sec-sub">' + esc(sub) + '</p>' : '') +
      '</div>';
  }

  /* Your brand leads; the project and its builder are the subtitle. Keeping
     the developer's name out of the primary mark is what stops this reading
     as the developer's own site. */
  function logo(extraClass) {
    var b = P.brand;
    var mark = b.logo
      ? '<img class="brand-logo" src="' + esc(b.logo) + '" alt="' + esc(b.siteName) + '">'
      : '<span class="brand-mark">' + esc(b.monogram || b.siteName.charAt(0)) + '</span>';
    return '<a class="brand ' + (extraClass || '') + '" href="#top">' + mark +
      '<span class="brand-text"><strong>' + esc(b.siteName) + '</strong>' +
      '<small>' + esc(b.locality) + ' · ' + esc(b.city) + '</small></span></a>';
  }

  /* The lead form markup is shared by the hero, the modal and the site-visit
     band, so a change to the fields only has to be made once. */
  function leadForm(source, opts) {
    opts = opts || {};
    var compact = opts.compact;
    return '<form class="lead-form' + (compact ? ' compact' : '') + '" data-source="' + esc(source) + '" novalidate>' +
      '<label><span>Full Name</span>' +
        '<input type="text" name="name" autocomplete="name" required placeholder="Your name"></label>' +
      '<label><span>Mobile Number</span>' +
        '<div class="tel-wrap"><span class="cc">+91</span>' +
        '<input type="tel" name="phone" autocomplete="tel" required inputmode="numeric" ' +
        'maxlength="10" pattern="[6-9][0-9]{9}" placeholder="10-digit mobile"></div></label>' +
      /* Email and configuration share a row — stacking every field made the
         dialog taller than the viewport. */
      (compact ? '' :
      '<div class="field-row">' +
        '<label><span>Email <em>(optional)</em></span>' +
          '<input type="email" name="email" autocomplete="email" placeholder="you@example.com"></label>' +
        '<label><span>Configuration</span><select name="configuration">' +
          '<option value="">Select</option>' +
          // De-duplicated: the price table lists 2 BHK three times by area.
          P.pricing.rows.map(function (r) { return r.type; })
            .filter(function (t, i, a) { return a.indexOf(t) === i; })
            .map(function (t) { return '<option>' + esc(t) + '</option>'; }).join('') +
          '<option>Not sure yet</option>' +
        '</select></label>' +
      '</div>') +
      '<label class="consent"><input type="checkbox" name="consent" required>' +
        '<span>I consent to be contacted about this project by phone, SMS, email or WhatsApp.</span></label>' +
      '<button class="btn btn-primary btn-block" type="submit">' + esc(opts.cta || 'Send Enquiry') + '</button>' +
      '<p class="form-status" role="status" aria-live="polite"></p>' +
      '<div class="or-sep"><span>or</span></div>' +
      '<a class="btn btn-wa btn-block js-wa" data-source="' + esc(source) + ' WhatsApp" href="#">' +
        WA_ICON + 'Connect on WhatsApp</a>' +
      '</form>';
  }
  window.leadFormHTML = leadForm;   // app.js reuses this for the modal

  /* ------------------------------------------------------------- <head> */

  (function seo() {
    var s = P.seo, b = P.brand;
    document.title = s.title;
    var metas = [
      ['name', 'description', s.description],
      ['name', 'keywords', s.keywords],
      ['property', 'og:type', 'website'],
      ['property', 'og:title', s.title],
      ['property', 'og:description', s.description],
      ['property', 'og:image', s.domain + '/' + s.ogImage],
      ['property', 'og:url', s.domain],
      ['name', 'twitter:card', 'summary_large_image']
    ];
    metas.forEach(function (m) {
      if (!m[2]) return;
      var el = document.querySelector('meta[' + m[0] + '="' + m[1] + '"]') || document.createElement('meta');
      el.setAttribute(m[0], m[1]);
      el.setAttribute('content', m[2]);
      document.head.appendChild(el);
    });
    var link = document.createElement('link');
    link.rel = 'canonical'; link.href = s.domain;
    document.head.appendChild(link);

    // Rich results: the project itself, plus the FAQ accordion.
    var ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.textContent = JSON.stringify([
      {
        '@context': 'https://schema.org', '@type': 'Residence',
        name: b.projectName + ' by ' + b.developer,
        description: s.description,
        url: s.domain,
        address: {
          '@type': 'PostalAddress',
          streetAddress: P.contact.officeAddress,
          addressLocality: b.locality, addressRegion: 'Maharashtra',
          addressCountry: 'IN'
        },
        telephone: P.contact.phone
      },
      {
        '@context': 'https://schema.org', '@type': 'FAQPage',
        mainEntity: P.faqs.map(function (f) {
          return { '@type': 'Question', name: f.q,
                   acceptedAnswer: { '@type': 'Answer', text: f.a } };
        })
      }
    ]);
    document.head.appendChild(ld);
  })();

  /* ------------------------------------------------------------- header */

  set('siteHeader',
    '<div class="wrap header-inner">' + logo() +
    (P.brand.developerLogo
      ? '<div class="co-brand"><img src="' + esc(P.brand.developerLogo) + '" alt="' + esc(P.brand.developer) + '"></div>'
      : '') +
    '<nav class="nav" id="nav" aria-label="Main">' +
      [['#highlights','Highlights'],['#pricing','Price'],['#plans','Floor Plans'],
       ['#amenities','Amenities'],['#gallery','Gallery'],['#location','Location'],['#faq','FAQ']]
      .map(function (a) { return '<a href="' + a[0] + '">' + a[1] + '</a>'; }).join('') +
    '</nav>' +
    '<div class="header-cta">' +
      '<a class="btn btn-ghost js-tel" href="#">Call</a>' +
      btn('Enquire Now', 'Header') +
      '<button class="nav-toggle" id="navToggle" aria-expanded="false" aria-controls="nav" aria-label="Menu">' +
        '<span></span><span></span><span></span></button>' +
    '</div></div>');

  /* --------------------------------------------------------------- hero */

  (function hero() {
    var h = P.hero, b = P.brand;

    var slides = h.slides.map(function (s, i) {
      return '<div class="slide' + (i === 0 ? ' active' : '') + '">' + media(s, 'slide-media', i === 0) + '</div>';
    }).join('');

    var offer = h.offer ? '<div class="offer">' +
      '<p class="offer-title">' + esc(h.offer.title) + '</p>' +
      '<ul>' + h.offer.lines.map(function (l) { return '<li>' + esc(l) + '</li>'; }).join('') + '</ul>' +
      '</div>' : '';

    var facts = '<ul class="facts">' + P.quickFacts.map(function (f) {
      return '<li><strong>' + esc(f.value) + '</strong><span>' + esc(f.label) + '</span></li>';
    }).join('') + '</ul>';

    set('top',
      '<div class="slider" id="heroSlider">' + slides +
        '<div class="slider-shade"></div>' +
      '</div>' +
      '<div class="wrap hero-grid">' +
        '<div class="hero-copy">' +
          '<p class="badge">' + esc(h.status) + '</p>' +
          // The lockup already reads "Codename Luxury Living", so the <h1>
          // carries the same words for search engines and screen readers.
          (b.projectLogoWhite || b.projectLogo
            ? '<h1 class="h1-logo"><img src="' + esc(b.projectLogoWhite || b.projectLogo) +
              '" alt="' + esc(b.projectName) + '"></h1>'
            : '<p class="eyebrow">Codename</p><h1>' + esc(b.projectName) + '</h1>') +
          '<p class="by">by ' + esc(b.developer) + ' · ' + esc(b.tagline) + '</p>' +
          offer +
          '<p class="config-line">' + esc(h.configLine) + '</p>' +
          '<p class="price">' + esc(h.priceFrom) + ' <span>' + esc(h.priceNote) + '</span></p>' +
          (h.psf ? '<p class="psf">' + esc(h.psf) + '</p>' : '') +
          facts +
          '<div class="hero-actions">' +
            btn('Get Price & Floor Plans', 'Hero', 'btn-primary btn-lg') +
            '<a class="btn btn-outline-light btn-lg js-wa" data-source="Hero" href="#">WhatsApp Us</a>' +
          '</div>' +
          '<p class="fineprint">Enquiries go directly to the sales team. No brokerage, no spam.</p>' +
        '</div>' +
      '</div>');
  })();

  /* -------------------------------------------------------- trust strip */

  set('trust', '<div class="wrap strip-grid">' + P.trustStrip.map(function (t) {
    return '<div><strong>' + esc(t.value) + '</strong><span>' + esc(t.label) + '</span></div>';
  }).join('') + '</div>');

  /* --------------------------------------------------------- highlights */

  set('highlights', '<div class="wrap">' +
    head('Overview', P.brand.projectName + ' — Highlights') +
    '<ul class="hl-grid">' + P.highlights.map(function (t) {
      return '<li><span class="tick">✓</span>' + esc(t) + '</li>';
    }).join('') + '</ul>' +
    '<div class="center">' + btn('Request Brochure', 'Highlights Brochure', 'btn-primary btn-lg') + '</div>' +
    '</div>');

  /* -------------------------------------------------------------- about */

  set('about', '<div class="wrap about-grid">' +
    '<div>' + head('The Project', P.about.heading) +
      P.about.body.map(function (p) { return '<p class="body-lg">' + esc(p) + '</p>'; }).join('') +
      '<dl class="specs">' + P.about.specs.map(function (s) {
        return '<div><dt>' + esc(s.label) + '</dt><dd>' + esc(s.value) + '</dd></div>';
      }).join('') + '</dl>' +
      (P.about.why && P.about.why.length
        ? '<div class="why"><p class="why-title">Why Luxury Living?</p><ul>' +
          P.about.why.map(function (w) { return '<li>' + esc(w) + '</li>'; }).join('') +
          '</ul></div>'
        : '') +
      btn('Request Brochure', 'About Brochure', 'btn-primary') +
    '</div>' +
    '<div class="about-media">' + media({ src: P.about.image, alt: 'Project view' }, 'about-img') + '</div>' +
    '</div>');

  /* ------------------------------------------------------------ pricing */

  set('pricing', '<div class="wrap">' +
    head('Area & Pricing', P.brand.projectName + ' — Area & Pricing') +
    '<div class="table-wrap"><table class="price-table"><thead><tr>' +
      '<th>Type</th><th>Area</th><th>Price (Onwards)</th><th></th></tr></thead><tbody>' +
      P.pricing.rows.map(function (r) {
        return '<tr>' +
          '<td data-label="Type"><strong>' + esc(r.type) + '</strong></td>' +
          '<td data-label="Area">' + esc(r.area) + '</td>' +
          '<td data-label="Price"><span class="price-pill">' + esc(r.price) + '</span></td>' +
          '<td>' + btn('Complete Costing Details', 'Price ' + r.type, 'btn-primary btn-sm', r.type) + '</td>' +
        '</tr>';
      }).join('') +
    '</tbody></table></div>' +
    '<p class="note">' + esc(P.pricing.note) + '</p>' +
    '</div>');

  /* -------------------------------------------------------------- plans */

  set('plans', '<div class="wrap">' +
    head('Layouts', 'Master Plan & Unit Plan',
         'Layouts are shared on request to keep launch-stage pricing confidential.') +
    '<div class="plan-grid">' + P.plans.map(function (pl) {
      return '<article class="plan-card">' +
        '<div class="plan-thumb">' + media({ src: pl.image, alt: pl.title }, 'plan-img') +
          '<span class="plan-overlay">' + esc(pl.cta.toUpperCase()) + '</span></div>' +
        '<h3>' + esc(pl.title) + '</h3>' +
        btn(pl.cta, 'Plan · ' + pl.title, 'btn-outline btn-block') +
      '</article>';
    }).join('') + '</div></div>');

  /* ---------------------------------------------------------- amenities */

  set('amenities', '<div class="wrap">' +
    head('Lifestyle', P.amenities.total + ' Luxurious Amenities',
         'Set on a 1,25,000 sq.ft. grand E-Deck, lifted clear of the street.') +
    /* Two rows in one frame that auto-slides sideways — a long static grid
       buries the later amenities where nobody scrolls. */
    '<div class="carousel amen-carousel" id="amenityCarousel">' +
      '<button class="car-arrow prev" aria-label="Previous amenities">‹</button>' +
      '<div class="car-track amen-track">' + P.amenities.items.map(function (a) {
      if (!a.image) {
        return '<figure class="amenity icon-tile">' +
          '<div class="icon-big">' + icon(a.icon) + '</div>' +
          '<figcaption>' + esc(a.name) + '</figcaption></figure>';
      }
      return '<figure class="amenity">' + media({ src: a.image, alt: a.name }, 'amenity-img') +
        '<figcaption><span class="ico">' + icon(a.icon) + '</span>' + esc(a.name) + '</figcaption>' +
      '</figure>';
    }).join('') + '</div>' +
      '<button class="car-arrow next" aria-label="More amenities">›</button>' +
    '</div>' +
    '<p class="note">' + esc(P.amenities.note) + '</p>' +
    '<div class="center">' + btn('Request All Amenities', 'Amenities', 'btn-primary btn-lg') + '</div>' +
    '</div>');

  /* ------------------------------------------------------------ gallery */

  set('gallery', '<div class="wrap">' +
    head('Gallery', 'Project Gallery', 'Artistic impressions from the developer’s project renders.') +
    '<div class="carousel" id="galleryCarousel">' +
      '<button class="car-arrow prev" aria-label="Scroll left">‹</button>' +
      '<div class="car-track">' + P.gallery.map(function (g, i) {
        return '<figure class="car-item js-lightbox" data-i="' + i + '" tabindex="0" role="button" ' +
               'aria-label="View ' + esc(g.alt) + '">' + media(g, 'car-img') +
               '<figcaption>' + esc(g.alt) + '</figcaption></figure>';
      }).join('') + '</div>' +
      '<button class="car-arrow next" aria-label="Scroll right">›</button>' +
    '</div></div>');

  /* ----------------------------------------------------------- location */

  (function location() {
    var L = P.location;
    var tabs = L.tabs.map(function (t, i) {
      return '<button class="loc-tab' + (i === 0 ? ' active' : '') + '" data-i="' + i + '">' +
             '<span>' + icon(t.icon) + '</span>' + esc(t.name) + '</button>';
    }).join('');

    var panels = L.tabs.map(function (t, i) {
      return '<ul class="loc-panel' + (i === 0 ? ' active' : '') + '" data-i="' + i + '">' +
        t.items.map(function (it) {
          return '<li><span class="pin">📍</span><span class="place">' + esc(it.place) +
                 '</span><b>' + esc(it.time) + '</b></li>';
        }).join('') + '</ul>';
    }).join('');

    set('location', '<div class="wrap">' +
      head('Connectivity', P.brand.projectName + ' — Location Advantage') +
      '<div class="map-wrap"><iframe title="Project location map" src="' + esc(L.mapEmbed) +
        '" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>' +
        '<a class="map-open" href="' + esc(L.mapLink) + '" target="_blank" rel="noopener">Open in Maps ↗</a></div>' +
      '<div class="loc-tabs">' + tabs + '</div>' +
      '<div class="loc-panels">' + panels + '</div>' +
      '<div class="center">' + btn('Request Location Details', 'Location', 'btn-primary') + '</div>' +
      '</div>');
  })();

  /* ----------------------------------------------------------- cta band */

  set('ctaband', '<div class="wrap cta-inner">' +
    '<div><h2>EOI window is open — launch pricing closes soon.</h2>' +
    '<p>Talk to ' + esc(P.contact.personName) + ' for unit availability, costing and a site visit.</p></div>' +
    '<div class="cta-actions">' +
      btn('Enquire Now', 'CTA Band', 'btn-light btn-lg') +
      '<a class="btn btn-outline-light btn-lg js-tel" href="#">Call Sales</a>' +
    '</div></div>');

  /* --------------------------------------------------------------- faqs */

  set('faq', '<div class="wrap narrow">' +
    head('FAQ', 'Project FAQs') +
    P.faqs.map(function (f) {
      return '<details><summary>' + esc(f.q) + '</summary><p>' + esc(f.a) + '</p></details>';
    }).join('') + '</div>');

  /* ---------------------------------------------------------- developer */

  set('developer', '<div class="wrap narrow center-block">' +
    (P.brand.developerLogo
      ? '<div class="dev-logo"><img src="' + esc(P.brand.developerLogo) + '" alt="' + esc(P.brand.developer) + '"></div>'
      : '') +
    head('The Developer', P.developer.heading) +
    '<p class="body-lg">' + esc(P.developer.body) + '</p>' +
    '<div class="stat-row">' + P.developer.stats.map(function (s) {
      return '<div><b>' + esc(s.value) + '</b><span>' + esc(s.label) + '</span></div>';
    }).join('') + '</div></div>');

  /* -------------------------------------------------------- visit band */

  set('visit', '<div class="wrap visit-inner">' +
    '<div class="visit-card">' +
      '<h2>Schedule a Site Visit</h2>' +
      '<p class="lead-sub">Complimentary pickup can be arranged. Zero brokerage.</p>' +
      leadForm('Site Visit', { compact: true, cta: 'Submit' }) +
    '</div></div>');

  /* ------------------------------------------------------------- footer */

  (function footer() {
    var c = P.contact, b = P.brand, l = P.legal;
    set('footer',
      '<div class="wrap footer-grid">' +
        '<div>' + logo('brand-footer') +
          (c.personName
            ? '<p class="footer-person"><strong>' + esc(c.personName) + '</strong>' +
              (c.personTitle ? '<br><span>' + esc(c.personTitle) + '</span>' : '') + '</p>'
            : '') +
          '<p class="footer-contact">' +
            '<a class="js-tel" href="#">' + esc(c.phone) + '</a><br>' +
            '<a class="js-wa" data-source="Footer" href="#">WhatsApp the sales team</a>' +
            (c.email ? '<br><a href="mailto:' + esc(c.email) + '">' + esc(c.email) + '</a>' : '') +
          '</p>' +
          '<p class="footer-addr">' + esc(c.officeAddress) + '</p>' +
        '</div>' +
        (P.brand.developerLogo
          ? '<div class="footer-credit"><span>A project by</span>' +
            '<img src="' + esc(P.brand.developerLogo) + '" alt="' + esc(b.developer) + '"></div>'
          : '') +
        '<nav class="footer-links" aria-label="Footer">' +
          [['#highlights','Highlights'],['#pricing','Price'],['#plans','Floor Plans'],
           ['#amenities','Amenities'],['#gallery','Gallery'],['#location','Location'],['#faq','FAQ']]
          .map(function (a) { return '<a href="' + a[0] + '">' + a[1] + '</a>'; }).join('') +
        '</nav>' +
      '</div>' +
      '<div class="wrap disclaimer">' +
        '<p class="rera">Agent MahaRERA Registration No.: <strong>' + esc(l.agentRera) + '</strong>' +
          (l.agentGst ? ' · GST: ' + esc(l.agentGst) : '') + '<br>' +
          'Project MahaRERA Registration No.: <strong>' + esc(l.projectRera) + '</strong> — ' +
          'verify both at <a href="https://maharera.mahaonline.gov.in" target="_blank" rel="noopener">maharera.mahaonline.gov.in</a></p>' +
        '<p>This website is operated by ' + esc(l.operatedBy) + '. ' + esc(l.disclaimer) + '</p>' +
        '<p class="copyright">© <span id="year"></span> ' + esc(b.siteName) + '. All rights reserved. ' +
          esc(b.projectName) + ' is a project by ' + esc(b.developer) + '.</p>' +
      '</div>');
  })();

  /* --------------------------------------------------------- sticky bar */

  set('stickyBar',
    '<a class="sb sb-call js-tel" href="#"><span>📞</span>Call</a>' +
    '<button class="sb sb-broch js-open-modal" data-source="Sticky Brochure"><span>⬇</span>Brochure</button>' +
    '<a class="sb sb-wa js-wa" data-source="Sticky Bar" href="#"><span>💬</span>WhatsApp</a>');

  document.getElementById('year').textContent = new Date().getFullYear();
  document.body.classList.add('ready');
})();
