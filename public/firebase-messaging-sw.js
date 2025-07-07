importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAYhSAA0p1qJ_UxM-x808Py6gIuu5IKb28",
  authDomain: "uplifted-record-424709-v1.firebaseapp.com",
  projectId: "uplifted-record-424709-v1",
  storageBucket: "uplifted-record-424709-v1.firebasestorage.app",
  messagingSenderId: "860673805443",
  appId: "1:860673805443:web:1c22c7f2ac29ab641a1fb6",
  measurementId: "G-2T0NK03JVM"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  ;
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon || '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});