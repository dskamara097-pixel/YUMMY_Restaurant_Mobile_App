import { useCallback } from 'react';

import { NotificationModel } from '@/models/Notification';
import { ReviewModel } from '@/models/Review';
import { notificationRepository } from '@/repositories/NotificationRepository';
import { reviewRepository } from '@/repositories/ReviewRepository';
import { useFirestoreData } from '@/hooks/useFirestoreData';

function sortByCreatedAt<TItem extends { createdAt?: string }>(items: TItem[]) {
  return [...items].sort((left, right) => new Date(right.createdAt ?? 0).getTime() - new Date(left.createdAt ?? 0).getTime());
}

export function useVendorNotifications(vendorUserId?: string) {
  const loader = useCallback(async () => (vendorUserId ? notificationRepository.listByUser(vendorUserId).then(sortByCreatedAt) : []), [vendorUserId]);
  const state = useFirestoreData<NotificationModel[]>(`vendor-notifications:${vendorUserId ?? 'none'}`, [], loader);
  const retry = state.retry;

  const markRead = useCallback(async (notificationId: string) => {
    await notificationRepository.markRead(notificationId);
    await retry();
  }, [retry]);

  return { ...state, markRead };
}

export function useVendorReviews(restaurantId?: string) {
  const loader = useCallback(async () => (restaurantId ? reviewRepository.listByTarget(restaurantId, 'restaurant').then(sortByCreatedAt) : []), [restaurantId]);
  const state = useFirestoreData<ReviewModel[]>(`vendor-reviews:${restaurantId ?? 'none'}`, [], loader);
  const retry = state.retry;

  const replyToReview = useCallback(async (reviewId: string, reply: string) => {
    if (!reply.trim()) throw new Error('Reply is required.');
    await reviewRepository.update(reviewId, {
      vendorReply: reply.trim(),
      vendorReplyAt: new Date().toISOString(),
    });
    await retry();
  }, [retry]);

  return { ...state, replyToReview };
}
