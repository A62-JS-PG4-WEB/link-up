import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

/**
 * Firebase configuration object containing the credentials and settings
 * to initialize the Firebase app.
 *
 * @type {Object}
 * @property {string} apiKey - API key for authenticating requests.
 * @property {string} authDomain - Authentication domain for Firebase Auth.
 * @property {string} projectId - Project ID for Firebase project.
 * @property {string} storageBucket - Storage bucket URL for Firebase Storage.
 * @property {string} messagingSenderId - Unique ID for Firebase Cloud Messaging.
 * @property {string} appId - Unique identifier for the Firebase app.
 * @property {string} databaseURL - Realtime Database URL.
 */
const firebaseConfig = {
  apiKey: "AIzaSyDqkiZQHj9hd2vjduDSJdBnmsZrqpX_S_4",
  authDomain: "link-up-efa4e.firebaseapp.com",
  projectId: "link-up-efa4e",
  storageBucket: "link-up-efa4e.appspot.com",
  messagingSenderId: "542928938195",
  appId: "1:542928938195:web:cede25f4f67e27edd2e026",
  databaseURL: "https://link-up-efa4e-default-rtdb.europe-west1.firebasedatabase.app/"
};

/**
 * Initializes the Firebase app with the provided configuration.
 *
 * @constant {FirebaseApp}
 */
const app = initializeApp(firebaseConfig);

/**
 * Firebase Authentication instance to manage user authentication operations.
 *
 * @constant {Auth}
 */
export const auth = getAuth(app);

/**
 * Firebase Realtime Database instance to interact with the database.
 *
 * @constant {Database}
 */
export const db = getDatabase(app);