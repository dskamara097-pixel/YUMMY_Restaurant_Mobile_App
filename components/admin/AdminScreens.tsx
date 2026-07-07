import type { Href } from 'expo-router';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppBadge } from '@/components/common/AppBadge';
import { AppButton } from '@/components/common/AppButton';
import { AppText } from '@/components/common/AppText';
import { AppInput } from '@/components/forms/AppInput';
import { SearchBar } from '@/components/forms/SearchBar';
import { AdminBottomNavigation } from '@/components/admin/AdminBottomNavigation';
import { AdminActionCard, AdminEntityCard, AdminStatCard } from '@/components/admin/AdminCards';
import { AdminGate } from '@/components/admin/AdminGate';
import { EmptyState } from '@/components/feedback/EmptyState';
import { FriendlyErrorState } from '@/components/feedback/FriendlyErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { spacing } from '@/constants/theme';
import { OrderStatusModel } from '@/models/Order';
import { UserRole, UserStatus } from '@/models/User';
import { useAdminCategories, useAdminFoodFilters, useAdminFoods } from '@/hooks/useAdminCatalog';
import { useAdminDashboard, useAnalytics, useReports } from '@/hooks/useAdminAnalytics';
import { adminOrderStatuses, useAdminOrderFilters, useAdminOrders } from '@/hooks/useAdminOrders';
import { useAdminCoupons, useAdminOffers } from '@/hooks/useAdminPromotions';
import { useAdminRestaurantFilters, useAdminRestaurants } from '@/hooks/useAdminRestaurants';
import { useAdminReviews } from '@/hooks/useAdminReviews';
import { useAdminUserFilters, useAdminUsers } from '@/hooks/useAdminUsers';
import { useSettings } from '@/hooks/useAdminSettings';
import { getVendorOrderStatusLabel } from '@/hooks/useVendorOrders';
import { formatCurrency } from '@/utils/formatCurrency';

const roles: Array<UserRole | 'all'> = ['all', 'customer', 'vendor', 'rider', 'admin'];
const statuses: Array<UserStatus | 'all'> = ['all', 'active', 'pending', 'disabled'];

export function AdminDashboardScreen() {
  const dashboard = useAdminDashboard();
  const data = dashboard.data;
  return <AdminGate><ScreenContainer scroll contentStyle={styles.screen}><AppHeader title="Admin Dashboard" subtitle="Platform control center" leftIcon="arrow-back" onLeftPress={() => router.back()} />{dashboard.loading ? <LoadingState title="Loading admin dashboard" message="Fetching platform metrics." /> : null}{dashboard.error ? <FriendlyErrorState title="Dashboard unavailable" message={dashboard.error} onRetry={dashboard.retry} /> : null}<View style={styles.statsGrid}><AdminStatCard label="Users" value={`${data.totalUsers}`} icon="people-outline" /><AdminStatCard label="Restaurants" value={`${data.totalRestaurants}`} icon="storefront-outline" tone="info" /><AdminStatCard label="Orders" value={`${data.totalOrders}`} icon="receipt-outline" tone="warning" /><AdminStatCard label="Revenue" value={formatCurrency(data.revenueSummary)} icon="cash-outline" tone="success" /></View><View style={styles.section}><SectionHeader title="Administration" subtitle="Firestore-backed management" /><AdminActionCard title="User Management" subtitle="Customers, vendors, riders, and admins" icon="people-outline" badge={`${data.totalUsers}`} onPress={() => router.push('/(admin)/users' as Href)} /><AdminActionCard title="Restaurant Approval" subtitle="Approve, reject, suspend, or restore restaurants" icon="storefront-outline" badge={`${data.totalRestaurants}`} onPress={() => router.push('/(admin)/restaurant-approval' as Href)} /><AdminActionCard title="Orders Management" subtitle="View, search, filter, and update order status" icon="receipt-outline" badge={`${data.pendingOrders} pending`} onPress={() => router.push('/(admin)/orders' as Href)} /><AdminActionCard title="Content Moderation" subtitle="Foods, categories, reviews, coupons, and offers" icon="shield-checkmark-outline" onPress={() => router.push('/(admin)/reviews' as Href)} /><AdminActionCard title="Reports & Analytics" subtitle="Platform summary and operational analytics" icon="analytics-outline" onPress={() => router.push('/(admin)/analytics' as Href)} /></View><AppBadge label="No payment gateway, Storage uploads, push notifications, APIs, GPS, maps, or live tracking added." tone="info" icon="information-circle-outline" /><AdminBottomNavigation active="dashboard" /></ScreenContainer></AdminGate>;
}

