# Payment Flow

Authority: `PROJECT_BIBLE.md`.

## Phase 9 Payment Policy

YUMMY supports dummy payment records only. There is no real payment processor, card network, bank API, mobile money provider API, webhook, or backend payment API.

## Methods

- Cash on Delivery: creates a payment with `pending` status and an order with `pending` status.
- Dummy Mobile Money: creates a payment with `paid` status and an order with `paymentReceived` status.
- Dummy Card Payment: creates a payment with `paid` status and an order with `paymentReceived` status.

## Status Values

Payment records use:

- `pending`
- `paid`
- `failed`
- `refunded`

## Architecture

Payment data is written through `PaymentRepository` and the `useCheckout()` hook. Screens must not write directly to Firestore.
