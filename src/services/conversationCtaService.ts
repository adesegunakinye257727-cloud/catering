/**
 * Conversation CTA Service
 * Manages the background image and content for "Your Event Starts With Our Conversation"
 * Persists to Firestore document: websiteContent/conversationCta
 */

import {
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  FirestoreError,
} from 'firebase/firestore';
import { db } from '../firebase';

export interface ConversationCtaData {
  backgroundImageUrl: string;
  heading: string;
  subheading: string;
  buttonText: string;
  whatsappNumber: string;
  updatedAt?: string;
}

export const DEFAULT_CONVERSATION_CTA: ConversationCtaData = {
  backgroundImageUrl:
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=80',
  heading: 'Your Event Starts With Our Conversation',
  subheading:
    'Reach out today to check date availability, choose your cake design, and secure your event preparations.',
  buttonText: 'Chat on WhatsApp',
  whatsappNumber: '2348057339399',
};

const COLLECTION_NAME = 'websiteContent';
const DOCUMENT_NAME = 'conversationCta';
const LOCAL_STORAGE_KEY = 'oreofe_conversation_cta_cache_v2';

export function getLocalCachedConversationCta(): ConversationCtaData {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.backgroundImageUrl === 'string') {
        return {
          ...DEFAULT_CONVERSATION_CTA,
          ...parsed,
        };
      }
    }
  } catch {
    // fallback
  }
  return DEFAULT_CONVERSATION_CTA;
}

export function setLocalCachedConversationCta(data: ConversationCtaData): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore quota
  }
}

export function subscribeToConversationCta(
  onUpdate: (data: ConversationCtaData) => void,
  onError?: (error: Error) => void
): () => void {
  const docRef = doc(db, COLLECTION_NAME, DOCUMENT_NAME);

  const unsubscribe = onSnapshot(
    docRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as Partial<ConversationCtaData>;
        const merged: ConversationCtaData = {
          backgroundImageUrl:
            data.backgroundImageUrl !== undefined
              ? data.backgroundImageUrl
              : DEFAULT_CONVERSATION_CTA.backgroundImageUrl,
          heading: data.heading || DEFAULT_CONVERSATION_CTA.heading,
          subheading: data.subheading || DEFAULT_CONVERSATION_CTA.subheading,
          buttonText: data.buttonText || DEFAULT_CONVERSATION_CTA.buttonText,
          whatsappNumber: data.whatsappNumber || DEFAULT_CONVERSATION_CTA.whatsappNumber,
          updatedAt: data.updatedAt,
        };
        setLocalCachedConversationCta(merged);
        onUpdate(merged);
        return;
      }
      onUpdate(getLocalCachedConversationCta());
    },
    (err: FirestoreError) => {
      console.warn('Firestore subscription fallback for conversationCta:', err.message);
      onUpdate(getLocalCachedConversationCta());
      if (onError) onError(err);
    }
  );

  return unsubscribe;
}

export async function getConversationCta(): Promise<ConversationCtaData> {
  try {
    const docRef = doc(db, COLLECTION_NAME, DOCUMENT_NAME);
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
      const data = snapshot.data() as Partial<ConversationCtaData>;
      const merged: ConversationCtaData = {
        backgroundImageUrl:
          data.backgroundImageUrl !== undefined
            ? data.backgroundImageUrl
            : DEFAULT_CONVERSATION_CTA.backgroundImageUrl,
        heading: data.heading || DEFAULT_CONVERSATION_CTA.heading,
        subheading: data.subheading || DEFAULT_CONVERSATION_CTA.subheading,
        buttonText: data.buttonText || DEFAULT_CONVERSATION_CTA.buttonText,
        whatsappNumber: data.whatsappNumber || DEFAULT_CONVERSATION_CTA.whatsappNumber,
        updatedAt: data.updatedAt,
      };
      setLocalCachedConversationCta(merged);
      return merged;
    }
  } catch (err) {
    console.warn('Error reading conversationCta from Firestore:', err);
  }
  return getLocalCachedConversationCta();
}

export async function saveConversationCta(
  data: Partial<ConversationCtaData>
): Promise<void> {
  const current = getLocalCachedConversationCta();
  const merged: ConversationCtaData = {
    ...current,
    ...data,
    updatedAt: new Date().toISOString(),
  };

  setLocalCachedConversationCta(merged);

  try {
    const docRef = doc(db, COLLECTION_NAME, DOCUMENT_NAME);
    await setDoc(docRef, merged, { merge: true });
  } catch (err: any) {
    console.warn('Firestore save failed for conversationCta, cached locally:', err);
    throw new Error('Saved to local session cache. Firestore error: ' + err.message);
  }
}
