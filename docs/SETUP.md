# Setup

## Requirements

- Node.js compatible with Expo SDK 57.
- npm.
- Expo CLI through `npx expo`.
- Expo Go or an emulator for mobile testing.

Expo SDK 57 targets React Native 0.86 and React 19.2.3.

## Install

```bash
npm install
```

## Start

```bash
npx expo start
```

Then choose one option from the Expo terminal:

- Press `a` for Android emulator.
- Press `i` for iOS simulator on macOS.
- Scan the QR code with Expo Go.
- Press `w` for web if web dependencies are available.

## Environment Variables

Phase 6B uses Expo public Firebase environment variables for real authentication.

Copy `.env.example` to `.env`, then fill approved Firebase project values:

- `EXPO_PUBLIC_FIREBASE_API_KEY`
- `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
- `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `EXPO_PUBLIC_FIREBASE_APP_ID`

Do not commit real Firebase credentials.

## Firebase Console

Enable Email/Password authentication in Firebase Console before live auth testing.

Firestore and Storage remain out of scope for Phase 6B.

## TypeScript Check

```bash
npm run typecheck
```

## Firebase Status

Firebase Authentication, Firestore repositories, Firebase Storage helpers, Firestore notifications, dummy payment records, customer/vendor/admin/rider route groups, and realtime order listeners are implemented through Phase 9. Backend APIs, real payment gateways, push notification delivery, GPS, Google Maps, and live map tracking remain out of scope.

