import { useCallback, useMemo } from 'react';

import { ReviewModel } from '@/models/Review';
import { reviewRepository } from '@/repositories/ReviewRepository';
import { useFirestoreData } from '@/hooks/useFirestoreData';
import { sampleReviewModels } from '@/utils/sampleModelFallbacks';

export function useReviews(targetId?: string, targetType?: ReviewModel['targetType']) {
  const initialReviews = useMemo(() => sampleReviewModels.filter((review) => {
    const targetMatches = !targetId || review.targetId === targetId;
    const typeMatches = !targetType || review.targetType === targetType;
    return targetMatches && typeMatches;
  }), [targetId, targetType]);
  const loader = useCallback(async () => {
    if (!targetId) return initialReviews;

    const reviews = await reviewRepository.listByTarget(targetId, targetType);
    return reviews.length > 0 ? reviews : initialReviews;
  }, [initialReviews, targetId, targetType]);
  return useFirestoreData<ReviewModel[]>(`reviews:${targetType ?? 'all'}:${targetId ?? 'none'}`, initialReviews, loader);
}
