export interface FavoriteModel {
  id: string;
  userId: string;
  targetId: string;
  targetType: 'restaurant' | 'food';
  createdAt: string;
}
