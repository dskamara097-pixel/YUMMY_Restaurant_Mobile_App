# YUMMY Restaurant Mobile Application Project Bible

Version: 1.0.0  
Status: Active governance document  
Last updated: July 5, 2026  
Applies to: All future phases unless the user explicitly overrides it

## 1. Authority

This Project Bible is the single source of truth for the YUMMY Restaurant Mobile Application. Every future phase must follow this document unless the user explicitly gives a newer instruction.

Supporting documents in `docs/01_*.md` through `docs/15_*.md` explain specific areas, but they must not contradict this file. If a conflict appears, `PROJECT_BIBLE.md` wins and the supporting document must be updated.

## 2. Project Vision

YUMMY should feel like a real commercial restaurant ordering product that could be published, demonstrated, maintained, and extended beyond the university assignment. The application must satisfy the assignment exactly while presenting a polished customer experience and a credible administrator workflow.

## 3. Mission

Build a mobile restaurant ordering application that allows customers to register, login, browse food, search meals, order meals, submit dummy payments, track orders, and receive notifications, while allowing administrators to login and manage foods, customers, orders, payments, and notifications.

## 4. Business Goals

- Make food discovery and ordering fast and clear.
- Give administrators reliable operational control.
- Create a brandable YUMMY product foundation.
- Keep the app extensible for real payments, delivery management, promotions, and analytics.
- Produce professional documentation and development standards for a team-style project.

## 5. Assignment Goals

- Use React Native with Expo.
- Use Expo Router.
- Use TypeScript.
- Use Firebase Authentication, Firestore, and Storage in implementation phases.
- Use React Hooks and Context API for state foundations.
- Implement all customer and administrator requirements from the assignment.
- Submit project code, Firebase configuration, Figma design or screenshots, database documentation, screenshots, report, and slides.

## 6. Technical Goals

- Keep screens thin and domain logic in services, hooks, utilities, and validation modules.
- Use TypeScript interfaces for every domain model.
- Centralize theme tokens and reusable UI behavior.
- Keep Firebase integration behind service modules.
- Protect admin-only behavior with role checks and Firebase rules.
- Maintain a traceable relationship between assignment requirements, code, tests, and documentation.

## 7. Scope

In scope:

- Customer authentication.
- Customer home, category, search, food details, cart, checkout, payment, tracking, notifications, and profile screens.
- Admin login, dashboard, food management, customer management, order management, payment verification, and notification management.
- Firebase Authentication, Firestore, and Storage.
- Dummy payment simulation only.
- Professional docs, tests, screenshots, project report, and presentation assets.

## 8. Out Of Scope

Out of scope unless the user explicitly approves it:

- Real payment gateway integration.
- Real push notification service.
- Live delivery driver tracking.
- Live GPS map for order tracking.
- Multi-restaurant marketplace behavior.
- Production deployment to app stores.
- Advanced analytics dashboard.
- Any feature that would cause assignment requirements to be missed.

## 9. Technology Stack

- React Native.
- Expo SDK 57.
- Expo Router.
- TypeScript.
- Firebase package installed.
- Modular Firebase SDK foundation configured through Expo public environment variables.
- Firebase Email/Password Authentication implemented for Phase 6B.
- Firestore and Storage service wrappers prepared for later implementation phases.
- React Hooks and Context API.
- React Hook Form available for future form work.
- Expo Vector Icons available for icons.

## 10. Architecture Philosophy

The architecture must be predictable, layered, typed, and easy to reason about.

Required layers:

- Presentation: Expo Router screens and reusable components.
- State: Auth context, cart context, screen-local state, and future Firestore hooks.
- Services: Firebase and domain operations.
- Validation: reusable input and business-rule validation.
- Types: shared domain contracts.
- Theme: centralized color, spacing, typography, radius, and component tokens.

Forbidden patterns:

- Direct Firebase calls inside screen components.
- Repeated hardcoded colors or spacing.
- Business rules duplicated across screens.
- Admin permissions enforced only through hidden navigation.
- Plaintext password storage in Firestore.

## 11. Design Philosophy

YUMMY should look appetizing, warm, modern, and trustworthy. Customer screens may be expressive and food-forward. Admin screens should be calmer, denser, and operational.

The Figma design is still required before final UI implementation. If the Figma file is missing, future visual work must pause or use an explicitly approved YUMMY design baseline.

## 12. Coding Philosophy

Code should be clear before it is clever.

SOLID:

- Single Responsibility: components, hooks, and services should each have one clear reason to change.
- Open/Closed: extend behavior through reusable components and services rather than rewriting screens.
- Liskov Substitution: shared types should not force unsafe assumptions about customers, admins, orders, or payments.
- Interface Segregation: keep props and service contracts focused.
- Dependency Inversion: screens depend on service abstractions, not raw Firebase APIs.

