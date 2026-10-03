// Data structures for MJ Holidays / Akalana House foundation

export interface NavItem {
  label: string;
  href: string;
}

export interface NavDropdown {
  id: string;
  label: string;
  viewAllLink: { label: string; href: string };
  items: NavItem[];
}

export interface Property {
  id: string;
  name: string;
  subtitle: string;
  location: string;
  region: string;
  mapNumber: string;
  accentColor: string;
  tags: string;
  desktopImage: string;
  mobileImage: string;
  logoSvg: string;
  mapSvg: string;
  discoverHref: string;
  bookingUrl: string;
  highlights: string[];
}

export interface Accommodation {
  id: string;
  resortId: string;
  resortName: string;
  name: string;
  capacity: number;
  capacityText: string;
  surface: number;
  bedrooms: string;
  pool: string;
  parking: number;
  manuscriptNote: string;
  desktopImage: string;
  mobileImage: string;
  url: string;
}

export interface HighlightItem {
  id: string;
  title: string;
  description: string;
  iconSvg: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answerHtml: string;
}

export interface ReviewItem {
  id: string;
  author: string;
  rating: number;
  source: 'Google' | 'Tripadvisor' | 'Booking.com' | 'Trip.com';
  date: string;
  text: string;
  translatedFrom?: string;
}

/* ----------------- NAVIGATION DATA ----------------- */
export const NAVIGATION_DROPDOWNS: NavDropdown[] = [
  {
    id: 'resorts',
    label: 'Our resorts',
    viewAllLink: { label: 'All our villas', href: '#villas' },
    items: [
      { label: 'Marguery Villas – Black River', href: '#marguery-villas' },
      { label: 'Mythic Suites & Villas - Grand Gaube', href: '#mythic-suites-villas' },
      { label: 'Eko Savannah - Tamarin - April 2027', href: '#eko-savannah' },
    ],
  },
  {
    id: 'experiences',
    label: 'Our experiences',
    viewAllLink: { label: 'All our special offers', href: '#experiences' },
    items: [
      { label: 'Long Stay', href: '#experiences' },
      { label: 'Honeymoon', href: '#experiences' },
      { label: 'North/West stay', href: '#experiences' },
      { label: 'Family Stay', href: '#experiences' },
      { label: 'Tailor-made travel', href: '#experiences' },
    ],
  },
  {
    id: 'destination',
    label: 'Our destination',
    viewAllLink: { label: 'Travel Journal', href: '#destination' },
    items: [
      { label: 'Black River | Marguery Villas', href: '#marguery-villas' },
      { label: 'Grand Gaube | Mythic Suites & Villas', href: '#mythic-suites-villas' },
      { label: 'Tamarin | Eko Savannah', href: '#eko-savannah' },
    ],
  },
  {
    id: 'group',
    label: 'Our group',
    viewAllLink: { label: 'About us', href: '#about' },
    items: [
      { label: 'About us', href: '#about' },
      { label: 'Career', href: '#careers' },
      { label: 'Our CSR commitments', href: '#csr' },
      { label: 'Become an owner', href: '#owner' },
      { label: 'FAQ', href: '#faq' },
    ],
  },
];

