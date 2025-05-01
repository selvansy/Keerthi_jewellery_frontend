import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Your Firebase configuration from the Firebase Console
// const firebaseConfig = {
//    apiKey: "AIzaSyAYhSAA0p1qJ_UxM-x808Py6gIuu5IKb28",
//   authDomain: "uplifted-record-424709-v1.firebaseapp.com",
//   projectId: "uplifted-record-424709-v1",
//   storageBucket: "uplifted-record-424709-v1.firebasestorage.app",
//   messagingSenderId: "860673805443",
//   appId: "1:860673805443:web:1c22c7f2ac29ab641a1fb6",
//   measurementId: "G-2T0NK03JVM"
// };
const firebaseConfig = {
  apiKey: "AIzaSyAYhSAA0p1qJ_UxM-x808Py6gIuu5IKb28",
  authDomain: "uplifted-record-424709-v1.firebaseapp.com",
  projectId: "uplifted-record-424709-v1",
  storageBucket: "uplifted-record-424709-v1.firebasestorage.app",
  messagingSenderId: "860673805443",
  appId: "1:860673805443:web:1c22c7f2ac29ab641a1fb6",
  measurementId: "G-2T0NK03JVM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Request permission and get token
export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    console.log(Notification.permission); // "default", "granted", or "denied"

    if (permission === 'granted') {
      // Get FCM token
      const token = await getToken(messaging, {
        vapidKey: 'BPUSErslziiNp4dhzWlrdXRfAD4rYUTssW6jkc3WkXTt3FsJoeQdml3ipgcQVLdKxx6l-VwyTc9tuISJx8FuGuc' // This is the key pair from Firebase Console
      });
      
      console.log('FCM Token:', token);
      
      // Send the token to your server
      await sendTokenToServer(token);
      
      return token;
    } else {
      console.log('Notification permission denied');
      return null;
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return null;
  }
};

// Send token to your backend
const sendTokenToServer = async (token) => {
  try {
    const response = await fetch('http://localhost:3002/api/register-device', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token,
        userId: 'current-user-id' // Replace with actual user ID from your auth system
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to register device token');
    }
    
    console.log('Token registered with server');
  } catch (error) {
    console.error('Error sending token to server:', error);
  }
};

// Handle incoming messages
export const onMessageListener = () => {
  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log('Message received:', payload);
      resolve(payload);
    });
  });
};

export { messaging };