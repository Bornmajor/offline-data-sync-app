# Offline Cloud data persistence android app

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
![offline-sync-figma-preview](https://github.com/Bornmajor/offline-data-sync-app/assets/98744068/0d1e1a65-d3e2-4659-a409-47dfea793395)

### Splash & Auth screen
<img width="327" alt="studio64_CuuGwCYE0t" src="https://github.com/Bornmajor/offline-data-sync-app/assets/98744068/5deb50dc-e69c-48d1-b1c7-7acfb722a8a8">
<img width="327" alt="studio64_MddeKBOdCM" src="https://github.com/Bornmajor/offline-data-sync-app/assets/98744068/e449e953-23b6-4f30-9756-960ce3040e57">

### Home screens
<img width="327" alt="studio64_X04qLq6rL3" src="https://github.com/Bornmajor/offline-data-sync-app/assets/98744068/4558a6d6-9b24-4cc3-9cf6-220edefee264">
<img width="327" alt="studio64_oLfS7GQ0Wz" src="https://github.com/Bornmajor/offline-data-sync-app/assets/98744068/0aa12033-8fb4-4c29-9e50-82a6b256e1f5">
<img width="327" alt="studio64_NffQClFk1b" src="https://github.com/Bornmajor/offline-data-sync-app/assets/98744068/8730a523-40f4-4c91-bcc3-eadebcebec3e">
<img width="327" alt="studio64_60sHmSZ7cn" src="https://github.com/Bornmajor/offline-data-sync-app/assets/98744068/19c42747-bc6b-4ffc-8b4e-3c15b3cf93e4">
<img width="327" alt="studio64_xOKTO8tb6q" src="https://github.com/Bornmajor/offline-data-sync-app/assets/98744068/2b75d973-e57f-4bca-ae79-31db511099b7">
<img width="327" alt="studio64_LzwtyRNs01" src="https://github.com/Bornmajor/offline-data-sync-app/assets/98744068/684c08ec-5f45-4292-90d0-70fa994c9b2f">

#### Online vs offline mode (showcase offline persistence capabilities)
<img width="327" alt="studio64_oLfS7GQ0Wz" src="https://github.com/Bornmajor/offline-data-sync-app/assets/98744068/0aa12033-8fb4-4c29-9e50-82a6b256e1f5">
<img width="327" alt="studio64_60sHmSZ7cn" src="https://github.com/Bornmajor/offline-data-sync-app/assets/98744068/19c42747-bc6b-4ffc-8b4e-3c15b3cf93e4">

### Others
<img width="327" alt="studio64_dXVoQYmPF9" src="https://github.com/Bornmajor/offline-data-sync-app/assets/98744068/27c674f5-e5a2-49f3-b20c-c5a215c3c4e0">


## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.


