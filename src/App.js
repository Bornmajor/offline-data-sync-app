import React, { useEffect } from 'react';
import { registerRootComponent } from 'expo';
import { StatusBar } from 'react-native';
import MainNavigation from './navigation/MainNavigation';
import useNotesStore from './features/notes/store/useNotesStore';

if (!__DEV__) {
  console.log = () => {};
  console.info = () => {};
  console.warn = () => {};
  console.debug = () => {};
  console.error = () => {};
}

/**
 * App bootstrap component.
 */
export default function App() {
  useEffect(() => {
    const store = useNotesStore.getState();
    const unsubscribe = store.startNetworkListener();
    store.syncAuthSession();

    return unsubscribe;
  }, []);

  return (
    <>
      <StatusBar />
      <MainNavigation />
    </>
  );
}

registerRootComponent(App);
