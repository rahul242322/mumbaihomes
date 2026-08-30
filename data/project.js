/* ============================================================================
   PROJECT DATA — this is the ONLY file you edit to launch a new project.
   ----------------------------------------------------------------------------
   The whole page renders from this object. Change the values, drop matching
   images/videos into assets/, reload. Nothing else needs touching.

   To launch a different project later:
     1. Copy this file to data/<project-slug>.js and edit it.
     2. Point the <script> tag in index.html at the new file.

   MEDIA RULES
     - Any `src` left as "" renders a labelled placeholder tile, so the site
       always looks complete even before you have the photos.
     - Slides accept  { type: "image", src, alt }  or
                      { type: "video", src, poster, alt }.
   ========================================================================== */

window.PROJECT = {

  /* ---------------------------------------------------------------- brand */
  /* This is YOUR microsite, not the developer's official website. The header
     and footer carry your brand; the developer is credited as the builder of
     the project you are marketing. Keep it that way — see `legal` below.     */
  brand: {
    siteName:    "Mumbai Homes",     // your business — owns the domain and the leads
    developer:   "Veena Developers", // the builder of this project
    projectName: "Codename Luxury Living",
    locality:    "Borivali West",
    city:        "Mumbai",
    tagline:     "S.V. Road Touch · Borivali West",
    logo:          "",               // assets/logo.png — YOUR logo. Falls back to a monogram
    monogram:      "M",
    /* The builder's logo, shown only as a credit in the About and footer
       sections — never as this site's own mark. */
    developerLogo: "assets/veena-logo.png",
    /* The project's own lockup, lifted from the official brochure. Dark for
       light backgrounds, white for dark ones. */
    projectLogo:      "assets/codename-logo-dark.png",
    projectLogoWhite: "assets/codename-logo-white.png"
  },

  /* -------------------------------------------------------------- contact */
  contact: {
    phone:    "+919607507404",
    whatsapp: "919607507404",        // wa.me format — country code, no +, no spaces
    email:    "",                    // shown in the footer when set
    personName:  "Rohit Kushwaha",
    personTitle: "Sourcing Manager",
    businessName: "Mumbai Homes",
    officeAddress: "Near Vijay Sales, S.V. Road Touch, opposite Indian Oil Petrol Pump, Borivali West, Mumbai"
  },

  /* --------------------------------------------------- lead delivery keys */
  /* See README.md §3. Leave "" to disable a channel. WhatsApp is always on
     and is the automatic fallback, so the form never loses a lead.          */
  leads: {
    web3formsKey: "",                // https://web3forms.com  → email
    sheetsUrl:    ""                 // Apps Script /exec URL  → Google Sheet
  },

  /* ------------------------------------------------------------------ seo */
  seo: {
    domain:      "https://mumbaihomes.co.in",
    title:       "Codename Luxury Living by Veena Developers — 2, 2.5 & 3 BHK, S.V. Road, Borivali West",
    description: "Ultra-luxury new launch by Veena Developers on S.V. Road, Borivali West. 3 iconic 40-storey towers across 3 acres, 70+ amenities on a 1,25,000 sq.ft. E-Deck. 2 BHK from ₹2.40 Cr. EOI open from ₹2 Lakhs.",
    ogImage:     "assets/og-image.jpg",
    keywords:    "Veena Developers Borivali, Codename Luxury Living, Borivali West new launch, 2 BHK S.V. Road Borivali, 3 BHK Borivali West price, Borivali ultra luxury project"
  },

  /* ----------------------------------------------------------------- hero */
  hero: {
    status: "Booking Open",
    /* Actual project renders, lifted from the official teaser film. These are
       the developer's own CGI of this project — not stock photography. */
    slides: [
      { type: "image", src: "assets/render-pool.jpg",    alt: "Infinity pool at sunset over the Mumbai skyline" },
      { type: "image", src: "assets/render-balcony.jpg", alt: "Panoramic city view from the balcony at dusk" },
      { type: "image", src: "assets/render-facade.jpg",  alt: "Podium facade with vertical green screens" },
      { type: "image", src: "assets/render-living.jpg",  alt: "Living room with skyline views" }
      // Video slide example:
      // { type: "video", src: "assets/walkthrough.mp4", poster: "assets/walkthrough.jpg", alt: "Project walkthrough" }
    ],
    priceFrom:   "₹ 2.40 Cr",
    priceNote:   "Onwards ++",
    psf:         "Launch Pricing · ₹35,000++ PSF",
    configLine:  "Premium 2, 2.5 & 3 BHK Ultra-Luxury Residences",
    /* The highlighted offer box. Set `offer: null` to hide it entirely. */
    offer: {
      title: "EOI Window Now Open*",
      lines: [
        "2 BHK — EOI just ₹2 Lakhs*",
        "3 BHK — EOI just ₹3 Lakhs*"
      ]
    }
  },

  /* ----------------------------------------------- quick facts (4 tiles) */
  quickFacts: [
    { value: "3 Towers",  label: "40 Storeys Each" },
    { value: "3 Acres",   label: "Land Parcel" },
    { value: "70+",       label: "E-Deck Amenities" },
    { value: "₹35,000",   label: "Launch PSF ++" }
  ],

  /* ----------------------------------------------------- trust strip (4) */
  trustStrip: [
    { value: "S.V. Road", label: "Main Road Touch" },
    { value: "3 Mins",    label: "Borivali Station" },
    { value: "1,25,000",  label: "Sq.Ft. Grand E-Deck" },
    { value: "Zero",      label: "Brokerage" }
  ],

  /* ----------------------------------------------------------- highlights */
  highlights: [
    "3 iconic towers spread across 3 acres",
    "40-storey residential towers",
    "Ground + 1 levels of premium commercial retail showrooms",
    "2nd to 8th level podium parking",
    "9th level grand E-Deck — 1,25,000 sq.ft. of world-class amenities",
    "Luxury residences from the 10th to the 40th floor",
    "70+ lifestyle amenities on the E-Deck",
    "Panoramic city & green views from every residence"
  ],

  /* ---------------------------------------------------------------- about */
  about: {
    heading: "About Codename Luxury Living",
    body: [
      "Codename Luxury Living by Veena Developers is the most iconic ultra-luxury landmark rising in Borivali West — three towers of 40 storeys, set across 3 acres on an S.V. Road touch plot near Vijay Sales, opposite the Indian Oil petrol pump.",
      "The vertical plan puts everything in its right place: ground and first levels hold premium commercial retail showrooms, the 2nd to 8th levels are podium parking, and the 9th level opens onto a 1,25,000 sq.ft. grand E-Deck carrying over 70 world-class amenities. Residences begin above all of it, on the 10th floor, and rise to the 40th — every home lifted clear of the street, with panoramic city and green views.",
      "Layouts are spacious and smartly planned, crafted for prestige, comfort and sophistication."
    ],
    image: "assets/eoi-creative.jpg",   // the official EOI campaign creative
    /* Rendered as a highlighted "why buy" list under the specs. */
    why: [
      "Ultra-luxury residences",
      "Iconic landmark address",
      "World-class lifestyle amenities",
      "Unmatched connectivity & location advantage"
    ],
    specs: [
      { label: "Project Type",     value: "Residential + Retail" },
      { label: "Configurations",   value: "2, 2.5 & 3 BHK" },
      { label: "Land Parcel",      value: "3 Acres" },
      { label: "Towers",           value: "3 Towers · 40 Storeys" },
      { label: "Retail",           value: "Ground + 1 Levels of Showrooms" },
      { label: "Parking",          value: "Podium, 2nd – 8th Levels" },
      { label: "Grand E-Deck",     value: "9th Level · 1,25,000 Sq.Ft." },
      { label: "Residences",       value: "10th – 40th Floors" },
      { label: "Launch Pricing",   value: "₹35,000++ PSF" },
      { label: "Location",         value: "S.V. Road Touch, Borivali West" }
    ]
  },

  /* -------------------------------------------------------------- pricing */
  pricing: {
    note: "Areas are carpet areas. Prices are ++ (stamp duty, registration, GST and other statutory charges are additional) and are subject to revision at each launch stage without notice.",
    rows: [
      { type: "2 BHK",   area: "686 Sq.Ft.",  price: "₹ 2.40 Cr ++" },
      { type: "2 BHK",   area: "704 Sq.Ft.",  price: "₹ 2.46 Cr ++" },
      { type: "2 BHK",   area: "746 Sq.Ft.",  price: "₹ 2.61 Cr ++" },
      { type: "2.5 BHK", area: "837 Sq.Ft.",  price: "₹ 2.92 Cr +"  },
      { type: "3 BHK",   area: "900 Sq.Ft.",  price: "₹ 3.15 Cr ++" },
      { type: "3 BHK",   area: "950 Sq.Ft.",  price: "₹ 3.32 Cr ++" },
      { type: "3 BHK",   area: "1181 Sq.Ft.", price: "₹ 4.13 Cr ++" }
    ]
  },

  /* ------------------------------------------------------------ site plans */
  /* Images render deliberately blurred behind a "Request" overlay — this is
     what drives plan-request leads. Leave src "" for a placeholder tile.     */
  plans: [
    { title: "Master Plan Layout", cta: "Request Master Layout Plan", image: "" },
    { title: "Unit Plan Layout",   cta: "Request Unit Layout Plans",  image: "" }
  ],

  /* ------------------------------------------------------------- amenities */
  amenities: {
    total: "70+",
    items: [
      /* `icon` names one of the inline SVGs in js/render.js — see ICONS there.
         An unrecognised value is printed literally, so an emoji still works. */
      { name: "Infinity Swimming Pool",  image: "assets/amenity-pool.jpg",       icon: "pool" },
      { name: "Private Cinema",          image: "assets/amenity-cinema.jpg",     icon: "cinema" },
      { name: "Banquet & Party Hall",    image: "assets/amenity-banquet.jpg",    icon: "banquet" },
      { name: "Kids Play Area",          image: "assets/amenity-kids.jpg",       icon: "kids" },
      { name: "Basketball Court",        image: "assets/amenity-basketball.jpg", icon: "basketball" },
      { name: "Landscaped Podium Deck",  image: "assets/amenity-deck.jpg",       icon: "tree" },
      { name: "Designer Entrance Lobby", image: "assets/amenity-lobby.jpg",      icon: "lobby" },
      { name: "Private Lift Lobbies",    image: "assets/amenity-lift.jpg",       icon: "lift" },
      /* Every amenity tile uses Pexels stock (free for commercial use, no
         attribution required) — the developer's own renders live in the hero
         slider and the gallery, where they are labelled as such. */
      { name: "Yoga & Meditation Deck",  image: "assets/amenity-yoga.jpg",    icon: "yoga" },
      { name: "Jogging Track",           image: "assets/amenity-jogging.jpg", icon: "running" },
      { name: "Fully Equipped Gym",      image: "assets/amenity-gym.jpg",     icon: "gym" },
      { name: "Senior Citizens' Corner", image: "assets/amenity-seniors.jpg", icon: "bench" }
    ],
    note: "Images in this section are representative and are not renders of this project. See the Project Gallery for the developer's own renders. The full amenity list is shared on request — confirm final details against the MahaRERA registration."
  },

  /* --------------------------------------------------------------- gallery */
  gallery: [
    { type: "image", src: "assets/render-pool.jpg",     alt: "Infinity pool at sunset" },
    { type: "image", src: "assets/render-balcony.jpg",  alt: "City views from the balcony" },
    { type: "image", src: "assets/render-living.jpg",   alt: "Living room" },
    { type: "image", src: "assets/render-bedroom.jpg",  alt: "Master bedroom" },
    { type: "image", src: "assets/render-facade.jpg",   alt: "Podium facade and retail frontage" },
    { type: "image", src: "assets/render-cinema.jpg",   alt: "Private cinema" },
    { type: "image", src: "assets/render-banquet.jpg",  alt: "Banquet hall" },
    { type: "image", src: "assets/render-kids.jpg",     alt: "Kids play area" },
    { type: "image", src: "assets/render-entrance.jpg", alt: "Designer entrance lobby" },
    { type: "image", src: "assets/render-aerial.jpg",   alt: "Podium deck and sports court" }
  ],

  /* -------------------------------------------------------------- location */
  location: {
    mapEmbed: "https://www.google.com/maps?q=Vijay%20Sales%2C%20S.V.%20Road%2C%20Borivali%20West%2C%20Mumbai&output=embed",
    mapLink:  "https://maps.app.goo.gl/pm3cN5nhArreLvaZ7",
    tabs: [
      {
        name: "Connectivity", icon: "road",
        items: [
          { place: "Borivali Railway Station",     time: "3 Min" },
          { place: "Kandivali Railway Station",    time: "5 Min" },
          { place: "S.V. Road",                    time: "On Main Road" },
          { place: "New Link Road & Metro Station", time: "5 Min" }
        ]
      },
      {
        name: "Landmarks", icon: "pin",
        items: [
          { place: "Vijay Sales, Borivali",        time: "Adjacent" },
          { place: "Indian Oil Petrol Pump",       time: "Opposite" },
          { place: "Jain Derasar",                 time: "5 Min Walk" },
          { place: "Haveli",                       time: "5 Min Walk" }
        ]
      },
      {
        name: "Education", icon: "school",
        items: [
          { place: "Major schools & colleges",     time: "2 – 5 Min" }
        ]
      },
      {
        name: "Healthcare", icon: "health",
        items: [
          { place: "Major hospitals",              time: "2 – 5 Min" }
        ]
      },
      {
        name: "Shopping", icon: "shop",
        items: [
          { place: "Malls & markets",              time: "2 – 5 Min" }
        ]
      },
      {
        name: "Recreation", icon: "tree",
        items: [
          { place: "Playgrounds & open spaces",    time: "2 – 5 Min" }
        ]
      }
    ]
  },

  /* ------------------------------------------------------------------ faqs */
  faqs: [
    { q: "Where is Codename Luxury Living located?",
      a: "On an S.V. Road touch plot in Borivali West — near Vijay Sales and opposite the Indian Oil petrol pump. Borivali Railway Station is 3 minutes away and Kandivali Railway Station 5 minutes." },
    { q: "What configurations are available?",
      a: "Ultra-luxury 2 BHK, 2.5 BHK and 3 BHK residences, located from the 10th to the 40th floor across 3 towers." },
    { q: "What are the carpet areas and prices?",
      a: "2 BHK: 686 sq.ft. at ₹2.40 Cr, 704 sq.ft. at ₹2.46 Cr, 746 sq.ft. at ₹2.61 Cr. 2.5 BHK: 837 sq.ft. at ₹2.92 Cr. 3 BHK: 900 sq.ft. at ₹3.15 Cr, 950 sq.ft. at ₹3.32 Cr, 1181 sq.ft. at ₹4.13 Cr. All prices are ++ and at a launch rate of ₹35,000++ PSF." },
    { q: "What is the EOI amount?",
      a: "The EOI window is open — ₹2 Lakhs for a 2 BHK and ₹3 Lakhs for a 3 BHK. Speak to the sales team for the exact terms and adjustment against booking." },
    { q: "What are the key amenities?",
      a: "Over 70 lifestyle amenities on a 1,25,000 sq.ft. grand E-Deck at the 9th level, including a gym, swimming pool, jogging track, yoga and meditation area, kids' play area, seating plaza and a senior citizens' corner." },
    { q: "How is the building planned?",
      a: "Ground and first levels hold premium commercial retail showrooms, the 2nd to 8th levels are podium parking, the 9th level is the grand E-Deck, and residences run from the 10th to the 40th floor." },
    { q: "Is the project MahaRERA registered?",
      a: "MahaRERA registration is in process. The registration number will be published here as soon as it is issued, and can be verified at maharera.mahaonline.gov.in." },
    { q: "Can I schedule a site visit?",
      a: "Yes. Submit the enquiry form or call the sales team directly and a site visit will be arranged at your convenience — zero brokerage." }
  ],

  /* ------------------------------------------------------------- developer */
  developer: {
    heading: "About Veena Developers",
    /* Figures taken from the official project brochure. */
    body: "Veena Developers has spent decades building in Mumbai's western suburbs on a reputation for unwavering trust and transparency, delivery ahead of committed timelines, and recognition from residents for excellence in service and design. Veena Developers isn't just building homes; it's building icons that stand the test of time.",
    stats: [
      { value: "40+",     label: "Projects Delivered" },
      { value: "35,000+", label: "Dreams Fulfilled" },
      { value: "7+ Mn",   label: "Sq.Ft. Delivered" },
      { value: "4+ Mn",   label: "Sq.Ft. Under Construction" },
      { value: "05",      label: "Ongoing Projects" },
      { value: "5,500+",  label: "Dreams To Be Fulfilled" }
    ]
  },

  /* ----------------------------------------------------------------- legal */
  /* IMPORTANT — this is a channel-partner / marketing microsite, NOT the
     developer's official website. Under the Real Estate (Regulation and
     Development) Act a real estate agent must be registered with MahaRERA
     before facilitating or advertising the sale of a registered project, and
     must display that agent registration number on its advertising.
     Fill in `agentRera` before you run a single ad.                          */
  legal: {
    /* REPLACE with your MahaRERA agent registration number as soon as it is
       issued. Until then this reads as a neutral status rather than a
       placeholder — but note that advertising a registered project without an
       agent registration is not permitted, so treat this as temporary. */
    agentRera:   "Registration in process",
    agentGst:    "",                 // optional, shown when set
    projectRera: "Coming Soon",      // the developer's project registration number
    operatedBy:  "Mumbai Homes, an independent MahaRERA-registered real estate agent",
    disclaimer:  "This is not the official website of the developer. It is operated by an independent marketing partner and is intended solely for informational purposes; nothing on it constitutes an offer, invitation or contract, nor an offer of services by the developer. The content — images, plans, areas, amenities, specifications and pricing — is indicative and is sourced from the developer; images are artistic impressions and may not accurately reflect the finished product. All prices are quoted ++, are exclusive of stamp duty, registration, GST and other statutory charges, are subject to alteration without notice, and availability cannot be guaranteed. Purchasers must rely solely on the particulars registered with MahaRERA and on the executed agreement for sale, and are recommended to contact the developer directly for accurate and up-to-date information. All trademarks, project names and logos are the property of their respective owners and are used here for identification only. By submitting your details you consent to being contacted by us and our representatives by phone, SMS, email or WhatsApp about this and similar projects, and acknowledge that this consent overrides any DNC/NDNC registration."
  }
};

