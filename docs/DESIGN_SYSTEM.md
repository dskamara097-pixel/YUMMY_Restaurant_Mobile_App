# Design System

Authority: `PROJECT_BIBLE.md`

Phase 3 creates the reusable visual foundation for YUMMY Restaurant Mobile Application. These tokens are the source for component styling and should be used instead of hardcoded values.

## Token Files

- `constants/colors.ts`
- `constants/spacing.ts`
- `constants/typography.ts`
- `constants/radius.ts`
- `constants/shadows.ts`
- `constants/icons.ts`
- `constants/theme.ts`

## Colors

Primary brand colors:

- Primary: `#CE1212`
- Primary dark: `#9B0D0D`
- Primary soft: `#FFE5E2`
- Accent: `#F4A261`
- Canvas: `#FFF8F4`
- Surface: `#FFFFFF`
- Ink: `#1E1E24`

Semantic colors:

- Success: `#2A9D8F`
- Warning: `#E9A227`
- Danger: `#D64545`
- Info: `#3B82F6`

Usage:

```ts
import { colors } from '@/constants/theme';

const backgroundColor = colors.brand.primary;
```

## Typography

Typography tokens live in `constants/typography.ts` and are grouped as:

- `display`
- `title`
- `sectionTitle`
- `body`
- `bodyStrong`
- `caption`
- `label`

Usage:

```tsx
<AppText variant="sectionTitle">Popular Meals</AppText>
<AppText tone="muted">Fresh meals prepared today.</AppText>
```

## Spacing

Spacing uses a consistent scale from `xxs` to `4xl`. Layout-level tokens include:

- `screenPadding`
- `compactScreenPadding`
- `sectionGap`
- `cardGap`
- `minTouchTarget`

Usage:

```ts
import { spacing } from '@/constants/theme';

const gap = spacing.md;
```

## Radius

Radius tokens include:

- `xs`
- `sm`
- `md`
- `lg`
- `xl`
- `pill`

Cards typically use `lg`. Buttons typically use `md`. Pills and badges use `pill`.

## Shadows

Shadow tokens include:

- `none`
- `soft`
- `card`
- `floating`

Use shadows sparingly. Cards may use `soft` or `card`; floating action surfaces may use `floating`.

## Icons

Icons are standardized through Expo Vector Icons Ionicons. Use `AppIcon` instead of importing `Ionicons` directly inside feature components.

Usage:

```tsx
<AppIcon name="cart-outline" />
```

## Accessibility

All new components should respect the Project Bible accessibility rules: readable contrast, 44-point minimum touch targets, clear labels, and status messaging that does not rely on color alone.