import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AdminBottomNavigation } from '@/components/admin/AdminBottomNavigation';
import { AdminEntityCard } from '@/components/admin/AdminCards';
import { AdminGate } from '@/components/admin/AdminGate';
import { AppBadge } from '@/components/common/AppBadge';
import { AppButton } from '@/components/common/AppButton';
import { AppText } from '@/components/common/AppText';
import { EmptyState } from '@/components/feedback/EmptyState';
import { FriendlyErrorState } from '@/components/feedback/FriendlyErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { AppInput } from '@/components/forms/AppInput';
import { SearchBar } from '@/components/forms/SearchBar';
import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { spacing } from '@/constants/theme';
import { FoodModel, NotificationModel, PaymentModel } from '@/models';
import { foodRepository } from '@/repositories/FoodRepository';
import { notificationRepository } from '@/repositories/NotificationRepository';
import { paymentRepository } from '@/repositories/PaymentRepository';
import { useFirestoreData } from '@/hooks/useFirestoreData';
import { formatCurrency } from '@/utils/formatCurrency';

function useAdminPayments() {
  const loader = useCallback(() => paymentRepository.list({ sort: [{ field: 'createdAt', direction: 'desc' }] }), []);
  return useFirestoreData<PaymentModel[]>('admin:payments', [], loader);
}

function useAdminNotifications() {
  const loader = useCallback(() => notificationRepository.list({ sort: [{ field: 'createdAt', direction: 'desc' }] }), []);
  return useFirestoreData<NotificationModel[]>('admin:notifications', [], loader);
}

function paymentTone(status: string) {
  if (status === 'paid') return 'success' as const;
  if (status === 'failed') return 'danger' as const;
  if (status === 'refunded') return 'warning' as const;
  return 'info' as const;
}

