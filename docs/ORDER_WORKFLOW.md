# Order Workflow

Authority: `PROJECT_BIBLE.md`.

## Phase 9 Workflow

1. Customer adds a Firestore food item to the cart from Food Details.
2. `CartRepository` stores cart items, quantities, subtotals, restaurant references, and image URLs.
3. Checkout validates authenticated user, cart contents, restaurant reference, and delivery address.
4. `OrderRepository` creates the order.
5. `PaymentRepository` creates the dummy payment record.
6. `NotificationRepository` creates order/payment Firestore notifications.
7. Cart is cleared after successful order creation.
8. Customer is routed to the timeline-based tracking screen.

## Order Tracking

Tracking remains status/timeline based. No Google Maps, GPS, route line, rider location, or live map is part of Phase 9.

## Realtime Updates

`useRealtimeOrder()` listens to Firestore order changes for the customer tracking page and rider status page.
