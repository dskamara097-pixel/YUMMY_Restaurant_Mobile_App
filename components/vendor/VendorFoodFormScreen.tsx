import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppBadge } from '@/components/common/AppBadge';
import { AppButton } from '@/components/common/AppButton';
import { AppInput } from '@/components/forms/AppInput';
import { AppHeader } from '@/components/layout/AppHeader';
import { ScreenContainer } from '@/components/layout/ScreenContainer';
import { VendorBottomNavigation } from '@/components/vendor/VendorBottomNavigation';
import { spacing } from '@/constants/theme';
import { useVendorCategories, useVendorFoods } from '@/hooks/useVendorMenu';
import { useVendorRestaurant } from '@/hooks/useVendorRestaurant';

type FoodForm = { name: string; description: string; price: string; categoryId: string; ingredients: string; available: boolean; featured: boolean };

const initialForm: FoodForm = { name: '', description: '', price: '', categoryId: '', ingredients: '', available: true, featured: false };

function parseIngredients(value: string) { return value.split(',').map((item) => item.trim()).filter(Boolean); }

export function VendorFoodFormScreen({ mode }: { mode: 'add' | 'edit' }) {
  const { foodId } = useLocalSearchParams<{ foodId?: string }>();
  const restaurantState = useVendorRestaurant();
  const foodsState = useVendorFoods(restaurantState.data?.id);
  const categoriesState = useVendorCategories(restaurantState.data?.id);
  const editingFood = useMemo(() => foodsState.data.find((food) => food.id === foodId), [foodId, foodsState.data]);
  const [values, setValues] = useState<FoodForm>(initialForm);
  const [notice, setNotice] = useState('');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (hydrated || foodsState.loading || categoriesState.loading) return;
    if (mode === 'edit' && editingFood) {
      setValues({ name: editingFood.name, description: editingFood.description, price: String(editingFood.price), categoryId: editingFood.categoryId, ingredients: editingFood.ingredients.join(', '), available: editingFood.available, featured: editingFood.featured });
    } else if (mode === 'add' && categoriesState.data[0]) {
      setValues((current) => ({ ...current, categoryId: categoriesState.data[0].id }));
    }
    setHydrated(true);
  }, [categoriesState.data, categoriesState.loading, editingFood, foodsState.loading, hydrated, mode]);

  function updateField(field: keyof FoodForm, value: string | boolean) { setValues((current) => ({ ...current, [field]: value })); setNotice(''); }

  async function handleSave() {
    const price = Number(values.price);
    if (!values.name.trim() || !values.description.trim()) { setNotice('Food name and description are required.'); return; }
    if (!values.categoryId.trim()) { setNotice('Select or enter a category id before saving.'); return; }
    if (!Number.isFinite(price) || price <= 0) { setNotice('Food price must be greater than zero.'); return; }
    try {
      await foodsState.saveFood({ id: mode === 'edit' ? foodId : undefined, name: values.name, description: values.description, price, categoryId: values.categoryId, ingredients: parseIngredients(values.ingredients), available: values.available, featured: values.featured });
      setNotice(mode === 'edit' ? 'Food item updated in Firestore.' : 'Food item created in Firestore.');
      if (mode === 'add') setValues({ ...initialForm, categoryId: categoriesState.data[0]?.id ?? '' });
    } catch (error) {
      const nextError = error as { message?: string };
      setNotice(nextError.message ?? 'Unable to save food item.');
    }
  }

  return (
    <ScreenContainer scroll contentStyle={styles.screen}>
      <AppHeader title={mode === 'edit' ? 'Edit Food' : 'Add Food'} subtitle="Firestore menu item" leftIcon="arrow-back" onLeftPress={() => router.back()} />
      <View style={styles.form}>
        <AppInput label="Food name" value={values.name} onChangeText={(value) => updateField('name', value)} leftIcon="fast-food-outline" />
        <AppInput label="Description" value={values.description} onChangeText={(value) => updateField('description', value)} leftIcon="reader-outline" multiline numberOfLines={3} textAlignVertical="top" />
        <AppInput label="Price" value={values.price} onChangeText={(value) => updateField('price', value)} leftIcon="cash-outline" keyboardType="number-pad" />
        <AppInput label="Category ID" value={values.categoryId} onChangeText={(value) => updateField('categoryId', value)} leftIcon="grid-outline" helperText={categoriesState.data.length ? `Available: ${categoriesState.data.map((category) => category.name).join(', ')}` : 'Create categories first for friendlier menu grouping.'} />
        <AppInput label="Ingredients" value={values.ingredients} onChangeText={(value) => updateField('ingredients', value)} leftIcon="leaf-outline" helperText="Comma-separated ingredients." />
      </View>
      <View style={styles.toggleRow}><AppButton label={values.available ? 'Available' : 'Hidden'} variant={values.available ? 'primary' : 'outline'} fullWidth={false} leftIcon="eye-outline" onPress={() => updateField('available', !values.available)} /><AppButton label={values.featured ? 'Featured' : 'Not Featured'} variant={values.featured ? 'secondary' : 'outline'} fullWidth={false} leftIcon="star-outline" onPress={() => updateField('featured', !values.featured)} /></View>
      {notice ? <AppBadge label={notice} tone={notice.includes('Firestore') ? 'success' : 'warning'} icon={notice.includes('Firestore') ? 'checkmark-circle-outline' : 'warning-outline'} /> : null}
      <AppButton label={mode === 'edit' ? 'Save Food Changes' : 'Create Food Item'} leftIcon="save-outline" loading={foodsState.loading} onPress={handleSave} />
      <VendorBottomNavigation active="menu" />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({ screen: { gap: spacing.xl, paddingBottom: spacing['2xl'] }, form: { gap: spacing.lg }, toggleRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md } });
