# 11 Naming Conventions

Authority: `PROJECT_BIBLE.md`

## Code Naming

- Components: PascalCase.
- Hooks: `use` prefix.
- Contexts: PascalCase plus `Context` or `Provider`.
- Services: lower camelCase file names ending with `Service` or `Repository`.
- Types and interfaces: PascalCase.
- Utility functions: lower camelCase.

## Route Naming

- User-facing route files should be lowercase.
- Expo Router groups should remain `(auth)`, `(customer)`, and `(admin)`.
- Dynamic route segments should use descriptive IDs, for example `[foodId].tsx`.

## Data Naming

- Firestore collections use plural lower camelCase.
- Firestore timestamp fields end with `At`.
- Normalized search fields end with `Lower`.