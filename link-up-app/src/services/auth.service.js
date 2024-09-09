import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../config/firebase-config';
import { updateUserOnlineStatus } from './users.service';

export const registerUser = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;


    await updateUserOnlineStatus(user.uid, true);

    return user; 
  } catch (error) {
    console.error("Login error:", error);
    throw error; 
  }
};

export const logoutUser = async () => {
  const user = auth.currentUser;

  if (user) {
    try {
      await updateUserOnlineStatus(user.uid, false);

      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
      throw error; 
    }
  }
};