# 07 Firebase Guidelines

Authority: `PROJECT_BIBLE.md`

Phase 9 is the current Firebase baseline: Authentication, Firestore repositories, Firebase Storage helpers, dummy payment documents, Firestore notifications, and realtime order listeners are implemented through approved service layers.

## Firebase Modules

- `firebase/config.ts`: reads Expo public Firebase environment variables.
- `firebase/firebase.ts`: initializes and exports the Firebase app instance.
- `firebase/auth.ts`: initializes Firebase Auth when valid environment values exist and configures persistence.
- `services/authService.ts`: owns Firebase Auth operations.
- `firebase/firestore.ts`: prepares the Firestore instance only; no reads or writes are implemented.
- `firebase/storage.ts`: prepares the Storage instance only; no uploads or downloads are implemented.
- `repositories/`: placeholder repository contracts for future CRUD work.
- `providers/AuthenticationProvider.tsx` and `hooks/useAuth.ts`: expose auth state and actions to screens.

## Environment Rules

- Use `EXPO_PUBLIC_FIREBASE_API_KEY`.
- Use `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`.
- Use `EXPO_PUBLIC_FIREBASE_PROJECT_ID`.
- Use `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`.
- Use `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`.
- Use `EXPO_PUBLIC_FIREBASE_APP_ID`.
- Never hardcode or commit real credentials.
- Email/Password must be enabled in Firebase Console before live auth testing.

## Authentication Rules

- Use Firebase Email/Password authentication.
- Registration must send an email verification message.
- Login, logout, forgot password, display name update, photo URL update, refresh user, re-authentication, and account deletion must go through `services/authService.ts`.
- Screens must use `useAuth()` and must not import Firebase directly.
- Firebase duplicate account protection by email uniqueness is the Phase 6B duplicate registration control.
- Assignment username, phone, and address persistence remain pending until Firestore is approved.

## Data Rules

- Do not write user profiles to Firestore in Phase 6B.
- Do not migrate static sample data in Phase 6B.
- Never store plaintext passwords.
- Store immutable order snapshots only in a later approved Firestore phase.
- Keep dummy payment data safe and clearly simulated when payment is approved later.

## Security Rules

Security templates live in `firebase/rules/` and currently deny all reads and writes. Admin access must be enforced with role data and Firebase rules, not navigation alone, in a later approved phase.

## Phase 6C Firestore Integration Rules

Firestore reads and writes are centralized through repository classes in `repositories/`. Screens consume data through hooks such as `useRestaurants`, `useFoods`, `useOrders`, `useAddresses`, and `useNotifications`.

The repository layer supports create, read, update, delete, pagination, filtering, sorting, and client-side search where a Firestore query cannot safely cover the interaction yet. Offline persistence is attempted through `enableFirestoreOfflinePersistence()` and failures are handled gracefully with cached data, loading states, empty states, and retry actions.

Security expectations:

- Public catalog collections may be read by customers: restaurants, categories, foods, coupons, offers, and reviews.
- Private customer collections require authenticated ownership: users, orders, carts, addresses, favorites, notifications, and settings.
- Catalog writes remain admin-only in the rules template.
- Storage uploads, push notifications, payment gateway calls, backend APIs, GPS, Google Maps, and live map tracking remain out of scope.

## Phase 7 Vendor Firestore Rules

Vendor management uses the same repository architecture as customer data. Vendor screens must call hooks, hooks must call repositories, and repositories must own Firestore SDK access.

Vendor ownership is based on `restaurants.ownerId == request.auth.uid`. Food, categories, coupons, offers, and restaurant order updates are scoped through `restaurantId` and Firestore rules. Super-admin approval is intentionally not built in Phase 7.

The role vocabulary for future security work is now prepared as `customer`, `vendor`, `admin`, and `rider`.

## Phase 8 Admin Firestore Rules

Admin management uses the repository architecture. Admin screens call hooks, hooks call repositories, and repositories own Firestore SDK access.

Admin access is prepared through the `admin` role. Firestore rules allow admins to access all collections, while customers remain limited to their private data and vendors remain limited to their restaurant-owned data.

Phase 8 does not add payment gateway calls, Firebase Storage uploads, push notification delivery, backend APIs, GPS, Google Maps, or live tracking.

## Phase 9 Production Features & Service Integration

Phase 9 adds production-service foundations while preserving the existing customer, vendor, admin, authentication, Firestore repository, role access, and documentation architecture.

Implemented scope:

- Firebase Storage image upload helpers with progress, loading, success, and error states.
- Firestore-backed cart-to-order checkout workflow.
- Dummy payment records for Cash on Delivery, Dummy Mobile Money, and Dummy Card Payment.
- Firestore notification records for order and payment events, plus promotion support.
- Realtime Firestore order listeners for timeline/status tracking.
- Rider workflow placeholder using assigned deliveries and status updates.
- Security rules updates for payments, notifications, Storage paths, and rider assigned-order access.

Out of scope remains unchanged: no real payment gateway, no backend APIs, no push notifications, no GPS, no Google Maps, and no live map tracking. Order tracking remains timeline/status based.

Detailed guides: `docs/FIREBASE_SETUP.md`, `docs/STORAGE_GUIDE.md`, `docs/PAYMENT_FLOW.md`, `docs/ORDER_WORKFLOW.md`, and `docs/NOTIFICATIONS_GUIDE.md`.

