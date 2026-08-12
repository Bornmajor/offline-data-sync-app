# Offline Data Sync App

A React Native / Expo Android app that demonstrates offline-first note syncing with Firebase Realtime Database. The app keeps notes available while offline, then syncs changes when connectivity returns.

## What is already implemented

- Separate email/password login and registration flows.
- Notes CRUD: create, edit, delete, and browse notes.
- Offline-aware sync through Firebase Realtime Database.
- Network status tracking with `@react-native-community/netinfo`.
- Local UI/session persistence with Zustand + AsyncStorage.
- Theme and session state persisted across app restarts.
- Native Firebase configuration for Android through `google-services.json`.
- Release-safe logging with secret redaction in development.
- Registration password policy enforced (min 8 chars with letter, number, and special character).

## Architecture

The app follows a layered flow:

`DataSource -> Repository -> UseCase -> Zustand -> UI`

That means:

- Firebase access lives in datasource files.
- Repositories wrap datasource calls.
- Use cases expose domain actions.
- Zustand stores app state and orchestrates use cases.
- Screens and components only talk to the store.

## Tech Stack

- Expo / React Native
- React Navigation
- Firebase Realtime Database
- Firebase JS SDK (`firebase` package)
- Zustand
- AsyncStorage
- NetInfo
- React Native Paper
- Jest + React Test Renderer

## Project Structure

```text
src/
  App.js
  features/
    auth/
      data/
        datasources/
        repositories/
      domain/
        usecases/
      screens/
    notes/
      components/
      data/
        datasources/
        repositories/
      domain/
        usecases/
      screens/
      store/
    settings/
      screens/
  navigation/
  shared/
    components/
    utils/
  test/
```

## Firebase Setup

This project currently initializes Firebase through the JavaScript SDK in [src/shared/firebase/firebaseClient.js](src/shared/firebase/firebaseClient.js).

- [app.json](app.json) points Android to [google-services.json](google-services.json) for native Android build metadata.
- The app also parses [google-services.json](google-services.json) in JS to populate `initializeApp(...)` config values (`apiKey`, `appId`, `projectId`, `databaseURL`, and related fields).
- This keeps one Firebase source of truth for Android and avoids duplicating those values in code.

If you want separate environments, keep per-environment Firebase config files and switch them via Expo config/EAS build profiles.

### Platform caveats

- Android: the current flow works as-is because [google-services.json](google-services.json) is available and mapped in [app.json](app.json).
- iOS: this repo does not include a `GoogleService-Info.plist` path/config; add iOS Firebase config and update Expo settings before shipping iOS.
- Web: [google-services.json](google-services.json) is Android-specific. For web builds, provide Firebase JS config through environment variables or a web-specific config module.
- Dependency note: `@react-native-firebase/*` packages are installed, but app runtime in this repository uses the Firebase JS SDK path in [src/shared/firebase/firebaseClient.js](src/shared/firebase/firebaseClient.js).

## Getting Started

### 1. Install dependencies

```bash
npm install
```

If you are setting up Firebase manually for this code path, make sure the JS SDK is installed:

```bash
npm install firebase
```

Optional: if you later migrate runtime calls to native Firebase modules, then install `@react-native-firebase/app` and `@react-native-firebase/database` as part of that migration.


### 2. Configure Firebase

- Create a Firebase project.
- Enable Realtime Database.
- Download the Android `google-services.json` file.
- Place it at the project root.
- Keep [app.json](app.json) configured with `android.googleServicesFile`.

### 3. Start the app

```bash
npx expo start -c
```

Because runtime data/auth calls use the Firebase JS SDK, you can run the app in Expo Go for Android flows. If you later switch runtime calls to `@react-native-firebase/*`, use a development build.

### 4. Build Android

The existing EAS profiles in [eas.json](eas.json) include:

- `preview3` for a development client build
- `preview` / `preview4` for internal builds
- `production` for release builds

Example:

```bash
eas build --profile preview3 --platform android
```


## Testing

### Run tests

Project script (watch mode):

```bash
npm test
```

One-time run (recommended for CI/local verification):

```bash
npx jest --watchAll=false
```

### Targeted test suites

The project includes unit tests for key layers:

- Repository layer
  - `src/features/auth/data/repositories/__tests__/authRepository.test.js`
  - `src/features/notes/data/repositories/__tests__/notesRepository.test.js`
- Datasource layer
  - `src/features/auth/data/datasources/__tests__/authRemoteDataSource.test.js`
  - `src/features/notes/data/datasources/__tests__/notesRemoteDataSource.test.js`
- Use case layer
  - `src/features/auth/domain/usecases/__tests__/authUseCases.test.js`
  - `src/features/notes/domain/usecases/__tests__/notesUseCases.test.js`
- Zustand business logic
  - `src/features/notes/store/__tests__/useNotesStore.test.js`
