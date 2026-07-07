# Component Library

Authority: `PROJECT_BIBLE.md`

Phase 3 provides reusable components for future screens. Phase 4B composes customer browsing UI. Phase 4C adds reusable ordering UI components. Phase 5A adds customer account components. Phase 5B adds review, coupon, loading skeleton, and friendly error components without Firebase, backend logic, payment processing, admin logic, GPS, or live maps. Phase 6A adds backend foundation only and does not change the reusable UI component API.

## Common Components

### AppButton

File: `components/common/AppButton.tsx`

Props:

- `label: string`
- `variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'`
- `size?: 'sm' | 'md' | 'lg'`
- `leftIcon?: AppIconName`
- `rightIcon?: AppIconName`
- `loading?: boolean`
- `fullWidth?: boolean`

Example:

```tsx
<AppButton label="Add to cart" leftIcon="cart-outline" />
```

### AppText

File: `components/common/AppText.tsx`

Props:

- `variant?: 'display' | 'title' | 'sectionTitle' | 'body' | 'bodyStrong' | 'caption' | 'label'`
- `tone?: 'default' | 'muted' | 'primary' | 'inverse' | 'success' | 'warning' | 'danger'`
- `align?: TextStyle['textAlign']`

Example:

```tsx
<AppText variant="title" tone="primary">YUMMY</AppText>
```

### AppIcon

File: `components/common/AppIcon.tsx`

Use for standardized Ionicons rendering.

### AppBadge

File: `components/common/AppBadge.tsx`

Props:

- `label: string`
- `tone?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'info'`
- `icon?: AppIconName`

### AppDivider

File: `components/common/AppDivider.tsx`

Props:

- `vertical?: boolean`
- `inset?: boolean`

## Form Components

### AppInput

File: `components/forms/AppInput.tsx`

Supports labels, helper text, errors, left icon, and right element.

Example:

```tsx
<AppInput label="Username" leftIcon="person-outline" placeholder="Enter username" />
```

### PasswordInput

File: `components/forms/PasswordInput.tsx`

Wraps `AppInput` and adds secure text reveal/hide behavior.

### SearchBar

File: `components/forms/SearchBar.tsx`

Search input with search icon and optional clear action. Used by customer home and search screens in Phase 4B.

## Layout Components

### ScreenContainer

File: `components/layout/ScreenContainer.tsx`

Props:

- `scroll?: boolean`
- `centered?: boolean`
- `padded?: boolean`
- `backgroundColor?: string`
- `contentStyle?: ViewStyle`

### AppHeader

File: `components/layout/AppHeader.tsx`

Reusable title/subtitle header with optional left and right icon actions.

### AuthScreenLayout

File: `components/layout/AuthScreenLayout.tsx`

Reusable authentication screen shell with YUMMY branding, title, description, and keyboard-safe scrolling. Used by login, registration, welcome, and forgot-password UI screens.

### CustomerBottomNavigation

File: `components/layout/CustomerBottomNavigation.tsx`

Reusable customer browsing navigation for Home, Categories, Search, and Favorites. It is UI-only and does not store route or user state.

### SectionHeader

File: `components/layout/SectionHeader.tsx`

Reusable section label with optional action button.

## Feedback Components

### LoadingState

File: `components/feedback/LoadingState.tsx`

### EmptyState

File: `components/feedback/EmptyState.tsx`

### ErrorState

File: `components/feedback/ErrorState.tsx`

### FriendlyErrorState

File: `components/feedback/FriendlyErrorState.tsx`

Reusable friendly error UI with retry support for Phase 5B.

### LoadingSkeleton

File: `components/feedback/LoadingSkeleton.tsx`

Reusable loading skeletons for restaurant cards, food cards, profile, orders, and search.

### ReviewCard

File: `components/feedback/ReviewCard.tsx`

Reusable customer review card with rating, comment, helpful badge, and image placeholder count.

These components provide consistent feedback states for future screens.

