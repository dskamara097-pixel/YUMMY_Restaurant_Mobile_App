# Notifications Guide

Authority: `PROJECT_BIBLE.md`.

## Phase 9 Notification Scope

Notifications are Firestore documents only. Push notifications, device tokens, notification permissions, and cloud messaging delivery are not implemented.

## Notification Types

- `order`
- `payment`
- `promotion`
- `system`

## Events

Phase 9 creates Firestore notifications for order placed and payment received events. Promotion notification helpers are available for admin/vendor workflows.

## Architecture

Notification writes go through `NotificationRepository`. Customer screens load notifications through `useNotifications()` and render them with the existing reusable notification card.
