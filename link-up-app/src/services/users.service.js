import { get, set, ref, query, equalTo, orderByChild } from 'firebase/database';
import { db } from '../config/firebase-config';

export const getUserByUsername = async (username) => {
  const snapshot = await get(ref(db, `users/${username}`));
  return snapshot.val();
};

export const createUserUsername = async (username, uid, email, phone) => {
  const user = { username, uid, email, phone, createdOn: new Date().toString() };
  await set(ref(db, `users/${username}`), user);
};

export const getUserData = async (uid) => {
  const snapshot = await get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
  return snapshot.val();
};
