# Folder Structure

```text
YUMMY_Restaurant_Mobile_App/
  app/
    _layout.tsx
    index.tsx
    (auth)/
      _layout.tsx
      login.tsx
      register.tsx
    (customer)/
      _layout.tsx
      home.tsx
    (admin)/
      _layout.tsx
      dashboard.tsx
  components/
    common/
      AppButton.tsx
      PlaceholderScreen.tsx
    forms/
    layout/
      ScreenContainer.tsx
    food/
    cart/
    admin/
  constants/
    theme.ts
  context/
    AppProviders.tsx
    AuthContext.tsx
    CartContext.tsx
  hooks/
    usePhaseStatus.ts
  services/
    README.md
  firebase/
    config.ts
  types/
    index.ts
  utils/
    formatCurrency.ts
  data/
    sampleData.ts
  assets/
  docs/
    SETUP.md
    FOLDER_STRUCTURE.md
    DEVELOPMENT_NOTES.md
```

## Notes

- The `app` directory owns Expo Router routes.
- Parenthesized route groups keep auth, customer, and admin sections organized without adding URL path segments.
- The `components` directory is grouped by reusable UI ownership.
- The `firebase` directory exists now, but real configuration is deferred.
- The `services` directory will contain Firebase repositories and domain services in later phases.
- Empty feature folders are kept with `.gitkeep` files until real components are added.
