import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { getFirebaseAuth } from '../../../../shared/firebase/firebaseClient';

/**
 * @typedef {Object} AuthResult
 * @property {boolean} ok - Whether the operation succeeded.
 * @property {string} [uid] - The authenticated user id (Firebase `auth.uid`).
 * @property {string} [email] - The authenticated user's email.
 * @property {string} [reason] - Failure reason when `ok` is false.
 */

/**
 * Creates the auth data source used to sign in, register, and sign out users.
 */
const createAuthRemoteDataSource = () => ({
  /**
   * Signs in an existing user.
   * @param {string} email - The user's email address.
   * @param {string} password - The user's password.
   * @returns {Promise<AuthResult>} Auth result payload.
   */
  signInUser: async (email, password) => {
    const auth = getFirebaseAuth();
    const normalizedEmail = email.trim().toLowerCase();

    try {
      const credential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
      return {
        ok: true,
        uid: credential.user?.uid,
        email: credential.user?.email ?? normalizedEmail,
      };
    } catch (error) {
      const code = error?.code;

      if (
        code === 'auth/wrong-password' ||
        code === 'auth/invalid-credential' ||
        code === 'auth/invalid-email' ||
        code === 'auth/user-not-found'
      ) {
        return { ok: false, reason: 'invalid-credentials' };
      }

      throw error;
    }
  },
  /**
   * Registers a new user account.
   * @param {string} email - The user's email address.
   * @param {string} password - The user's password.
   * @returns {Promise<AuthResult>} Registration result payload.
   */
  registerUser: async (email, password) => {
    const auth = getFirebaseAuth();
    const normalizedEmail = email.trim().toLowerCase();

    try {
      const credential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
      return {
        ok: true,
        uid: credential.user?.uid,
        email: credential.user?.email ?? normalizedEmail,
      };
    } catch (error) {
      if (error?.code === 'auth/email-already-in-use') {
        return { ok: false, reason: 'email-already-in-use' };
      }

      throw error;
    }
  },
  /**
   * Signs out the current Firebase Auth user.
   * @returns {Promise<void>}
   */
  signOutUser: async () => {
    const auth = getFirebaseAuth();
    await signOut(auth);
  },
  /**
   * Gets the current authenticated user.
   * @returns {{ uid: string, email: string } | null} The user when signed in, otherwise null.
   */
  getCurrentUser: () => {
    const auth = getFirebaseAuth();
    const user = auth.currentUser;

    if (!user?.uid) {
      return null;
    }

    return { uid: user.uid, email: user.email ?? '' };
  },
});

export default createAuthRemoteDataSource;
