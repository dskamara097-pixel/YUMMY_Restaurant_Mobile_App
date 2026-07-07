# Decision Log

This log records project-level decisions. `PROJECT_BIBLE.md` remains the authority for current rules.

| Date | Phase | Decision | Reason | Status |
| --- | --- | --- | --- | --- |
| 2026-07-05 | Phase 1 | Treat YUMMY as a new standalone project. | User explicitly rejected association with existing projects. | Active |
| 2026-07-05 | Phase 1 | Use React Native, Expo, TypeScript, Firebase, and Expo Router. | Assignment stack and architecture recommendation. | Active |
| 2026-07-05 | Phase 1 | Require Figma confirmation before final UI implementation. | Figma was required but not available in the thread. | Active |
| 2026-07-05 | Phase 2 | Create fresh app at `YUMMY_Restaurant_Mobile_App`. | Keep project independent from older local folders. | Active |
| 2026-07-05 | Phase 2 | Install Firebase package but leave config comment-only. | Firebase configuration was out of scope for Phase 2. | Active |
| 2026-07-05 | Phase 2 | Use placeholder auth, customer, and admin routes only. | Prevent app breakage without building feature screens. | Active |
| 2026-07-05 | Phase 2.5 | Make `PROJECT_BIBLE.md` the single source of truth. | Future phases need one governance authority. | Active |
| 2026-07-05 | Phase 3 | Create reusable design tokens and component library only. | User requested reusable UI foundation without feature screens, Firebase, or authentication. | Active |
| 2026-07-05 | Phase 4A | Build customer auth UI only. | User requested splash, onboarding, welcome, login, register, and forgot-password UI without Firebase, real auth, browsing, or admin screens. | Active |
| 2026-07-05 | Phase 4B | Build customer restaurant browsing UI only. | User approved customer home, categories, search, restaurant details, food details, and favorites with static data only. | Active |
| 2026-07-05 | Phase 4B | The Order Tracking screen will NOT use a live GPS map. Instead it will use a professional delivery timeline interface containing estimated delivery time, delivery progress timeline, rider profile, rider rating, call rider, chat rider, delivery address, support section, and order status progression. A live map may be added as a future enhancement but is NOT part of the current application. | User explicitly changed the order tracking architecture for the current application. | Active |
| 2026-07-05 | Phase 4C | Build ordering experience UI only. | User approved shopping cart, quantity controls, promo placeholder, delivery address, order notes, checkout, and empty cart UI using static data only. | Active |
| 2026-07-05 | Phase 5A | Build customer account, orders, notifications, support, settings, saved addresses, and timeline tracking UI only. | User approved remaining customer account/support screens with static data and explicitly prohibited Firebase, backend/API calls, payment gateway, admin screens, GPS, Google Maps, and live map tracking. | Active |
| 2026-07-05 | Phase 5B | Build customer experience enhancement UI only. | User approved reviews, coupons, offers, recently viewed, recommendations, search filters, sorting, loading states, error states, empty state improvements, and UI polish while prohibiting Firebase, backend/API calls, authentication, payments, maps, GPS, and admin features. | Active |
| 2026-07-05 | Phase 6A | Build Firebase foundation only with modular SDK services, Expo env config, models, placeholder repositories, providers, hooks, utilities, roles, and deny-all rules templates. | User approved backend infrastructure while explicitly prohibiting auth logic, UI wiring, Firestore reads/writes, Storage uploads, notifications, payments, APIs, maps, and admin features. | Active |
| 2026-07-06 | Phase 6B | Implement Firebase Email/Password Authentication only and connect existing auth/profile/settings screens. | User approved auth while explicitly prohibiting Firestore data, static data migration, payments, notifications, backend APIs, Storage uploads, admin features, GPS, and maps. | Active |
| 2026-07-06 | Phase 6C | Replace connected customer sample data with Firestore repositories and hooks while preserving UI. | User approved database integration after authentication and prohibited payments, push notifications, backend APIs, Storage uploads, admin work, GPS, and maps. | Active |
| 2026-07-07 | Phase 7 | Add restaurant/vendor management module with Firestore-backed vendor ownership. | User approved vendor-side management and explicitly prohibited super-admin, payments, push notifications, backend APIs, GPS, Google Maps, and live maps. | Active |
| 2026-07-07 | Phase 8 | Add administrator management console with Firestore-backed platform operations. | User approved platform administration and explicitly prohibited payment gateway, Storage uploads, push notifications, backend APIs, GPS, Google Maps, and live tracking. | Active |

| 2026-07-07 | Phase 9 | Add production service integrations without external payment, push, backend API, GPS, Google Maps, or live map tracking. | User approved Firebase Storage helpers, cart-to-order workflow, dummy payments, Firestore notifications, realtime status listeners, and rider placeholders while preserving timeline tracking. | Active |
