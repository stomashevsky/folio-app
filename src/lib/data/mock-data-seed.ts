/**
 * Shared seed data for all mock data files.
 * Generates 115 people with realistic demographics, KYC statuses,
 * and verification outcomes using seeded PRNG for determinism.
 */
import type { InquiryStatus } from "@/lib/types";

// ─── Seeded PRNG (Mulberry32) ───

function mulberry32(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), s | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function weightedPick<T>(rng: () => number, items: [T, number][]): T {
  const total = items.reduce((s, [, w]) => s + w, 0);
  let r = rng() * total;
  for (const [item, weight] of items) {
    r -= weight;
    if (r <= 0) return item;
  }
  return items[items.length - 1][0];
}

// ─── Name pool with regions ───

export type Region =
  | "us" | "ca" | "uk" | "de" | "fr" | "es" | "it" | "nl" | "se" | "no" | "pl" | "cz" | "ch"
  | "jp" | "kr" | "cn" | "in" | "sg" | "au" | "nz"
  | "br" | "mx" | "ar" | "co"
  | "ae" | "sa" | "pk" | "tr" | "eg" | "ng" | "ke" | "za" | "sn" | "il";

interface NameEntry { name: string; region: Region }

const namePool: NameEntry[] = [
  // ── 10 Edge-case people (indices 0-9) ──
  // Photo assignment: index % 3 → 0=Andre(M), 1=Maria(F), 2=Carmen(F)
  // Names match actual document photos for entries with verifications
  { name: "André Caçador de Araújo", region: "us" }, // 0 → Andre ID (M) — fast approval
  { name: "Maria Aldomar", region: "it" },            // 1 → Maria ID (F) — slow w/ retries
  { name: "Carmen Muestra", region: "ch" },           // 2 → Carmen passport (F) — declined tampered
  { name: "Rafael Torres", region: "us" },            // 3 → Andre (M) — declined selfie liveness
  { name: "Sofia Osman", region: "ae" },              // 4 → Maria (F) — needs_review watchlist
  { name: "Elena Wu", region: "cn" },                 // 5 → Carmen (F) — needs_review high-risk
  { name: "Tyler Brooks", region: "us" },             // 6 → Andre (M) — pending, no photos
  { name: "Ingrid Holm", region: "se" },              // 7 → Maria (F) — expired, no photos
  { name: "Valentina Reyes", region: "mx" },          // 8 → Carmen (F) — created, no photos
  { name: "Marco Park", region: "au" },               // 9 → Andre (M) — approved 3 govId attempts

  // ── Bulk names (indices 10-114) ──
  // Gender pattern follows index % 3: 0=Andre(M), 1=Maria(F), 2=Carmen(F)
  // Index 10: 10%3=1(F), 11%3=2(F), 12%3=0(M) → F,F,M repeating from 10

  // North America (10-30)
  { name: "Megan Foster", region: "us" },          // 10 %3=1 Maria (F)
  { name: "Ashley Cooper", region: "us" },         // 11 %3=2 Carmen (F)
  { name: "David Kim", region: "us" },             // 12 %3=0 Andre (M)
  { name: "Jessica Huang", region: "us" },         // 13 %3=1 Maria (F)
  { name: "Olivia Hernandez", region: "us" },      // 14 %3=2 Carmen (F)
  { name: "Robert Taylor", region: "us" },         // 15 %3=0 Andre (M)
  { name: "Chloe Adams", region: "ca" },           // 16 %3=1 Maria (F)
  { name: "Sophia Ramirez", region: "us" },        // 17 %3=2 Carmen (F)
  { name: "Brandon Scott", region: "us" },         // 18 %3=0 Andre (M)
  { name: "Emily Watson", region: "ca" },          // 19 %3=1 Maria (F)
  { name: "Amanda Sullivan", region: "us" },       // 20 %3=2 Carmen (F)
  { name: "Ethan Nguyen", region: "us" },          // 21 %3=0 Andre (M)
  { name: "Brittany Hughes", region: "us" },       // 22 %3=1 Maria (F)
  { name: "Stephanie Bell", region: "ca" },        // 23 %3=2 Carmen (F)
  { name: "Nathan Rivera", region: "us" },         // 24 %3=0 Andre (M)
  { name: "Christina Lee", region: "us" },         // 25 %3=1 Maria (F)
  { name: "Nicole Gonzalez", region: "us" },       // 26 %3=2 Carmen (F)
  { name: "Ryan Mitchell", region: "us" },         // 27 %3=0 Andre (M)
  { name: "Danielle Murphy", region: "ca" },       // 28 %3=1 Maria (F)
  { name: "Michelle Torres", region: "us" },       // 29 %3=2 Carmen (F)
  { name: "Kevin Flores", region: "us" },          // 30 %3=0 Andre (M)

  // Europe (31-66)
  { name: "Isabella Rossi", region: "it" },        // 31 %3=1 Maria (F)
  { name: "Camille Bernard", region: "fr" },       // 32 %3=2 Carmen (F)
  { name: "Stefan Mueller", region: "de" },        // 33 %3=0 Andre (M)
  { name: "Nadia Petrov", region: "pl" },          // 34 %3=1 Maria (F)
  { name: "Eva Novak", region: "cz" },             // 35 %3=2 Carmen (F)
  { name: "Oliver Brown", region: "uk" },          // 36 %3=0 Andre (M)
  { name: "Clara Vega", region: "es" },            // 37 %3=1 Maria (F)
  { name: "Sara Nilsson", region: "se" },          // 38 %3=2 Carmen (F)
  { name: "Thomas Wright", region: "uk" },         // 39 %3=0 Andre (M)
  { name: "Natasha Volkova", region: "pl" },       // 40 %3=1 Maria (F)
  { name: "Elisa Torres", region: "es" },          // 41 %3=2 Carmen (F)
  { name: "Henrik Johansson", region: "se" },      // 42 %3=0 Andre (M)
  { name: "Freya Schmidt", region: "de" },         // 43 %3=1 Maria (F)
  { name: "Ingrid Larsen", region: "no" },         // 44 %3=2 Carmen (F)
  { name: "Pierre Lefebvre", region: "fr" },       // 45 %3=0 Andre (M)
  { name: "Elena Papadopoulos", region: "de" },    // 46 %3=1 Maria (F)
  { name: "Charlotte Moreau", region: "fr" },      // 47 %3=2 Carmen (F)
  { name: "Marco Bianchi", region: "it" },         // 48 %3=0 Andre (M)
  { name: "Katarina Svensson", region: "se" },     // 49 %3=1 Maria (F)
  { name: "Marta Kowalczyk", region: "pl" },       // 50 %3=2 Carmen (F)
  { name: "Andrei Popescu", region: "cz" },        // 51 %3=0 Andre (M)
  { name: "Fiona Campbell", region: "uk" },        // 52 %3=1 Maria (F)
  { name: "Adriana Moretti", region: "it" },       // 53 %3=2 Carmen (F)
  { name: "Tobias Richter", region: "de" },        // 54 %3=0 Andre (M)
  { name: "Zuzana Kral", region: "cz" },           // 55 %3=1 Maria (F)
  { name: "Luisa Fernandez", region: "es" },       // 56 %3=2 Carmen (F)
  { name: "Willem De Vries", region: "nl" },       // 57 %3=0 Andre (M)
  { name: "Astrid Lindqvist", region: "se" },      // 58 %3=1 Maria (F)
  { name: "Petra Novotna", region: "cz" },         // 59 %3=2 Carmen (F)
  { name: "Luca Romano", region: "it" },           // 60 %3=0 Andre (M)
  { name: "Margaux Duval", region: "fr" },         // 61 %3=1 Maria (F)
  { name: "Bianca Greco", region: "it" },          // 62 %3=2 Carmen (F)
  { name: "James Fletcher", region: "uk" },        // 63 %3=0 Andre (M)
  { name: "Klara Bergman", region: "se" },         // 64 %3=1 Maria (F)
  { name: "Renata Nowak", region: "pl" },          // 65 %3=2 Carmen (F)
  { name: "Sebastian Bauer", region: "ch" },       // 66 %3=0 Andre (M)

  // Asia-Pacific (67-90)
  { name: "Hana Watanabe", region: "jp" },         // 67 %3=1 Maria (F)
  { name: "Suki Lee", region: "kr" },              // 68 %3=2 Carmen (F)
  { name: "Raj Gupta", region: "in" },             // 69 %3=0 Andre (M)
  { name: "Maya Singh", region: "in" },            // 70 %3=1 Maria (F)
  { name: "Priyanka Sharma", region: "in" },       // 71 %3=2 Carmen (F)
  { name: "Kenji Ito", region: "jp" },             // 72 %3=0 Andre (M)
  { name: "Ling Zhang", region: "cn" },            // 73 %3=1 Maria (F)
  { name: "Ananya Patel", region: "in" },          // 74 %3=2 Carmen (F)
  { name: "Daniel Park", region: "kr" },           // 75 %3=0 Andre (M)
  { name: "Min-ji Kim", region: "kr" },            // 76 %3=1 Maria (F)
  { name: "Lily Tan", region: "sg" },              // 77 %3=2 Carmen (F)
  { name: "Takeshi Mori", region: "jp" },          // 78 %3=0 Andre (M)
  { name: "Sarah O'Neill", region: "nz" },         // 79 %3=1 Maria (F)
  { name: "Yuna Choi", region: "kr" },             // 80 %3=2 Carmen (F)
  { name: "Jack Morrison", region: "au" },         // 81 %3=0 Andre (M)
  { name: "Sakura Taniguchi", region: "jp" },      // 82 %3=1 Maria (F)
  { name: "Mei Chen", region: "cn" },              // 83 %3=2 Carmen (F)
  { name: "Wei Huang", region: "cn" },             // 84 %3=0 Andre (M)
  { name: "Haruko Sato", region: "jp" },           // 85 %3=1 Maria (F)
  { name: "Deepa Joshi", region: "in" },           // 86 %3=2 Carmen (F)
  { name: "Arjun Reddy", region: "in" },           // 87 %3=0 Andre (M)
  { name: "Nisha Kapoor", region: "in" },          // 88 %3=1 Maria (F)
  { name: "Aiko Yamada", region: "jp" },           // 89 %3=2 Carmen (F)
  { name: "Tom Nguyen", region: "au" },            // 90 %3=0 Andre (M)

  // Middle East & Africa (91-105)
  { name: "Aisha Khan", region: "pk" },            // 91 %3=1 Maria (F)
  { name: "Zara Hussain", region: "ae" },          // 92 %3=2 Carmen (F)
  { name: "Omar Farouk", region: "eg" },           // 93 %3=0 Andre (M)
  { name: "Leila Amiri", region: "ae" },           // 94 %3=1 Maria (F)
  { name: "Fatou Diallo", region: "sn" },          // 95 %3=2 Carmen (F)
  { name: "Emre Yilmaz", region: "tr" },           // 96 %3=0 Andre (M)
  { name: "Grace Wanjiku", region: "ke" },         // 97 %3=1 Maria (F)
  { name: "Chidinma Okafor", region: "ng" },       // 98 %3=2 Carmen (F)
  { name: "Mohammed Al-Salem", region: "sa" },     // 99 %3=0 Andre (M)
  { name: "Yael Cohen", region: "il" },            // 100 %3=1 Maria (F)
  { name: "Amina Diop", region: "sn" },            // 101 %3=2 Carmen (F)
  { name: "Thabo Molefe", region: "za" },          // 102 %3=0 Andre (M)
  { name: "Bushra Nasser", region: "ae" },         // 103 %3=1 Maria (F)
  { name: "Nkechi Eze", region: "ng" },            // 104 %3=2 Carmen (F)
  { name: "Tariq Hassan", region: "pk" },          // 105 %3=0 Andre (M)

  // Latin America (106-114)
  { name: "Valentina Rojas", region: "ar" },       // 106 %3=1 Maria (F)
  { name: "Camila Dos Santos", region: "br" },     // 107 %3=2 Carmen (F)
  { name: "Lucas Silva", region: "br" },           // 108 %3=0 Andre (M)
  { name: "Mariana Castro", region: "mx" },        // 109 %3=1 Maria (F)
  { name: "Paula Rios", region: "co" },            // 110 %3=2 Carmen (F)
  { name: "Mateo Gutierrez", region: "mx" },       // 111 %3=0 Andre (M)
  { name: "Isabela Ferreira", region: "br" },      // 112 %3=1 Maria (F)
  { name: "Diana Mendoza", region: "mx" },         // 113 %3=2 Carmen (F)
  { name: "Santiago Herrera", region: "co" },      // 114 %3=0 Andre (M)
];

