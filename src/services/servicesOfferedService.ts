/**
 * Services Offered Service
 * Manages the "What Oreofe HolluWar Offers" services section:
 * 1. Alaga Ijoko/Iduru
 * 2. Buying & Packaging of “Eru Iyawo”
 * 3. Sales of Accompanying & Proposal Letters
 * 4. Wedding, Birthday & Anniversary Cakes
 * 5. Surprise Birthday Package
 * 6. Indoor & Outdoor Catering Services
 * 7. Master of Ceremony (M.C)
 * 8. Training
 * 
 * Persists to Firestore document: websiteContent/servicesOffered
 */

import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  FirestoreError,
} from 'firebase/firestore';
import { db } from '../firebase';

export interface ServiceOfferedItem {
  id: string;
  title: string;
  tag: string;
  description: string;
  whyNeedIt: string;
  imageUrl: string;
  cloudinaryPublicId?: string;
  order: number;
  enabled: boolean;
  whatsappMessage: string;
}

export const INITIAL_SERVICES_OFFERED: ServiceOfferedItem[] = [
  {
    id: 'alaga',
    title: 'Alaga Ijoko/Iduru',
    tag: 'Traditional Compere',
    description: 'Experienced traditional engagement moderation, bridging both families with cultural decorum, songs, chants, and dowry guidance.',
    whyNeedIt: 'Ensuring your Yoruba introduction is deeply respectful, culturally authentic, and joyfully memorable for both families.',
    imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
    order: 1,
    enabled: true,
    whatsappMessage: 'Hello Mrs. Kolawole (Oreofe HolluWar), I would like to book Alaga Ijoko/Iduru for an upcoming engagement ceremony.',
  },
  {
    id: 'eru-iyawo',
    title: 'Buying & Packaging of “Eru Iyawo”',
    tag: 'Bridal Dowry Curation',
    description: 'Meticulous procurement, decorative wrapping, customized boxes, and exquisite presentation of traditional bridal dowry gifts.',
    whyNeedIt: 'Relieving families of tedious market runs by beautifully presenting yams, fabrics, luggage, and customary gifts in royal bespoke packaging.',
    imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=80',
    order: 2,
    enabled: true,
    whatsappMessage: 'Hello Mrs. Kolawole (Oreofe HolluWar), I would like assistance with buying and packaging Eru Iyawo.',
  },
  {
    id: 'proposal-letters',
    title: 'Sales of Accompanying & Proposal Letters',
    tag: 'Ceremonial Letters',
    description: 'Artisanal calligraphy and ornate royal framing for traditional proposal and acceptance letters (Leta Idana & Leta Ifowosowo).',
    whyNeedIt: 'Creating heirloom-worthy formal framed letters that honor age-old Yoruba heritage during your engagement proceedings.',
    imageUrl: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=1200&q=80',
    order: 3,
    enabled: true,
    whatsappMessage: 'Hello Mrs. Kolawole (Oreofe HolluWar), I would like to order Accompanying & Proposal Letters for our engagement.',
  },
  {
    id: 'cakes',
    title: 'Wedding, Birthday & Anniversary Cakes',
    tag: 'Artisanal Confectionery',
    description: 'Architectural multi-tiered wedding centerpieces, moist birthday towers, engagement traditional designs, and anniversary cakes.',
    whyNeedIt: 'Baked from scratch with premium ingredients, breathtaking sugar florals, and unforgettable flavors tailored to your palate.',
    imageUrl: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=1200&q=80',
    order: 4,
    enabled: true,
    whatsappMessage: 'Hello Mrs. Kolawole (Oreofe HolluWar), I would like to order a celebration cake for my upcoming event.',
  },
  {
    id: 'surprise-birthday',
    title: 'Surprise Birthday Package',
    tag: 'Milestone Surprises',
    description: 'Full surprise packages featuring luxury cake, balloons, gift hampers, morning saxophone/trumpet serenade, and memory captures.',
    whyNeedIt: 'Making your loved one feel extraordinarily cherished on their special day with seamless covert planning and flawless reveal.',
    imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=1200&q=80',
    order: 5,
    enabled: true,
    whatsappMessage: 'Hello Mrs. Kolawole (Oreofe HolluWar), I would like to book a Surprise Birthday Package for a loved one.',
  },
  {
    id: 'catering',
    title: 'Indoor & Outdoor Catering Services',
    tag: 'Gourmet Feasts',
    description: 'Sumptuous banquets, traditional firewood party jollof, fried rice, pounded yam, rich local soups, assorted meats, and small chops.',
    whyNeedIt: 'Delighting your guests with hot, hygienic, and generously portioned culinary masterpieces served by warm professional stewards.',
    imageUrl: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80',
    order: 6,
    enabled: true,
    whatsappMessage: 'Hello Mrs. Kolawole (Oreofe HolluWar), I would like to enquire about your Indoor & Outdoor Catering Services.',
  },
  {
    id: 'mc',
    title: 'Master of Ceremony (M.C)',
    tag: 'Event Hosting',
    description: 'Dynamic, eloquent, and respectful ceremony compere managing reception flow, guest engagement, and punctuality with poise.',
    whyNeedIt: 'Keeping your audience energized, preventing awkward lulls, and ensuring your reception proceeds smoothly according to schedule.',
    imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80',
    order: 7,
    enabled: true,
    whatsappMessage: 'Hello Mrs. Kolawole (Oreofe HolluWar), I would like to book a Master of Ceremony (M.C) for my event.',
  },
  {
    id: 'training',
    title: 'Training',
    tag: 'Culinary & Event Academy',
    description: 'Intensive practical vocational mentorship in professional baking, sugarcraft, event decoration, catering, and traditional compere skills.',
    whyNeedIt: 'Empowering aspiring entrepreneurs and enthusiasts with hands-on technical skills, industry secrets, and mentorship to launch thriving businesses.',
    imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80',
    order: 8,
    enabled: true,
    whatsappMessage: 'Hello Mrs. Kolawole (Oreofe HolluWar), I would like information regarding enrollment in your Training programs.',
  },
];

