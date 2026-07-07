# YUMMY Restaurant Mobile Application

Final university submission package for the YUMMY Restaurant Mobile Application.

YUMMY is a React Native Expo food ordering application built for the Introduction to Mobile App Development Assignment 2. It includes customer ordering flows, administrator management, vendor/rider foundations, Firebase Authentication, Firestore repositories, Firebase Storage helpers, dummy payments, Firestore notifications, and timeline-based order tracking.

## Current Status

Phase 10 Part 2: Final University Submission Package.

The project is prepared for university submission. Required documentation, database structure notes, Firebase setup guide, screenshot checklist, submission checklist, project report, and presentation slide outline are included in `docs/`.

## Technology Stack

- React Native with Expo SDK 57
- Expo Router
- TypeScript
- Firebase Authentication
- Cloud Firestore
- Firebase Storage helpers
- React Hooks and Context API
- React Hook Form support
- Modular repository architecture
- Reusable design system and component library

## Main Features

Customer features:

- Splash and onboarding
- Registration and login
- Home and categories
- Search, filters, and sorting
- Restaurant and food details
- Cart and checkout
- Dummy payment records
- Timeline-based order tracking
- Notifications
- User profile and saved addresses

Administrator features:

- Admin login
- Dashboard
- User and customer management
- Food management and add food
- Orders management
- Payments management
- Notifications management
- Coupons, offers, reviews, reports, analytics, roles, and settings

Important boundaries:

- No real payment gateway is connected.
- No backend API server is used.
- No push notification delivery service is implemented.
- No Google Maps, GPS, or live tracking is used.
- Order tracking uses a professional timeline/status interface.

## Run The Project

```bash
npm install
npx expo start
```

Optional verification commands:

```bash
npm run typecheck
npx expo config --type public
npx expo export --platform android
```

## Firebase Environment

Copy `.env.example` to `.env` and add approved Firebase values:

- `EXPO_PUBLIC_FIREBASE_API_KEY`
- `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
- `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `EXPO_PUBLIC_FIREBASE_APP_ID`

Firebase Console setup should include:

- Email/Password Authentication enabled
- Cloud Firestore database created
- Firebase Storage bucket created
- Firestore rules from `firebase/rules/firestore.rules`
- Storage rules from `firebase/rules/storage.rules`

## Submission Documents

- `docs/DATABASE_STRUCTURE.md`
- `docs/FIREBASE_SETUP.md`
- `docs/SCREENSHOT_CHECKLIST.md`
- `docs/SUBMISSION_CHECKLIST.md`
- `docs/PROJECT_REPORT.md`
- `docs/PRESENTATION_SLIDES.md`
- `docs/13_ASSIGNMENT_COMPLIANCE.md`
- `docs/PROJECT_BIBLE.md`

## Quality Gate

Phase 10 Part 2 requires:

- `npm install`
- `npm run typecheck`
- `npx expo config --type public`
- `npx expo export --platform android`
- `npx expo start`

## Manual Submission Tasks

Before final upload, capture screenshots using `docs/SCREENSHOT_CHECKLIST.md`, export or save the final report/slides if required by the lecturer, and confirm real Firebase environment values are configured locally without committing secrets.
