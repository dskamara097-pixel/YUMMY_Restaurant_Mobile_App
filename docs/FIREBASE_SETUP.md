# Firebase Setup Guide

Project: YUMMY Restaurant Mobile Application  
Authority: `PROJECT_BIBLE.md`

## Purpose

This guide explains how to prepare Firebase for the university submission build. YUMMY uses Firebase Authentication, Cloud Firestore, and Firebase Storage helpers. It does not use a custom backend API, real payment gateway, push notification service, Google Maps, GPS, or live tracking.

## Firebase Project Setup

1. Open Firebase Console.
2. Create or select the YUMMY Firebase project.
3. Add a Web app configuration.
4. Copy the Firebase web app values into a local `.env` file.
5. Do not commit real Firebase credentials.

## Expo Environment Variables

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

Required values:

```text
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
```

Expo public variables are used because this is a client-side mobile application. Security must come from Firebase Auth, Firestore rules, Storage rules, and role checks, not from hiding public Firebase config.

## Authentication

Enable Email/Password authentication in Firebase Console:

1. Go to Authentication.
2. Open Sign-in method.
3. Enable Email/Password.
4. Save changes.

YUMMY supports registration, login, logout, forgot password, session persistence, email verification support, profile updates, re-authentication support, and account deletion support through the Firebase Auth service layer.

## Firestore

Create Cloud Firestore:

1. Go to Firestore Database.
2. Create database.
3. Choose a region.
4. Start with rules suitable for testing only if required, then deploy the project rules before final demonstration.

Rules template:

```text
firebase/rules/firestore.rules
```

Main collections:

- `users`
- `restaurants`
- `categories`
- `foods`
- `carts`
- `orders`
- `payments`
- `notifications`
- `addresses`
- `reviews`
- `coupons`
- `offers`
- `favorites`
- `settings`

See `docs/DATABASE_STRUCTURE.md` for collection fields.

## Storage

Create Firebase Storage:

1. Go to Storage.
2. Create a bucket.
3. Deploy Storage rules before final demonstration.

Rules template:

```text
firebase/rules/storage.rules
```

Storage helper paths:

- `profile-images/{userId}/{fileName}`
- `restaurant-images/{restaurantId}/{fileName}`
- `food-images/{restaurantId}/{fileName}`
- `review-images/{userId}/{fileName}`

## Roles

Supported roles:

- `customer`
- `vendor`
- `admin`
- `rider`

Admin and vendor behavior must be protected by both app-level guards and Firebase rules.

## Dummy Payments

Payment records are dummy assignment data only. The app does not connect to a real payment provider. Do not store real card numbers, real mobile money credentials, bank details, or payment secrets.

## Notifications

Notifications are Firestore documents only. Push notifications are not implemented.

## Verification Commands

Run:

```bash
npm install
npm run typecheck
npx expo config --type public
npx expo export --platform android
npx expo start
```

## Common Issues

- Missing `.env` values: Firebase service wrappers will report configuration errors.
- Email/Password disabled: registration and login will fail.
- Firestore rules too strict: authenticated reads/writes may fail.
- Storage rules not deployed: uploads may fail.
- Real credentials committed: remove them immediately and rotate Firebase keys if needed.