export function AdminProfileScreen() {
  return <AdminGate><ScreenContainer scroll contentStyle={styles.screen}><AppHeader title="Admin Profile" subtitle="Administrator account" leftIcon="arrow-back" onLeftPress={() => router.back()} /><AppBadge label="Admin role verified through Firestore profile." tone="success" icon="shield-checkmark-outline" /><AdminActionCard title="User Management" subtitle="Review users and roles" icon="people-outline" onPress={() => router.push('/(admin)/users' as Href)} /><AdminActionCard title="Platform Settings" subtitle="Service fees and maintenance mode" icon="settings-outline" onPress={() => router.push('/(admin)/settings' as Href)} /><AdminBottomNavigation active="settings" /></ScreenContainer></AdminGate>;
}

export function AdminUsersScreen({ fixedRole, title = 'User Management' }: { fixedRole?: UserRole; title?: string }) {
  const usersState = useAdminUsers(fixedRole ?? 'all');
  const [query, setQuery] = useState('');
  const [role, setRole] = useState<UserRole | 'all'>(fixedRole ?? 'all');
  const [status, setStatus] = useState<UserStatus | 'all'>('all');
  const users = useAdminUserFilters(usersState.data, query, fixedRole ?? role, status);
  return <AdminGate><ScreenContainer scroll contentStyle={styles.screen}><AppHeader title={title} subtitle="Search, filter, activate, suspend" leftIcon="arrow-back" onLeftPress={() => router.back()} />{usersState.loading ? <LoadingState title="Loading users" message="Fetching Firestore user records." /> : null}{usersState.error ? <FriendlyErrorState title="Users unavailable" message={usersState.error} onRetry={usersState.retry} /> : null}<SearchBar value={query} onChangeText={setQuery} placeholder="Search users" />{!fixedRole ? <View style={styles.chips}>{roles.map((item) => <AppButton key={item} label={item} size="sm" fullWidth={false} variant={role === item ? 'primary' : 'outline'} onPress={() => setRole(item)} />)}</View> : null}<View style={styles.chips}>{statuses.map((item) => <AppButton key={item} label={item} size="sm" fullWidth={false} variant={status === item ? 'primary' : 'outline'} onPress={() => setStatus(item)} />)}</View>{!usersState.loading && users.length === 0 ? <EmptyState title="No users found" message="Matching Firestore users will appear here." icon="people-outline" /> : null}<View style={styles.section}><SectionHeader title="Users" subtitle={`${users.length} visible`} />{users.map((user) => <AdminEntityCard key={user.id} title={user.fullName} subtitle={`${user.email ?? 'No email'} - ${user.phone}`} meta={`${user.role} - ${user.username}`} badge={user.status} badgeTone={user.status === 'active' ? 'success' : user.status === 'disabled' ? 'danger' : 'warning'} primaryActionLabel="Activate" onPrimaryAction={() => usersState.updateStatus(user.id, 'active')} dangerActionLabel="Suspend" onDangerAction={() => usersState.updateStatus(user.id, 'disabled')} />)}</View><AdminBottomNavigation active="users" /></ScreenContainer></AdminGate>;
}

