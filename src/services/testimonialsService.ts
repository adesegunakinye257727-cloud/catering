/**
 * Testimonials Service
 * Manages reading, writing, and real-time subscription for client testimonials in Firestore.
 */

import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  FirestoreError,
} from 'firebase/firestore';
import { db } from '../firebase';

export interface TestimonialItem {
  id: string;
  clientName: string;
  testimonial: string;
  eventType?: string;
  clientPhotoUrl?: string;
  order: number;
  active: boolean;
}

export interface TestimonialsConfig {
  items: TestimonialItem[];
  updatedAt?: string;
}

export const INITIAL_TESTIMONIALS: TestimonialItem[] = [
  {
    id: 'test-1',
    clientName: 'Mrs. Folashade A.',
    testimonial:
      'Mrs. Kolawole made our wedding celebration so easy. The 4-tier bridal cake was breathtaking and tasted exceptional, and the hall decorations left our guests speechless.',
    eventType: 'Wedding Reception',
    clientPhotoUrl: '',
    order: 1,
    active: true,
  },
  {
    id: 'test-2',
    clientName: 'Mr. Babatunde O.',
    testimonial:
      'We rented giant cooking pots, chafing warmers, and banquet chairs for my mother’s 70th birthday. Everything was delivered spotless and right on time in Idowa-Ijebu.',
    eventType: '70th Birthday & Utensils Rental',
    clientPhotoUrl: '',
    order: 2,
    active: true,
  },
  {
    id: 'test-3',
    clientName: 'Alhaja Mariam K.',
    testimonial:
      'The traditional engagement stage backdrop and cultural cake were beyond our expectations. Having decor and utensils handled in one place saved our family so much stress.',
    eventType: 'Traditional Engagement',
    clientPhotoUrl: '',
    order: 3,
    active: true,
  },
];

const COLLECTION_NAME = 'websiteContent';
const DOCUMENT_NAME = 'testimonials';
const LOCAL_STORAGE_KEY = 'oreofe_testimonials_cache';

export function getLocalCachedTestimonials(): TestimonialItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }
  return INITIAL_TESTIMONIALS;
}

export function setLocalCachedTestimonials(items: TestimonialItem[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore quota
  }
}

export function subscribeToTestimonials(
  onUpdate: (items: TestimonialItem[]) => void,
  onError?: (error: Error) => void
): () => void {
  const docRef = doc(db, COLLECTION_NAME, DOCUMENT_NAME);

  const unsubscribe = onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as TestimonialsConfig;
        if (data.items && Array.isArray(data.items)) {
          const sorted = [...data.items].sort((a, b) => a.order - b.order);
          setLocalCachedTestimonials(sorted);
          onUpdate(sorted);
          return;
        }
      }
      onUpdate(getLocalCachedTestimonials());
    },
    (err: FirestoreError) => {
      console.warn('Firestore subscription fallback for testimonials:', err.message);
      onUpdate(getLocalCachedTestimonials());
      if (onError) onError(err);
    }
  );

  return unsubscribe;
}

export async function getTestimonials(): Promise<TestimonialItem[]> {
  try {
    const docRef = doc(db, COLLECTION_NAME, DOCUMENT_NAME);
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
      const data = snapshot.data() as TestimonialsConfig;
      if (data.items && Array.isArray(data.items)) {
        const sorted = [...data.items].sort((a, b) => a.order - b.order);
        setLocalCachedTestimonials(sorted);
        return sorted;
      }
    }

    await saveTestimonials(INITIAL_TESTIMONIALS);
    return INITIAL_TESTIMONIALS;
  } catch (error) {
    console.warn('Using local fallback for testimonials:', error);
    return getLocalCachedTestimonials();
  }
}

export async function saveTestimonials(items: TestimonialItem[]): Promise<boolean> {
  const sorted = [...items].sort((a, b) => a.order - b.order);
  setLocalCachedTestimonials(sorted);

  try {
    const docRef = doc(db, COLLECTION_NAME, DOCUMENT_NAME);
    await setDoc(
      docRef,
      {
        items: sorted,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    return true;
  } catch (error) {
    console.error('Failed to save testimonials to Firestore:', error);
    return false;
  }
}
