import { getApp, getApps, initializeApp } from 'firebase/app';
import { addDoc, collection, getFirestore, serverTimestamp } from 'firebase/firestore';

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const firebaseReady = Object.values(config).every(Boolean);

export async function saveReportDraft(report: Record<string, unknown>) {
  if (!firebaseReady) return { demo: true };
  const app = getApps().length ? getApp() : initializeApp(config);
  const db = getFirestore(app);
  const ref = await addDoc(collection(db, 'substituteReports'), {
    ...report,
    status: 'draft',
    updatedAt: serverTimestamp(),
  });
  return { demo: false, id: ref.id };
}
