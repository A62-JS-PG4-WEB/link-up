import { get, set, ref, query, equalTo, orderByChild, update } from 'firebase/database';
import { auth, db } from '../config/firebase-config';
import { updateProfile, updateEmail, updatePassword, sendEmailVerification, reauthenticateWithCredential, EmailAuthProvider  } from "firebase/auth";
// import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export const sendVerificationEmail = async (user) => {
  try {
    await sendEmailVerification(user);
    console.log('Verification email sent.');
  } catch (error) {
    console.error('Error sending verification email:', error);
  }
};


export const updateUserEmail = async (newEmail, currentPassword) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('No user is currently signed in.');
  }

  try {

    await reauthenticateUser(currentPassword);
    await updateEmail(user, newEmail);

    console.log('Email updated successfully. Please verify the new email address.');
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
  const snapshot = await get(query(ref(db, 'users'), orderByChild('email'), equalTo(email)));
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
