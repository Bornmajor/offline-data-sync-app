import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { showAppFeedback } from '../feedback/feedbackAdapter';

const STORAGE_KEY = 'ui-storage';

const defaultState = {
  appTheme: '#F7B518',
  textTheme: 'black',
  isLoading: true,
  /** @type {boolean | null} */
  hasInternet: null,
};

/**
 * UI / presentation state: theme, global loading flag, connectivity, and the
 * entry point for user-facing feedback. Deliberately holds no auth or domain
 * data so screens can subscribe to visual state without pulling in the rest.
 */
const useUiStore = create(
  persist(
    (set) => ({
      ...defaultState,
      /** @param {string} appTheme */
      setAppTheme: (appTheme) => set({ appTheme }),
      /** @param {string} textTheme */
      setTextTheme: (textTheme) => set({ textTheme }),
      /** @param {boolean} isLoading */
      setIsLoading: (isLoading) => set({ isLoading }),
      /** @param {boolean | null} hasInternet */
      setHasInternet: (hasInternet) => set({ hasInternet }),
      /**
       * Emits a message to the global snackbar.
       * @param {string} message
       */
      showFeedback: (message) => showAppFeedback(message),
      /**
       * Starts tracking connectivity and keeps `hasInternet` in sync.
       * @returns {() => void} Unsubscribe function.
       */
      startNetworkListener: () => {
        const updateInternetStatus = (state) => {
          const connected = state.isConnected === true;
          const reachable = state.isInternetReachable !== false;
          set({ hasInternet: connected && reachable });
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
      }),
      onRehydrateStorage: () => (state) => {
        state?.setIsLoading(false);
      },
    },
  ),
);

export default useUiStore;
