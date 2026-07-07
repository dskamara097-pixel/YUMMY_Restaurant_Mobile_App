import { useCallback } from 'react';

import { CategoryModel } from '@/models/Category';
import { FoodModel } from '@/models/Food';
import { categoryRepository } from '@/repositories/CategoryRepository';
import { foodRepository } from '@/repositories/FoodRepository';
import { useFirestoreData } from '@/hooks/useFirestoreData';

export type SaveVendorCategoryInput = {
  id?: string;
  name: string;
  description?: string;
  active: boolean;
  sortOrder: number;
};

export type SaveVendorFoodInput = {
  id?: string;
  name: string;
  description: string;
  categoryId: string;
  price: number;
  ingredients: string[];
  available: boolean;
  featured: boolean;
};

export function useVendorCategories(restaurantId?: string) {
  const loader = useCallback(async () => (restaurantId ? categoryRepository.listByRestaurant(restaurantId) : []), [restaurantId]);
  const state = useFirestoreData<CategoryModel[]>(`vendor-categories:${restaurantId ?? 'none'}`, [], loader);
  const retry = state.retry;

  const saveCategory = useCallback(async (input: SaveVendorCategoryInput) => {
    if (!restaurantId) throw new Error('Create a restaurant profile before managing categories.');
    const timestamp = new Date().toISOString();
    const payload = {
      restaurantId,
      name: input.name.trim(),
      description: input.description?.trim(),
      active: input.active,
      sortOrder: input.sortOrder,
      updatedAt: timestamp,
    };

    if (input.id) await categoryRepository.update(input.id, payload);
    else await categoryRepository.create({ ...payload, createdAt: timestamp });
    await retry();
  }, [restaurantId, retry]);

  const deleteCategory = useCallback(async (categoryId: string) => {
    await categoryRepository.delete(categoryId);
    await retry();
  }, [retry]);

  return { ...state, saveCategory, deleteCategory };
}

export function useVendorFoods(restaurantId?: string) {
  const loader = useCallback(async () => (restaurantId ? foodRepository.listByRestaurant(restaurantId) : []), [restaurantId]);
  const state = useFirestoreData<FoodModel[]>(`vendor-foods:${restaurantId ?? 'none'}`, [], loader);
  const retry = state.retry;

  const saveFood = useCallback(async (input: SaveVendorFoodInput) => {
    if (!restaurantId) throw new Error('Create a restaurant profile before managing food.');
    const timestamp = new Date().toISOString();
    const payload = {
      restaurantId,
      name: input.name.trim(),
      description: input.description.trim(),
      categoryId: input.categoryId,
      price: input.price,
      currency: 'SLE' as const,
      ingredients: input.ingredients,
      available: input.available,
      featured: input.featured,
      updatedAt: timestamp,
    };

    if (input.id) await foodRepository.update(input.id, payload);
    else await foodRepository.create({ ...payload, createdAt: timestamp });
    await retry();
  }, [restaurantId, retry]);

  const deleteFood = useCallback(async (foodId: string) => {
    await foodRepository.delete(foodId);
    await retry();
  }, [retry]);

  const toggleAvailability = useCallback(async (food: FoodModel) => {
    await foodRepository.update(food.id, { available: !food.available });
    await retry();
  }, [retry]);

  return { ...state, saveFood, deleteFood, toggleAvailability };
}
