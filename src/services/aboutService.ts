/**
 * About Us Service
 * Manages founder photo and content for the About Us section.
 * Persists to Firestore document: websiteContent/about
 */

import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  FirestoreError,
} from 'firebase/firestore';
import { db } from '../firebase';

export interface AboutData {
  founderImageUrl: string;
  founderName: string;
  founderTitle: string;
  founderRole: string;
  updatedAt?: string;
}

export const DEFAULT_ABOUT_DATA: AboutData = {
  founderImageUrl:
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80',
  founderName: 'Mrs. Kolawole F. Adenike',
  founderTitle: 'Founder & CEO — Mrs. Kolawole F. Adenike',
  founderRole: 'Managing Director, Oreofe HolluWar Cake & Event',
};

const COLLECTION_NAME = 'websiteContent';
const DOCUMENT_NAME = 'about';
const LOCAL_STORAGE_KEY = 'oreofe_about_cache_v2';

export function getLocalCachedAbout(): AboutData {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.founderImageUrl === 'string') {
        return {
          ...DEFAULT_ABOUT_DATA,
          ...parsed,
        };
      }
    }
  } catch {
    // fallback
  }
  return DEFAULT_ABOUT_DATA;
}

export function setLocalCachedAbout(data: AboutData): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore quota
  }
}

export function subscribeToAbout(
  onUpdate: (data: AboutData) => void,
  onError?: (error: Error) => void
): () => void {
  const docRef = doc(db, COLLECTION_NAME, DOCUMENT_NAME);

  const unsubscribe = onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as Partial<AboutData>;
        const merged: AboutData = {
          founderImageUrl:
            data.founderImageUrl !== undefined
              ? data.founderImageUrl
              : DEFAULT_ABOUT_DATA.founderImageUrl,
          founderName: data.founderName || DEFAULT_ABOUT_DATA.founderName,
          founderTitle: data.founderTitle || DEFAULT_ABOUT_DATA.founderTitle,
          founderRole: data.founderRole || DEFAULT_ABOUT_DATA.founderRole,
          updatedAt: data.updatedAt,
        };
        setLocalCachedAbout(merged);
        onUpdate(merged);
        return;
      }
      onUpdate(getLocalCachedAbout());
    },
    (err: FirestoreError) => {
      console.warn('Firestore subscription fallback for about:', err.message);
      onUpdate(getLocalCachedAbout());
      if (onError) onError(err);
    }
  );

  return unsubscribe;
}

export async function getAboutData(): Promise<AboutData> {
  try {
    const docRef = doc(db, COLLECTION_NAME, DOCUMENT_NAME);
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
      const data = snapshot.data() as Partial<AboutData>;
      const merged: AboutData = {
        founderImageUrl:
          data.founderImageUrl !== undefined
            ? data.founderImageUrl
            : DEFAULT_ABOUT_DATA.founderImageUrl,
        founderName: data.founderName || DEFAULT_ABOUT_DATA.founderName,
        founderTitle: data.founderTitle || DEFAULT_ABOUT_DATA.founderTitle,
        founderRole: data.founderRole || DEFAULT_ABOUT_DATA.founderRole,
        updatedAt: data.updatedAt,
      };
      setLocalCachedAbout(merged);
      return merged;
    }
  } catch (err) {
    console.warn('Error reading about from Firestore:', err);
  }
  return getLocalCachedAbout();
}

export async function saveAboutData(
  data: Partial<AboutData>
): Promise<void> {
  const current = getLocalCachedAbout();
  const merged: AboutData = {
    ...current,
    ...data,
    updatedAt: new Date().toISOString(),
  };

  setLocalCachedAbout(merged);

  try {
    const docRef = doc(db, COLLECTION_NAME, DOCUMENT_NAME);
    await setDoc(docRef, merged, { merge: true });
  } catch (err: any) {
    console.warn('Firestore save failed for about, cached locally:', err);
    throw new Error('Saved to local session cache. Firestore error: ' + err.message);
  }
}