export function AdminRestaurantsScreen({ approvalOnly = false }: { approvalOnly?: boolean }) {
  const restaurantsState = useAdminRestaurants();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'suspended'>(approvalOnly ? 'pending' : 'all');
  const restaurants = useAdminRestaurantFilters(restaurantsState.data, query, status);
  return <AdminGate><ScreenContainer scroll contentStyle={styles.screen}><AppHeader title={approvalOnly ? 'Restaurant Approval' : 'Vendor Management'} subtitle="Approve, reject, suspend, restore" leftIcon="arrow-back" onLeftPress={() => router.back()} /><SearchBar value={query} onChangeText={setQuery} placeholder="Search restaurants" />{restaurantsState.loading ? <LoadingState title="Loading restaurants" message="Fetching restaurant records." /> : null}{restaurantsState.error ? <FriendlyErrorState title="Restaurants unavailable" message={restaurantsState.error} onRetry={restaurantsState.retry} /> : null}<View style={styles.chips}>{(['all', 'pending', 'approved', 'rejected', 'suspended'] as const).map((item) => <AppButton key={item} label={item} size="sm" fullWidth={false} variant={status === item ? 'primary' : 'outline'} onPress={() => setStatus(item)} />)}</View>{restaurants.length === 0 && !restaurantsState.loading ? <EmptyState title="No restaurants found" message="Matching restaurants will appear here." icon="storefront-outline" /> : null}<View style={styles.section}>{restaurants.map((restaurant) => { const restaurantStatus = restaurant.status ?? (restaurant.active ? 'approved' : 'pending'); return <AdminEntityCard key={restaurant.id} title={restaurant.name} subtitle={restaurant.description} meta={`Owner ${restaurant.ownerId ?? 'unassigned'} - ${restaurant.deliveryTimeMinutes} min`} badge={restaurantStatus} badgeTone={restaurantStatus === 'approved' ? 'success' : restaurantStatus === 'suspended' ? 'danger' : 'warning'} onPress={() => router.push({ pathname: '/(admin)/restaurants/[restaurantId]', params: { restaurantId: restaurant.id } } as unknown as Href)} primaryActionLabel="Approve" onPrimaryAction={() => restaurantsState.approve(restaurant.id)} secondaryActionLabel="Restore" onSecondaryAction={() => restaurantsState.restore(restaurant.id)} dangerActionLabel="Suspend" onDangerAction={() => restaurantsState.suspend(restaurant.id)} />; })}</View><AdminBottomNavigation active="restaurants" /></ScreenContainer></AdminGate>;
}

export function AdminRestaurantDetailsScreen() {
  const { restaurantId } = useLocalSearchParams<{ restaurantId?: string }>();
  const restaurantsState = useAdminRestaurants();
  const restaurant = restaurantsState.data.find((item) => item.id === restaurantId);
  return <AdminGate><ScreenContainer scroll contentStyle={styles.screen}><AppHeader title="Restaurant Details" subtitle={restaurantId ?? 'Restaurant'} leftIcon="arrow-back" onLeftPress={() => router.back()} />{restaurantsState.loading ? <LoadingState title="Loading restaurant" /> : null}{!restaurant && !restaurantsState.loading ? <EmptyState title="Restaurant not found" message="The restaurant document is unavailable." icon="storefront-outline" /> : null}{restaurant ? <><AdminStatCard label="Delivery Fee" value={formatCurrency(restaurant.deliveryFee)} icon="cash-outline" /><AdminEntityCard title={restaurant.name} subtitle={restaurant.description} meta={`Owner ${restaurant.ownerId ?? 'unassigned'} - Rating ${restaurant.rating}`} badge={restaurant.status ?? (restaurant.active ? 'approved' : 'pending')} /><View style={styles.chips}><AppButton label="Approve" fullWidth={false} onPress={() => restaurantsState.approve(restaurant.id)} /><AppButton label="Reject" fullWidth={false} variant="outline" onPress={() => restaurantsState.reject(restaurant.id)} /><AppButton label="Suspend" fullWidth={false} variant="danger" onPress={() => restaurantsState.suspend(restaurant.id)} /></View></> : null}<AdminBottomNavigation active="restaurants" /></ScreenContainer></AdminGate>;
}

export function AdminFoodsScreen() {
  const foodsState = useAdminFoods();
  const [query, setQuery] = useState('');
  const foods = useAdminFoodFilters(foodsState.data, query);
  return <AdminGate><ScreenContainer scroll contentStyle={styles.screen}><AppHeader title="Food Management" subtitle="Delete inappropriate foods" leftIcon="arrow-back" onLeftPress={() => router.back()} />{foodsState.loading ? <LoadingState title="Loading foods" /> : null}{foodsState.error ? <FriendlyErrorState title="Foods unavailable" message={foodsState.error} onRetry={foodsState.retry} /> : null}<SearchBar value={query} onChangeText={setQuery} placeholder="Search foods" />{foods.length === 0 && !foodsState.loading ? <EmptyState title="No foods found" message="Food records will appear here." icon="fast-food-outline" /> : null}<View style={styles.section}>{foods.map((food) => <AdminEntityCard key={food.id} title={food.name} subtitle={food.description} meta={`${formatCurrency(food.price)} - Restaurant ${food.restaurantId}`} badge={food.available ? 'Available' : 'Hidden'} badgeTone={food.available ? 'success' : 'warning'} dangerActionLabel="Delete" onDangerAction={() => foodsState.deleteFood(food.id)} />)}</View><AdminBottomNavigation active="restaurants" /></ScreenContainer></AdminGate>;
}