// ─── Address pools by region ───

const addressesByRegion: Record<string, string[]> = {
  us: [
    "123 Main Street, Austin, TX 78701, USA",
    "456 Oak Avenue, Seattle, WA 98101, USA",
    "789 Pine Road, Denver, CO 80202, USA",
    "1010 Sunset Blvd, Los Angeles, CA 90028, USA",
    "222 State Street, Boston, MA 02109, USA",
    "500 Michigan Ave, Chicago, IL 60611, USA",
    "350 Fifth Avenue, New York, NY 10118, USA",
    "1200 NW Glisan St, Portland, OR 97209, USA",
  ],
  ca: [
    "100 King Street W, Toronto, ON M5X 1A9, Canada",
    "845 Granville Street, Vancouver, BC V6Z 1K7, Canada",
    "200 Saint-Laurent Blvd, Montreal, QC H2Y 1Y3, Canada",
  ],
  uk: [
    "15 King's Road, London SW3 4RP, UK",
    "8 Victoria Street, Edinburgh EH1 2HE, UK",
    "42 Deansgate, Manchester M3 2EG, UK",
    "25 Broad Street, Birmingham B1 2HG, UK",
  ],
  de: [
    "Friedrichstraße 43, 10117 Berlin, Germany",
    "Maximilianstraße 12, 80539 Munich, Germany",
    "Königsallee 30, 40212 Düsseldorf, Germany",
    "Mönckebergstraße 7, 20095 Hamburg, Germany",
  ],
  fr: [
    "25 Rue de Rivoli, 75001 Paris, France",
    "10 Rue de la République, 69001 Lyon, France",
    "14 Cours Mirabeau, 13100 Aix-en-Provence, France",
    "5 Place Bellecour, 69002 Lyon, France",
  ],
  es: [
    "Calle Mayor 15, 28013 Madrid, Spain",
    "Passeig de Gràcia 92, 08008 Barcelona, Spain",
    "Calle Sierpes 32, 41004 Seville, Spain",
  ],
  it: [
    "Via Montenapoleone 8, 20121 Milan, Italy",
    "Via del Corso 120, 00186 Rome, Italy",
    "Via Toledo 156, 80134 Naples, Italy",
  ],
  nl: [
    "Keizersgracht 672, 1017 ER Amsterdam, Netherlands",
    "Coolsingel 40, 3011 AD Rotterdam, Netherlands",
  ],
  se: [
    "Drottninggatan 10, 111 51 Stockholm, Sweden",
    "Avenyn 24, 411 36 Gothenburg, Sweden",
  ],
  no: [
    "Karl Johans gate 31, 0159 Oslo, Norway",
    "Bryggen 3, 5003 Bergen, Norway",
  ],
  pl: [
    "Nowy Świat 35, 00-029 Warsaw, Poland",
    "Rynek Główny 5, 31-042 Kraków, Poland",
  ],
  cz: [
    "Pařížská 12, 110 00 Prague, Czech Republic",
    "Masarykova 25, 602 00 Brno, Czech Republic",
  ],
  ch: [
    "Bahnhofstrasse 40, 8001 Zürich, Switzerland",
    "Rue du Rhône 50, 1204 Geneva, Switzerland",
  ],
  jp: [
    "1-1 Shibuya, Shibuya-ku, Tokyo 150-0002, Japan",
    "2-4-8 Umeda, Kita-ku, Osaka 530-0001, Japan",
    "3-5 Sakae, Naka-ku, Nagoya 460-0008, Japan",
  ],
  kr: [
    "123 Gangnam-daero, Gangnam-gu, Seoul 06133, South Korea",
    "45 Haeundae Beach Rd, Busan 48099, South Korea",
  ],
  cn: [
    "100 Nanjing East Rd, Huangpu, Shanghai 200002, China",
    "88 Wangfujing St, Dongcheng, Beijing 100006, China",
  ],
  in: [
    "42 MG Road, Bengaluru, Karnataka 560001, India",
    "15 Connaught Place, New Delhi 110001, India",
    "8 Marine Drive, Mumbai, Maharashtra 400002, India",
  ],
  sg: ["10 Marina Blvd, #08-01, Singapore 018983"],
  au: [
    "200 George Street, Sydney NSW 2000, Australia",
    "80 Collins Street, Melbourne VIC 3000, Australia",
  ],
  nz: ["15 Queen Street, Auckland 1010, New Zealand"],
  br: [
    "Av. Paulista 1578, São Paulo, SP 01310-200, Brazil",
    "Rua Visconde de Pirajá 351, Rio de Janeiro, RJ 22410-003, Brazil",
  ],
  mx: [
    "Av. Reforma 222, Col. Juárez, 06600 Mexico City, Mexico",
    "Av. Revolución 1500, Guadalajara, Jalisco 44100, Mexico",
  ],
  ar: [
    "Av. Corrientes 1234, C1043AAZ Buenos Aires, Argentina",
    "Av. Colón 500, X5000JHN Córdoba, Argentina",
  ],
  co: [
    "Carrera 7 #71-21, Bogotá, Colombia",
    "Calle 10 #5-51, Medellín, Colombia",
  ],
  ae: [
    "Sheikh Zayed Road, Trade Centre 1, Dubai, UAE",
    "Corniche Road, Al Markaziyah, Abu Dhabi, UAE",
  ],
  sa: ["King Fahd Road, Al Olaya, Riyadh 12211, Saudi Arabia"],
  pk: [
    "Shahrah-e-Faisal, Karachi 75350, Pakistan",
    "The Mall Road, Lahore 54000, Pakistan",
  ],
  tr: [
    "İstiklal Caddesi 125, 34430 Istanbul, Turkey",
    "Atatürk Bulvarı 50, 06050 Ankara, Turkey",
  ],
  eg: ["26th of July Street, Zamalek, Cairo 11211, Egypt"],
  ng: ["12 Broad Street, Lagos Island, Lagos, Nigeria"],
  ke: ["Kenyatta Avenue 45, Nairobi 00100, Kenya"],
  za: [
    "15 Long Street, Cape Town 8001, South Africa",
    "Nelson Mandela Square, Sandton, Johannesburg 2196, South Africa",
  ],
  sn: ["Rue Félix Faure 20, Dakar, Senegal"],
  il: ["Rothschild Blvd 45, Tel Aviv 6578401, Israel"],
};

