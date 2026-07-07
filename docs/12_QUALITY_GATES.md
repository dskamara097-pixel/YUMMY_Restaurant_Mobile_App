# 12 Quality Gates

Authority: `PROJECT_BIBLE.md`

## Universal Gate

- Phase scope respected.
- `npm install` works after dependency changes.
- `npm run typecheck` passes.
- Expo config parses.
- No broken imports.
- No route errors.
- README and docs updated.
- No secrets committed.

## Documentation Gate

- `PROJECT_BIBLE.md` updated when standards change.
- Supporting docs reference `PROJECT_BIBLE.md`.
- `DECISION_LOG.md` records governance decisions.
- Roadmap and assignment compliance are synchronized.

## Feature Gate

Feature phases must also verify:

- Loading states.
- Empty states.
- Error states.
- Validation states.
- Accessibility basics.
- Assignment checklist movement.

## Firebase Gate

Firebase phases must also verify:

- No plaintext passwords.
- No real payment secrets.
- Security rules drafted or tested.
- Data contracts match `types/`.