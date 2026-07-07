# YUMMY Restaurant Mobile Application Project Report

## Title

YUMMY Restaurant Mobile Application: A React Native Expo Food Ordering System with Firebase Integration

## Introduction

The YUMMY Restaurant Mobile Application is a mobile food ordering system developed for the Introduction to Mobile App Development Assignment 2. The application demonstrates how a modern restaurant ordering platform can be built using React Native, Expo, Expo Router, TypeScript, Firebase Authentication, Cloud Firestore, and Firebase Storage helpers.

The project was developed in phases. Early phases focused on project analysis, setup, architecture, documentation, design system, and reusable components. Later phases added customer screens, vendor screens, administrator screens, Firebase Authentication, Firestore data access, dummy payments, notifications, and final submission documentation.

YUMMY is designed as a professional university submission rather than a simple prototype. It includes structured documentation, clean folder organization, reusable components, repository-based data access, and a clear separation between customer, administrator, vendor, and rider workflows.

## Objectives

The main objective of this project is to create a mobile restaurant ordering application that satisfies the assignment requirements and demonstrates practical mobile application development skills.

Specific objectives:

1. Build a React Native mobile application using Expo.
2. Use Expo Router for file-based navigation.
3. Use TypeScript for safer and more maintainable code.
4. Implement Firebase Authentication for user login and registration.
5. Use Cloud Firestore for application data.
6. Prepare Firebase Storage helpers for image upload support.
7. Provide customer screens for browsing, searching, cart, checkout, payment, tracking, notifications, and profile.
8. Provide administrator screens for dashboard, food management, customers, orders, payments, and notifications.
9. Use React Hooks and Context API for state management.
10. Maintain professional documentation for submission and future development.

## Technologies

### React Native

React Native is used to build the mobile user interface. It allows the application to be written in JavaScript/TypeScript while targeting mobile platforms.

### Expo

Expo provides the development runtime, tooling, bundling, and project configuration. It simplifies running and testing the app during development.

### Expo Router

Expo Router provides file-based routing. Route groups are used to separate authentication, customer, administrator, vendor, and rider workflows.

### TypeScript

TypeScript provides typed models, safer component props, and better code maintainability.

### Firebase Authentication

Firebase Authentication supports registration, login, logout, forgot password, session persistence, email verification support, profile updates, re-authentication support, and account deletion support.

### Cloud Firestore

Firestore stores users, restaurants, foods, carts, orders, payments, notifications, addresses, reviews, coupons, offers, favorites, and settings.

### Firebase Storage Helpers

Firebase Storage helper services support image upload foundations for profile photos, restaurant images, food images, and review images.

### React Hooks and Context API

Hooks are used for reusable state and data access. Context API is used for authentication state and application providers.

## Functional Requirements

### Customer Requirements

The customer side includes:

- Splash screen
- Onboarding screen
- Registration screen
- Login screen
- Home screen
- Food categories screen
- Search screen
- Food details screen
- Cart screen
- Checkout screen
- Payment screen
- Order tracking screen
- Notifications screen
- User profile screen

Customers can browse food, search meals, view details, add food to cart, proceed to checkout, create dummy payment records, view notifications, and track orders using a timeline interface.

### Administrator Requirements

The administrator side includes:

- Admin login
- Dashboard
- Food management
- Add food
- Customer management
- Orders
- Payments
- Notifications

Additional administrator support includes restaurants, vendors, riders, categories, coupons, offers, reviews, reports, analytics, roles, and platform settings.

### Vendor and Rider Support

The project also includes vendor and rider foundations. Vendors can manage restaurant-related data, and riders have placeholder delivery status workflows. These features support project completeness but are not expanded into commercial features beyond assignment scope.

## Database

The application uses Cloud Firestore. Database access is centralized through repository classes and hooks. This keeps screens clean and prevents direct Firestore logic inside route files.

Major collections:

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

The database structure is documented in `docs/DATABASE_STRUCTURE.md`.

## Firebase

Firebase is used for three main areas.

### Authentication

Firebase Authentication manages user identity. The application supports email/password authentication and stores profile/role data separately in Firestore.

### Firestore

Firestore stores application records. Access is protected through Firebase rules and app-level role checks.

### Storage

Firebase Storage helpers prepare image upload support. The app stores download URLs in Firestore documents after upload. Real production image hosting details are not hardcoded.

## Screens

The project uses Expo Router route groups:

- `app/(auth)/` for authentication screens
- `app/(customer)/` for customer screens
- `app/(admin)/` for administrator screens
- `app/(vendor)/` for vendor screens
- `app/(rider)/` for rider screens

Customer screens focus on ordering usability and warm restaurant branding. Admin screens use a clearer operational layout for management tasks.

## Testing

The project was verified using:

```bash
npm install
npm run typecheck
npx expo config --type public
npx expo export --platform android
npx expo start
```

Testing focus:

- TypeScript correctness
- Expo configuration validity
- Expo Router route compilation
- Android bundle export
- Documentation completeness
- Assignment compliance coverage

Manual testing still required before final submission:

- Capture screenshots
- Test on Expo Go or emulator
- Verify Firebase project values in `.env`
- Confirm Firebase Console services are enabled

## Challenges

Key challenges included:

1. Managing a large multi-phase project without losing architectural consistency.
2. Keeping Firebase logic out of screens by using repositories and hooks.
3. Supporting assignment payment requirements without adding a real payment gateway.
4. Implementing order tracking without Google Maps, GPS, or live tracking.
5. Keeping documentation synchronized with code changes across many phases.
6. Separating customer, admin, vendor, and rider workflows while preserving clean routing.

## Conclusion

The YUMMY Restaurant Mobile Application satisfies the main university assignment requirements and demonstrates professional mobile application development practices. It includes a polished customer experience, administrator management features, Firebase integration, dummy payment support, Firestore notifications, timeline-based order tracking, reusable components, and detailed documentation.

The project is ready for university submission after manual screenshot capture and final packaging. Future enhancements may include real payment gateway integration, push notifications, production analytics, and optional live tracking, but these are intentionally outside the current assignment scope.
