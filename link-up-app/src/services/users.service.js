import { get, set, ref, query, equalTo, orderByChild, update } from 'firebase/database';
import { db } from '../config/firebase-config';
import { auth } from '../config/firebase-config';
import { updateProfile, updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { collection, where, getDocs } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export const searchUsers = async (searchTerm) => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('username', '==', searchTerm));
    const querySnapshot = await getDocs(q);

    const users = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

  } catch (error) {
    toast.error(`Error fetching users: ${error}`);
  }
};
export const updateAccountInfoDB = async (username, newEmail) => {
  try {
    await update(ref(db, `users/${username}`), { email: newEmail });
  } catch (error) {
    toast.error(`Error updating personal info: ${error}`);
    throw new Error(error.message);
  }
};


export const updateUserEmail = async (newEmail, currentPassword) => {
  try {

    const user = auth.currentUser;
    if (!user) {
      throw new Error('No user is currently signed in.');
    }

    await reauthenticateUser(currentPassword);
    await updateEmail(user, newEmail);

  } catch (error) {
    throw new Error(`Failed to update email: ${error.message}`);
  }
};
export const reauthenticateUser = async (currentPassword) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('No user is currently signed in.');
  }

  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  try {
    await reauthenticateWithCredential(user, credential);
  } catch (error) {
    throw new Error(`Reauthentication failed: ${error.message}`);
  }
};

export const updateUserPhoneNumber = async (userData, phoneNumber) => {
  try {
    const userRef = ref(db, `users/${userData.username}`);
    await update(userRef, { phone: phoneNumber });

    await updateProfile(auth.currentUser, { phoneNumber });

    return phoneNumber;
  } catch (error) {
    throw new Error(`Failed to update phone number: ${error.message}`);
  }
};


export const updateProfilePicture = async (username, photoURL) => {
  try {
    await updateProfile(auth.currentUser, { photoURL });

    const userRef = ref(db, `users/${username}`);
    await update(userRef, { photoURL });

    return photoURL;
  } catch (error) {
    throw new Error(`Failed to update profile picture: ${error.message}`);
  }
};


export const updateUserPassword = async (oldPassword, newPassword) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('No user is currently signed in.');
  }

  try {

    await reauthenticateUser(oldPassword);


    await updatePassword(user, newPassword);

    return "Password updated successfully.";
  } catch (error) {
    throw new Error(`Failed to update password: ${error.message}`);
  }
};

/**
 * Retrieves user data by username.
 * 
 * @async
 * @param {string} username - The username of the user.
 * @returns {Promise<Object>} A promise that resolves to the user data object.
 * @throws Will throw an error if the user data cannot be fetched.
 */
export const getUserByUsername = async (username) => {
  const snapshot = await get(ref(db, `users/${username}`));
  return snapshot.val();
};

/**
 * Retrieves user data by email.
 * 
 * @async
 * @param {string} email - The email of the user.
 * @returns {Promise<Object|null>} A promise that resolves to the user data object, or null if no user is found.
 * @throws Will throw an error if fetching user data by email fails.
 */
export const getUserByEmail = async (email) => {
  try {
    const snapshot = await get(query(ref(db, 'users'), orderByChild('email'), equalTo(email)));

    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return null;
    }
  } catch (error) {
    toast.error(`Error fetching user by email: ${error}`);
    throw new Error(error.message);
  }
};

/**
 * Creates a new user in the database with a given username and other details.
 * 
 * @async
 * @param {string} username - The username of the user.
 * @param {string} uid - The unique ID of the user.
 * @param {string} email - The email of the user.
 * @param {string} phone - The phone number of the user.
 * @returns {Promise<void>} A promise that resolves once the user is created.
 * @throws Will throw an error if creating the user fails.
 */
export const createUserUsername = async (username, uid, email, phone) => {
  const user = { username, uid, email, phone, createdOn: new Date().getTime() };
  await set(ref(db, `users/${username}`), user);
};

/**
 * Retrieves user data based on the user's unique ID.
 * 
 * @async
 * @param {string} uid - The unique ID of the user.
 * @returns {Promise<Object>} A promise that resolves to the user data object.
 * @throws Will throw an error if the user data cannot be fetched.
 */
export const getUserData = async (uid) => {
  const snapshot = await get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
  return snapshot.val();
};

/**
 * Adds a team to a user's list of teams.
 * 
 * @async
 * @param {string} teamId - The ID of the team.
 * @param {string} username - The username of the user.
 * @returns {Promise<void>} A promise that resolves once the team is added.
 * @throws Will throw an error if adding the team fails.
 */
export const addUserTeam = async (teamId, username) => {
  await update(ref(db), {
    [`users/${username}/teams/${teamId}`]: new Date().getTime(),
  })
};

/**
 * Adds a channel to a user's list of channels.
 * 
 * @async
 * @param {string} channelId - The ID of the channel.
 * @param {string} username - The username of the user.
 * @returns {Promise<void>} A promise that resolves once the channel is added.
 * @throws Will throw an error if adding the channel fails.
 */
export const addUserChannel = async (channelId, username) => {
  await update(ref(db), {
    [`users/${username}/channels/${channelId}`]: new Date().getTime(),
  })
};

/**
 * Retrieves the timestamp of a user in a specific channel.
 * 
 * @async
 * @param {string} channelId - The ID of the channel.
 * @param {string} username - The username of the user.
 * @returns {Promise<number>} A promise that resolves to the timestamp of the user in the channel.
 * @throws Will throw an error if retrieving the timestamp fails.
 */
export const getUserTimestamp = async (channelId, username) => {
  const snapshot =  await get(ref(db, `channels/${channelId}/members/${username}`));

  return snapshot.val();
};

/**
 * Updates the timestamp of a user in a specific channel.
 * 
 * @async
 * @param {string} channelId - The ID of the channel.
 * @param {string} username - The username of the user.
 * @returns {Promise<void>} A promise that resolves once the timestamp is updated.
 * @throws Will throw an error if updating the timestamp fails.
 */
export const updateUserTimestamp = async(channelId, username) => {
  await update(ref(db), {
    [`channels/${channelId}/members/${username}`]: new Date().getTime(),
})
};

/**
 * Updates the ID of the last message sent by a user in a specific channel.
 * 
 * @async
 * @param {string} username - The username of the user.
 * @param {string} channelId - The ID of the channel.
 * @param {string} messageId - The ID of the last message.
 * @returns {Promise<void>} A promise that resolves once the last message ID is updated.
 * @throws Will throw an error if updating the last message ID fails.
 */
export const lastSentMessage = async (username, channelId, messageId) => {
  await update(ref(db), {
    [`users/${username}/channels/${channelId}/lastMessage`]: messageId,
  })
};

/**
 * Retrieves the ID of the last message sent by a user in a specific channel.
 * 
 * @async
 * @param {string} username - The username of the user.
 * @param {string} channelId - The ID of the channel.
 * @returns {Promise<string|null>} A promise that resolves to the ID of the last message, or null if no message is found.
 * @throws Will throw an error if retrieving the last message ID fails.
 */
export const getLastMessage = async (username, channelId) => {
  const snapshot =  await get(ref(db,`users/${username}/channels/${channelId}/lastMessage`));  
  return snapshot.val();
};