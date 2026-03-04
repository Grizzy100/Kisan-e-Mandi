import admin from "firebase-admin";

if (
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY &&
  !process.env.FIREBASE_PRIVATE_KEY.includes("YOUR_KEY_HERE")
) {
  const firebasePrivateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n");

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: firebasePrivateKey,
      }),
    });
  }
} else {
  console.warn("[Firebase] Admin SDK not initialized — FIREBASE_* env vars missing or placeholder.");
}

export default admin;
