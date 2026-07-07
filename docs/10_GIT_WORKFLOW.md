# 10 Git Workflow

Authority: `PROJECT_BIBLE.md`

## Branches

- `main`: stable submission-ready state.
- `develop`: integration branch.
- `feature/<scope>`: feature work.
- `docs/<scope>`: documentation work.
- `fix/<scope>`: bug fixes.

## Commits

Use concise conventional-style commits:

- `feat: add customer registration`
- `fix: correct payment amount validation`
- `docs: add engineering handbook`
- `test: add cart total tests`
- `chore: update dependencies`

## Merge Rule

Do not merge work that fails the quality gates in `12_QUALITY_GATES.md`.