import { useCallback } from 'react';

import { CategoryModel } from '@/models/Category';
import { categoryRepository } from '@/repositories/CategoryRepository';
import { useFirestoreData } from '@/hooks/useFirestoreData';

export function useCategories() {
  const loader = useCallback(() => categoryRepository.listActive(), []);
  return useFirestoreData<CategoryModel[]>('categories:active', [], loader);
}
