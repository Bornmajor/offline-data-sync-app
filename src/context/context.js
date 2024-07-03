// MyContext.js
import React, { createContext, useContext, useState,useEffect } from 'react';
import { Share,Alert,ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firebase from '@react-native-firebase/app';
import database from '@react-native-firebase/database';
import NetInfo from '@react-native-community/netinfo';


const MyContext = createContext();

export const MyContextProvider = (props) => {
  const [appTheme, setAppTheme] = useState('#F7B518');
  const [textTheme,setTextTheme] = useState("black");
  const [isLoading,setIsLoading] = useState(true);
  const [isLogin,setIsLogin] = useState(false);

  const [usrMail,setUsrMail] = useState('');
  const [usrPwd,setUsrPwd] = useState('');
  const [notesList,setNotesList] = useState([]);
  const [hasInternet, setHasInternet] = useState(null);



const firebaseConfig = {
  apiKey: "",
  authDomain: "offline-sync-app.firebaseapp.com",
  databaseURL: "https://offline-sync-app-default-rtdb.firebaseio.com",
  projectId: "offline-sync-app",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

  useEffect(()=>{
  // Enable offline persistence
  if(isLogin){
  database().setPersistenceEnabled(true);   
  }
 

  },[]);

  useEffect(() => {
    // Function to update the internet status
    const updateInternetStatus = (state) => {
      setHasInternet(state.isConnected && state.isInternetReachable);
    };

    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener(updateInternetStatus);
    console.log('Network changed');

    // Check the initial connection status
    NetInfo.fetch().then(updateInternetStatus);

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);




  const addUser = async (email, password) => {

    const usersRef = database().ref('/users');
    const snapshot = await usersRef.once('value');
    const data = snapshot.val();

    // Check if email exists
    let emailExists = false;
    let existingUserKey = null;
    for (let key in data) {
      if (data[key].email === email) {
        emailExists = true;
        existingUserKey = key;
        break;
      }
    }

    if (emailExists) {
      // Verify the password if the email exists
      if (data[existingUserKey].password === password) {
        showFeedback('User authenticated successfully.');

      } else {
        showFeedback('Incorrect password.');
        return false;
      }
    } else {
      // Add new email and password if the email does not exist
      const newUserRef = usersRef.push();
      newUserRef.set({ email, password });
     
      showFeedback('User added successfully.');
    }
      return true;
  };


  const removeAuthData = async () => {
    try {
        await AsyncStorage.removeItem('email');
        await AsyncStorage.removeItem('pwd');

        console.log('Value removed successfully');
        setIsLogin(false);

    } catch (error) {
        console.error('Error removing value:', error);
    }
};


  const storeAuthData = async (email,pwd) => {
    try {
      const result =  await addUser(email,pwd);


      console.log(result);
      //retrieve data
      if(result){
      await AsyncStorage.setItem('email', email);
      await AsyncStorage.setItem('pwd', pwd);

      console.log('Result',result);
      getAuthData();  
      }
      

    

    } catch (e) {
      console.log(e);
      setIsLoading(true);

      // saving error
    }
  };

  const getAuthData = async () => {
    try {
      const email = await AsyncStorage.getItem('email');
      const pwd = await AsyncStorage.getItem('pwd');
      if (email !== null) {
        // value previously stored
        setIsLogin(true);
        setIsLoading(false);


        //set global states
         setUsrMail(email);
         setUsrPwd(pwd);

         showFeedback('Welcome');
      }else{
        // setIsLoading(false);
      }
    } catch (e) {
      console.log(e);
      setIsLoading(true);
      // error reading value
    }
  };

  useEffect(()=>{
    getAuthData();
  },[isLoading])

    const infoAlert = (msg) =>
      Alert.alert('Media info', msg, [
        {text: 'OK', onPress: () => console.log('OK Pressed')},   
      ],
      {
        cancelable: true,
      },);

      const showFeedback = (msg) =>{
        ToastAndroid.showWithGravity(
            msg,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
        );
    }

    const deleteNote = async (id) => {

      const noteRef = database().ref(`/notes/${id}`);
      await noteRef.remove();
      
     
    };

        // Function to show a confirmation dialog
  const confirmDelete = (id) => {
    return new Promise((resolve, reject) => {
      Alert.alert(
        'Delete Confirmation',
        'Are you sure you want to delete this item?',
        [
          {
            text: 'Cancel',
            onPress: () => {
              console.log('Cancel Pressed');
              resolve(false); // Resolve the promise with false if Cancel is pressed
            },
            style: 'cancel',
          },
          {
            text: 'Delete',
            onPress: () => {
              
              deleteNote(id);
           
              resolve(true); // Resolve the promise with true if Delete is pressed
            },
            style: 'destructive',
          },
        ],
        { cancelable: true }
      );
    });
  };

          

  return (
    <MyContext.Provider
      value={{
        appTheme,
        setAppTheme,
        textTheme,
        setTextTheme,
        isLoading,setIsLoading,
        isLogin,setIsLogin,
        showFeedback,
        storeAuthData,
        usrMail,usrPwd,
        removeAuthData,
        hasInternet,
        confirmDelete  

      }}
    >
      {props.children}
    </MyContext.Provider>
  );
};

export default MyContext;
