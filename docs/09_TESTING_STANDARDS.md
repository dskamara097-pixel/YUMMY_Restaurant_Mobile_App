# 09 Testing Standards

Authority: `PROJECT_BIBLE.md`

## Setup Phase Tests

- `npm install`
- `npm run typecheck`
- `npx expo config --type public`
- Expo route or bundle verification where practical

## Feature Phase Tests

Future feature phases should include:

- Unit tests for validation and calculation utilities.
- Integration tests for role and service flows where practical.
- Manual QA for mobile screens.
- Firebase security rule checks for Firebase phases.

## Critical Future Test Areas

- Registration validation.
- Username uniqueness.
- Login and role routing.
- Cart total calculation.
- Dummy payment validation.
- Order status transitions.
- Payment approval notification generation.

## Test Evidence

Each phase must report what was tested and what could not be tested.