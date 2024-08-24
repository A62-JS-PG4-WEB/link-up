import { get, set, ref, query, equalTo, orderByChild, update } from 'firebase/database';
import { db } from '../config/firebase-config';

export const getUserByUsername = async (username) => {
  const snapshot = await get(ref(db, `users/${username}`));
  return snapshot.val();
};

export const createUserUsername = async (username, uid, email, phone) => {
  const user = { username, uid, email, phone, createdOn: new Date().getTime() };
  await set(ref(db, `users/${username}`), user);
};

export const getUserData = async (uid) => {
  const snapshot = await get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
  return snapshot.val();
};

export const addUserTeam = async (teamId, username) => {

  await update(ref(db), {
    [`users/${username}/teams/${teamId}`]: new Date().getTime(),
  })
};

export const addUserChannel = async (channelId, username) => {
    await update(ref(db), {
    [`users/${username}/channels/${channelId}`]: new Date().getTime(),
  })
};