DRY:

- Reuse validation, formatting, status rendering, and Firebase access patterns.
- Do not duplicate assignment rules across screens.

KISS:

- Prefer simple Context and hooks until real complexity demands more.
- Do not introduce state libraries, backend abstractions, or design systems without a clear need.

## 13. Folder Structure

Canonical Phase 2 structure:

```text
YUMMY_Restaurant_Mobile_App/
  app/
    _layout.tsx
    index.tsx
    (auth)/
    (customer)/
    (admin)/
  components/
    common/
    forms/
    layout/
    food/
    cart/
    admin/
  constants/
  context/
  hooks/
  services/
  firebase/
  types/
  utils/
  data/
  assets/
  docs/
```

Future route files must remain in the correct route group. Shared code must not be placed inside `app/`.

## 14. Naming Conventions

- Components: PascalCase, for example `FoodCard`.
- Hooks: camelCase starting with `use`, for example `useOrders`.
- Context providers: PascalCase ending in `Provider`.
- Service modules: camelCase ending in `Service` or `Repository`.
- Types and interfaces: PascalCase.
- Route files: lowercase when user-facing.
- Firestore collections: plural lower camelCase.
- Constants: UPPER_SNAKE_CASE only for true constants.

## 15. Component Standards

Components must be reusable, typed, accessible, and visually consistent.

Required component behavior:

- Accept typed props.
- Avoid hidden Firebase calls.
- Avoid hardcoded colors outside theme tokens.
- Provide loading, disabled, empty, and error states where relevant.
- Keep text within its container on small screens.
- Use icons for familiar actions where appropriate.

## 16. UI Standards

Brand palette:

- Primary red: `#CE1212`
- Dark red: `#9B0D0D`
- Accent: `#F4A261`
- Ink: `#1E1E24`
- Muted: `#6E6E78`
- Surface: `#FFFFFF`
- Canvas: `#FFF8F4`
- Border: `#E9E2DE`
- Success: `#2A9D8F`
- Warning: `#E9A227`
- Danger: `#D64545`

UI must include clear loading states, empty states, validation messages, and error recovery paths. Customer flows should be welcoming. Admin flows should prioritize scanning, comparison, and repeated action.

## 17. Accessibility Standards

- Touch targets should be at least 44 by 44 points.
- Inputs must have clear labels.
- Buttons must have meaningful accessible labels.
- Status must not rely on color alone.
- Text contrast must remain readable.
- Long forms must support keyboard-safe scrolling.
- Dynamic content must not overlap or become clipped on small screens.

## 18. Firebase Standards

Firebase foundation was configured in Phase 6A. Firebase Authentication, Firestore repositories, Firebase Storage helpers, dummy payment documents, Firestore notifications, admin/vendor/rider modules, and realtime order listeners are implemented through Phase 9. Backend APIs, real payment gateways, push notification delivery, GPS, Google Maps, and live map tracking still require later approval.

Required services:

- Firebase Authentication for identity.
- Firestore for `users`, `categories`, `foods`, `carts`, `orders`, `payments`, `notifications`, and optional `auditLogs`.
- Firebase Storage for food images and optional profile images.

Authentication rule:

- The assignment requires username login. Firebase Auth should use an internal username email adapter such as `username@yummy.local`.
- Store visible username and `usernameLower` in Firestore.
- Never store plaintext passwords in Firestore.

Payment rule:

- Payments are dummy only.
- Do not integrate real payment systems unless explicitly approved.
- Do not store real full card numbers.

Order tracking rule:

- The Order Tracking screen will NOT use a live GPS map.
- Instead it will use a professional delivery timeline interface containing estimated delivery time, delivery progress timeline, rider profile, rider rating, call rider, chat rider, delivery address, support section, and order status progression.
- A live map may be added as a future enhancement but is NOT part of the current application.

## 19. Documentation Standards

Documentation must be current, concise, and phase-aware.

Required docs:

- `PROJECT_BIBLE.md`.
- Numbered standards docs.
- `DECISION_LOG.md`.
- `PROJECT_MANIFEST.json`.
- Setup, folder structure, and development notes.
- Assignment compliance and roadmap docs.

Every new phase must update relevant docs when architecture, scope, dependencies, routes, or quality gates change.

## 20. Git Workflow

Recommended branches:

- `main` for stable submission-ready work.
- `develop` for integration.
- `feature/<scope>` for implementation work.
- `docs/<scope>` for documentation-only work.
- `fix/<scope>` for bug fixes.

Commit format:

- `feat: add customer registration`
- `fix: validate mobile money amount`
- `docs: update project bible`
- `test: add cart total tests`
- `chore: install expo router`

## 21. Branch Strategy

