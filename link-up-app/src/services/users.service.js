import { get, set, ref, query, equalTo, orderByChild, update } from 'firebase/database';
import { db } from '../config/firebase-config';
import { auth } from '../config/firebase-config';
import { updateProfile, updateEmail, updatePassword, sendEmailVerification, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
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

    if (users.length > 0) {
      console.log('Users found:', users);
    } else {
      console.log('No users found');
    }
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

// export const sendVerificationEmail = async (user) => {
//   try {
//     await sendEmailVerification(user);
//   } catch (error) {
//     toast.error(`Error sending verification email: ${error}`);
//   }
// };

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
export const getUserByUsername = async (username) => {
  const snapshot = await get(ref(db, `users/${username}`));
  return snapshot.val();
};

export const getUserByEmail = async (email) => {
  try {
    const snapshot = await get(query(ref(db, 'users'), orderByChild('email'), equalTo(email)));

    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log('No user found with that email.');
      return null;
    }
  } catch (error) {
    toast.error(`Error fetching user by email: ${error}`);
    throw new Error(error.message);
  }
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

export const getUserTimestamp = async (channelId, username) => {
  const snapshot =  await get(ref(db, `channels/${channelId}/members/${username}`));

  return snapshot.val();
}

export const updateUserTimestamp = async(channelId, username) => {
  await update(ref(db), {
    [`channels/${channelId}/members/${username}`]: new Date().getTime(),
})
};

export const lastSentMessage = async (username, channelId, messageId) => {

  await update(ref(db), {
    [`users/${username}/channels/${channelId}/lastMessage`]: messageId,
  })
};

export const getLastMessage = async (username, channelId) => {

  const snapshot =  await get(ref(db,`users/${username}/channels/${channelId}/lastMessage`));  
  return snapshot.val();
}