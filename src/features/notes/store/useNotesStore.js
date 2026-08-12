import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { Alert, ToastAndroid } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import createAuthRemoteDataSource from '../../auth/data/datasources/authRemoteDataSource';
import createAuthRepository from '../../auth/data/repositories/authRepository';
import createGetCurrentUserEmailUseCase from '../../auth/domain/usecases/getCurrentUserEmailUseCase';
import createRegisterUserUseCase from '../../auth/domain/usecases/registerUserUseCase';
import createSignInUserUseCase from '../../auth/domain/usecases/signInUserUseCase';
import createSignOutUserUseCase from '../../auth/domain/usecases/signOutUserUseCase';
import createNotesRemoteDataSource from '../data/datasources/notesRemoteDataSource';
import createNotesRepository from '../data/repositories/notesRepository';
import createAddNoteUseCase from '../domain/usecases/addNoteUseCase';
import createDeleteNoteUseCase from '../domain/usecases/deleteNoteUseCase';
import createObserveNotesByEmailUseCase from '../domain/usecases/observeNotesByEmailUseCase';
import createUpdateNoteUseCase from '../domain/usecases/updateNoteUseCase';
import logger from '../../../shared/utils/logger';

const STORAGE_KEY = 'notes-storage';
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

const authRemoteDataSource = createAuthRemoteDataSource();
const authRepository = createAuthRepository(authRemoteDataSource);
const signInUser = createSignInUserUseCase(authRepository);
const registerUser = createRegisterUserUseCase(authRepository);
const signOutUser = createSignOutUserUseCase(authRepository);
const getCurrentUserEmail = createGetCurrentUserEmailUseCase(authRepository);

const notesRemoteDataSource = createNotesRemoteDataSource();
const notesRepository = createNotesRepository(notesRemoteDataSource);
const observeNotesByEmail = createObserveNotesByEmailUseCase(notesRepository);
const addNote = createAddNoteUseCase(notesRepository);
const updateNote = createUpdateNoteUseCase(notesRepository);
const deleteNote = createDeleteNoteUseCase(notesRepository);

const defaultState = {
  appTheme: '#F7B518',
  textTheme: 'black',
  isLoading: true,
  isLogin: false,
  usrMail: '',
  hasInternet: null,
  notes: [],
};

/**
 * Global app store for auth, notes, and UI state.
 */
const useNotesStore = create(
  persist(
    (set, get) => ({
      ...defaultState,
      setAppTheme: (appTheme) => set({ appTheme }),
      setTextTheme: (textTheme) => set({ textTheme }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setIsLogin: (isLogin) => set({ isLogin }),
      setUsrMail: (usrMail) => set({ usrMail }),
      setHasInternet: (hasInternet) => set({ hasInternet }),
      setNotes: (notes) => set({ notes }),
      resetSession: () => set({ isLogin: false, usrMail: '', notes: [] }),
      showFeedback: (msg) => {
        ToastAndroid.showWithGravity(msg, ToastAndroid.LONG, ToastAndroid.BOTTOM);
      },
      syncAuthSession: () => {
        const currentEmail = getCurrentUserEmail();

        if (currentEmail) {
          set({ isLogin: true, usrMail: currentEmail });
          return currentEmail;
        }

        set({ isLogin: false, usrMail: '' });
        return '';
      },
      /**
       * Signs in an existing user.
       * @param {string} email - User email.
       * @param {string} password - User password.
       * @returns {Promise<boolean>} True when login succeeded.
       */
      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const result = await signInUser(email, password);

          if (result.ok) {
            set({ isLogin: true, usrMail: result.email ?? email, isLoading: false });
            return true;
          }

          set({ isLoading: false });
          get().showFeedback('Incorrect email or password.');
          return false;
        } catch (error) {
          logger.error('Login failed', error);
          get().showFeedback('Login failed. Check network or Firebase rules.');
          set({ isLoading: false });
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
        if (!PASSWORD_REGEX.test(password)) {
          get().showFeedback(
            'Password must be at least 8 characters and include a letter, number, and special character',
          );
          return false;
        }

        set({ isLoading: true });
        try {
          const result = await registerUser(email, password);

          if (result.ok) {
            set({ isLogin: true, usrMail: result.email ?? email, isLoading: false });
            get().showFeedback('Account created successfully.');
            return true;
          }

          set({ isLoading: false });
          if (result.reason === 'email-already-in-use') {
            get().showFeedback('Email already in use. Try login instead.');
          } else {
            get().showFeedback('Registration failed.');
          }
          return false;
        } catch (error) {
          logger.error('Registration failed', error);
          get().showFeedback('Registration failed. Check network or Firebase rules.');
          set({ isLoading: false });
          return false;
        }
      },
      logout: async () => {
        try {
          await signOutUser();
        } catch (error) {
          logger.error('Logout failed', error);
        } finally {
          set({ isLogin: false, usrMail: '', notes: [], isLoading: false });
        }
      },
      watchNotes: (email) => {
        set({ isLoading: true });
        return observeNotesByEmail(email, (notesSnapshot) => {
          if (!notesSnapshot) {
            set({ notes: [], isLoading: false });
            return;
          }

          const notesList = Object.keys(notesSnapshot).map((key) => ({
            id: key,
            ...notesSnapshot[key],
          }));
          set({ notes: notesList, isLoading: false });
        });
      },
      createNote: async (title, description) => {
        const email = get().usrMail;
        await addNote({ title, description, email });
      },
      editNote: async (id, title, description) => {
        await updateNote({ id, title, description });
      },
      removeNote: async (id) => {
        await deleteNote(id);
      },
      confirmDelete: (id) =>
        new Promise((resolve) => {
          Alert.alert(
            'Delete Confirmation',
            'Are you sure you want to delete this item?',
            [
              {
                text: 'Cancel',
                onPress: () => resolve(false),
                style: 'cancel',
              },
              {
                text: 'Delete',
                onPress: async () => {
                  await get().removeNote(id);
                  resolve(true);
                },
                style: 'destructive',
              },
            ],
            { cancelable: true },
          );
        }),
      startNetworkListener: () => {
        const updateInternetStatus = (state) => {
          const connected = state.isConnected === true;
          const reachable = state.isInternetReachable !== false;

          set({
            hasInternet: connected && reachable,
          });
        };

        const unsubscribe = NetInfo.addEventListener(updateInternetStatus);
        NetInfo.fetch().then(updateInternetStatus);
        return unsubscribe;
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        appTheme: state.appTheme,
        textTheme: state.textTheme,
        isLogin: state.isLogin,
        usrMail: state.usrMail,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setIsLoading(false);
      },
    },
  ),
);

export default useNotesStore;
