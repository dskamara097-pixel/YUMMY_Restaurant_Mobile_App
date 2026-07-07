export interface ReviewModel {
  id: string;
  targetId: string;
  targetType: 'restaurant' | 'food';
  userId: string;
  rating: number;
  comment: string;
  imageUrls?: string[];
  helpfulCount: number;
  hidden?: boolean;
  moderationStatus?: 'visible' | 'hidden';
  createdAt: string;
  updatedAt?: string;
}
