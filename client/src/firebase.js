import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { api } from './api';

const cfg = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Ask permission, fetch the FCM token and store it on the user's profile.
export async function enableNotifications() {
  if (!cfg.apiKey || !('Notification' in window)) return;
  try {
    if ((await Notification.requestPermission()) !== 'granted') return;
    const messaging = getMessaging(initializeApp(cfg));
    const reg = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    const fcmToken = await getToken(messaging, { vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY, serviceWorkerRegistration: reg });
    if (fcmToken) await api.put('/auth/me', { fcmToken });
    onMessage(messaging, ({ notification }) => new Notification(notification.title, { body: notification.body }));
  } catch (e) { console.warn('Notifications unavailable:', e.message); }
}