const countryForRegion: Record<string, string> = {
  us: "United States", ca: "Canada", uk: "United Kingdom", de: "Germany",
  fr: "France", es: "Spain", it: "Italy", nl: "Netherlands", se: "Sweden",
  no: "Norway", pl: "Poland", cz: "Czech Republic", ch: "Switzerland",
  jp: "Japan", kr: "South Korea", cn: "China", in: "India", sg: "Singapore",
  au: "Australia", nz: "New Zealand", br: "Brazil", mx: "Mexico",
  ar: "Argentina", co: "Colombia", ae: "United Arab Emirates",
  sa: "Saudi Arabia", pk: "Pakistan", tr: "Turkey", eg: "Egypt",
  ng: "Nigeria", ke: "Kenya", za: "South Africa", sn: "Senegal", il: "Israel",
};

// ─── ID number formats by region ───

function generateIdNumber(region: string, rng: () => number): string {
  const d = () => Math.floor(rng() * 10);
  const c = () => String.fromCharCode(65 + Math.floor(rng() * 26));
  switch (region) {
    case "us": return `${c()}${d()}${d()}${d()}${d()}${d()}${d()}${d()}`;
    case "ca": return `${c()}${c()}${d()}${d()}${d()}${d()}${d()}${d()}`;
    case "uk": return `${c()}${c()}${d()}${d()}${d()}${d()}${d()}${d()}${c()}`;
    case "de": return `${c()}${d()}${d()}${d()}${d()}${d()}${d()}${d()}${d()}${d()}`;
    case "fr": return `${d()}${d()}${d()}${d()}${d()}${d()}${d()}${d()}${d()}${d()}${d()}${d()}`;
    case "jp": return `${c()}${c()}${d()}${d()}${d()}${d()}${d()}${d()}${d()}`;
    case "kr": return `${d()}${d()}${d()}${d()}${d()}${d()}-${d()}${d()}${d()}${d()}${d()}${d()}${d()}`;
    case "in": return `${c()}${c()}${c()}${c()}${d()}${d()}${d()}${d()}${d()}${c()}`;
    case "br": return `${d()}${d()}${d()}.${d()}${d()}${d()}.${d()}${d()}${d()}-${d()}${d()}`;
    case "au": return `${c()}${c()}${d()}${d()}${d()}${d()}${d()}${d()}${d()}`;
    default: return `${c()}${c()}${d()}${d()}${d()}${d()}${d()}${d()}`;
  }
}

