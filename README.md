# Offline Data Sync App

A React Native / Expo Android app that demonstrates offline-first note syncing with Firebase Realtime Database. The app keeps notes available while offline, then syncs changes when connectivity returns.

## What is already implemented

- Separate email/password login and registration flows.
- Notes CRUD: create, edit, delete, and browse notes.
- Offline-aware sync through Firebase Realtime Database.
- Network status tracking with `@react-native-community/netinfo`.
- Session/theme persistence with Zustand + AsyncStorage across app restarts.
- Per-user data isolation: notes live under `/notes/{uid}` and are enforced by
  Realtime Database security rules (`database.rules.json`), not client filtering.
- Native Firebase configuration for Android through `google-services.json`.
- Release-safe logging with secret redaction in development.
- Registration password policy enforced (min 8 chars with letter, number, and special character).

## Architecture

The app follows a one-directional layered flow:

`DataSource -> Repository -> UseCase -> Store (Zustand) -> UI`

- **DataSource** – the only place Firebase is touched (`data/datasources/`).
- **Repository** – a thin boundary that wraps a datasource (`data/repositories/`).
- **UseCase** – one domain action each (`domain/usecases/`).
- **Composition root** – `features/<feature>/container.js` wires
  datasource → repository → use case once, so stores depend only on ready-to-call
  use cases and never on how they are assembled.
- **Store** – Zustand state, split by concern (see below). Stores orchestrate
  use cases and hold no view logic.
- **UI** – screens/components read from stores and call store actions only.

### State is split by concern

| Store | Owns | Persisted |
| --- | --- | --- |
| `shared/store/useUiStore` | theme, global `isLoading`, connectivity, snackbar feedback | theme only |
| `features/auth/store/useAuthStore` | `isLogin`, `usrMail`, `usrId`, login/register/logout/session | session only |
| `features/notes/store/useNotesStore` | current note list + note CRUD actions | not persisted (source of truth is Firebase) |

Native confirmation dialogs live in `shared/feedback/confirmDialog.js` so state
modules stay free of UI concerns.

## Tech Stack

- Expo / React Native (Android)
- React Navigation (native stack)
- Firebase Realtime Database via the Firebase JS SDK (`firebase` package)
- Zustand (+ `persist` middleware over AsyncStorage)
- `@react-native-community/netinfo`
- React Native Paper
- Jest (`jest-expo`) + React Test Renderer
- Runtime code is `.js` annotated with JSDoc; `tsconfig.json` is included so
  editors surface those types. There is no build-time TS compilation step.

## Project Structure

```text
src/
  App.js                     # bootstrap: starts network listener + session sync
  features/
    auth/
      container.js           # composition root for auth
      data/{datasources,repositories}/
      domain/usecases/
      screens/               # Login, Register
      store/useAuthStore.js
    notes/
      container.js           # composition root for notes
      components/             # NoteCard
      data/{datasources,repositories}/
      domain/usecases/
      screens/               # Home, Note
      store/useNotesStore.js
    settings/
      screens/               # Settings
  navigation/                # MainNavigation (guest vs. app stacks)
  shared/
    components/               # Loader, PasswordInput
    feedback/                 # feedbackAdapter, GlobalSnackbar, confirmDialog
    firebase/                 # firebaseClient
    store/useUiStore.js
    utils/                    # logger (redacts secrets, silent in release)
```

## Firebase Setup

Firebase is initialized through the JavaScript SDK in
[src/shared/firebase/firebaseClient.js](src/shared/firebase/firebaseClient.js).

- [app.json](app.json) points Android to [google-services.json](google-services.json) for the native build.
- `firebaseClient.js` also reads [google-services.json](google-services.json) at runtime to build the
  `initializeApp(...)` config (`apiKey`, `appId`, `projectId`, `databaseURL`, …), so there is a single
  Firebase source of truth for the Android target.

## Security model