/* ----------------- PROPERTIES DATA ----------------- */
export const PROPERTIES: Property[] = [
  {
    id: 'marguery-villas',
    name: 'Marguery Villas',
    subtitle: 'Black River West of the island',
    location: 'Black River',
    region: 'West of the island',
    mapNumber: 'N°1',
    accentColor: '#456917',
    tags: 'Authenticity • Private Pool Villas • West Coast Mauritius • Local Lifestyle • Exploration',
    desktopImage: 'https://cdn.prod.website-files.com/6877d738ead9a7e4d209c537/6a1021cf092088312d7decc3_Marguery%20Villas%20(6).jpg',
    mobileImage: 'https://cdn.prod.website-files.com/6877d738ead9a7e4d209c537/6a1021cf092088312d7decc3_Marguery%20Villas%20(6).jpg',
    logoSvg: 'https://cdn.prod.website-files.com/6877b50802107221745ba52e/6877ebbe887a8bf8782007e9_Group%20(3).svg',
    mapSvg: 'https://cdn.prod.website-files.com/6877b50802107221745ba52e/6877e9eb46e4d9f3ab9d83db_Group%20588.svg',
    discoverHref: '#villas',
    bookingUrl: 'https://booking.marguery-villas-resort.com/premium/index2.html?id_stile=18333&lingua_int=eng&id_albergo=19957&dc=1769',
    highlights: ['Private Pool', 'Concierge 7/7', 'Housekeeping', 'Lagoon & Mountain Views'],
  },
  {
    id: 'mythic-suites-villas',
    name: 'Mythic Suites & Villas',
    subtitle: 'Grand Gaube North East of the island',
    location: 'Grand Gaube',
    region: 'North East of the island',
    mapNumber: 'N°2',
    accentColor: '#1f9ebb',
    tags: 'Privacy • Suites & Pool Villas • Northern Beaches • Spacious Living • Gastronomy',
    desktopImage: 'https://cdn.prod.website-files.com/6877d738ead9a7e4d209c537/69e7340e2a14cc9f32826546_Mythic%20Suites%20%26%20Villas.jpg',
    mobileImage: 'https://cdn.prod.website-files.com/6877d738ead9a7e4d209c537/69e7340e2a14cc9f32826546_Mythic%20Suites%20%26%20Villas.jpg',
    logoSvg: 'https://cdn.prod.website-files.com/6877b50802107221745ba52e/6877ec2c4f956d03a1042c4d_Calque_1%20(8).svg',
    mapSvg: 'https://cdn.prod.website-files.com/6877b50802107221745ba52e/6879249da7aa992ca5004811_Group%20589.webp',
    discoverHref: '#villas',
    bookingUrl: 'https://booking.mythic-resort.com/premium/index2.html?id_stile=18334&lingua_int=eng&id_albergo=21781&dc=9972',
    highlights: ['Suites & Villas', 'Private Catering', 'Catamaran Excursions', "L'Atelier Restaurant"],
  },
  {
    id: 'eko-savannah',
    name: 'Eko Savannah - April 2027',
    subtitle: 'Tamarin South West of the island',
    location: 'Tamarin',
    region: 'South West of the island',
    mapNumber: 'N°3',
    accentColor: '#5f6549',
    tags: 'Country Club • Pool Villas • Wellness • Gastronomy • Mauritian Lifestyle',
    desktopImage: 'https://cdn.prod.website-files.com/6877d738ead9a7e4d209c537/68c01e7be19c5a9ac823dc41_Eko%20Savannah.jpg',
    mobileImage: 'https://cdn.prod.website-files.com/6877d738ead9a7e4d209c537/68c01e7be19c5a9ac823dc41_Eko%20Savannah.jpg',
    logoSvg: 'https://cdn.prod.website-files.com/6877b50802107221745ba52e/6877ec31eefc2a8818676353_Calque_1%20(9).svg',
    mapSvg: 'https://cdn.prod.website-files.com/6877b50802107221745ba52e/687924a6d137116c96ab1e5f_Group%2040080.webp',
    discoverHref: '#villas',
    bookingUrl: 'https://booking.mjholidays.com/premium/index2.html?id_stile=22444&lingua_int=eng&id_albergo=29785&dc=1820',
    highlights: ['Savannah Backdrop', 'Boma Restaurant', 'Clubhouse & Spa', 'Eco-Luxury Architecture'],
  },
];