- Shared widgets/components
  - `src/shared/components/__tests__/Loader.test.js`
  - `src/shared/components/__tests__/PasswordInput.test.js`

Run only these suites:

```bash
npx jest --runInBand \
  src/features/auth/data/datasources/__tests__/authRemoteDataSource.test.js \
  src/features/notes/data/datasources/__tests__/notesRemoteDataSource.test.js \
  src/features/auth/domain/usecases/__tests__/authUseCases.test.js \
  src/features/notes/domain/usecases/__tests__/notesUseCases.test.js \
  src/features/auth/data/repositories/__tests__/authRepository.test.js \
  src/features/notes/data/repositories/__tests__/notesRepository.test.js \
  src/features/notes/store/__tests__/useNotesStore.test.js \
  src/shared/components/__tests__/Loader.test.js \
  src/shared/components/__tests__/PasswordInput.test.js
```


## CI/CD (GitHub Actions)

APK release automation is configured with the workflow at [.github/workflows/build-apk.yml](.github/workflows/build-apk.yml).

### What the workflow does

- Installs dependencies
- Runs tests
- Builds Android APK with EAS
- Downloads the APK artifact
- Publishes the APK to GitHub Releases

### Triggers

- Push to `main` (creates a release with auto tag format `v0.0.0-main-<run_number>`)
- Tag push matching `v*` (for example: `v1.0.1`)
- Manual run from Actions (`workflow_dispatch`) with selectable EAS profile

### Required GitHub Secret

Add this repository secret before running the workflow:

- `EXPO_TOKEN`: Expo access token used by EAS CLI in CI

### Publish an APK release

```bash
git tag v1.0.1
git push origin v1.0.1
```

After the workflow finishes, the APK is attached to the matching GitHub Release tag.

## Screens in the App

- Login / registration screen
- Notes list screen
- Note editor screen
- Settings screen

## Notes

- Firebase console keys should not be hardcoded in UI files.
- Console logging is disabled in release builds and redacted in development.
- The main app entry is [src/App.js](src/App.js).

## Learn More

- [Expo docs](https://docs.expo.dev/)
- [Expo development builds](https://docs.expo.dev/develop/development-builds/introduction/)
- [Firebase Realtime Database](https://firebase.google.com/docs/database)
- [React Native Firebase](https://rnfirebase.io/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)

## Screenshots

### Splash & Auth Screen

![offline-sync-figma-preview](https://github.com/Bornmajor/offline-data-sync-app/assets/98744068/0d1e1a65-d3e2-4659-a409-47dfea793395)

<img width="327" alt="studio64_CuuGwCYE0t" src="https://github.com/Bornmajor/offline-data-sync-app/assets/98744068/5deb50dc-e69c-48d1-b1c7-7acfb722a8a8">
<img width="327" alt="studio64_MddeKBOdCM" src="https://github.com/Bornmajor/offline-data-sync-app/assets/98744068/e449e953-23b6-4f30-9756-960ce3040e57">

### Home Screens

<img width="327" alt="studio64_X04qLq6rL3" src="https://github.com/Bornmajor/offline-data-sync-app/assets/98744068/4558a6d6-9b24-4cc3-9cf6-220edefee264">
<img width="327" alt="studio64_oLfS7GQ0Wz" src="https://github.com/Bornmajor/offline-data-sync-app/assets/98744068/0aa12033-8fb4-4c29-9e50-82a6b256e1f5">
<img width="327" alt="studio64_NffQClFk1b" src="https://github.com/Bornmajor/offline-data-sync-app/assets/98744068/8730a523-40f4-4c91-bcc3-eadebcebec3e">
<img width="327" alt="studio64_60sHmSZ7cn" src="https://github.com/Bornmajor/offline-data-sync-app/assets/98744068/19c42747-bc6b-4ffc-8b4e-3c15b3cf93e4">
<img width="327" alt="studio64_xOKTO8tb6q" src="https://github.com/Bornmajor/offline-data-sync-app/assets/98744068/2b75d973-e57f-4bca-ae79-31db511099b7">
<img width="327" alt="studio64_LzwtyRNs01" src="https://github.com/Bornmajor/offline-data-sync-app/assets/98744068/684c08ec-5f45-4292-90d0-70fa994c9b2f">

### Online vs Offline Mode

<img width="327" alt="studio64_oLfS7GQ0Wz" src="https://github.com/Bornmajor/offline-data-sync-app/assets/98744068/0aa12033-8fb4-4c29-9e50-82a6b256e1f5">
<img width="327" alt="studio64_60sHmSZ7cn" src="https://github.com/Bornmajor/offline-data-sync-app/assets/98744068/19c42747-bc6b-4ffc-8b4e-3c15b3cf93e4">

### Others

<img width="327" alt="studio64_dXVoQYmPF9" src="https://github.com/Bornmajor/offline-data-sync-app/assets/98744068/27c674f5-e5a2-49f3-b20c-c5a215c3c4e0">
