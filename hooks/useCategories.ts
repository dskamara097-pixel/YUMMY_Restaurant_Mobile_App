import { useCallback } from 'react';

import { CategoryModel } from '@/models/Category';
import { categoryRepository } from '@/repositories/CategoryRepository';
import { useFirestoreData } from '@/hooks/useFirestoreData';
import { sampleCategoryModels } from '@/utils/sampleModelFallbacks';

export function useCategories() {
  const loader = useCallback(async () => {
    const categories = await categoryRepository.listActive();
    return categories.length > 0 ? categories : sampleCategoryModels;
  }, []);

  return useFirestoreData<CategoryModel[]>('categories:active', sampleCategoryModels, loader);
}
