# 14 Development Roadmap

Authority: `PROJECT_BIBLE.md`

## Completed

- Phase 1: project analysis and software architecture.
- Phase 2: Expo project setup and environment configuration.
- Phase 2.5: Project handbook and engineering standards.
- Phase 3: professional design system and component library.
- Phase 4A: authentication and welcome screens UI.
- Phase 4B: restaurant browsing experience UI only.
- Phase 4C: ordering experience UI only.
- Phase 5A: customer account, orders, notifications, support, settings, saved addresses, and order tracking timeline UI only.
- Phase 5B: customer experience enhancements UI only.
- Phase 6A: Firebase foundation only, including modular SDK services, Expo environment config, models, placeholder repositories, providers, hooks, utilities, role definitions, and locked-down rules templates.
- Phase 6B: Firebase Email/Password authentication only, including register, login, logout, forgot password, email verification, session restoration, profile display name/photo URL updates, re-authentication support, account deletion, validation, and friendly errors.
- Phase 6C: Firestore database integration, including repositories, typed hooks, CRUD, filtering, sorting, pagination, search support, offline persistence preparation, cache fallback, rules template updates, and connected customer data screens.
- Phase 7: Restaurant/vendor management, including vendor login, dashboard, restaurant profile management, menu/category/food CRUD, availability toggles, restaurant order search/filter/status updates, coupons/offers management, analytics, settings, vendor hooks, and vendor ownership rules.
- Phase 8: Administrator management, including admin login, dashboard, profile, user/customer/vendor/rider management, restaurant approval/details, food/category/order/coupon/offer/review management, reports, analytics, platform settings, role management, admin hooks, and admin access rules.
- Phase 9: Production features and service integration, including Firebase Storage helpers, Firestore cart-to-order workflow, dummy payments, Firestore notifications, realtime order listeners, rider placeholders, and updated security rules.

## Next Approved Work Only

Do not begin Phase 10 or any real payment gateway, backend API, push notification delivery, GPS, Google Maps, or live map tracking without user approval.

## Planned Sequence

1. Prepare the next approved phase only after user approval.
2. Keep real payment gateway, backend APIs, push notification delivery, GPS, Google Maps, and live map tracking out of scope unless explicitly approved.
3. Add security hardening, tests, polish, screenshots, report, and slides when approved.

## Order Tracking Direction

The current application uses a professional delivery timeline/status interface for order tracking. A live GPS map is not part of the current application and may only be considered as a future enhancement.

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


