import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  initializeFirestore,
  getFirestore,
  Firestore,
  doc,
  getDoc,
} from 'firebase/firestore';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase App
export const app: FirebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Cloud Firestore
function initFirestore(): Firestore {
  const databaseId = firebaseConfig.firestoreDatabaseId || '(default)';
  try {
    return initializeFirestore(
      app,
      {
        experimentalAutoDetectLongPolling: true,
      },
      databaseId
    );
  } catch {
    return getFirestore(app, databaseId);
  }
}

export const db: Firestore = initFirestore();

// Optionally initialize Firebase Analytics if supported in current browser environment
export let analytics: Analytics | null = null;
if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
  isSupported()
    .then((supported) => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {
      // Analytics unsupported in certain sandboxed environments
    });
}

/**
 * On-demand helper to verify Firestore connectivity
 */
export async function verifyFirestoreConnection(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const testDoc = doc(db, 'test', 'connection');
    await getDoc(testDoc);
    return {
      success: true,
      message: 'Cloud Firestore connected and accessible.',
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message.includes('the client is offline')) {
        return {
          success: false,
          message: 'Client is operating in offline mode.',
        };
      }
      return {
        success: true,
        message: `Cloud Firestore reached: ${error.message}`,
      };
    }
    return {
      success: true,
      message: 'Cloud Firestore reached.',
    };
  }
}

export default app;
