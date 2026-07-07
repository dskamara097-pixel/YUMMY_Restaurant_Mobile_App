# Storage Guide

Authority: `PROJECT_BIBLE.md` and `docs/07_FIREBASE_GUIDELINES.md`.

## Phase 9 Storage Scope

Firebase Storage helpers support image upload foundations for:

- Customer profile photos
- Restaurant logos
- Restaurant cover images
- Food images
- Review image placeholders

## Architecture

- `firebase/storage.ts` creates guarded Firebase Storage access.
- `services/storageService.ts` handles upload paths, upload task progress, and download URLs.
- `hooks/useImageUpload.ts` exposes `uploading`, `progress`, `downloadUrl`, `error`, and `uploadImage()`.

## Security

Use `firebase/rules/storage.rules`. Storage writes require authenticated ownership or role-based access. Public reads are allowed for app display images only.

## Image URLs

Do not hardcode production image URLs. Store download URLs returned by Firebase Storage in the relevant Firestore document.
