# Firebase Authentication Architecture

This document prepares the Firebase authentication architecture for future phases. It does not implement authentication logic.

## Supported Roles

- Customer
- Restaurant
- Admin
- Delivery Rider

## Phase 6A Rules

- Authentication SDK wiring exists only as a Firebase foundation service.
- No screen is connected to Firebase Auth.
- No sign in, sign up, sign out, password reset, or auth listener is implemented.
- Role assignment will be handled in a later approved phase through controlled account creation and custom claims or Firestore role metadata.

## Future Flow

1. Validate form input on the client.
2. Create or authenticate the Firebase user.
3. Store user profile metadata in Firestore.
4. Assign role metadata through approved security architecture.
5. Route users based on role only after backend authentication is approved.

## Security Posture

Default rules deny all reads and writes until the project reaches the Firebase implementation phase where collections, roles, and ownership rules are reviewed together.