/* ----------------- ACCOMMODATIONS CAROUSEL DATA ----------------- */
export const ACCOMMODATIONS: Accommodation[] = [
  {
    id: 'superior-pool-villa-3br',
    resortId: 'marguery-villas',
    resortName: 'Marguery Villas',
    name: 'Superior Pool Villa | 3 br',
    capacity: 6,
    capacityText: '6 persons',
    surface: 251,
    bedrooms: '3 rooms',
    pool: '18m² private pool',
    parking: 2,
    manuscriptNote: 'Spacious and modular!',
    desktopImage: 'https://cdn.prod.website-files.com/6877d738ead9a7e4d209c537/6a461fab80422bee60bd13fe_webflow%201907%20(7).jpg',
    mobileImage: 'https://cdn.prod.website-files.com/6877d738ead9a7e4d209c537/69ea203e2929909941b1f659_69e72f0cd282a13b25b6d526_Superior-Pool-Villa-Piscine-Exterieure-Privee-1%201.webp',
    url: '#quote',
  },
  {
    id: 'grand-luxury-suite',
    resortId: 'mythic-suites-villas',
    resortName: 'Mythic Suites',
    name: 'Grand Luxury Suite',
    capacity: 6,
    capacityText: '6 persons',
    surface: 202,
    bedrooms: '1 to 3 rooms',
    pool: 'Shared pool',
    parking: 1,
    manuscriptNote: 'Large apartment with swimming pool!',
    desktopImage: 'https://cdn.prod.website-files.com/6877d738ead9a7e4d209c537/69ea201555768b449a25d0fa_69e72fb80fb1d7f01f6e3b1c_Grand-Luxury-Suite-Chambre-livingroom.webp',
    mobileImage: 'https://cdn.prod.website-files.com/6877d738ead9a7e4d209c537/69ea201555768b449a25d0fa_69e72fb80fb1d7f01f6e3b1c_Grand-Luxury-Suite-Chambre-livingroom.webp',
    url: '#quote',
  },
  {
    id: 'retreat-pool-villa',
    resortId: 'eko-savannah',
    resortName: 'Eko Savannah',
    name: 'Retreat Pool Villa',
    capacity: 6,
    capacityText: '6 persons',
    surface: 270,
    bedrooms: '2 or 3 rooms',
    pool: '44m² private pool',
    parking: 2,
    manuscriptNote: 'Available from April 2027',
    desktopImage: 'https://cdn.prod.website-files.com/6877d738ead9a7e4d209c537/69ea1fabd23ef933131e16fe_69e730908323206a1cbb04ab_DSC08281.webp',
    mobileImage: 'https://cdn.prod.website-files.com/6877d738ead9a7e4d209c537/69ea1fc6c245fff23ae10a99_69e730908323206a1cbb04ab_DSC08281%201.webp',
    url: '#quote',
  },
  {
    id: 'superior-pool-villa-2br',
    resortId: 'marguery-villas',
    resortName: 'Marguery Villas',
    name: 'Superior Pool Villa | 2 br',
    capacity: 4,
    capacityText: '4 persons',
    surface: 231,
    bedrooms: '2 rooms',
    pool: '18sqm private pool',
    parking: 2,
    manuscriptNote: 'Spacious and flexible!',
    desktopImage: 'https://cdn.prod.website-files.com/6877d738ead9a7e4d209c537/6a461f1680422bee60bc8e2f_webflow%201907%20(6).jpg',
    mobileImage: 'https://cdn.prod.website-files.com/6877d738ead9a7e4d209c537/6a438394ebe4133eaab6a155_webflow%201907%20(2).jpg',
    url: '#quote',
  },
  {
    id: 'superior-pool-villa-1br',
    resortId: 'marguery-villas',
    resortName: 'Marguery Villas',
    name: 'Superior Pool Villa | 1 br',
    capacity: 2,
    capacityText: '2 persons',
    surface: 210,
    bedrooms: '1 room',
    pool: '18m² private pool',
    parking: 2,
    manuscriptNote: 'Spacious and flexible!',
    desktopImage: 'https://cdn.prod.website-files.com/6877d738ead9a7e4d209c537/69ea203a1a05c6524ab9c664_69e72f0cd282a13b25b6d526_Superior-Pool-Villa-Piscine-Exterieure-Privee-1.webp',
    mobileImage: 'https://cdn.prod.website-files.com/6877d738ead9a7e4d209c537/69ea203e2929909941b1f659_69e72f0cd282a13b25b6d526_Superior-Pool-Villa-Piscine-Exterieure-Privee-1%201.webp',
    url: '#quote',
  },
  {
    id: 'grand-luxury-suite-1br',
    resortId: 'mythic-suites-villas',
    resortName: 'Mythic Suites',
    name: 'Grand Luxury Suite 1 chambre',
    capacity: 6,
    capacityText: '6 persons',
    surface: 202,
    bedrooms: '1 to 3 rooms',
    pool: 'Shared pool',
    parking: 1,
    manuscriptNote: 'Grand appartement avec piscine !',
    desktopImage: 'https://cdn.prod.website-files.com/6877d738ead9a7e4d209c537/6a4638a258750e00535146f4_webflow%201907%20(11).jpg',
    mobileImage: 'https://cdn.prod.website-files.com/6877d738ead9a7e4d209c537/6a4638a258750e00535146f4_webflow%201907%20(11).jpg',
    url: '#quote',
  },
  {
    id: 'elegance-pool-villa',
    resortId: 'mythic-suites-villas',
    resortName: 'Mythic Suites',
    name: 'Elegance Pool Villa',
    capacity: 8,
    capacityText: '8 persons',
    surface: 480,
    bedrooms: '3 or 4 rooms',
    pool: '54m² private pool',
    parking: 2,
    manuscriptNote: 'With a lush tropical garden!',
    desktopImage: 'https://cdn.prod.website-files.com/6877d738ead9a7e4d209c537/68c84a085f13d74eb3690091_Elegance-Pool-Villa%20(2).webp',
    mobileImage: 'https://cdn.prod.website-files.com/6877d738ead9a7e4d209c537/68c84a14914aa57459053055_Elegance-Pool-Villa%20(3).webp',
    url: '#quote',
  },
  {
    id: 'serenity-pool-villa',
    resortId: 'eko-savannah',
    resortName: 'Eko Savannah',
    name: 'Serenity Pool Villa',
    capacity: 8,
    capacityText: '8 persons',
    surface: 310,
    bedrooms: '4 rooms',
    pool: '48m² private pool',
    parking: 3,
    manuscriptNote: 'Available from April 2027',
    desktopImage: 'https://cdn.prod.website-files.com/6877d738ead9a7e4d209c537/68cc208f027f56988fd1ce13_EkoSavannah-Pool%20(2).webp',
    mobileImage: 'https://cdn.prod.website-files.com/6877d738ead9a7e4d209c537/6a43e4b85ba20a23a310b7c7_webflow%201200x1350%20(45).jpg',
    url: '#quote',
  },
  {
    id: 'deluxe-pool-villa',
    resortId: 'marguery-villas',
    resortName: 'Marguery Villas',
    name: 'Deluxe Pool Villa',
    capacity: 8,
    capacityText: '8 persons',
    surface: 301,
    bedrooms: '3 rooms',
    pool: '29m² private pool',
    parking: 2,
    manuscriptNote: 'A haven of peace!',
    desktopImage: 'https://cdn.prod.website-files.com/6877d738ead9a7e4d209c537/6a4639f13739ad97409070ff_webflow%201907%20(12).jpg',
    mobileImage: 'https://cdn.prod.website-files.com/6877d738ead9a7e4d209c537/69b192438931f0cf0038f8ae_Design%20sans%20titre%20(6).jpg',
    url: '#quote',
  },
  {
    id: 'prestige-pool-villa',
    resortId: 'marguery-villas',
    resortName: 'Marguery Villas',
    name: 'Prestige Pool Villa',
    capacity: 10,
    capacityText: '10 persons',
    surface: 333,
    bedrooms: '4 rooms',
    pool: '33m² private pool',
    parking: 2,
    manuscriptNote: 'Ideal for family holidays',
    desktopImage: 'https://cdn.prod.website-files.com/6877d738ead9a7e4d209c537/6a464468adc041a9cc63fedc_webflow%201907%20(14).jpg',
    mobileImage: 'https://cdn.prod.website-files.com/6877d738ead9a7e4d209c537/69cbe37e2c652346026db07d_Design%20sans%20titre%20(42).jpg',
    url: '#quote',
  },
  {
    id: 'signature-pool-villa',
    resortId: 'eko-savannah',
    resortName: 'Eko Savannah',
    name: 'Signature Pool Villa',
    capacity: 10,
    capacityText: '10 persons',
    surface: 358,
    bedrooms: '5 rooms',
    pool: '50m² private pool',
    parking: 4,
    manuscriptNote: 'Available from April 2027',
    desktopImage: 'https://cdn.prod.website-files.com/6877d738ead9a7e4d209c537/69ea1f7ab0235319c817e1c3_69e730ddc0a58982a863cd42_DSC08289%20(1).webp',
    mobileImage: 'https://cdn.prod.website-files.com/6877d738ead9a7e4d209c537/69ea1f6810ec38fa67addf98_69e730ddc0a58982a863cd42_DSC08289%201.webp',
    url: '#quote',
  },
];

