import { useCallback, useMemo } from 'react';

import { NotificationModel } from '@/models/Notification';
import { notificationRepository } from '@/repositories/NotificationRepository';
import { useAuth } from '@/hooks/useAuth';
import { useFirestoreData } from '@/hooks/useFirestoreData';
import { sampleNotificationModels } from '@/utils/sampleModelFallbacks';

export function useNotifications() {
  const { userId } = useAuth();
  const initialNotifications = useMemo(() => sampleNotificationModels.map((notification) => ({ ...notification, userId: userId ?? notification.userId })), [userId]);
  const loader = useCallback(async () => {
    if (!userId) return initialNotifications;

    const notifications = await notificationRepository.listByUser(userId);
    return notifications.length > 0 ? notifications : initialNotifications;
  }, [initialNotifications, userId]);
  return useFirestoreData<NotificationModel[]>(`notifications:user:${userId ?? 'guest'}`, initialNotifications, loader);
}