// ─── Date formatting helpers ───

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatBirthdateForExtract(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, "0")} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function generateExpirationDate(rng: () => number): string {
  const year = 2028 + Math.floor(rng() * 7);
  const month = Math.floor(rng() * 12);
  const day = 1 + Math.floor(rng() * 28);
  return `${String(day).padStart(2, "0")} ${months[month]} ${year}`;
}

// ─── Exported types ───

export interface GeneratedPerson {
  index: number;
  name: string;
  region: Region;
  status: InquiryStatus;
  templateName: string;
  tags: string[];
  referenceId?: string;
  createdAt: string;
  completedAt?: string;
  timeToFinish?: number;
  verificationAttempts: { governmentId: number; selfie: number };
  birthdate: string;
  age: number;
  address: string;
  // For verification extractedData
  idNumber: string;
  issuingCountry: string;
  expirationDate: string;
  birthdateFormatted: string;
}

// ─── Weight tables ───

const statusWeights: [InquiryStatus, number][] = [
  ["approved", 75],
  ["declined", 8],
  ["needs_review", 5],
  ["pending", 5],
  ["expired", 4],
  ["created", 3],
];

const templateWeights: [string, number][] = [
  ["KYC + AML: GovID + Selfie", 70],
  ["KYC: GovID Only", 30],
];