/* ----------------- HIGHLIGHTS / VALUE PROPS ----------------- */
export const HIGHLIGHTS: HighlightItem[] = [
  {
    id: 'suites-villas',
    title: 'Private pool\nTropical garden',
    description: 'Your exclusive, fully equipped villa, offering complete privacy and the freedom to enjoy your holiday at your own pace',
    iconSvg: 'https://cdn.prod.website-files.com/6877b50802107221745ba52e/6a3a5bb87eeb828c744cbdfb_suites-villas.svg',
  },
  {
    id: 'hotel-experience',
    title: 'The comfort\nof a hotel',
    description: 'A dedicated on-site team available 7 days a week: reception, housekeeping, maintenance and immediate assistance whenever you need it',
    iconSvg: 'https://cdn.prod.website-files.com/6877b50802107221745ba52e/6a3a5bb8bb5489bd48324b74_hotel-experience.svg',
  },
  {
    id: 'tailor-made',
    title: 'Tailor-made services',
    description: 'Breakfast, lunch and dinner option, in-villa massage, private chef, excursion, car rental and much more',
    iconSvg: 'https://cdn.prod.website-files.com/6877b50802107221745ba52e/6a3a5bb812ef18f903e6e85c_tailor-made.svg',
  },
  {
    id: 'local-expertise',
    title: 'Personalised local expertise',
    description: 'Every detail of your stay is carefully tailored to your preferences, combining our local knowledge with attentive, personalised service',
    iconSvg: 'https://cdn.prod.website-files.com/6877b50802107221745ba52e/6a3a5bb89b888236b5e2cd05_local-expertise.svg',
  },
];

