/**
 * Cinematic Hero Content Service
 * Manages reading and writing the `cinematicHero` document in `websiteContent` collection.
 */

import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  FirestoreError,
} from 'firebase/firestore';
import { db } from '../firebase';

export interface CinematicHeroConfig {
  enabled: boolean;
  videoUrl: string;
  cloudinaryPublicId: string;
  videoName: string;
  scrollControlled: boolean;
  sectionHeight: number;
  mobileEnabled: boolean;
  desktopEnabled: boolean;
}

export const INITIAL_CINEMATIC_HERO_CONFIG: CinematicHeroConfig = {
  enabled: true,
  videoUrl:
    'https://res.cloudinary.com/tomxzhw2/video/upload/v1790382611/cinematic_assets/ypod2xlgp8e6zqk3gp4w.mp4',
  cloudinaryPublicId: 'cinematic_assets/ypod2xlgp8e6zqk3gp4w',
  videoName: 'Cinematic Food Animation (Master)',
  scrollControlled: true,
  sectionHeight: 500,
  mobileEnabled: true,
  desktopEnabled: true,
};

const COLLECTION_NAME = 'websiteContent';
const DOCUMENT_NAME = 'cinematicHero';
const LOCAL_STORAGE_KEY = 'cinematicHero_cache';

/**
 * Read cached fallback config from localStorage if available
 */
export function getLocalCachedConfig(): CinematicHeroConfig {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      return { ...INITIAL_CINEMATIC_HERO_CONFIG, ...JSON.parse(raw) };
    }
  } catch {
    // ignore json errors
  }
  return INITIAL_CINEMATIC_HERO_CONFIG;
}

/**
 * Save config to local cache
 */
export function setLocalCachedConfig(config: CinematicHeroConfig): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(config));
  } catch {
    // ignore
  }
}

/**
 * Get current cinematicHero configuration from Firestore
 */
export async function getCinematicHeroConfig(): Promise<{
  data: CinematicHeroConfig;
  fromCache?: boolean;
  error?: string;
}> {
  try {
    const docRef = doc(db, COLLECTION_NAME, DOCUMENT_NAME);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      const data = {
        ...INITIAL_CINEMATIC_HERO_CONFIG,
        ...snap.data(),
      } as CinematicHeroConfig;
      setLocalCachedConfig(data);
      return { data };
    }

    // Initialize the document with initial schema if it doesn't exist
    await setDoc(docRef, INITIAL_CINEMATIC_HERO_CONFIG);
    setLocalCachedConfig(INITIAL_CINEMATIC_HERO_CONFIG);
    return { data: INITIAL_CINEMATIC_HERO_CONFIG };
  } catch (error: unknown) {
    const err = error as FirestoreError;
    const cached = getLocalCachedConfig();
    return {
      data: cached,
      fromCache: true,
      error:
        err?.message ||
        'Firestore is currently unreachable. Changes are running in local fallback mode.',
    };
  }
}

/**
 * Save updated configuration to Firestore
 */
export async function saveCinematicHeroConfig(
  config: CinematicHeroConfig
): Promise<{ success: boolean; error?: string }> {
  // Always update local cache first
  setLocalCachedConfig(config);

  try {
    const docRef = doc(db, COLLECTION_NAME, DOCUMENT_NAME);
    await setDoc(docRef, {
      enabled: Boolean(config.enabled),
      videoUrl: String(config.videoUrl || '').trim(),
      cloudinaryPublicId: String(config.cloudinaryPublicId || '').trim(),
      videoName: String(config.videoName || '').trim(),
      scrollControlled: Boolean(config.scrollControlled),
      sectionHeight: Number(config.sectionHeight) || 500,
      mobileEnabled: Boolean(config.mobileEnabled),
      desktopEnabled: Boolean(config.desktopEnabled),
    });
    return { success: true };
  } catch (error: unknown) {
    const err = error as FirestoreError;
    return {
      success: false,
      error:
        err?.message ||
        'Could not save to Cloud Firestore. Saved to local session cache.',
    };
  }
}

/**
 * Helper to race a promise against a timeout
 */
function withTimeout<T>(promise: Promise<T>, timeoutMs = 4000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Firestore operation timed out; cached locally')), timeoutMs)
    ),
  ]);
}

/**
 * Specifically replace the active video in Firestore while keeping all other settings intact
 */
export async function replaceCinematicHeroVideo(videoData: {
  videoUrl: string;
  cloudinaryPublicId: string;
  videoName: string;
}): Promise<{ success: boolean; error?: string; updatedConfig: CinematicHeroConfig }> {
  const current = getLocalCachedConfig();

  const updatedConfig: CinematicHeroConfig = {
    ...current,
    videoUrl: String(videoData.videoUrl || '').trim(),
    cloudinaryPublicId: String(videoData.cloudinaryPublicId || '').trim(),
    videoName: String(videoData.videoName || '').trim(),
    enabled: true, // Make newly replaced video active
  };

  setLocalCachedConfig(updatedConfig);

  try {
    const docRef = doc(db, COLLECTION_NAME, DOCUMENT_NAME);
    await withTimeout(
      setDoc(
        docRef,
        {
          videoUrl: updatedConfig.videoUrl,
          cloudinaryPublicId: updatedConfig.cloudinaryPublicId,
          videoName: updatedConfig.videoName,
          enabled: updatedConfig.enabled,
        },
        { merge: true }
      ),
      3500
    );
    return { success: true, updatedConfig };
  } catch (error: unknown) {
    const err = error as FirestoreError;
    // Local cache is already updated, return success with notice if needed
    return {
      success: true,
      error:
        err?.message ||
        'Saved to local session cache while waiting for Firestore connection.',
      updatedConfig,
    };
  }
}

/**
 * Subscribe to real-time changes of the cinematicHero document
 */
export function subscribeToCinematicHeroConfig(
  onData: (data: CinematicHeroConfig) => void,
  onError?: (err: FirestoreError) => void
): () => void {
  const docRef = doc(db, COLLECTION_NAME, DOCUMENT_NAME);

  return onSnapshot(
    docRef,
    (snap) => {
      if (snap.exists()) {
        const data = {
          ...INITIAL_CINEMATIC_HERO_CONFIG,
          ...snap.data(),
        } as CinematicHeroConfig;
        setLocalCachedConfig(data);
        onData(data);
      } else {
        onData(INITIAL_CINEMATIC_HERO_CONFIG);
      }
    },
    (err) => {
      if (onError) onError(err);
      // Fallback to local cache on snapshot failure
      onData(getLocalCachedConfig());
    }
  );
}
