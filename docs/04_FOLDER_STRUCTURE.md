# 04 Folder Structure

Authority: `PROJECT_BIBLE.md`

The canonical folder structure is defined in `PROJECT_BIBLE.md`. This file records how to apply it.

## Current Phase 2 Structure

```text
app/
components/
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

## Rules

- `app/` contains only routes and route layouts.
- `components/` contains reusable UI grouped by common, forms, layout, food, cart, admin, feedback, and profile ownership.
- `constants/` contains shared constants and theme tokens.
- `context/` contains React Context providers.
- `hooks/` contains reusable hooks.
- `services/` contains future domain and Firebase service modules.
- `firebase/` contains Firebase initialization and configuration only after approval.
- `types/` contains shared TypeScript contracts.
- `utils/` contains pure helper functions.
- `data/` contains seed or sample data only.
- `docs/` contains project governance and engineering documentation.

## Legacy Note

`docs/FOLDER_STRUCTURE.md` remains as the Phase 2 setup snapshot. This `04_FOLDER_STRUCTURE.md` is the ongoing engineering standard.