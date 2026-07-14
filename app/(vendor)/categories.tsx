import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppBadge } from '@/components/common/AppBadge';
import { AppButton } from '@/components/common/AppButton';
import { AppInput } from '@/components/forms/AppInput';
import { EmptyState } from '@/components/feedback/EmptyState';
import { FriendlyErrorState } from '@/components/feedback/FriendlyErrorState';
import { LoadingState } from '@/components/feedback/LoadingState';
import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { VendorBottomNavigation } from '@/components/vendor/VendorBottomNavigation';
import { VendorEntityCard } from '@/components/vendor/VendorCards';
import { spacing } from '@/constants/theme';
import { CategoryModel } from '@/models/Category';
import { useVendorCategories } from '@/hooks/useVendorMenu';
import { useVendorRestaurant } from '@/hooks/useVendorRestaurant';

type CategoryForm = { id?: string; name: string; description: string; sortOrder: string; active: boolean };
const emptyForm: CategoryForm = { name: '', description: '', sortOrder: '1', active: true };

export default function VendorCategoryManagementScreen() {
  const restaurantState = useVendorRestaurant();
  const categoriesState = useVendorCategories(restaurantState.data?.id);
  const [form, setForm] = useState<CategoryForm>(emptyForm);
  const [notice, setNotice] = useState('');
  const firstError = restaurantState.error ?? categoriesState.error;

  function editCategory(category: CategoryModel) {
    setForm({ id: category.id, name: category.name, description: category.description ?? '', sortOrder: String(category.sortOrder), active: category.active });
    setNotice('Editing selected category.');
  }

  function updateField(field: keyof CategoryForm, value: string | boolean) { setForm((current) => ({ ...current, [field]: value })); setNotice(''); }

  async function handleSave() {
    if (!form.name.trim()) { setNotice('Category name is required.'); return; }
    const duplicate = categoriesState.data.some((category) => category.id !== form.id && category.name.trim().toLowerCase() === form.name.trim().toLowerCase());
    if (duplicate) { setNotice('A category with this name already exists.'); return; }
    const sortOrder = Number(form.sortOrder);
    if (!Number.isFinite(sortOrder)) { setNotice('Sort order must be a number.'); return; }
    try {
      await categoriesState.saveCategory({ id: form.id, name: form.name, description: form.description, active: form.active, sortOrder });
      setNotice(form.id ? 'Category updated in Firestore.' : 'Category created in Firestore.');
      setForm(emptyForm);
    } catch (error) {
      const nextError = error as { message?: string };
      setNotice(nextError.message ?? 'Unable to save category.');
    }
  }

  return (
    <ScreenContainer scroll contentStyle={styles.screen}>
      <AppHeader title="Category Management" subtitle="Restaurant menu groups" leftIcon="arrow-back" onLeftPress={() => router.back()} />
      {restaurantState.loading || categoriesState.loading ? <LoadingState title="Loading categories" message="Fetching vendor categories." /> : null}
      {firstError ? <FriendlyErrorState title="Categories unavailable" message={firstError} onRetry={async () => { await Promise.all([restaurantState.retry(), categoriesState.retry()]); }} /> : null}
      <View style={styles.form}>
        <AppInput label="Category name" value={form.name} onChangeText={(value) => updateField('name', value)} leftIcon="grid-outline" />
        <AppInput label="Description" value={form.description} onChangeText={(value) => updateField('description', value)} leftIcon="reader-outline" />
        <AppInput label="Sort order" value={form.sortOrder} onChangeText={(value) => updateField('sortOrder', value)} leftIcon="swap-vertical-outline" keyboardType="number-pad" />
        <View style={styles.actions}><AppButton label={form.active ? 'Active' : 'Hidden'} fullWidth={false} variant={form.active ? 'primary' : 'outline'} onPress={() => updateField('active', !form.active)} /><AppButton label={form.id ? 'Update Category' : 'Create Category'} fullWidth={false} leftIcon="save-outline" onPress={handleSave} /><AppButton label="Clear" fullWidth={false} variant="ghost" onPress={() => setForm(emptyForm)} /></View>
      </View>
      {notice ? <AppBadge label={notice} tone={notice.includes('Firestore') ? 'success' : 'warning'} icon={notice.includes('Firestore') ? 'checkmark-circle-outline' : 'warning-outline'} /> : null}
      {!categoriesState.loading && categoriesState.data.length === 0 ? <EmptyState title="No categories yet" message="Create categories to organize your restaurant menu." icon="grid-outline" /> : null}
      <View style={styles.section}><SectionHeader title="Categories" subtitle={`${categoriesState.data.length} Firestore records`} />{categoriesState.data.map((category) => <VendorEntityCard key={category.id} title={category.name} subtitle={category.description} meta={`Sort order ${category.sortOrder}`} badge={category.active ? 'Active' : 'Hidden'} badgeTone={category.active ? 'success' : 'warning'} primaryActionLabel="Edit" onPrimaryAction={() => editCategory(category)} dangerActionLabel="Delete" onDangerAction={() => categoriesState.deleteCategory(category.id)} />)}</View>
      <VendorBottomNavigation active="menu" />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({ screen: { gap: spacing.xl, paddingBottom: spacing['2xl'] }, form: { gap: spacing.lg }, actions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }, section: { gap: spacing.md } });
