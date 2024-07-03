import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import {MyContextProvider} from './context/context';
import { registerRootComponent } from 'expo';
import { StatusBar } from 'react-native';
import MainNavigation from './navigation/MainNavigation';
import { PaperProvider } from 'react-native-paper';
import { SplashScreen } from 'expo';

export default function App() {
 
  return (
    <>
   <MyContextProvider>

    <StatusBar />
    <PaperProvider>
       <MainNavigation />
    </PaperProvider>
   

   </MyContextProvider>

    </>
  
  )
}

registerRootComponent(App); // Registering the root component