/* ----------------- FAQ DATA ----------------- */
export const FAQ_DATA: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Which resort offers which experience?',
    answerHtml: `
      <p>Sporty escape, relaxing retreat, or family adventure each MJ Holidays resort offers a <strong>different face of Mauritius</strong>.</p>
      <p><strong>Marguery Villas</strong>, in Rivière Noire, is perfect for exploring <strong>the island’s South and West</strong>. Try kitesurfing at Pointe d’Esny, kayaking with dolphins, hiking Le Morne or Black River Gorges, or sunbathing at La Preneuse or Île aux Bénitiers. There are also <strong>plenty of family activities</strong>: zoos, golf, waterfalls… All set in a friendly, village-style atmosphere between lagoon and mountains.</p>
      <p><strong>Mythic Suites &amp; Villas</strong>, in Grand Gaube, invites you to discover <strong>the North and East of the island</strong>. Take a catamaran to the northern islets, tour colonial mansions, explore Port Louis, go scuba diving, hike in Ferney Valley or Le Pouce, relax on sandy beaches, or tee off at a scenic golf course. So much to do within easy reach of the resort!</p>
      <p><strong>Eko Savannah</strong>, on the edge of the savannah, is your ideal base to explore <strong>the West and Central regions of Mauritius</strong>. Enjoy a walk through tea fields, mountain biking in the savannah, a visit to Grand Bassin Hindu temple or a local rum distillery, family outings to the zoo or golf course, or a hike to the Seven Cascades. You’ll love the <strong>warm country club spirit</strong> and all the nearby activities!</p>
      <p>Three resorts, three vibes but always <strong>the same promise</strong>: freedom, privacy, and heartfelt hospitality.</p>
    `,
  },
  {
    id: 'faq-2',
    question: 'Do MJ Holidays villas have any included services (concierge, housekeeping, chef)?',
    answerHtml: `
      <p>Yes, all our properties benefit from daily hotel service, including housekeeping and maintenance. A concierge is available 7 days a week to organize your needs. Upon request, a private chef can enhance your meals, or a massage can be arranged directly in your villa.</p>
    `,
  },
  {
    id: 'faq-3',
    question: 'Can we personalize our stay (excursions, transfers, private events)?',
    answerHtml: `
      <p>Absolutely. Our concierges organize your transfers, sea excursions, hikes, sports activities, wellness treatments, and private events. Each stay is fully customizable to meet your needs and create unique memories.</p>
    `,
  },
];