export function AdminAddFoodScreen() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [restaurantId, setRestaurantId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [notice, setNotice] = useState('');
  const [saving, setSaving] = useState(false);

  async function saveFood() {
    setNotice('');

    if (!name.trim() || !description.trim() || !price.trim() || !restaurantId.trim() || !categoryId.trim()) {
      setNotice('Food name, description, price, restaurant ID, and category ID are required.');
      return;
    }

    const numericPrice = Number(price);

    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      setNotice('Enter a valid food price.');
      return;
    }

    setSaving(true);

    try {
      const timestamp = new Date().toISOString();
      const food: Omit<FoodModel, 'id'> = {
        restaurantId: restaurantId.trim(),
        categoryId: categoryId.trim(),
        name: name.trim(),
        description: description.trim(),
        price: numericPrice,
        currency: 'SLE',
        ingredients: [],
        available: true,
        featured: false,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      await foodRepository.create(food);
      setName('');
      setDescription('');
      setPrice('');
      setRestaurantId('');
      setCategoryId('');
      setNotice('Food item saved to Firestore.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to save food item.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminGate>
      <ScreenContainer scroll contentStyle={styles.screen}>
        <AppHeader title="Add Food" subtitle="Submission-required admin CRUD" leftIcon="arrow-back" onLeftPress={() => router.back()} />
        <View style={styles.form}>
          <AppInput label="Food name" value={name} onChangeText={setName} leftIcon="fast-food-outline" />
          <AppInput label="Description" value={description} onChangeText={setDescription} leftIcon="document-text-outline" multiline />
          <AppInput label="Price" value={price} onChangeText={setPrice} leftIcon="cash-outline" keyboardType="number-pad" />
          <AppInput label="Restaurant ID" value={restaurantId} onChangeText={setRestaurantId} leftIcon="storefront-outline" autoCapitalize="none" />
          <AppInput label="Category ID" value={categoryId} onChangeText={setCategoryId} leftIcon="grid-outline" autoCapitalize="none" />
          <AppButton label="Save Food" leftIcon="save-outline" loading={saving} onPress={() => void saveFood()} />
        </View>
        {notice ? <AppBadge label={notice} tone={notice.includes('saved') ? 'success' : 'warning'} icon="information-circle-outline" /> : null}
        <AppBadge label="Uses repository CRUD only. No direct Firestore logic in the route." tone="info" icon="shield-checkmark-outline" />
        <AdminBottomNavigation active="restaurants" />
      </ScreenContainer>
    </AdminGate>
  );
}

export function AdminPaymentsScreen() {
  const paymentsState = useAdminPayments();
  const [query, setQuery] = useState('');
  const payments = paymentsState.data.filter((payment) => `${payment.orderId} ${payment.userId} ${payment.method} ${payment.status}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <AdminGate>
      <ScreenContainer scroll contentStyle={styles.screen}>
        <AppHeader title="Payments" subtitle="Dummy payment verification" leftIcon="arrow-back" onLeftPress={() => router.back()} />
        <SearchBar value={query} onChangeText={setQuery} placeholder="Search payments" />
        {paymentsState.loading ? <LoadingState title="Loading payments" /> : null}
        {paymentsState.error ? <FriendlyErrorState title="Payments unavailable" message={paymentsState.error} onRetry={paymentsState.retry} /> : null}
        {payments.length === 0 && !paymentsState.loading ? <EmptyState title="No payments found" message="Dummy payment records will appear here." icon="card-outline" /> : null}
        <View style={styles.section}>
          <SectionHeader title="Payment Records" subtitle="Firestore dummy payments only" />
          {payments.map((payment) => (
            <AdminEntityCard key={payment.id} title={`Payment ${payment.id}`} subtitle={`Order ${payment.orderId} - ${payment.method}`} meta={`${formatCurrency(payment.amount)} - User ${payment.userId}`} badge={payment.status} badgeTone={paymentTone(payment.status)} primaryActionLabel="Mark Paid" onPrimaryAction={() => paymentRepository.updateStatus(payment.id, 'paid')} dangerActionLabel="Mark Failed" onDangerAction={() => paymentRepository.updateStatus(payment.id, 'failed')} />
          ))}
        </View>
        <AppBadge label="No real payment gateway or external payment API is connected." tone="info" icon="card-outline" />
        <AdminBottomNavigation active="orders" />
      </ScreenContainer>
    </AdminGate>
  );
}

export function AdminNotificationsScreen() {
  const notificationsState = useAdminNotifications();
  const [query, setQuery] = useState('');
  const notifications = notificationsState.data.filter((notification) => `${notification.title} ${notification.message} ${notification.type} ${notification.userId}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <AdminGate>
      <ScreenContainer scroll contentStyle={styles.screen}>
        <AppHeader title="Notifications" subtitle="Firestore notification management" leftIcon="arrow-back" onLeftPress={() => router.back()} />
        <SearchBar value={query} onChangeText={setQuery} placeholder="Search notifications" />
        {notificationsState.loading ? <LoadingState title="Loading notifications" /> : null}
        {notificationsState.error ? <FriendlyErrorState title="Notifications unavailable" message={notificationsState.error} onRetry={notificationsState.retry} /> : null}
        {notifications.length === 0 && !notificationsState.loading ? <EmptyState title="No notifications found" message="Order, payment, promotion, and system notifications will appear here." icon="notifications-outline" /> : null}
        <View style={styles.section}>
          <SectionHeader title="Notification Records" subtitle="Firestore documents only" />
          {notifications.map((notification) => (
            <AdminEntityCard key={notification.id} title={notification.title} subtitle={notification.message} meta={`User ${notification.userId} - ${notification.createdAt}`} badge={notification.type} badgeTone={notification.read ? 'success' : 'warning'} primaryActionLabel="Mark Read" onPrimaryAction={() => notificationRepository.markRead(notification.id)} dangerActionLabel="Delete" onDangerAction={() => notificationRepository.delete(notification.id)} />
          ))}
        </View>
        <AppBadge label="Push notification delivery is not implemented." tone="info" icon="notifications-outline" />
        <AdminBottomNavigation active="dashboard" />
      </ScreenContainer>
    </AdminGate>
  );
}

const styles = StyleSheet.create({
  screen: { gap: spacing.xl, paddingBottom: spacing['2xl'] },
  form: { gap: spacing.lg },
  section: { gap: spacing.md },
});
