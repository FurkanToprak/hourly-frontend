export const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';
if (!googleClientId) {
  throw Error('Google client ID missing!');
}

export const googleClientSecret = process.env.REACT_APP_GOOGLE_CLIENT_SECRET || '';
if (!googleClientSecret) {
  throw Error('Google client secret missing!');
}

export const firebaseAPIKey = process.env.REACT_APP_FIREBASE_API_KEY || '';
if (!firebaseAPIKey) {
  throw Error('Firebase API key missing!');
}

export const firebaseAuthDomain = process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || '';
if (!firebaseAuthDomain) {
  throw Error('Firebase auth domain missing!');
}

export const firebaseProjectId = process.env.REACT_APP_FIREBASE_PROJECT_ID || '';
if (!firebaseProjectId) {
  throw Error('Firebase project ID missing!');
}

export const firebaseStorageBucket = process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || '';
if (!firebaseStorageBucket) {
  throw Error('Firebase storage bucket missing!');
}

export const firebaseMessagingSenderId = process.env.REACT_APP_MESSAGING_SENDER_ID || '';
if (!firebaseMessagingSenderId) {
  throw Error('Firebase messaging sender ID missing!');
}

export const firebaseAppId = process.env.REACT_APP_FIREBASE_APP_ID || '';
if (!firebaseAppId) {
  throw Error('Firebase app ID missing!');
}

export const firebaseMeasurementId = process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || '';
if (!firebaseMeasurementId) {
  throw Error('Firebase measurement ID missing!');
}

export const backendUri = process.env.REACT_APP_BACKEND_URI || '';
if (!backendUri) {
  throw Error('Backend URI missing!');
}