export function AdminCategoryManagementScreen() {
  const categoriesState = useAdminCategories();
  const [name, setName] = useState('');
  const [notice, setNotice] = useState('');
  async function saveCategory() { if (!name.trim()) { setNotice('Category name is required.'); return; } await categoriesState.saveCategory({ name, active: true, sortOrder: categoriesState.data.length + 1 }); setName(''); setNotice('Category saved to Firestore.'); }
  return <AdminGate><ScreenContainer scroll contentStyle={styles.screen}><AppHeader title="Category Management" subtitle="Platform category CRUD" leftIcon="arrow-back" onLeftPress={() => router.back()} />{categoriesState.loading ? <LoadingState title="Loading categories" /> : null}{categoriesState.error ? <FriendlyErrorState title="Categories unavailable" message={categoriesState.error} onRetry={categoriesState.retry} /> : null}<View style={styles.form}><AppInput label="Category name" value={name} onChangeText={setName} leftIcon="grid-outline" /><AppButton label="Create Category" leftIcon="save-outline" onPress={saveCategory} /></View>{notice ? <AppBadge label={notice} tone="success" icon="checkmark-circle-outline" /> : null}<View style={styles.section}>{categoriesState.data.map((category) => <AdminEntityCard key={category.id} title={category.name} subtitle={category.description} meta={`Sort ${category.sortOrder} - ${category.restaurantId ? 'Restaurant category' : 'Platform category'}`} badge={category.active ? 'Active' : 'Hidden'} badgeTone={category.active ? 'success' : 'warning'} secondaryActionLabel={category.active ? 'Hide' : 'Show'} onSecondaryAction={() => categoriesState.saveCategory({ ...category, active: !category.active })} dangerActionLabel="Delete" onDangerAction={() => categoriesState.deleteCategory(category.id)} />)}</View><AdminBottomNavigation active="restaurants" /></ScreenContainer></AdminGate>;
}

export function AdminOrdersScreen() {
  const ordersState = useAdminOrders();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<OrderStatusModel | 'all'>('all');
  const orders = useAdminOrderFilters(ordersState.data, query, status);
  return <AdminGate><ScreenContainer scroll contentStyle={styles.screen}><AppHeader title="Orders Management" subtitle="Search, filter, update status" leftIcon="arrow-back" onLeftPress={() => router.back()} />{ordersState.loading ? <LoadingState title="Loading orders" /> : null}{ordersState.error ? <FriendlyErrorState title="Orders unavailable" message={ordersState.error} onRetry={ordersState.retry} /> : null}<SearchBar value={query} onChangeText={setQuery} placeholder="Search orders" /><View style={styles.chips}><AppButton label="all" size="sm" fullWidth={false} variant={status === 'all' ? 'primary' : 'outline'} onPress={() => setStatus('all')} />{adminOrderStatuses.map((item) => <AppButton key={item.value} label={item.label} size="sm" fullWidth={false} variant={status === item.value ? 'primary' : 'outline'} onPress={() => setStatus(item.value)} />)}</View>{orders.length === 0 && !ordersState.loading ? <EmptyState title="No orders found" message="Order records will appear here." icon="receipt-outline" /> : null}<View style={styles.section}>{orders.map((order) => <AdminEntityCard key={order.id} title={`Order ${order.id}`} subtitle={order.items.map((item) => `${item.quantity}x ${item.name}`).join(', ')} meta={`${formatCurrency(order.total)} - Restaurant ${order.restaurantId}`} badge={getVendorOrderStatusLabel(order.status)} badgeTone={order.status === 'delivered' ? 'success' : order.status === 'cancelled' ? 'danger' : 'warning'} onPress={() => router.push({ pathname: '/(admin)/orders/[orderId]', params: { orderId: order.id } } as unknown as Href)} secondaryActionLabel="Mark Ready" onSecondaryAction={() => ordersState.updateStatus(order.id, 'ready')} dangerActionLabel="Cancel" onDangerAction={() => ordersState.updateStatus(order.id, 'cancelled')} />)}</View><AdminBottomNavigation active="orders" /></ScreenContainer></AdminGate>;
}

