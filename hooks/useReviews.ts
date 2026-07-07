import { useCallback } from 'react';

import { ReviewModel } from '@/models/Review';
import { reviewRepository } from '@/repositories/ReviewRepository';
import { useFirestoreData } from '@/hooks/useFirestoreData';

export function useReviews(targetId?: string, targetType?: ReviewModel['targetType']) {
  const loader = useCallback(async () => (targetId ? reviewRepository.listByTarget(targetId, targetType) : []), [targetId, targetType]);
  return useFirestoreData<ReviewModel[]>(`reviews:${targetType ?? 'all'}:${targetId ?? 'none'}`, [], loader);
}
