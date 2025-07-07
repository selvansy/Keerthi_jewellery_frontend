import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyAYhSAA0p1qJ_UxM-x808Py6gIuu5IKb28",
  authDomain: "uplifted-record-424709-v1.firebaseapp.com",
  projectId: "uplifted-record-424709-v1",
  storageBucket: "uplifted-record-424709-v1.firebasestorage.app",
  messagingSenderId: "860673805443",
  appId: "1:860673805443:web:8e7ab13f943cb12f1a1fb6",
  measurementId: "G-QG7Q4F51CN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Messaging only if supported
let messaging;
(async () => {
  try {
    if (await isSupported()) {
      messaging = getMessaging(app);
    }
  } catch (error) {
    console.error('Firebase Messaging is not supported', error);
  }
})();

// Request permission and get token
export const requestNotificationPermission = async () => {
  try {
    if (!messaging) {
      console.error('Messaging not supported or initialized');
      return null;
    }

    const permission = await Notification.requestPermission();
    ;

    if (permission === 'granted') {
      try {
        const token = await getToken(messaging, {
          vapidKey: 'BPUSErslziiNp4dhzWlrdXRfAD4rYUTssW6jkc3WkXTt3FsJoeQdml3ipgcQVLdKxx6l-VwyTc9tuISJx8FuGuc'
        });
        
        if (!token) {
          console.error('No registration token available.');
          return null;
        }
        
        ;
        await sendTokenToServer(token);
        
        // Listen for token refresh
        onTokenRefresh(messaging);
        
        return token;
      } catch (tokenError) {
        console.error('An error occurred while retrieving token:', tokenError);
        return null;
      }
    } else {
      ;
      return null;
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return null;
  }
};

// Handle token refresh
const onTokenRefresh = (messaging) => {
  onMessage(messaging, () => {
    getToken(messaging, {
      vapidKey: 'BPUSErslziiNp4dhzWlrdXRfAD4rYUTssW6jkc3WkXTt3FsJoeQdml3ipgcQVLdKxx6l-VwyTc9tuISJx8FuGuc'
    }).then((refreshedToken) => {
      ;
      sendTokenToServer(refreshedToken);
    }).catch((err) => {
      console.error('Unable to retrieve refreshed token:', err);
    });
  });
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
        userId: 'current-user-id' // Replace with actual user ID
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to register device token: ${response.status}`);
    }
    
    ;
  } catch (error) {
    console.error('Error sending token to server:', error);
  }
};

// Handle incoming messages
export const onMessageListener = () => {
  return new Promise((resolve) => {
    if (!messaging) {
      console.error('Messaging not initialized');
      return resolve(null);
    }
    
    onMessage(messaging, (payload) => {
      ;
      resolve(payload);
    });
  });
};

export { messaging };