export function AdminOrderDetailsScreen() {
  const { orderId } = useLocalSearchParams<{ orderId?: string }>();
  const ordersState = useAdminOrders();
  const order = ordersState.data.find((item) => item.id === orderId);
  return <AdminGate><ScreenContainer scroll contentStyle={styles.screen}><AppHeader title="Order Details" subtitle={orderId ?? 'Order'} leftIcon="arrow-back" onLeftPress={() => router.back()} />{ordersState.loading ? <LoadingState title="Loading order" /> : null}{!order && !ordersState.loading ? <EmptyState title="Order not found" message="The order document is unavailable." icon="receipt-outline" /> : null}{order ? <><View style={styles.statsGrid}><AdminStatCard label="Total" value={formatCurrency(order.total)} icon="cash-outline" tone="success" /><AdminStatCard label="Status" value={getVendorOrderStatusLabel(order.status)} icon="time-outline" tone="warning" /></View><View style={styles.section}><SectionHeader title="Items" />{order.items.map((item) => <AdminEntityCard key={item.foodId} title={item.name} subtitle={`${item.quantity} x ${formatCurrency(item.unitPrice)}`} meta={formatCurrency(item.lineTotal)} />)}</View><View style={styles.chips}>{adminOrderStatuses.map((status) => <AppButton key={status.value} label={status.label} fullWidth={false} size="sm" onPress={() => ordersState.updateStatus(order.id, status.value)} />)}</View></> : null}<AdminBottomNavigation active="orders" /></ScreenContainer></AdminGate>;
}

export function AdminCouponsScreen() {
  const couponsState = useAdminCoupons();
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  async function saveCoupon() { if (!title.trim() || !code.trim()) return; await couponsState.saveCoupon({ title, code, description: title, discountType: 'percentage', discountValue: 10, expiresAt: '2026-12-31', active: true }); setTitle(''); setCode(''); }
  return <AdminGate><ScreenContainer scroll contentStyle={styles.screen}><AppHeader title="Coupon Management" subtitle="Platform coupon CRUD" leftIcon="arrow-back" onLeftPress={() => router.back()} /><View style={styles.form}><AppInput label="Coupon title" value={title} onChangeText={setTitle} leftIcon="pricetag-outline" /><AppInput label="Code" value={code} onChangeText={setCode} leftIcon="barcode-outline" autoCapitalize="characters" /><AppButton label="Create Coupon" onPress={saveCoupon} /></View>{couponsState.loading ? <LoadingState title="Loading coupons" /> : null}{couponsState.error ? <FriendlyErrorState title="Coupons unavailable" message={couponsState.error} onRetry={couponsState.retry} /> : null}<View style={styles.section}>{couponsState.data.map((coupon) => <AdminEntityCard key={coupon.id} title={coupon.code} subtitle={coupon.title} meta={`${coupon.discountValue}${coupon.discountType === 'percentage' ? '%' : ' SLE'} off`} badge={coupon.active ? 'Active' : 'Hidden'} dangerActionLabel="Delete" onDangerAction={() => couponsState.deleteCoupon(coupon.id)} />)}</View><AdminBottomNavigation active="restaurants" /></ScreenContainer></AdminGate>;
}

export function AdminOffersScreen() {
  const offersState = useAdminOffers();
  const [title, setTitle] = useState('');
  async function saveOffer() { if (!title.trim()) return; await offersState.saveOffer({ title, description: title, discountLabel: '10% off', expiresAt: '2026-12-31', featured: true, active: true }); setTitle(''); }
  return <AdminGate><ScreenContainer scroll contentStyle={styles.screen}><AppHeader title="Offers Management" subtitle="Platform offer CRUD" leftIcon="arrow-back" onLeftPress={() => router.back()} /><View style={styles.form}><AppInput label="Offer title" value={title} onChangeText={setTitle} leftIcon="gift-outline" /><AppButton label="Create Offer" onPress={saveOffer} /></View>{offersState.loading ? <LoadingState title="Loading offers" /> : null}{offersState.error ? <FriendlyErrorState title="Offers unavailable" message={offersState.error} onRetry={offersState.retry} /> : null}<View style={styles.section}>{offersState.data.map((offer) => <AdminEntityCard key={offer.id} title={offer.title} subtitle={offer.description} meta={`${offer.discountLabel} until ${offer.expiresAt}`} badge={offer.active ? 'Active' : 'Hidden'} dangerActionLabel="Delete" onDangerAction={() => offersState.deleteOffer(offer.id)} />)}</View><AdminBottomNavigation active="restaurants" /></ScreenContainer></AdminGate>;
}

