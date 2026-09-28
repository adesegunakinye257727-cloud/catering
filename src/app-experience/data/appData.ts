export interface AppCake {
  id: string;
  category: 'wedding' | 'birthday' | 'engagement' | 'celebration' | 'custom';
  categoryLabel: string;
  title: string;
  description: string;
  tierInfo: string;
  flavorHighlights: string[];
  leadTime: string;
  imageUrl: string;
  tag: string;
  popular?: boolean;
}

export interface AppEventService {
  id: string;
  eventType: 'wedding' | 'birthday' | 'engagement' | 'celebration' | 'other';
  title: string;
  category: string;
  description: string;
  highlights: string[];
  imageUrl: string;
  badge: string;
}

export interface AppPromotion {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  ctaText: string;
  targetTab: 'planner' | 'cakes' | 'events';
}

export const APP_CAKES: AppCake[] = [
  {
    id: 'cake-royal-bridal',
    category: 'wedding',
    categoryLabel: 'Wedding',
    title: 'The Royal Bridal 4-Tier',
    description: 'Bespoke multi-tier bridal centerpiece with hand-piped pearl lace, royal sugar crest, and edible gold leaf accents.',
    tierInfo: '4 Tiers • Serves 180–250 Guests',
    flavorHighlights: ['Red Velvet Cream Cheese', 'Rich Fruit & Rum', 'Madagascar Vanilla'],
    leadTime: 'Order 2–4 Weeks in Advance',
    imageUrl: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80',
    tag: 'Bridal Centerpiece',
    popular: true,
  },
  {
    id: 'cake-alaga-traditional',
    category: 'engagement',
    categoryLabel: 'Engagement',
    title: 'Traditional Alaga Introduction Cake',
    description: 'Sculpted traditional calabash or Yoruba drum motifs with rich cultural hues, celebrating marriage introductions in Ijebu.',
    tierInfo: '2–3 Tiers • Serves 80–120 Guests',
    flavorHighlights: ['Carrot & Cinnamon Spice', 'Classic Marble Swirl', 'Buttercream Vanilla'],
    leadTime: 'Order 7–14 Days in Advance',
    imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
    tag: 'Cultural Heritage',
    popular: true,
  },
  {
    id: 'cake-golden-jubilee',
    category: 'birthday',
    categoryLabel: 'Birthday',
    title: 'Golden Jubilee Milestone Tower',
    description: 'Celebratory 50th, 60th, or 70th jubilee birthday cake with glistening metallic gold dragees and balloon arch topper matching your theme.',
    tierInfo: '3 Tiers • Serves 90–150 Guests',
    flavorHighlights: ['Double Belgian Chocolate', 'Coconut & Almond', 'Strawberry Swirl'],
    leadTime: 'Order 5–10 Days in Advance',
    imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    tag: 'Milestone Jubilee',
    popular: true,
  },
  {
    id: 'cake-thanksgiving-celebration',
    category: 'celebration',
    categoryLabel: 'Celebration',
    title: 'Family Thanksgiving & Dedication',
    description: 'Warm floral piped anniversary or baby dedication cake designed for joyful family gatherings and church celebrations.',
    tierInfo: '2 Tiers • Serves 50–80 Guests',
    flavorHighlights: ['Velvet Vanilla', 'Moist Lemon Poppy', 'Rich Caramel Chocolate'],
    leadTime: 'Order 4–7 Days in Advance',
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
    tag: 'Family Blessing',
    popular: false,
  },
  {
    id: 'cake-custom-bespoke',
    category: 'custom',
    categoryLabel: 'Custom',
    title: 'Custom Photo & Concept Cake',
    description: 'Bring any inspiration picture or personal design. Mrs. Kolawole crafts bespoke fondant shapes, sugar characters, and logos.',
    tierInfo: 'Custom Tiers • Custom Sizing',
    flavorHighlights: ['Client Flavor Preference', 'Custom Filling Choice'],
    leadTime: 'Order 1–2 Weeks in Advance',
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
    tag: 'Bespoke Artistry',
    popular: true,
  },
];

export const APP_SERVICES: AppEventService[] = [
  {
    id: 'srv-decor',
    eventType: 'wedding',
    title: 'Royal Stage & Hall Decorations',
    category: 'Venue Styling',
    description: 'Transform your event space with royal canopy drapes, stage backdrops, ambient crystal fairy lights, and themed floral arches.',
    highlights: ['Head table & bridal stage setup', 'Chair tiebacks and banquet centerpieces', 'Floral entry arches & red carpets'],
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    badge: 'Popular Service',
  },
  {
    id: 'srv-utensils',
    eventType: 'celebration',
    title: 'Cooking Utensils & Food Warmers Rental',
    category: 'Equipment Rentals',
    description: 'High-capacity community cooking pots, industrial gas burners, luxury chafing dish warmers, coolers, and catering serving sets.',
    highlights: ['Cast-iron giant firewood & gas cooking pots', 'Stainless steel buffet chafing food warmers', 'Heavy-duty insulated beverage coolers'],
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    badge: 'Essential Equipment',
  },
  {
    id: 'srv-hall',
    eventType: 'wedding',
    title: 'Banquet Hall Booking & Seating',
    category: 'Venues in Idowa-Ijebu',
    description: 'Spacious event halls with clean generator power, ample parking, and fully customizable banquet or theater seating configurations.',
    highlights: ['Vetted partner halls in Idowa-Ijebu & Ogun', 'Air conditioning & generator backup support', 'Round tables & Chiavari chair layouts'],
    imageUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80',
    badge: 'Venue Coordination',
  },
  {
    id: 'srv-music',
    eventType: 'birthday',
    title: 'Live Band & Traditional Drummers',
    category: 'Entertainment',
    description: 'Authentic Yoruba talking drummers, live gospel and juju bands, and high-fidelity sound systems tailored to keep your guests dancing.',
    highlights: ['Traditional Alaga introduction drummers', 'Versatile live celebratory band & sound engineering', 'Microphone setup for prayer and speeches'],
    imageUrl: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80',
    badge: 'Lively Atmosphere',
  },
  {
    id: 'srv-coordination',
    eventType: 'other',
    title: 'Full Event Day Coordination',
    category: 'Event Support',
    description: 'On-site direction from start to finish. We oversee cake presentation, food warming logistics, and seating transitions seamlessly.',
    highlights: ['Vendor check-in & setup schedule', 'Cake cutting ceremony coordination', 'Smooth crisis prevention on event day'],
    imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80',
    badge: 'Peace of Mind',
  },
];

export const APP_PROMOTIONS: AppPromotion[] = [
  {
    id: 'promo-full-bundle',
    title: 'Complete Celebration Combo',
    subtitle: 'Cake + Stage Decor + Utensils',
    badge: 'Recommended',
    description: 'Bundle your centerpiece cake, full hall backdrop, and catering cooking pots together with Oreofe HolluWar for our best bundled pricing.',
    ctaText: 'Build Custom Bundle',
    targetTab: 'planner',
  },
  {
    id: 'promo-early-bird',
    title: 'Advance Wedding Booking',
    subtitle: 'Free Cake Tasting & Consultation',
    badge: 'Limited Availability',
    description: 'Secure your 2025/2026 wedding date at least 4 weeks early to receive complimentary flavor sampling in Idowa-Ijebu.',
    ctaText: 'Explore Wedding Cakes',
    targetTab: 'cakes',
  },
];
