import { useCallback } from 'react';

import { ReviewModel } from '@/models/Review';
import { reviewRepository } from '@/repositories/ReviewRepository';
import { useFirestoreData } from '@/hooks/useFirestoreData';

export function useAdminReviews() {
  const loader = useCallback(() => reviewRepository.listAll(), []);
  const state = useFirestoreData<ReviewModel[]>('admin-reviews', [], loader);
  const retry = state.retry;

  const hideReview = useCallback(async (reviewId: string) => { await reviewRepository.hide(reviewId); await retry(); }, [retry]);
  const restoreReview = useCallback(async (reviewId: string) => { await reviewRepository.restore(reviewId); await retry(); }, [retry]);
  return { ...state, hideReview, restoreReview };
}