export function AdminReviewsScreen() {
  const reviewsState = useAdminReviews();
  return <AdminGate><ScreenContainer scroll contentStyle={styles.screen}><AppHeader title="Reviews Moderation" subtitle="Hide or restore reviews" leftIcon="arrow-back" onLeftPress={() => router.back()} />{reviewsState.loading ? <LoadingState title="Loading reviews" /> : null}{reviewsState.error ? <FriendlyErrorState title="Reviews unavailable" message={reviewsState.error} onRetry={reviewsState.retry} /> : null}{reviewsState.data.length === 0 && !reviewsState.loading ? <EmptyState title="No reviews" message="Review records will appear here." icon="star-outline" /> : null}<View style={styles.section}>{reviewsState.data.map((review) => <AdminEntityCard key={review.id} title={`${review.rating} star review`} subtitle={review.comment} meta={`${review.targetType} ${review.targetId} - User ${review.userId}`} badge={review.hidden ? 'Hidden' : 'Visible'} badgeTone={review.hidden ? 'danger' : 'success'} primaryActionLabel="Restore" onPrimaryAction={() => reviewsState.restoreReview(review.id)} dangerActionLabel="Hide" onDangerAction={() => reviewsState.hideReview(review.id)} />)}</View><AdminBottomNavigation active="dashboard" /></ScreenContainer></AdminGate>;
}

export function AdminReportsScreen() {
  const reports = useReports();
  return <AdminGate><ScreenContainer scroll contentStyle={styles.screen}><AppHeader title="Reports Dashboard" subtitle="Operational platform report" leftIcon="arrow-back" onLeftPress={() => router.back()} />{reports.loading ? <LoadingState title="Loading reports" /> : null}{reports.error ? <FriendlyErrorState title="Reports unavailable" message={reports.error} onRetry={reports.retry} /> : null}<View style={styles.statsGrid}><AdminStatCard label="New Users" value={`${reports.data.newUsers}`} icon="person-add-outline" /><AdminStatCard label="Pending Orders" value={`${reports.data.pendingOrders}`} icon="time-outline" tone="warning" /><AdminStatCard label="Cancelled" value={`${reports.data.cancelledOrders}`} icon="close-circle-outline" tone="danger" /><AdminStatCard label="Revenue" value={formatCurrency(reports.data.revenueSummary)} icon="cash-outline" tone="success" /></View><AdminBadgeNote /><AdminBottomNavigation active="dashboard" /></ScreenContainer></AdminGate>;
}

export function AdminAnalyticsDashboardScreen() {
  const analytics = useAnalytics();
  const data = analytics.data;
  return <AdminGate><ScreenContainer scroll contentStyle={styles.screen}><AppHeader title="Analytics Dashboard" subtitle="Users, restaurants, orders, revenue" leftIcon="arrow-back" onLeftPress={() => router.back()} />{analytics.loading ? <LoadingState title="Loading analytics" /> : null}{analytics.error ? <FriendlyErrorState title="Analytics unavailable" message={analytics.error} onRetry={analytics.retry} /> : null}<View style={styles.statsGrid}><AdminStatCard label="Customers" value={`${data.totalCustomers}`} icon="people-outline" /><AdminStatCard label="Vendors" value={`${data.totalVendors}`} icon="storefront-outline" tone="info" /><AdminStatCard label="Riders" value={`${data.totalRiders}`} icon="bicycle-outline" tone="warning" /><AdminStatCard label="Foods" value={`${data.totalFoods}`} icon="fast-food-outline" /><AdminStatCard label="Completed" value={`${data.completedOrders}`} icon="checkmark-circle-outline" tone="success" /><AdminStatCard label="Revenue" value={formatCurrency(data.revenueSummary)} icon="cash-outline" tone="success" /></View><AdminBadgeNote /><AdminBottomNavigation active="dashboard" /></ScreenContainer></AdminGate>;
}

function AdminBadgeNote() {
  return <AppBadge label="Analytics are calculated from Firestore documents. No payment gateway or backend API was added." tone="info" icon="analytics-outline" />;
}

