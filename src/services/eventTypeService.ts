/**
 * Event Types Content Service
 * Manages reading, writing, and real-time subscription for the `eventTypes` document in `websiteContent`.
 */

import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  FirestoreError,
} from 'firebase/firestore';
import { db } from '../firebase';

export interface EventTypeCard {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  cloudinaryPublicId?: string;
  order: number;
  enabled: boolean;
  tag: string;
  ctaText: string;
  whatsappMessage: string;
}

export interface EventTypesConfig {
  cards: EventTypeCard[];
  updatedAt?: string;
}

export const INITIAL_EVENT_TYPES: EventTypeCard[] = [
  {
    id: 'wedding',
    title: 'Wedding',
    description: 'Grand multi-tier cakes, royal stage styling, banquet seating, and complete ceremony coordination.',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80',
    order: 1,
    enabled: true,
    tag: 'Holy Matrimony & Reception',
    ctaText: 'Plan Your Wedding',
    whatsappMessage: 'Hello Mrs. Kolawole (Oreofe HolluWar), I am planning a Wedding and would like to discuss cakes and event services.',
  },
  {
    id: 'birthday',
    title: 'Birthday',
    description: 'Milestone jubilee cakes, joyful balloon arches, stage backdrops, music, and party rental essentials.',
    imageUrl: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=1000&q=80',
    order: 2,
    enabled: true,
    tag: 'Milestone Jubilees & Parties',
    ctaText: 'Plan Your Birthday',
    whatsappMessage: 'Hello Mrs. Kolawole (Oreofe HolluWar), I am planning a Birthday celebration and would like to order a cake and party services.',
  },
  {
    id: 'engagement',
    title: 'Engagement',
    description: 'Traditional Alaga introduction cakes, cultural stage backdrops, talking drummers, and community cooking pots.',
    imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1000&q=80',
    order: 3,
    enabled: true,
    tag: 'Traditional Introduction',
    ctaText: 'Plan Your Engagement',
    whatsappMessage: 'Hello Mrs. Kolawole (Oreofe HolluWar), I am planning an Engagement / Traditional introduction ceremony.',
  },
  {
    id: 'celebration',
    title: 'Celebration',
    description: 'Anniversaries, graduations, baby namings, and family thanksgiving banquets arranged with warmth and care.',
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80',
    order: 4,
    enabled: true,
    tag: 'Family & Thanksgiving',
    ctaText: 'Plan Your Celebration',
    whatsappMessage: 'Hello Mrs. Kolawole (Oreofe HolluWar), I am planning a Family Celebration / Thanksgiving event.',
  },
  {
    id: 'other',
    title: 'Other Events',
    description: 'Corporate banquets, church conferences, memorials of life, and bespoke gatherings across Ogun State.',
    imageUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1000&q=80',
    order: 5,
    enabled: true,
    tag: 'Bespoke Occasions',
    ctaText: 'Discuss Your Event',
    whatsappMessage: 'Hello Mrs. Kolawole (Oreofe HolluWar), I am planning an event and would like to enquire about your services.',
  },
];

const COLLECTION_NAME = 'websiteContent';
const DOCUMENT_NAME = 'eventTypes';
const LOCAL_STORAGE_KEY = 'oreofe_eventTypes_cache_v3';
const CLOUDINARY_CLOUD_NAME = 'tomxzhw2';

/**
 * Normalizes card image URLs: if a valid Cloudinary public ID exists and the imageUrl
 * was accidentally left pointing to an Unsplash default, prefer the Cloudinary URL.
 */
function normalizeCards(cards: EventTypeCard[]): EventTypeCard[] {
  return cards.map((c) => {
    if (
      c.cloudinaryPublicId &&
      c.cloudinaryPublicId.startsWith('event_types/') &&
      (!c.imageUrl || c.imageUrl.includes('unsplash.com'))
    ) {
      return {
        ...c,
        imageUrl: `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${c.cloudinaryPublicId}`,
      };
    }
    return c;
  });
}

/**
 * Read cached fallback cards from localStorage if available
 */
export function getLocalCachedEventTypes(): EventTypeCard[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return normalizeCards(parsed);
      }
    }
  } catch {
    // ignore json errors
  }
  return INITIAL_EVENT_TYPES;
}

/**
 * Save cards to local cache
 */
export function setLocalCachedEventTypes(cards: EventTypeCard[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cards));
  } catch {
    // ignore quota errors
  }
}

/**
 * Broadcast in-app event so public site updates instantly across components
 */
export function notifyEventTypesUpdated(cards: EventTypeCard[]) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('oreofe_event_types_updated', { detail: cards })
    );
  }
}

/**
 * Subscribe to real-time updates for Event Types configuration
 */
export function subscribeToEventTypes(
  onUpdate: (cards: EventTypeCard[]) => void,
  onError?: (error: Error) => void
): () => void {
  const docRef = doc(db, COLLECTION_NAME, DOCUMENT_NAME);

  const unsubscribe = onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as EventTypesConfig;
        if (data.cards && Array.isArray(data.cards)) {
          const sorted = normalizeCards(
            [...data.cards].sort((a, b) => a.order - b.order)
          );
          setLocalCachedEventTypes(sorted);
          onUpdate(sorted);
          return;
        }
      }
      const cached = getLocalCachedEventTypes();
      onUpdate(cached);
    },
    (err: FirestoreError) => {
      console.warn('Firestore subscription fallback for eventTypes:', err.message);
      const fallback = getLocalCachedEventTypes();
      onUpdate(fallback);
      if (onError) onError(err);
    }
  );

  return unsubscribe;
}

/**
 * Fetch Event Types once from Firestore with cached fallback
 */
export async function getEventTypes(): Promise<EventTypeCard[]> {
  try {
    const docRef = doc(db, COLLECTION_NAME, DOCUMENT_NAME);
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
      const data = snapshot.data() as EventTypesConfig;
      if (data.cards && Array.isArray(data.cards)) {
        const sorted = normalizeCards(
          [...data.cards].sort((a, b) => a.order - b.order)
        );
        setLocalCachedEventTypes(sorted);
        return sorted;
      }
    }

    await saveEventTypesConfig(INITIAL_EVENT_TYPES);
    return INITIAL_EVENT_TYPES;
  } catch (error) {
    console.warn('Using local fallback for eventTypes:', error);
    return getLocalCachedEventTypes();
  }
}

/**
 * Save complete Event Types array to Firestore and local cache
 */
export async function saveEventTypesConfig(cards: EventTypeCard[]): Promise<boolean> {
  const sorted = normalizeCards([...cards].sort((a, b) => a.order - b.order));
  setLocalCachedEventTypes(sorted);
  notifyEventTypesUpdated(sorted);

  try {
    const docRef = doc(db, COLLECTION_NAME, DOCUMENT_NAME);
    await setDoc(
      docRef,
      {
        cards: sorted,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    return true;
  } catch (error) {
    console.error('Failed to save eventTypes to Firestore, cached locally:', error);
    return false;
  }
}
