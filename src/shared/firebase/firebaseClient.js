import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import googleServices from '../../../google-services.json';

const client = googleServices.client?.[0] ?? {};
const projectInfo = googleServices.project_info ?? {};
const apiKey = client.api_key?.[0]?.current_key;
const appId = client.client_info?.mobilesdk_app_id;

const firebaseConfig = {
  apiKey,
  appId,
  projectId: projectInfo.project_id,
  databaseURL: projectInfo.firebase_url,
  storageBucket: projectInfo.storage_bucket,
  messagingSenderId: projectInfo.project_number,
  authDomain: `${projectInfo.project_id}.firebaseapp.com`,
};

/**
 * Gets or creates the Firebase app instance for the JS SDK.
 * @returns {import('firebase/app').FirebaseApp}
 */
const getFirebaseApp = () => {
  if (getApps().length > 0) {
    return getApp();
  }

  return initializeApp(firebaseConfig);
};

/**
 * Gets the Firebase Auth instance.
 * @returns {import('firebase/auth').Auth}
 */
const getFirebaseAuth = () => getAuth(getFirebaseApp());

/**
 * Gets the Firebase Realtime Database instance.
 * @returns {import('firebase/database').Database}
 */
const getFirebaseDatabase = () => getDatabase(getFirebaseApp());

export { getFirebaseApp, getFirebaseAuth, getFirebaseDatabase };
