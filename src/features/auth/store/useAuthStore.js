import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import useUiStore from '../../../shared/store/useUiStore';
import logger from '../../../shared/utils/logger';
import useNotesStore from '../../notes/store/useNotesStore';
import { getCurrentUser, registerUser, signInUser, signOutUser } from '../container';

const STORAGE_KEY = 'auth-storage';
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

const defaultState = {
  isLogin: false,
  usrMail: '',
  usrId: '',
};

/**
 * Authentication state and session lifecycle. Owns only identity; notes and UI
 * state live in their own stores.
 */
const useAuthStore = create(
  persist(
    (set, get) => ({
      ...defaultState,
      /** Clears the local session (does not call Firebase). */
      resetSession: () => {
        set({ isLogin: false, usrMail: '', usrId: '' });
        useNotesStore.getState().clearNotes();
      },
      /**
       * Rehydrates session state from the current Firebase user, if any.
       * @returns {{ uid: string, email: string } | null}
       */
      syncAuthSession: () => {
        const user = getCurrentUser();

        if (user?.uid) {
          set({ isLogin: true, usrMail: user.email, usrId: user.uid });
          return user;
        }

        set({ isLogin: false, usrMail: '', usrId: '' });
        return null;
      },
      /**
       * Signs in an existing user.
       * @param {string} email - User email.
       * @param {string} password - User password.
       * @returns {Promise<boolean>} True when login succeeded.
       */
      login: async (email, password) => {
        const ui = useUiStore.getState();
        ui.setIsLoading(true);

        try {
          const result = await signInUser(email, password);

          if (result.ok) {
            set({ isLogin: true, usrMail: result.email ?? email, usrId: result.uid ?? '' });
            ui.setIsLoading(false);
            return true;
          }

          ui.setIsLoading(false);
          ui.showFeedback('Incorrect email or password.');
          return false;
        } catch (error) {
          logger.error('Login failed', error);
          ui.showFeedback('Login failed. Check network or Firebase rules.');
          ui.setIsLoading(false);
          return false;
        }
      },
      /**
       * Registers a new user.
       * @param {string} email - User email.
       * @param {string} password - User password.
       * @returns {Promise<boolean>} True when registration succeeded.
       */
      register: async (email, password) => {
        const ui = useUiStore.getState();

        if (!PASSWORD_REGEX.test(password)) {
          ui.showFeedback(
            'Password must be at least 8 characters and include a letter, number, and special character',
          );
          return false;
        }

        ui.setIsLoading(true);

        try {
          const result = await registerUser(email, password);

          if (result.ok) {
            set({ isLogin: true, usrMail: result.email ?? email, usrId: result.uid ?? '' });
            ui.setIsLoading(false);
            ui.showFeedback('Account created successfully.');
            return true;
          }

          ui.setIsLoading(false);
          if (result.reason === 'email-already-in-use') {
            ui.showFeedback('Email already in use. Try login instead.');
          } else {
            ui.showFeedback('Registration failed.');
          }
          return false;
        } catch (error) {
          logger.error('Registration failed', error);
          ui.showFeedback('Registration failed. Check network or Firebase rules.');
          ui.setIsLoading(false);
          return false;
        }
      },
      /** Signs the user out and clears local session + notes. */
      logout: async () => {
        try {
          await signOutUser();
        } catch (error) {
          logger.error('Logout failed', error);
        } finally {
          get().resetSession();
          useUiStore.getState().setIsLoading(false);
        }
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isLogin: state.isLogin,
        usrMail: state.usrMail,
        usrId: state.usrId,
      }),
    },
  ),
);

export default useAuthStore;
