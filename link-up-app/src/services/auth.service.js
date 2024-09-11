import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../config/firebase-config';

/**
 * Registers a new user using email and password with Firebase Authentication.
 *
 * @function
 * @param {string} email - The email address of the user to register.
 * @param {string} password - The password for the new user.
 * @returns {Promise<import('firebase/auth').UserCredential>} A promise that resolves with the user credentials upon successful registration.
 * @throws {import('firebase/auth').FirebaseError} Throws an error if registration fails.
 */
export const registerUser = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

/**
 * Logs in a user using email and password with Firebase Authentication.
 *
 * @function
 * @param {string} email - The email address of the user to log in.
 * @param {string} password - The password for the user.
 * @returns {Promise<import('firebase/auth').UserCredential>} A promise that resolves with the user credentials upon successful login.
 * @throws {import('firebase/auth').FirebaseError} Throws an error if login fails.
 */
export const loginUser = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

/**
 * Logs out the currently authenticated user from Firebase Authentication.
 *
 * @function
 * @returns {Promise<void>} A promise that resolves once the user has been successfully signed out.
 * @throws {import('firebase/auth').FirebaseError} Throws an error if logout fails.
 */
export const logoutUser = () => {
  return signOut(auth);
};