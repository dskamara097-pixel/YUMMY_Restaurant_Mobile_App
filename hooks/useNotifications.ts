import { useCallback } from 'react';

import { NotificationModel } from '@/models/Notification';
import { notificationRepository } from '@/repositories/NotificationRepository';
import { useAuth } from '@/hooks/useAuth';
import { useFirestoreData } from '@/hooks/useFirestoreData';

export function useNotifications() {
  const { userId } = useAuth();
  const loader = useCallback(async () => (userId ? notificationRepository.listByUser(userId) : []), [userId]);
  return useFirestoreData<NotificationModel[]>(`notifications:user:${userId ?? 'guest'}`, [], loader);
}
