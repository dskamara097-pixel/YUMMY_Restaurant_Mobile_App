# YUMMY Restaurant Mobile Application

Fresh React Native Expo project for the YUMMY Restaurant Mobile Application.

This project follows the Phase 1 architecture, Phase 2 setup foundation, Phase 2.5 engineering handbook, Phase 3 design system, Phase 4 customer UI phases, Phase 5 customer experience UI, Phase 6A Firebase foundation, Phase 6B Firebase Authentication, Phase 6C Firestore Database Integration, Phase 7 Restaurant/Vendor Management, Phase 8 Administrator Management, and Phase 9 Production Features & Service Integration. All future development must follow [docs/PROJECT_BIBLE.md](docs/PROJECT_BIBLE.md) unless the user explicitly instructs otherwise.

## Current Phase`r`n`r`nPhase 9: Production Features & Service Integration.`r`n`r`nPhase 9 adds Firebase Storage helper infrastructure, Firestore-backed cart/order/payment/notification workflow, realtime order status listeners, and rider delivery placeholders. Customer, vendor, and admin modules remain preserved. Dummy payments and Firestore notification documents are implemented, but no real payment gateway, push notification delivery, backend API, GPS, Google Maps, or live map tracking is included.

## Stack

- React Native
- Expo SDK 57
- Expo Router
- TypeScript
- Firebase modular SDK authentication and Firestore
- AsyncStorage-backed mobile auth persistence when the React Native Firebase resolver is available
- Expo public environment variables for Firebase config
- React Hooks and Context API structure
- Repository pattern for customer and vendor Firestore access
- React Hook Form installed for later form phases
- Expo Vector Icons through `AppIcon`

## Run The Project

```bash
npm install
npx expo start
```

Optional checks:

```bash
npm run typecheck
npx expo config --type public
npx expo export --platform android
```

## Firebase Environment

Copy `.env.example` to `.env` and fill approved Firebase project values before testing real authentication or Firestore reads/writes. Keep real Firebase values out of source control.

Required keys:

- `EXPO_PUBLIC_FIREBASE_API_KEY`
- `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
- `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `EXPO_PUBLIC_FIREBASE_APP_ID`

Firebase Console must have Email/Password authentication enabled and Firestore Database created. Deploy the reviewed Firestore rules template from `firebase/rules/firestore.rules` before production testing.

## Handbook

Start here before every future phase:

- [Project Bible](docs/PROJECT_BIBLE.md)
- [Decision Log](docs/DECISION_LOG.md)
- [Project Overview](docs/01_PROJECT_OVERVIEW.md)
- [Architecture Guidelines](docs/02_ARCHITECTURE_GUIDELINES.md)
- [Coding Standards](docs/03_CODING_STANDARDS.md)
- [Quality Gates](docs/12_QUALITY_GATES.md)
- [Assignment Compliance](docs/13_ASSIGNMENT_COMPLIANCE.md)
- [Development Roadmap](docs/14_DEVELOPMENT_ROADMAP.md)
- [Roadmap Snapshot](docs/ROADMAP.md)

## Design System

- [Design System](docs/DESIGN_SYSTEM.md)
- [Component Library](docs/COMPONENT_LIBRARY.md)

All customer UI screens use reusable design tokens and components under `constants/` and `components/`.

## Phase Boundaries

Implemented so far:

- Expo TypeScript project scaffold
- Expo Router setup
- Engineering handbook
- Design tokens and reusable component library
- Customer auth/welcome UI
- Customer browsing UI
- Customer cart and checkout UI
- Customer profile, account, support, notifications, and timeline tracking UI
- Customer reviews, coupons, offers, recently viewed, recommendations, filters, sorting, loading skeletons, and error UI
- Firebase foundation with modular SDK services, env config, models, repositories, providers, hooks, utilities, roles, and rules templates
- Firebase Email/Password authentication connected to login, register, forgot password, profile, settings, and edit profile screens
- Firestore repositories and hooks for users, restaurants, categories, foods, reviews, coupons, offers, orders, addresses, favorites, notifications, settings, and cart foundation
- Firestore-connected customer screens for home, categories, restaurant details, food details, search, favorites, profile, edit profile, orders, order tracking timeline, coupons, offers, reviews, notifications, addresses, recently viewed, and recommended
- Restaurant/vendor route group with login, dashboard, restaurant profile, edit profile, menu management, food management, add/edit food, category management, order management, order details, status updates, coupons/offers, analytics, and settings
- Administrator route group with login, dashboard, profile, user management, customer management, vendor management, rider management, restaurant approval/details, food management, category management, order management/details, coupon management, offers management, reviews moderation, reports, analytics, platform settings, and role management

Not implemented yet:

- Real payment gateway or real payment processing`r`n- Backend/API calls`r`n- Push notification delivery`r`n- Live GPS/map tracking`r`n- Screenshots, report, and presentation slides

## Setup Notes

See [docs/SETUP.md](docs/SETUP.md).