**`google-services.json` is committed on purpose.** The values it contains
(`apiKey`, `appId`, `projectId`, `databaseURL`) are *public client identifiers*,
not secrets — they ship inside every distributed APK and cannot be hidden from a
determined user. Firebase is designed around this; access control is enforced
server-side, not by keeping the config private.

What actually protects data:

1. **Firebase Authentication** – every request is made as a signed-in user; there
   is no anonymous access.
2. **Realtime Database security rules** – [database.rules.json](database.rules.json). Notes are stored
   under an owner-scoped path `/notes/{uid}/{noteId}`, and the rules grant read
   and write on `/notes/{uid}` **only** when `auth.uid === {uid}`. A user cannot
   read, query, or write another user's notes even with a hand-crafted request;
   the client-side code never has to be trusted for isolation. Field-level
   `.validate` rules also constrain note shape and size.

Deploy the rules with the Firebase CLI (config in [firebase.json](firebase.json)):

```bash
firebase deploy --only database
```

Other practices in the codebase:

- `console.*` is disabled entirely in release builds ([src/App.js](src/App.js)).
- [src/shared/utils/logger.js](src/shared/utils/logger.js) redacts `password` / `token` / `apiKey` / etc.
  (including nested and array values) before anything reaches the console in development.
- Registration enforces a password policy (min 8 chars, letter + number + special).
- Real secrets (e.g. `EXPO_TOKEN` for CI) live in GitHub Actions secrets, never in the repo.

### Platform note

This repo targets **Android**. iOS (`GoogleService-Info.plist`) and web (env-based
Firebase config) are not set up.

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Firebase

- Create a Firebase project and enable Realtime Database.
- Download the Android `google-services.json` and place it at the project root
  (kept wired through `android.googleServicesFile` in [app.json](app.json)).
- Enable Email/Password sign-in under Authentication.
- Deploy the security rules: `firebase deploy --only database`.

### 3. Start the app

```bash
npx expo start -c
```

Data/auth calls use the Firebase JS SDK, so Android flows run in Expo Go.

### 4. Build Android

EAS build profiles live in [eas.json](eas.json) (`preview` builds an APK, `production` a release build):

```bash
eas build --profile preview --platform android
```


## Testing

```bash
npm test          # watch mode
npm run test:ci   # single run + coverage (fails under the configured threshold)
```

`test:ci` enforces a global coverage floor (see `jest.coverageThreshold` in
[package.json](package.json)); framework glue (navigation, the Firebase client,
composition roots) is excluded from the measurement.

### What is covered

| Area | Suites |
| --- | --- |
| Datasource ↔ Firebase wiring | `authRemoteDataSource`, `notesRemoteDataSource` |
| Repository + use-case delegation | `authRepository`, `notesRepository`, `authUseCases`, `notesUseCases` |
| Auth store | `useAuthStore` – login/register/logout, weak-password rejection, session sync, cross-store note clearing |
| Notes store | `useNotesStore` – `toNotesList` snapshot→array transform, subscription lifecycle, blank-title guard, write-failure feedback |
| **Offline / connectivity** | `useUiStore` – `startNetworkListener` online/offline transitions and the initial `NetInfo.fetch()` result |
| Screens | `Login`, `Register` (validation + submit), `Settings` (logout), `NoteCard` (confirm→delete with owner id) |
| Shared | `logger` secret redaction, `feedbackAdapter` pub/sub, `confirmDialog`, `Loader`, `PasswordInput` |


## CI/CD (GitHub Actions)

APK release automation is configured with the workflow at [.github/workflows/build-apk.yml](.github/workflows/build-apk.yml).

### What the workflow does

- Installs dependencies
- Runs the test suite with coverage (`npm run test:ci`)
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

- The app entry point is [src/App.js](src/App.js), which starts the connectivity
  listener and rehydrates the Firebase session on mount.
- See the **Security model** section above for how secrets and data isolation are handled.

## Learn More

- [Expo docs](https://docs.expo.dev/)
- [Firebase Realtime Database](https://firebase.google.com/docs/database)
- [Realtime Database security rules](https://firebase.google.com/docs/database/security)
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
