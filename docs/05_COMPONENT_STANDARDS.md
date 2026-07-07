# 05 Component Standards

Authority: `PROJECT_BIBLE.md`

## Component Categories

- `components/common`: generic reusable primitives.
- `components/forms`: inputs, validation messages, selectors, and form sections.
- `components/layout`: screen wrappers and layout primitives.
- `components/food`: menu, category, and food details components.
- `components/cart`: cart, checkout, and price summary components.
- `components/admin`: admin dashboard and management components.
- `components/feedback`: loading, empty, and error states.
- `components/profile`: profile avatar and account presentation components.

## Required Component Rules

- Components must use typed props.
- Components must not own unrelated business logic.
- Components must not call Firebase directly.
- Reusable components must support disabled and loading states when relevant.
- Components must use theme tokens for colors, spacing, and radius.
- Components must keep text readable and unclipped on small screens.

## Component Review Checklist

- Is the component reusable or screen-specific?
- Are props named clearly?
- Are accessibility labels included where needed?
- Is the component free of duplicated styling?
- Does it respect the phase boundary?