## Food Components

### FoodCard

File: `components/food/FoodCard.tsx`

Reusable meal card with image placeholder, category, availability, rating, price, and order button. Phase 4B routes the order button to food details only; no cart logic is attached.

### CategoryCard

File: `components/food/CategoryCard.tsx`

Reusable category selection card used by the categories screen.

### PriceTag

File: `components/food/PriceTag.tsx`

Formats Sierra Leone Leone values with `formatCurrency`.

### RatingBadge

File: `components/food/RatingBadge.tsx`

Displays star rating and optional count.

### CouponCard

File: `components/food/CouponCard.tsx`

Reusable coupon card with promo code, discount, expiry date, optional restaurant name, and Apply UI-only action.

## Cart Components

### CartItemCard

File: `components/cart/CartItemCard.tsx`

Reusable cart row/card with food image placeholder, food name, restaurant name, unit price, quantity controls, remove action, and item subtotal.

### QuantityStepper

File: `components/cart/QuantityStepper.tsx`

Reusable increase/decrease control. It prevents quantity below the configured minimum and is frontend-only in Phase 4C.

### CartSummaryCard

File: `components/cart/CartSummaryCard.tsx`

Reusable subtotal, delivery fee, service fee, discount, and total summary card.

### DeliveryAddressCard

File: `components/cart/DeliveryAddressCard.tsx`

Reusable delivery address card for customer name, phone number, delivery address, and Change Address action. It must not include maps or GPS.

### PromoCodeCard

File: `components/cart/PromoCodeCard.tsx`

Reusable promo code input and Apply button. Phase 4C behavior is frontend placeholder only.

### OrderNotesCard

File: `components/cart/OrderNotesCard.tsx`

Reusable delivery notes input for messages such as `Leave at gate` or `Call when arriving`.
## Profile Components

### ProfileAvatar

File: `components/profile/ProfileAvatar.tsx`

Displays an image avatar or generated initials. Used for customer, rider, and restaurant identity placeholders.

### ProfileInfoCard

File: `components/profile/ProfileInfoCard.tsx`

Reusable customer profile summary card with avatar, full name, phone, email placeholder, delivery address, and Edit Profile action.

### AccountOptionRow

File: `components/profile/AccountOptionRow.tsx`

Reusable account/settings navigation row with icon, title, subtitle, optional badge, and optional destructive tone.

### OrderHistoryCard

File: `components/profile/OrderHistoryCard.tsx`

Reusable previous-order card showing order ID, restaurant, items, date, total amount, status, and Reorder UI-only action.

### TrackingTimeline

File: `components/profile/TrackingTimeline.tsx`

Reusable delivery progress timeline. It must remain timeline-based and must not include Google Maps, GPS, or live map tracking.

### NotificationCard

File: `components/profile/NotificationCard.tsx`

Reusable notification list item for payment, order, and system notifications.

### AddressCard

File: `components/profile/AddressCard.tsx`

Reusable saved-address card with default badge plus edit/delete UI-only actions.
## Component Rules

- Use design tokens from `constants/theme.ts`.
- Do not call Firebase from components.
- Do not hardcode repeated colors or spacing.
- Keep props typed and beginner friendly.
- Prefer these shared components before creating new UI.
- Feature buttons may show UI intent, but business logic belongs in later approved phases.
- Cart and checkout UI may update screen-local quantities and totals, but must not persist orders or process payments in Phase 4C.
- Phase 5A account, order, notification, address, and support actions are UI-only and must not call Firebase or APIs.
- Phase 6A Firebase providers, hooks, repositories, and utilities are not UI components and must not be imported directly into components until an approved integration phase.






## Phase 9 Component Usage Notes

Phase 9 reuses existing cart, feedback, layout, profile, and common components for production-service workflows. `CartItemCard` now supports image URLs passed from Firestore cart items. `NotificationCard` supports the `promotion` notification type in addition to order, payment, and system notifications.
