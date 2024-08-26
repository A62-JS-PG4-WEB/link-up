import { get, set, ref, query, equalTo, orderByChild, update } from 'firebase/database';
import { auth, db } from '../config/firebase-config';
import { updateProfile, updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { getStorage, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const updateUserPhoneNumber = async (user, phone) => {
  console.log('updating user' , user.username)
  try {
    const userRef = ref(db, `users/${user.username}`);
    await update(userRef, { phone });

    await updateProfile(auth.currentUser, { phone });

    return phone;
  } catch (error) {
    throw new Error(`Failed to update phone number: ${error.message}`);
  }
};
export const updateProfilePicture = async (user, photoURL) => {
  console.log(user);
  try {
    await updateProfile(auth.currentUser, { photoURL });

    const userRef = ref(db, `users/${user}`);
    await update(userRef, { photoURL });

    return photoURL;
  } catch (error) {
    throw new Error(`Failed to update profile picture: ${error.message}`);
  }
};

export const updateUserEmail = async (newEmail, currentPassword) => {
  try {
      const user = auth.currentUser;
      if (!user) {
          throw new Error('User is not authenticated');
      }

      await reauthenticateUser(currentPassword);
      await updateEmail(user, newEmail);

      toast.success('Email updated successfully.');
  } catch (error) {
      toast.error('Error updating email: ' + error.message);
      throw new Error(error.message);
  }
};


const reauthenticateUser = async (password) => {
  const user = auth.currentUser;
  if (!user) {
      throw new Error('User is not authenticated');
  }

  const credential = EmailAuthProvider.credential(user.email, password);
  try {
      await reauthenticateWithCredential(user, credential);
  } catch (error) {
      toast.error('Error reauthenticating user:', error);
      throw new Error('Reauthentication failed. Please check your password.');
  }
};

export const updateEmailInAuth = async (profileData) => {
  const user = auth.currentUser;

  if (!user) {
      throw new Error('User is not authenticated');
  }

  try {
      if (profileData.email && profileData.email !== user.email) {
          await updateEmail(user, profileData.email);
      }

  } catch (error) {
      toast.error('Error updating user profile:', error);
      throw error;
  }
};
export const updateUserPassword = async (user, oldPassword, newPassword) => {
  try {
    const credential = EmailAuthProvider.credential(user.email, oldPassword);
    await reauthenticateWithCredential(auth.currentUser, credential);

    await updatePassword(auth.currentUser, newPassword);
  } catch (error) {
    throw new Error(`Failed to update password: ${error.message}`);
  }
};

// export const updateUsername = async (user, newUsername) => {
//   try {
//     await updateProfile(auth.currentUser, { displayName: newUsername });

//     const userRef = dbRef(db, `users/${user.username}`);
//     await update(userRef, { displayName: newUsername });

//     return newUsername;
//   } catch (error) {
//     throw new Error(`Failed to update username: ${error.message}`);
//   }
// };
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