const COLLECTION_NAME = 'websiteContent';
const DOCUMENT_NAME = 'servicesOffered';
const LOCAL_STORAGE_KEY = 'oreofe_services_offered_cache_v2';

export function getLocalCachedServices(): ServiceOfferedItem[] {
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
  return INITIAL_SERVICES_OFFERED;
}

export function setLocalCachedServices(services: ServiceOfferedItem[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(services));
  } catch {
    // ignore quota
  }
}

export function notifyServicesUpdated(services: ServiceOfferedItem[]) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('oreofe_services_updated', { detail: services })
    );
  }
}

export function subscribeToServicesOffered(
  onUpdate: (services: ServiceOfferedItem[]) => void,
  onError?: (error: Error) => void
): () => void {
  const docRef = doc(db, COLLECTION_NAME, DOCUMENT_NAME);

  const unsubscribe = onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data && Array.isArray(data.services) && data.services.length > 0) {
          const sorted = [...data.services].sort((a, b) => a.order - b.order);
          setLocalCachedServices(sorted);
          onUpdate(sorted);
          return;
        }
      }
      onUpdate(getLocalCachedServices());
    },
    (err: FirestoreError) => {
      console.warn('Firestore subscription fallback for servicesOffered:', err.message);
      onUpdate(getLocalCachedServices());
      if (onError) onError(err);
    }
  );

  return unsubscribe;
}

export async function getServicesOffered(): Promise<ServiceOfferedItem[]> {
  try {
    const docRef = doc(db, COLLECTION_NAME, DOCUMENT_NAME);
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
      const data = snapshot.data();
      if (data && Array.isArray(data.services) && data.services.length > 0) {
        const sorted = [...data.services].sort((a, b) => a.order - b.order);
        setLocalCachedServices(sorted);
        return sorted;
      }
    }
  } catch (err) {
    console.warn('Error reading servicesOffered from Firestore:', err);
  }
  return getLocalCachedServices();
}

export async function saveServicesOffered(
  services: ServiceOfferedItem[]
): Promise<void> {
  const sorted = [...services].sort((a, b) => a.order - b.order);
  setLocalCachedServices(sorted);
  notifyServicesUpdated(sorted);

  try {
    const docRef = doc(db, COLLECTION_NAME, DOCUMENT_NAME);
    await setDoc(
      docRef,
      {
        services: sorted,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (err: any) {
    console.warn('Firestore save failed for servicesOffered, cached locally:', err);
    throw new Error('Saved to local session cache. Firestore error: ' + err.message);
  }
}
