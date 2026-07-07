# 02 Architecture Guidelines

Authority: `PROJECT_BIBLE.md`

This document expands the architecture rules in `PROJECT_BIBLE.md` without replacing them.

## Required Architecture

- Expo Router owns navigation through the `app/` directory.
- Shared UI belongs in `components/`.
- Domain state belongs in `context/`, `contexts/`, `hooks/`, and future service-backed stores.
- Firebase access belongs in `firebase/`, `services/`, `repositories/`, and provider modules.
- Auth operations belong in `services/authService.ts`, `providers/AuthenticationProvider.tsx`, and `hooks/useAuth.ts`.
- Domain contracts belong in `types/` and `models/`.
- Formatting and pure helpers belong in `utils/`.
- Theme decisions belong in `constants/theme.ts` unless the theme system is later expanded.

## Layer Rules

- Screens compose components and call hooks.
- Hooks coordinate state and services.
- Services communicate with Firebase only for approved phase scope.
- Phase 6B permits Firebase Authentication calls only.
- Phase 6B forbids Firestore reads/writes, Storage uploads, notification work, payments, backend APIs, and admin feature logic.
- Utilities stay pure and side-effect free.
- Components do not import Firebase directly.

## Firebase Authentication Rules

- Firebase config must read from `EXPO_PUBLIC_FIREBASE_*` environment variables.
- No Firebase credentials may be hardcoded or committed.
- Screens use `useAuth()` and must not call Firebase Auth directly.
- Registration, login, logout, forgot password, email verification, refresh user, update profile, re-authentication, and delete account go through `services/authService.ts`.
- Assignment username, phone, and address persistence requires a later Firestore phase.

## Change Control

Any change to navigation structure, data model, Firebase collections, repository contracts, provider wiring, or authentication flow must be recorded in `DECISION_LOG.md`.

## Phase 6C Repository Architecture

Firestore integration follows the established layered architecture:

1. UI screens render existing components and states.
2. Hooks load, cache, retry, and expose typed data.
3. Repositories own Firestore SDK access.
4. Firebase service files initialize and guard Firebase modules.

No screen should import Firestore SDK functions directly. New Firestore work must extend repositories and hooks first, then connect UI screens through those hooks.
