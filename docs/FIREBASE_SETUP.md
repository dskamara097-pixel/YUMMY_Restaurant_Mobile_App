# Firebase Setup Guide

Authority: `PROJECT_BIBLE.md` and `docs/07_FIREBASE_GUIDELINES.md`.

## Phase 9 Scope

Phase 9 uses Firebase Authentication, Cloud Firestore, and Firebase Storage through the existing repository, hook, and service layers. No backend API server, payment gateway, push notification service, GPS, Google Maps, or live map tracking is introduced.

## Environment Variables

Use Expo public variables from `.env` and keep real credentials out of source control:

- `EXPO_PUBLIC_FIREBASE_API_KEY`
- `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
- `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `EXPO_PUBLIC_FIREBASE_APP_ID`

## Services

- Auth remains handled by the existing Firebase Auth provider.
- Firestore access stays inside repositories and hooks.
- Storage access is centralized in `firebase/storage.ts` and `services/storageService.ts`.
- Screens must call hooks/services, not Firebase SDK methods directly.

## Rules

Use `firebase/rules/firestore.rules` and `firebase/rules/storage.rules` as the Phase 9 rules templates. They include customer ownership, vendor restaurant ownership, admin access, rider assigned-order access, payment documents, notifications, and image upload paths.
