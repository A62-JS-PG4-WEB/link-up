import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; 
import {getDatabase} from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDqkiZQHj9hd2vjduDSJdBnmsZrqpX_S_4",
  authDomain: "link-up-efa4e.firebaseapp.com",
  projectId: "link-up-efa4e",
  storageBucket: "link-up-efa4e.appspot.com",
  messagingSenderId: "542928938195",
  appId: "1:542928938195:web:cede25f4f67e27edd2e026",
  databaseURL: "https://link-up-efa4e-default-rtdb.europe-west1.firebasedatabase.app/"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);