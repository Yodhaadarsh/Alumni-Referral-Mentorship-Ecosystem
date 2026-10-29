// Replace the config values with your Firebase project's web app config.
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');
firebase.initializeApp({ apiKey: '', projectId: '', messagingSenderId: '', appId: '' });
const messaging = firebase.messaging();
messaging.onBackgroundMessage(({ notification }) =>
  self.registration.showNotification(notification.title, { body: notification.body }));
