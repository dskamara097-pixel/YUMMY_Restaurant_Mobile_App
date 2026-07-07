# Submission Checklist

Project: YUMMY Restaurant Mobile Application

## Code Package

- [ ] Project folder included: `YUMMY_Restaurant_Mobile_App`
- [ ] `package.json` included
- [ ] `package-lock.json` included
- [ ] `app/` route files included
- [ ] `components/` included
- [ ] `hooks/` included
- [ ] `repositories/` included
- [ ] `models/` included
- [ ] `firebase/` included
- [ ] `docs/` included
- [ ] `assets/` included
- [ ] `.env.example` included
- [ ] Real `.env` file excluded from submission if it contains private values

## Required Documentation

- [x] README improved
- [x] Database structure documented
- [x] Firebase setup documented
- [x] Screenshot checklist created
- [x] Submission checklist created
- [x] Project report drafted
- [x] Presentation slide outline drafted
- [x] Assignment compliance updated

## Required Technologies

- [x] Expo
- [x] React Native
- [x] Expo Router
- [x] TypeScript
- [x] Firebase Authentication
- [x] Firestore
- [x] Firebase Storage helpers
- [x] React Hooks
- [x] Context API
- [x] Form validation
- [x] Search
- [x] CRUD
- [x] Responsive UI

## Required Customer Screens

- [x] Splash
- [x] Onboarding
- [x] Registration
- [x] Login
- [x] Home
- [x] Food Categories
- [x] Search
- [x] Food Details
- [x] Cart
- [x] Checkout
- [x] Payment
- [x] Order Tracking
- [x] Notifications
- [x] User Profile

## Required Admin Screens

- [x] Admin Login
- [x] Dashboard
- [x] Food Management
- [x] Add Food
- [x] Customer Management
- [x] Orders
- [x] Payments
- [x] Notifications

## Verification Commands

Run before final upload:

```bash
npm install
npm run typecheck
npx expo config --type public
npx expo export --platform android
npx expo start
```

## Manual Tasks Before Upload

- [ ] Capture screenshots using `docs/SCREENSHOT_CHECKLIST.md`
- [ ] Add screenshots to report or submission folder if required
- [ ] Convert `docs/PROJECT_REPORT.md` to PDF or DOCX if required
- [ ] Convert `docs/PRESENTATION_SLIDES.md` to PowerPoint or PDF if required
- [ ] Confirm Firebase demo project has Authentication, Firestore, and Storage enabled
- [ ] Confirm `.env` is available locally for demonstration but not committed with real secrets
- [ ] Zip the project if required by the lecturer
- [ ] Test the app on Expo Go or an emulator if available

## Scope Confirmation

- [x] No real payment gateway added
- [x] No backend API server added
- [x] No push notification delivery added
- [x] No Google Maps added
- [x] No GPS or live tracking added
