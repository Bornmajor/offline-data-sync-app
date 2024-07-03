import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native';
import Home from '../screens/Home';
import Login from '../screens/Login';
import Settings from '../screens/Settings';
import { useContext } from 'react';
import MyContext from '../context/context';
import { PaperProvider } from 'react-native-paper';
import Note from '../screens/Note';

const MainNavigation = () => {
    const Stack = createStackNavigator();
    const {appTheme,isLogin} = useContext(MyContext);

  return (
    <PaperProvider>
    <NavigationContainer>
        <Stack.Navigator
        initialRouteName='login'
        screenOptions={{
            headerStyle:{backgroundColor:appTheme,height:70},
            headerTintColor:'white',
            headerTitleStyle: {
              fontSize: 25, // Adjust the font size here
            },

        }}>
       {isLogin ?  (
        <>
         <Stack.Screen
            name='home'
            component={Home}
            options={{               
                title:'Notedly App',  
            }}
            
            />
               <Stack.Screen
            name='note'
            component={Note}
            options={{
                title:'Note 1',  
            }}
            
            /> 
               <Stack.Screen
            name='settings'
            component={Settings}
            options={{
                title:'Settings',  
            }}
            
            /> 
        </>
       ):
         <Stack.Screen
            name='login'
            component={Login}
            options={{ headerShown: false }} // Hides the header for Details screen
            
            />
        

       }
            

        
        </Stack.Navigator>
    </NavigationContainer>
    </PaperProvider>
  )
}

export default MainNavigation