const tagWeights: [string[], number][] = [
  [[], 50],
  [["premium"], 10],
  [["high-risk"], 8],
  [["eu-resident"], 7],
  [["vip"], 5],
  [["re-verification"], 5],
  [["expedited"], 4],
  [["manual-review"], 4],
  [["api-created"], 3],
  [["premium", "vip"], 2],
  [["high-risk", "manual-review"], 2],
];

const refIdPrefixes = ["user_", "ext_", "cust_", "ref_"];

// ─── Edge cases (indices 0-9) ───

const edgeCases: (Omit<GeneratedPerson, "idNumber" | "issuingCountry" | "expirationDate" | "birthdateFormatted"> & Partial<Pick<GeneratedPerson, "idNumber" | "issuingCountry" | "expirationDate" | "birthdateFormatted">>)[] = [
  {
    index: 0, name: "André Caçador de Araújo", region: "us",
    status: "approved", templateName: "KYC + AML: GovID + Selfie",
    tags: ["expedited"], createdAt: "2026-02-12T09:12:00.000Z",
    completedAt: "2026-02-12T09:13:45.000Z", timeToFinish: 105,
    verificationAttempts: { governmentId: 1, selfie: 1 },
    birthdate: "1983-03-14", age: 42, address: "789 Pine Road, Denver, CO 80202, USA",
    // Data from actual Portuguese ID document photo
    idNumber: "00766666 7 ZZO", issuingCountry: "Portugal",
    expirationDate: "29 May 2034", birthdateFormatted: "14 Mar 1983",
  },
  {
    index: 1, name: "Maria Aldomar", region: "it",
    status: "approved", templateName: "KYC + AML: GovID + Selfie",
    tags: ["re-verification"], createdAt: "2026-02-12T08:05:00.000Z",
    completedAt: "2026-02-12T08:21:22.000Z", timeToFinish: 982,
    verificationAttempts: { governmentId: 2, selfie: 2 },
    birthdate: "2005-01-18", age: 21, address: "Via Montenapoleone 8, 20121 Milan, Italy",
    // Data from actual Italian residence permit document photo
    idNumber: "123456", issuingCountry: "Italy",
    expirationDate: "30 Jun 2031", birthdateFormatted: "18 Jan 2005",
  },
  {
    index: 2, name: "Carmen Muestra", region: "ch",
    status: "declined", templateName: "KYC + AML: GovID + Selfie",
    tags: ["manual-review"], createdAt: "2026-02-11T22:30:00.000Z",
    completedAt: "2026-02-11T22:41:15.000Z", timeToFinish: 675,
    verificationAttempts: { governmentId: 2, selfie: 1 },
    birthdate: "1995-08-01", age: 30, address: "Bahnhofstrasse 40, 8001 Zürich, Switzerland",
    // Data from actual Swiss passport document photo
    idNumber: "S0A00A00", issuingCountry: "Switzerland",
    expirationDate: "31 Oct 2032", birthdateFormatted: "01 Aug 1995",
  },
  {
    index: 3, name: "Rafael Torres", region: "us",
    status: "declined", templateName: "KYC + AML: GovID + Selfie",
    tags: [], createdAt: "2026-02-11T19:45:00.000Z",
    completedAt: "2026-02-11T19:52:30.000Z", timeToFinish: 450,
    verificationAttempts: { governmentId: 1, selfie: 2 },
    birthdate: "1991-09-03", age: 34, address: "1010 Sunset Blvd, Los Angeles, CA 90028, USA",
  },
  {
    index: 4, name: "Sofia Osman", region: "ae",
    status: "needs_review", templateName: "KYC + AML: GovID + Selfie",
    tags: ["high-risk"], referenceId: "ext_so_osman_2026",
    createdAt: "2026-02-11T17:20:00.000Z",
    completedAt: "2026-02-11T17:27:10.000Z", timeToFinish: 430,
    verificationAttempts: { governmentId: 1, selfie: 1 },
    birthdate: "1983-01-29", age: 43, address: "Sheikh Zayed Road, Trade Centre 1, Dubai, UAE",
  },
  {
    index: 5, name: "Elena Wu", region: "cn",
    status: "needs_review", templateName: "KYC + AML: GovID + Selfie",
    tags: ["high-risk", "manual-review"], createdAt: "2026-02-11T15:10:00.000Z",
    completedAt: "2026-02-11T15:18:45.000Z", timeToFinish: 525,
    verificationAttempts: { governmentId: 1, selfie: 1 },
    birthdate: "1990-07-17", age: 35, address: "100 Nanjing East Rd, Huangpu, Shanghai 200002, China",
  },
  {
    index: 6, name: "Tyler Brooks", region: "us",
    status: "pending", templateName: "KYC + AML: GovID + Selfie",
    tags: ["api-created"], referenceId: "user_tyler_90821",
    createdAt: "2026-02-11T14:00:00.000Z",
    verificationAttempts: { governmentId: 0, selfie: 0 },
    birthdate: "2001-12-05", age: 24, address: "500 Michigan Ave, Chicago, IL 60611, USA",
  },
  {
    index: 7, name: "Ingrid Holm", region: "se",
    status: "expired", templateName: "KYC: GovID Only",
    tags: [], createdAt: "2026-02-11T11:30:00.000Z",
    verificationAttempts: { governmentId: 0, selfie: 0 },
    birthdate: "1968-04-23", age: 57, address: "Drottninggatan 10, 111 51 Stockholm, Sweden",
  },
  {
    index: 8, name: "Valentina Reyes", region: "mx",
    status: "created", templateName: "KYC + AML: GovID + Selfie",
    tags: ["expedited"], createdAt: "2026-02-11T10:05:00.000Z",
    verificationAttempts: { governmentId: 0, selfie: 0 },
    birthdate: "1996-08-30", age: 29, address: "Av. Reforma 222, Col. Juárez, 06600 Mexico City, Mexico",
  },
  {
    index: 9, name: "Marco Park", region: "au",
    status: "approved", templateName: "KYC + AML: GovID + Selfie",
    tags: ["re-verification"], createdAt: "2026-02-11T08:50:00.000Z",
    completedAt: "2026-02-11T09:06:32.000Z", timeToFinish: 982,
    verificationAttempts: { governmentId: 3, selfie: 1 },
    birthdate: "1985-02-14", age: 41, address: "200 George Street, Sydney NSW 2000, Australia",
  },
];

