/**
 * Stats Service
 * Manages reading, writing, and real-time subscription for the `stats` document in `websiteContent`.
 */

import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  FirestoreError,
} from 'firebase/firestore';
import { db } from '../firebase';

export interface StatsData {
  eventsCompleted: number;
  happyCustomers: number;
  yearsOfExperience: number;
  happyClients: number;
  updatedAt?: string;
}

export const INITIAL_STATS: StatsData = {
  eventsCompleted: 150,
  happyCustomers: 280,
  yearsOfExperience: 8,
  happyClients: 260,
};

const COLLECTION_NAME = 'websiteContent';
const DOCUMENT_NAME = 'stats';
const LOCAL_STORAGE_KEY = 'oreofe_stats_cache';

export function getLocalCachedStats(): StatsData {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (
        typeof parsed.eventsCompleted === 'number' &&
        typeof parsed.happyCustomers === 'number' &&
        typeof parsed.yearsOfExperience === 'number' &&
        typeof parsed.happyClients === 'number'
      ) {
        return parsed;
      }
    }
  } catch {
    // fallback
  }
  return INITIAL_STATS;
}

export function setLocalCachedStats(data: StatsData): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore quota
  }
}

export function subscribeToStats(
  onUpdate: (stats: StatsData) => void,
  onError?: (error: Error) => void
): () => void {
  const docRef = doc(db, COLLECTION_NAME, DOCUMENT_NAME);

  const unsubscribe = onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as Partial<StatsData>;
        const merged: StatsData = {
          eventsCompleted: Number(data.eventsCompleted ?? INITIAL_STATS.eventsCompleted),
          happyCustomers: Number(data.happyCustomers ?? INITIAL_STATS.happyCustomers),
          yearsOfExperience: Number(data.yearsOfExperience ?? INITIAL_STATS.yearsOfExperience),
          happyClients: Number(data.happyClients ?? INITIAL_STATS.happyClients),
        };
        setLocalCachedStats(merged);
        onUpdate(merged);
        return;
      }
      onUpdate(getLocalCachedStats());
    },
    (err: FirestoreError) => {
      console.warn('Firestore subscription fallback for stats:', err.message);
      onUpdate(getLocalCachedStats());
      if (onError) onError(err);
    }
  );

  return unsubscribe;
}

export async function getStats(): Promise<StatsData> {
  try {
    const docRef = doc(db, COLLECTION_NAME, DOCUMENT_NAME);
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
      const data = snapshot.data() as Partial<StatsData>;
      const merged: StatsData = {
        eventsCompleted: Number(data.eventsCompleted ?? INITIAL_STATS.eventsCompleted),
        happyCustomers: Number(data.happyCustomers ?? INITIAL_STATS.happyCustomers),
        yearsOfExperience: Number(data.yearsOfExperience ?? INITIAL_STATS.yearsOfExperience),
        happyClients: Number(data.happyClients ?? INITIAL_STATS.happyClients),
      };
      setLocalCachedStats(merged);
      return merged;
    }

    await saveStats(INITIAL_STATS);
    return INITIAL_STATS;
  } catch (error) {
    console.warn('Using local fallback for stats:', error);
    return getLocalCachedStats();
  }
}

export async function saveStats(stats: StatsData): Promise<boolean> {
  setLocalCachedStats(stats);
  try {
    const docRef = doc(db, COLLECTION_NAME, DOCUMENT_NAME);
    await setDoc(
      docRef,
      {
        eventsCompleted: Number(stats.eventsCompleted),
        happyCustomers: Number(stats.happyCustomers),
        yearsOfExperience: Number(stats.yearsOfExperience),
        happyClients: Number(stats.happyClients),
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    return true;
  } catch (error) {
    console.error('Failed to save stats to Firestore:', error);
    return false;
  }
}