/* ----------------- REVIEWS DATA ----------------- */
export const REVIEWS_SUMMARY = {
  averageRating: 4.7,
  totalReviews: 1171,
  platforms: [
    { name: 'All Reviews', rating: 4.7 },
    { name: 'Google', rating: 4.6, icon: 'google' },
    { name: 'Tripadvisor', rating: 4.8, icon: 'tripadvisor' },
    { name: 'Booking.com', rating: 4.7, icon: 'booking' },
    { name: 'Trip.com', rating: 4.5, icon: 'trip' },
  ],
  aiSummaryPoints: [
    'Spacious, clean, and well-maintained villas with private pools and strong privacy',
    'Highly attentive, friendly, and professional staff and concierge service',
    'Excellent location close to the beach, shops, restaurants, and local attractions',
  ],
};

export const REVIEWS_LIST: ReviewItem[] = [
  {
    id: 'rev-1',
    author: 'Nico T.',
    rating: 5.0,
    source: 'Google',
    date: '1 day ago',
    text: 'Excellent place and a concierge who listens. Many thanks again to Romain for his help.\n\nThe breakfast could use some improvement, however.',
    translatedFrom: 'French',
  },
  {
    id: 'rev-2',
    author: 'Sophie D.',
    rating: 5.0,
    source: 'Tripadvisor',
    date: '3 days ago',
    text: 'Unforgettable stay at Marguery Villas. The private pool and the daily housekeeping made our family holiday pure bliss. The concierge organized exceptional dolphin watching trips.',
  },
  {
    id: 'rev-3',
    author: 'Markus W.',
    rating: 5.0,
    source: 'Booking.com',
    date: '1 week ago',
    text: 'Mythic Suites exceeded all expectations. Exceptional luxury, spacious rooms, super quiet and serene. The chef in-villa dinner was top notch!',
  },
  {
    id: 'rev-4',
    author: 'Camille L.',
    rating: 4.8,
    source: 'Google',
    date: '2 weeks ago',
    text: 'Outstanding hospitality and comfort. Having hotel level services within our own private pool villa is definitely the best way to experience Mauritius.',
  },
];
