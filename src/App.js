import React, { useEffect } from 'react';
import { registerRootComponent } from 'expo';
import { StatusBar } from 'react-native';
import MainNavigation from './navigation/MainNavigation';
import useAuthStore from './features/auth/store/useAuthStore';
import useUiStore from './shared/store/useUiStore';

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
    const stopNetworkListener = useUiStore.getState().startNetworkListener();
    useAuthStore.getState().syncAuthSession();

    return stopNetworkListener;
  }, []);

  return (
    <>
      <StatusBar />
      <MainNavigation />
    </>
  );
}

registerRootComponent(App);