// ─── Build generated people ───

export const generatedPeople: GeneratedPerson[] = [];

// Edge cases first (indices 0-9)
for (const ec of edgeCases) {
  const rng = mulberry32(ec.index * 7919 + 42);
  const region = ec.region;
  generatedPeople.push({
    ...ec,
    idNumber: ec.idNumber ?? generateIdNumber(region, rng),
    issuingCountry: ec.issuingCountry ?? (countryForRegion[region] ?? region),
    expirationDate: ec.expirationDate ?? generateExpirationDate(rng),
    birthdateFormatted: ec.birthdateFormatted ?? formatBirthdateForExtract(ec.birthdate),
  });
}

// Bulk generation (indices 10-114)
for (let i = 10; i < namePool.length; i++) {
  const { name, region } = namePool[i];
  const rng = mulberry32(i * 7919 + 42);

  const status = weightedPick(rng, statusWeights);
  const templateName = weightedPick(rng, templateWeights);
  const tags = weightedPick(rng, tagWeights);
  const hasRefId = rng() < 0.2;
  const referenceId = hasRefId
    ? `${refIdPrefixes[i % refIdPrefixes.length]}${(10000 + i * 97) % 99999}`
    : undefined;

  // Date: 90-day span biased toward recent
  const endMs = new Date("2026-02-10T23:59:59Z").getTime();
  const startMs = new Date("2025-11-15T00:00:00Z").getTime();
  const t = Math.pow(rng(), 0.6);
  const dateMs = startMs + t * (endMs - startMs);
  const date = new Date(dateMs);
  date.setHours(7 + Math.floor(rng() * 14));
  date.setMinutes(Math.floor(rng() * 60));
  date.setSeconds(Math.floor(rng() * 60));
  const createdAt = date.toISOString();

  const finished = status === "approved" || status === "declined" || status === "needs_review";
  const ttf = finished ? Math.round(Math.max(90, Math.min(900, 200 + rng() * 300 + (rng() - 0.5) * 200))) : undefined;
  const completedAt = finished && ttf
    ? new Date(date.getTime() + ttf * 1000).toISOString()
    : undefined;

  const hasSelfie = templateName.includes("Selfie");
  let govIdAttempts = 0;
  let selfieAttempts = 0;
  if (finished) {
    const govRoll = rng();
    govIdAttempts = govRoll < 0.85 ? 1 : govRoll < 0.97 ? 2 : 3;
    selfieAttempts = hasSelfie ? (rng() < 0.9 ? 1 : 2) : 0;
  }

  // Birthdate: age 21-75, centered ~35
  const u1 = rng(), u2 = rng();
  const z = Math.sqrt(-2 * Math.log(u1 + 0.001)) * Math.cos(2 * Math.PI * u2);
  const age = Math.round(Math.max(21, Math.min(75, 35 + z * 12)));
  const birthYear = 2026 - age;
  const birthMonth = 1 + Math.floor(rng() * 12);
  const birthDay = 1 + Math.floor(rng() * 28);
  const birthdate = `${birthYear}-${String(birthMonth).padStart(2, "0")}-${String(birthDay).padStart(2, "0")}`;

  const addressPool = addressesByRegion[region] ?? addressesByRegion.us;
  const address = addressPool[Math.floor(rng() * addressPool.length)];

  generatedPeople.push({
    index: i,
    name,
    region,
    status,
    templateName,
    tags,
    referenceId,
    createdAt,
    completedAt,
    timeToFinish: ttf,
    verificationAttempts: { governmentId: govIdAttempts, selfie: selfieAttempts },
    birthdate,
    age,
    address,
    idNumber: generateIdNumber(region, rng),
    issuingCountry: countryForRegion[region] ?? region,
    expirationDate: generateExpirationDate(rng),
    birthdateFormatted: formatBirthdateForExtract(birthdate),
  });
}

// Re-export helpers for use in mock-verifications
export { countryForRegion, addressesByRegion };
