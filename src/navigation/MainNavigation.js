import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import Home from '../features/notes/screens/Home';
import Login from '../features/auth/screens/Login';
import Register from '../features/auth/screens/Register';
import Settings from '../features/settings/screens/Settings';
import Note from '../features/notes/screens/Note';
import useNotesStore from '../features/notes/store/useNotesStore';

const Stack = createStackNavigator();

/**
 * Builds the root navigation tree for logged-in and guest users.
 */
const MainNavigation = () => {
  const appTheme = useNotesStore((state) => state.appTheme);
  const isLogin = useNotesStore((state) => state.isLogin);

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator
          key={isLogin ? 'app' : 'guest'}
          initialRouteName={isLogin ? 'home' : 'login'}
          screenOptions={{
            headerStyle: { backgroundColor: appTheme, height: 70 },
            headerTintColor: 'white',
            headerTitleStyle: {
              fontSize: 25,
            },
          }}
        >
          {isLogin ? (
            <>
              <Stack.Screen name="home" component={Home} options={{ title: 'Notedly App' }} />
              <Stack.Screen name="note" component={Note} options={{ title: 'Note 1' }} />
              <Stack.Screen name="settings" component={Settings} options={{ title: 'Settings' }} />
            </>
          ) : (
            <>
              <Stack.Screen name="login" component={Login} options={{ headerShown: false }} />
              <Stack.Screen name="register" component={Register} options={{ title: 'Register' }} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default MainNavigation;
