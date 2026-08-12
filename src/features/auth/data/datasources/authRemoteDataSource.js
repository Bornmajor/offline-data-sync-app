import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { getFirebaseAuth } from '../../../../shared/firebase/firebaseClient';

/**
 * Creates the auth data source used to sign in, register, and sign out users.
 */
const createAuthRemoteDataSource = () => ({
  /**
   * Signs in an existing user.
   * @param {string} email - The user's email address.
   * @param {string} password - The user's password.
   * @returns {Promise<{ ok: boolean, email?: string, reason?: string }>} Auth result payload.
   */
  signInUser: async (email, password) => {
    const auth = getFirebaseAuth();
    const normalizedEmail = email.trim().toLowerCase();

    try {
      const credential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
      return { ok: true, email: credential.user?.email ?? normalizedEmail };
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
   * @returns {Promise<{ ok: boolean, email?: string, reason?: string }>} Registration result payload.
   */
  registerUser: async (email, password) => {
    const auth = getFirebaseAuth();
    const normalizedEmail = email.trim().toLowerCase();

    try {
      const credential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
      return { ok: true, email: credential.user?.email ?? normalizedEmail };
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
   * Gets the current authenticated user's email.
   * @returns {string} Email when signed in, otherwise an empty string.
   */
  getCurrentUserEmail: () => {
    const auth = getFirebaseAuth();
    return auth.currentUser?.email ?? '';
  },
});

export default createAuthRemoteDataSource;
