import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import {
  firebaseAPIKey, firebaseAppId, firebaseAuthDomain, firebaseMeasurementId,
  firebaseMessagingSenderId, firebaseProjectId, firebaseStorageBucket,
} from './Config';

const firebaseConfig = {
  apiKey: firebaseAPIKey,
  authDomain: firebaseAuthDomain,
  projectId: firebaseProjectId,
  storageBucket: firebaseStorageBucket,
  messagingSenderId: firebaseMessagingSenderId,
  appId: firebaseAppId,
  measurementId: firebaseMeasurementId,
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const analytics = getAnalytics(firebaseApp);
export const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/userinfo.email');
provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
