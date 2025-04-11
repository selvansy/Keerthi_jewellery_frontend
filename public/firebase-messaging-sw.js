// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker
firebase.initializeApp({
  apiKey: "AIzaSyAYhSAA0p1qJ_UxM-x808Py6gIuu5IKb28",
  authDomain: "uplifted-record-424709-v1.firebaseapp.com",
  projectId: "uplifted-record-424709-v1",
  storageBucket: "uplifted-record-424709-v1.firebasestorage.app",
  messagingSenderId: "860673805443",
  appId: "1:860673805443:web:8e7ab13f943cb12f1a1fb6",
  measurementId: "G-QG7Q4F51CN"
});

// Retrieve firebase messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Background message received:', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png' // Add a notification icon in your public folder
  };
  
  self.registration.showNotification(notificationTitle, notificationOptions);
});