export function AdminSettingsScreen() {
  const settingsState = useSettings();
  const [platformName, setPlatformName] = useState('');
  const [taxPercentage, setTaxPercentage] = useState('0');
  const [serviceFee, setServiceFee] = useState('0');
  const [deliveryFee, setDeliveryFee] = useState('0');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (hydrated || settingsState.loading) return;
    setPlatformName(settingsState.data.platformName);
    setTaxPercentage(String(settingsState.data.taxPercentage));
    setServiceFee(String(settingsState.data.serviceFee));
    setDeliveryFee(String(settingsState.data.deliveryFee));
    setContactEmail(settingsState.data.contactEmail);
    setContactPhone(settingsState.data.contactPhone);
    setMaintenanceMode(settingsState.data.maintenanceMode);
    setHydrated(true);
  }, [hydrated, settingsState.data, settingsState.loading]);

  async function saveSettings() {
    await settingsState.saveSettings({ platformName, taxPercentage: Number(taxPercentage), serviceFee: Number(serviceFee), deliveryFee: Number(deliveryFee), contactEmail, contactPhone, maintenanceMode });
    setNotice('Platform settings saved to Firestore.');
  }

  return <AdminGate><ScreenContainer scroll contentStyle={styles.screen}><AppHeader title="Platform Settings" subtitle="Fees, tax, maintenance, contact" leftIcon="arrow-back" onLeftPress={() => router.back()} />{settingsState.loading ? <LoadingState title="Loading settings" /> : null}{settingsState.error ? <FriendlyErrorState title="Settings unavailable" message={settingsState.error} onRetry={settingsState.retry} /> : null}<View style={styles.form}><AppInput label="Platform name" value={platformName} onChangeText={setPlatformName} leftIcon="restaurant-outline" /><AppInput label="Tax percentage" value={taxPercentage} onChangeText={setTaxPercentage} keyboardType="number-pad" leftIcon="calculator-outline" /><AppInput label="Service fee" value={serviceFee} onChangeText={setServiceFee} keyboardType="number-pad" leftIcon="cash-outline" /><AppInput label="Delivery fee" value={deliveryFee} onChangeText={setDeliveryFee} keyboardType="number-pad" leftIcon="bicycle-outline" /><AppInput label="Contact email" value={contactEmail} onChangeText={setContactEmail} leftIcon="mail-outline" /><AppInput label="Contact phone" value={contactPhone} onChangeText={setContactPhone} leftIcon="call-outline" /></View><View style={styles.chips}><AppButton label={maintenanceMode ? 'Maintenance On' : 'Maintenance Off'} variant={maintenanceMode ? 'danger' : 'outline'} fullWidth={false} onPress={() => setMaintenanceMode((current) => !current)} /><AppButton label="Save Settings" fullWidth={false} leftIcon="save-outline" onPress={saveSettings} /></View>{notice ? <AppBadge label={notice} tone="success" icon="checkmark-circle-outline" /> : null}<AdminBottomNavigation active="settings" /></ScreenContainer></AdminGate>;
}

export function AdminRoleManagementScreen() {
  const usersState = useAdminUsers('all');
  const [query, setQuery] = useState('');
  const users = useAdminUserFilters(usersState.data, query, 'all', 'all');
  return <AdminGate><ScreenContainer scroll contentStyle={styles.screen}><AppHeader title="Role Management" subtitle="customer, vendor, rider, admin" leftIcon="arrow-back" onLeftPress={() => router.back()} />{usersState.loading ? <LoadingState title="Loading roles" /> : null}{usersState.error ? <FriendlyErrorState title="Roles unavailable" message={usersState.error} onRetry={usersState.retry} /> : null}<SearchBar value={query} onChangeText={setQuery} placeholder="Search users to change role" /><View style={styles.section}>{users.map((user) => <AdminEntityCard key={user.id} title={user.fullName} subtitle={user.email ?? user.username} meta={`Current role: ${user.role}`} badge={user.status} primaryActionLabel="Customer" onPrimaryAction={() => usersState.updateRole(user.id, 'customer')} secondaryActionLabel="Vendor" onSecondaryAction={() => usersState.updateRole(user.id, 'vendor')} dangerActionLabel="Admin" onDangerAction={() => usersState.updateRole(user.id, 'admin')} />)}</View><AppBadge label="Role updates write to Firestore user profile documents only." tone="info" icon="shield-outline" /><AdminBottomNavigation active="settings" /></ScreenContainer></AdminGate>;
}

const styles = StyleSheet.create({
  screen: { gap: spacing.xl, paddingBottom: spacing['2xl'] },
  section: { gap: spacing.md },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  form: { gap: spacing.lg },
});
