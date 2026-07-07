# 03 Coding Standards

Authority: `PROJECT_BIBLE.md`

## Required Standards

- Use TypeScript for all application code.
- Prefer explicit domain interfaces from `types/`.
- Keep screens small and focused.
- Keep Firebase calls out of route files.
- Centralize validation rules.
- Centralize formatting helpers.
- Do not commit secrets.
- Do not introduce a new dependency without a reason and documentation update.

## React Native Standards

- Use functional components.
- Use hooks responsibly and keep dependency arrays correct.
- Keep layout responsive for small and large phone screens.
- Avoid repeated inline style objects for reusable patterns.
- Do not build feature screens before their approved phase.

## Error Handling

Future feature code must provide user-readable error messages and avoid leaking private implementation details.