// =============================================================================
// Central content + data for the Salsita with Cris portfolio.
// Replace copy, prices, social handles, and availability here in one place.
// =============================================================================

export type Service = {
  index: string;
  title: string;
  description: string;
  price: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  descriptor: string;
};

export type SocialLink = {
  label: string;
  handle: string;
  href: string;
  icon: "instagram" | "youtube" | "tiktok" | "email";
};

export type Stat = {
  label: string;
  value: number;
  suffix: string;
};

// Days of the month that are fully booked (no slots available).
export type Availability = {
  // ISO date string "YYYY-MM-DD" -> available time slots.
  slots: Record<string, string[]>;
  // ISO date strings that are fully booked.
  booked: string[];
};

// -----------------------------------------------------------------------------
// Brand
// -----------------------------------------------------------------------------

export const brand = {
  instructorName: "Cristhian Andrés Garzón",
  publicName: "Cristhian Garzón",
  brandName: "Salsita with Cris",
  location: "Budapest, Hungary",
};

// -----------------------------------------------------------------------------
// Navigation
// -----------------------------------------------------------------------------

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Booking", href: "#booking" },
  { label: "Contact", href: "#contact" },
];

// -----------------------------------------------------------------------------
// Style strip marquee keywords
// -----------------------------------------------------------------------------

export const styleKeywords = [
  "Salsa",
  "Salsa Caleña",
  "Partnerwork",
  "Social Dancing",
  "Budapest",
  "Colombian Footwork",
  "Private Lessons",
  "Workshops",
  "Wedding Dance",
  "Group Classes",
  "Salsita Family",
];

// -----------------------------------------------------------------------------
// About stats
// -----------------------------------------------------------------------------

export const stats: Stat[] = [
  { label: "Dancers trained", value: 500, suffix: "+" },
  { label: "Community members", value: 150, suffix: "+" },
  { label: "Years sharing salsa", value: 4, suffix: "+" },
  { label: "Styles taught", value: 3, suffix: "+" },
];

// -----------------------------------------------------------------------------
// Services
// -----------------------------------------------------------------------------

export const services: Service[] = [
  {
    index: "01",
    title: "Group Salsa Classes",
    description:
      "Weekly partnerwork classes in Budapest, blending Cuban and LA style so dancers can feel comfortable, musical, and connected at socials.",
    price: "From 4,000 HUF",
  },
  {
    index: "02",
    title: "Colombian Salsa Footwork",
    description:
      "Salsa Caleña classes focused on fast footwork, rhythm, coordination, musicality, and pure Colombian sabor.",
    price: "From 4,000 HUF",
  },
  {
    index: "03",
    title: "Private Lessons",
    description:
      "One-on-one or couple sessions tailored to your level, goals, confidence, musicality, and technique.",
    price: "From 14,000 HUF",
  },
  {
    index: "04",
    title: "Workshops and Events",
    description:
      "High-energy salsa workshops, community events, company activities, bachelorette classes, and cultural dance experiences.",
    price: "On request",
  },
  {
    index: "05",
    title: "Wedding Dance and Shows",
    description:
      "Personal choreography, performance moments, and dance experiences for celebrations that deserve something unforgettable.",
    price: "On request",
  },
];

// -----------------------------------------------------------------------------
// Testimonials — SAMPLE copy for layout only. Replace with real quotes later.
// -----------------------------------------------------------------------------

export const featuredTestimonial: Testimonial = {
  quote:
    "Cristhian makes salsa feel less intimidating and more alive. You leave the class with steps, but also with energy, confidence, and a feeling that you belong.",
  name: "Anna K.",
  descriptor: "Partnerwork dancer",
};

export const supportingTestimonials: Testimonial[] = [
  {
    quote:
      "The Caleña class is fast, joyful, and addictive. It feels like cardio, culture, and therapy at the same time.",
    name: "Mateo R.",
    descriptor: "Colombian footwork class",
  },
  {
    quote:
      "What I love is the community. People come to learn salsa, but they stay because the room feels like family.",
    name: "Dóra V.",
    descriptor: "Salsita Family member",
  },
];

// -----------------------------------------------------------------------------
// Booking — service options + mock availability
// -----------------------------------------------------------------------------

export const bookingServices = [
  "Group Salsa Classes",
  "Colombian Salsa Footwork",
  "Private Lesson",
  "Workshop or Event",
  "Wedding Dance or Show",
];

// Mock availability for the demo calendar. Keyed by ISO date.
// Connect to a real backend later by swapping these helpers.
export const availability: Availability = {
  slots: {
    "2026-06-23": ["10:00", "12:00", "17:30", "19:00"],
    "2026-06-24": ["17:30", "19:00"],
    "2026-06-25": ["10:00", "12:00", "19:00"],
    "2026-06-29": ["10:00", "17:30", "19:00"],
    "2026-06-30": ["12:00", "17:30", "19:00"],
    "2026-07-01": ["10:00", "12:00", "17:30"],
    "2026-07-02": ["17:30", "19:00"],
    "2026-07-06": ["10:00", "12:00", "17:30", "19:00"],
    "2026-07-07": ["12:00", "19:00"],
    "2026-07-08": ["10:00", "17:30"],
  },
  booked: ["2026-06-26", "2026-07-03", "2026-07-09"],
};

// -----------------------------------------------------------------------------
// Social links — replace handles + URLs here.
// -----------------------------------------------------------------------------

export const socialLinks: SocialLink[] = [
  {
    label: "Instagram",
    handle: "@andresgarzong",
    href: "https://instagram.com/andresgarzong",
    icon: "instagram",
  },
  {
    label: "YouTube",
    handle: "Salsita with Cris",
    href: "https://youtube.com/",
    icon: "youtube",
  },
  {
    label: "TikTok",
    handle: "@andresgarzong",
    href: "https://tiktok.com/@andresgarzong",
    icon: "tiktok",
  },
  {
    label: "Email",
    handle: "andresgarzong@gmail.com",
    href: "mailto:andresgarzong@gmail.com",
    icon: "email",
  },
];
