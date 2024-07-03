# Offline Data Persistence Android App

This project demonstrates how to build an Android application with offline data persistence capabilities, similar to Google Keep and WhatsApp. The application utilizes a real-time database that ensures data is persistently stored locally even when the app is offline or restarted.

## Problem solving
In modern mobile applications, ensuring data persistence is crucial for a seamless user experience. This project showcases the implementation of an Android app with robust offline persistence features. By maintaining a local copy of data alongside cloud storage, the app guarantees data availability regardless of network conditions.

## Features
* <b>Offline Data Storage</b>: tore and sync data with our NoSQL cloud database. Data is synced across all clients in realtime, and remains available when your app goes offline.
* <b>Real-Time Database</b>: Synchronize local data with the cloud when the device goes online..
* <b>Auto Sync</b>: Automatically updates cloud data with local changes once the connection is restored.
* <b>User-Friendly Interface</b>: Simple and intuitive UI for managing data entries.

## Technology used 
1. Firebase Realtime Database(https://firebase.google.com/docs/database) -Store and sync data with our NoSQL cloud database. Data is synced across all clients in realtime, and remains available when your app goes offline. 
2. React Native Firebase(https://rnfirebase.io/) - firebase SDK 
3. React Native Async storage (https://react-native-async-storage.github.io/async-storage/docs/install/) - storing auth tokens.
4. NoSQL database
5. React Native Paper(https://callstack.github.io/react-native-paper/) - Cross-platform Material Design for React Native
6. Figma - for prototype design


## Get started
### Setup
1. Set Up Firebase Project and Realtime Database
* Create a Firebase Project: Go to the Firebase Console.Click on "Add Project" and follow the steps to create a new project.
* Add Realtime Database:Go project overview.Create an app choose web.In your Firebase project, navigate to the "Database" section in the left-hand menu. Click on "Create Database" in the Realtime Database section.Choose the location for your database and set the security rules. For development purposes, you can start in test mode.
  
2. Add Firebase SDK to Your React Native Project. Install the Firebase packages: Ensure you have installed the necessary Firebase packages:
  ```bash
  npm install @react-native-firebase/app @react-native-firebase/database
   ```
3. Initialize Firebase in Your App:
You need to initialize Firebase in your app’s entry file (usually App.js or index).You can get the config of database from project you created in firebase console
 ```bash
import firebase from '@react-native-firebase/app';
import database from '@react-native-firebase/database';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

   ```
3. Ensure Configuration Files are Correctly Placed:
For Android: Ensure google-services.json is in the root directory.

4. Install other dependencies:
  
   ```bash
   npm install @react-native-community/netinfo @react-native-paper @react-navigation/native @react-native-async-storage/async-storage
   ```

5. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go)(won't work requires development build to work)

You can start developing by editing the files inside the **src/** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## App shots (Android Emulator os android version 10)


## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.


