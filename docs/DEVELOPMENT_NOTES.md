# Development Notes

Authority: `PROJECT_BIBLE.md`

## Phase Boundary

Phase 6B is Firebase Authentication work only.

Do not implement Firestore reads/writes, migrate static data, upload to Storage, implement payments, implement notifications, add backend APIs, add admin features, or add GPS/maps.

## Architecture Decisions Preserved

- Use Expo Router for navigation.
- Use TypeScript for domain safety.
- Keep Firebase calls out of screens by routing auth operations through `services/authService.ts` and `hooks/useAuth.ts`.
- Keep design tokens centralized.
- Order tracking uses a professional delivery timeline interface, not a live GPS map.
- Firestore and Storage foundation files remain unused by UI in this phase.

## Phase 6B Additions

- Firebase Email/Password auth service in `services/authService.ts`.
- React Native session persistence support through `@react-native-async-storage/async-storage` when Firebase's React Native resolver exposes persistence.
- Completed `AuthenticationProvider` with current user, loading, error, authenticated state, initialization, and auth actions.
- Completed `useAuth()` API for login, register, logout, forgot password, verify email, refresh user, update profile, re-authenticate, and delete account.
- Login, register, forgot password, profile, settings, and edit profile screens connected to auth without redesigning UI.
- Email/password validation, confirm-password validation, loading states, and friendly Firebase Auth errors.
- Registration sends email verification and Firebase prevents duplicate registration by email uniqueness.

## Verification Notes

- TypeScript typecheck passes.
- Android export passes with Firebase Auth and AsyncStorage included.
- Real authentication requires approved Firebase `.env` values and Email/Password enabled in Firebase Console.

## Phase 6B Handoff

Phase 6B was completed before Firestore integration began.

## Phase 6C Additions

- Implemented typed Firestore repository base with converters, CRUD, filtering, sorting, pagination, and search support.
- Completed Firestore repositories for users, restaurants, categories, foods, reviews, coupons, offers, orders, addresses, favorites, notifications, settings, and cart foundation.
- Added Firestore hooks for restaurants, foods, categories, reviews, coupons, offers, orders, favorites, addresses, notifications, and user profile data.
- Connected customer screens to Firestore-backed hooks while preserving the Phase 5 UI.
- Added lightweight in-memory query cache fallback and retry behavior.
- Prepared Firestore offline persistence with graceful failure handling.
- Updated Firestore rules template for public catalog reads, authenticated private customer data, and admin-only catalog writes.

## Phase 6C Boundaries

No Firebase Storage uploads, payment gateway, push notification implementation, backend API layer, admin screens, GPS, Google Maps, or live map tracking were added. Order tracking continues to use the approved professional timeline approach.

## Phase 7 Handoff

Phase 7 was completed before administrator management began.

## Phase 7 Additions

- Added `app/(vendor)/` route group.
- Added vendor login, dashboard, profile, edit profile, menu, food management, add food, edit food, categories, orders, order details, update order status, offers/coupons, analytics, and settings screens.
- Added vendor hooks for restaurant profile, menu, categories, foods, orders, analytics, coupons, and offers.
- Extended repositories for vendor-owned restaurant, menu, category, coupon, offer, and order operations.
- Updated Firestore rules template for vendor ownership through restaurant `ownerId`.
- Updated role naming to prepare `customer`, `vendor`, `admin`, and `rider`.

## Phase 7 Boundaries

No super-admin panel, payment gateway, push notifications, backend API layer, Firebase Storage upload, Google Maps, GPS, or live tracking map was added. Order status remains timeline/status based.



## Phase 8 Administrator Additions

- Replaced the admin placeholder with a complete `app/(admin)/` route group.
- Added admin login, dashboard, profile, user management, customer management, vendor management, rider management, restaurant approval, restaurant details, food management, category management, order management, order details, coupon management, offers management, reviews moderation, reports, analytics, platform settings, and role management.
- Added admin hooks for access control, dashboard, users, restaurants, orders, reports, analytics, settings, catalog, promotions, and review moderation.
- Added `AdminRepository` and `AnalyticsRepository`, and extended existing repositories for admin operations.
- Updated Firestore rules so admins can access all collections while customers and vendors remain scoped to their own data.

## Phase 8 Boundaries

No real payment gateway, push notification delivery, backend API layer, GPS, Google Maps, or live order tracking was added. Firebase Storage helpers were added in Phase 9.

## Ready For Next Approved Phase`r`n`r`nPhase 9 is complete. Do not begin Phase 10 or any new scope without user approval.`r`n

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

