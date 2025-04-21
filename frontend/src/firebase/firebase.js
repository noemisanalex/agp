// src/firebase/firebase.js

import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "fake-api-key",
  authDomain: "localhost",
  projectId: "autogestionpro",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

if (window.location.hostname === 'localhost') {
  connectFirestoreEmulator(db, 'localhost', 8090);
}

export { db };
