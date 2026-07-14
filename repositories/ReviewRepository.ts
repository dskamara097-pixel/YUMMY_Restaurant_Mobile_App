import { ReviewModel } from '@/models/Review';
import { FirestoreRepository } from '@/repositories/Repository';
import { FIRESTORE_COLLECTIONS } from '@/utils/constants';

export class ReviewRepository extends FirestoreRepository<ReviewModel> {
  constructor() {
    super(FIRESTORE_COLLECTIONS.reviews);
  }

  listAll() {
    return this.list({ sort: [{ field: 'createdAt', direction: 'desc' }] });
  }

  listByTarget(targetId: string, targetType?: ReviewModel['targetType']) {
    const filters = [{ field: 'targetId', value: targetId }];
    if (targetType) filters.push({ field: 'targetType', value: targetType });
    return this.list({ filters })
      .then((reviews) => reviews.sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()));
  }

  hide(reviewId: string) {
    return this.update(reviewId, { hidden: true, moderationStatus: 'hidden' });
  }

  restore(reviewId: string) {
    return this.update(reviewId, { hidden: false, moderationStatus: 'visible' });
  }
}

export const reviewRepository = new ReviewRepository();