Work should move from feature branches into `develop`, then into `main` after passing quality gates. If a formal Git remote is not used, the same discipline still applies through clear commit messages and small work units.

## 22. Semantic Versioning

Use semantic versioning:

- Major: breaking architecture or data contract change.
- Minor: new user-visible or admin-visible capability.
- Patch: bug fix, documentation correction, or internal cleanup.

Current project version: `1.0.0` for Phase 6B Firebase Authentication.

## 23. Testing Strategy

Minimum testing requirements by phase:

- Setup phases: install, typecheck, Expo config, route or bundle check.
- Firebase phases: emulator or rules verification where possible.
- Feature phases: unit tests for validation and calculations, manual QA for flows.
- Submission phase: full assignment checklist verification.

Critical future tests:

- Registration validation.
- Username uniqueness.
- Login and role routing.
- Cart total calculation.
- Payment validation.
- Order status transitions.
- Admin approve or reject payment flow.
- Notification generation.

## 24. Quality Gates

Every phase must pass its relevant quality gate before handoff.

Universal gate:

- No TypeScript errors.
- No broken imports.
- No route errors.
- README and docs updated.
- No feature work outside phase scope.
- Assignment compliance updated when requirements move.
- No Firebase secrets committed.

Implementation gate:

- Loading, empty, error, and validation states covered.
- Accessibility basics checked.
- Screens tested on mobile-sized layouts.
- Firebase rules considered for any data access.

## 25. Definition Of Done

A phase is done only when:

- The requested scope is complete.
- Out-of-scope work was not introduced.
- Files are organized according to this Bible.
- Quality gates pass or issues are clearly documented.
- Documentation is updated.
- The user receives a concise handoff.
- The next phase is not started without approval.

## 26. Development Roadmap

Completed:

- Phase 1: project analysis and software architecture.
- Phase 2: Expo project setup and environment configuration.
- Phase 2.5: Project Bible and engineering handbook.
- Phase 3: professional design system and component library.
- Phase 4A: customer welcome and authentication UI, without Firebase or real authentication.
- Phase 4B: customer restaurant browsing experience UI, without Firebase, cart logic, checkout, payment, admin screens, notifications, or order tracking.
- Phase 4C: customer ordering experience UI, with frontend-only cart quantity updates, checkout preview, and no backend, payment processing, admin screens, notifications, GPS, maps, or order tracking.
- Phase 5A: customer account, order history, timeline tracking, notifications, saved addresses, support, and settings UI, with static data and no Firebase, backend/API calls, payment gateway, admin screens, GPS, or live maps.
- Phase 5B: customer reviews, coupons, offers, recently viewed, recommendations, search filters, sorting, loading states, error states, empty state improvements, and UI polish, with static data and no Firebase, backend/API calls, authentication, payments, maps, GPS, or admin features.
- Phase 6A: Firebase foundation with modular SDK services, Expo environment configuration, models, placeholder repositories, providers, hooks, utilities, roles, and locked-down rules templates. No auth logic, UI wiring, Firestore reads/writes, Storage uploads, APIs, notifications, payments, maps, or admin features.
- Phase 6B: Firebase Email/Password authentication with register, login, logout, forgot password, email verification, session restoration, display name/photo URL updates, re-authentication support, account deletion, validation, and friendly errors. No Firestore data, Storage uploads, payments, notifications, backend APIs, admin features, GPS, or maps.

Next phases, pending approval:

1. Confirm Figma design or approve the current YUMMY design baseline.
2. Authentication and role routing after approval.
3. Firestore-backed customer data, persistent cart, and order workflows after approval.
4. Persistent cart, checkout backend, and dummy payment.
5. Connect order tracking to real order status using the approved timeline interface, not a live GPS map.
6. Implement real notifications.
7. Admin dashboard and management flows.
8. Security rules, testing, polish, screenshots, report, and slides.

## 27. Milestones

- Milestone 0: Figma confirmation.
- Milestone 1: Foundation and handbook.
- Milestone 2: Authentication and role routing.
- Milestone 3: Customer menu experience.
- Milestone 4: Cart, checkout, and orders.
- Milestone 5: Dummy payments.
- Milestone 6: Tracking and notifications.
- Milestone 7: Admin operations.
- Milestone 8: Quality, security, and polish.
- Milestone 9: Submission package.

## 28. Assignment Checklist

Project setup:

- [x] React Native Expo project scaffolded.
- [x] Expo Router installed and configured.
- [x] TypeScript configured.
- [x] Firebase package installed.
- [x] Firebase foundation services configured through Expo environment variables; real credentials are not committed.
- [x] Context API structure started.
- [x] Backend models, placeholder repositories, providers, hooks, utilities, roles, and rules templates prepared.
- [x] Firebase Authentication implemented for email/password users.
- [ ] Firestore reads/writes enabled.
- [x] Firebase Storage upload helpers enabled.

