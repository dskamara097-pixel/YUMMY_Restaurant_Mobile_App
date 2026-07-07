import { useCallback, useMemo } from 'react';

import { FoodModel } from '@/models/Food';
import { CategoryModel } from '@/models/Category';
import { foodRepository } from '@/repositories/FoodRepository';
import { categoryRepository } from '@/repositories/CategoryRepository';
import { useFirestoreData } from '@/hooks/useFirestoreData';
import { SaveVendorCategoryInput } from '@/hooks/useVendorMenu';

export function useAdminFoods() {
  const loader = useCallback(() => foodRepository.listAll(), []);
  const state = useFirestoreData<FoodModel[]>('admin-foods', [], loader);
  const retry = state.retry;
  const deleteFood = useCallback(async (foodId: string) => { await foodRepository.delete(foodId); await retry(); }, [retry]);
  return { ...state, deleteFood };
}

export function useAdminCategories() {
  const loader = useCallback(() => categoryRepository.list(), []);
  const state = useFirestoreData<CategoryModel[]>('admin-categories', [], loader);
  const retry = state.retry;

  const saveCategory = useCallback(async (input: SaveVendorCategoryInput & { restaurantId?: string }) => {
    const timestamp = new Date().toISOString();
    const payload = {
      restaurantId: input.restaurantId,
      name: input.name.trim(),
      description: input.description?.trim(),
      active: input.active,
      sortOrder: input.sortOrder,
      updatedAt: timestamp,
    };
    if (input.id) await categoryRepository.update(input.id, payload);
    else await categoryRepository.create({ ...payload, createdAt: timestamp });
    await retry();
  }, [retry]);

  const deleteCategory = useCallback(async (categoryId: string) => { await categoryRepository.delete(categoryId); await retry(); }, [retry]);
  return { ...state, saveCategory, deleteCategory };
}

export function useAdminFoodFilters(foods: FoodModel[], query: string) {
  return useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return foods.filter((food) => !normalizedQuery || [food.name, food.description, food.restaurantId].join(' ').toLowerCase().includes(normalizedQuery));
  }, [foods, query]);
}
