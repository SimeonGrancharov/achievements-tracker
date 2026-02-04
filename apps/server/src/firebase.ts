import { initializeApp, cert, getApps, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';

let app: App;

if (getApps().length === 0) {
  // Use GOOGLE_APPLICATION_CREDENTIALS env var for service account
  // or Application Default Credentials (ADC) in Google Cloud environments
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    // Allow passing service account JSON directly via env var
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    app = initializeApp({
      credential: cert(serviceAccount),
    });
  } else {
    // Uses GOOGLE_APPLICATION_CREDENTIALS or ADC
    app = initializeApp();
  }
} else {
  app = getApps()[0];
}

const auth: Auth = getAuth(app);

export { app, auth };