Customer requirements:

- [x] Splash screen UI built.
- [x] Onboarding screen UI built.
- [x] Registration screen UI built; backend pending.
- [x] Login screen UI built; backend pending.
- [x] Home screen UI built; backend pending.
- [x] Categories UI built; backend pending.
- [x] Search UI built with filters and sorting UI; backend pending.
- [x] Restaurant details UI built; backend pending.
- [x] Food details UI built; cart backend pending.
- [x] Cart UI built; backend persistence pending.
- [x] Checkout UI built; backend and payment pending.
- [ ] Dummy payment.
- [x] Order tracking timeline UI built; backend status updates pending.
- [x] Notifications UI built; backend push/data pending.
- [x] Favorites UI built with improved empty state; backend pending.
- [x] Reviews UI built; backend pending.
- [x] Coupons and offers UI built; backend pending.
- [x] Recently viewed and recommended UI built; backend pending.
- [x] Profile UI built; backend account persistence pending.

Admin requirements:

- [ ] Admin login.
- [ ] Dashboard.
- [ ] Food management.
- [ ] Customer management.
- [ ] Order management.
- [ ] Payment verification.
- [ ] Notification management.

Submission requirements:

- [ ] Figma design or screenshots.
- [ ] Database structure documentation.
- [ ] Project report, 10-15 pages.
- [ ] Application screenshots.
- [ ] Presentation slides, 10-15 slides.

## 29. Risk Management

Known risks:

- Figma design is not yet available in this workspace.
- Firebase username login requires an adapter because Firebase Auth uses email/password.
- Firebase Authentication depends on approved local `.env` values and Firebase Console Email/Password enablement for live testing.
- Dummy payment requirements must be implemented without storing real sensitive card data.
- Admin security must be enforced through role checks and Firebase rules.
- Expo SDK 57 dependency versions should be kept compatible.

Mitigation:

- Do not implement final UI without Figma confirmation or explicit approval.
- Keep all Firebase work behind services.
- Keep payment simulation clearly labeled.
- Run quality gates at the end of every phase.
- Update `DECISION_LOG.md` when tradeoffs are made.

## 30. Future Enhancements

- Real payment gateway integration.
- Push notifications.
- Delivery tracking.
- Branch management.
- Ratings and reviews.
- Favorites.
- Coupons and loyalty.
- Order cancellation.
- Estimated delivery time.
- Live GPS map for order tracking.
- Multi-language support.
- Admin analytics.

## 31. Future Phase Rule

All future development must follow this Project Bible unless the user explicitly instructs otherwise. Do not continue to a new phase without approval.










## Phase 6C Firestore Database Integration

Phase 6C promotes Firestore to the customer data source while preserving the existing UI and design system. Firestore access must remain centralized in `repositories/` and exposed to screens through hooks in `hooks/`.

Phase 6C scope includes typed repositories, CRUD methods, pagination, filtering, sorting, search support, lightweight cache fallback, offline-persistence preparation, and connected customer data screens. It does not include Firebase Storage uploads, payment processing, push notifications, backend APIs, admin feature screens, GPS, Google Maps, or live map tracking.

All future phases must continue to follow this data flow: screen -> hook -> repository -> Firebase service. Screens must not import Firestore SDK functions directly.

## Phase 7 Restaurant/Vendor Management

Phase 7 adds the restaurant owner side of the application. Vendor screens live under `app/(vendor)/` and use the existing design system, Firestore repositories, and typed hooks.

Phase 7 scope includes vendor login, dashboard, restaurant profile management, menu/category/food CRUD, food availability toggles, restaurant order search/filter/status updates, coupons/offers management, analytics summary, and vendor settings.

Phase 7 does not include a super-admin panel, payment gateway, push notifications, backend APIs, Firebase Storage uploads, GPS, Google Maps, or live map tracking. Order tracking remains status/timeline based.

Vendor users must only manage restaurant data connected to their Firebase Auth user id through restaurant `ownerId` and Firestore rules.

## Phase 8 Administrator Management

Phase 8 adds the platform administrator module under `app/(admin)/`. Administrator screens use the existing design system and the repository/hook Firestore architecture.

Phase 8 scope includes admin login, dashboard, admin profile, user/customer/vendor/rider management, restaurant approval and details, food management, category CRUD, order management and order details, coupon CRUD, offer CRUD, review moderation, reports, analytics, platform settings, and role management.

Admin access is restricted through Firestore user profiles and rules. Non-admin users are denied by the admin route guard. Firestore rules now allow admins to access all collections while preserving customer-owned and vendor-owned restrictions.

Phase 8 does not add a payment gateway, Firebase Storage uploads, push notifications, backend APIs, GPS, Google Maps, or live order tracking.

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

