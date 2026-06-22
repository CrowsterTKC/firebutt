/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext } from 'react';

export const CategoryContext = createContext<CategoryProviderValue>({
  categories: [],
  selectedCategory: '',
  setSelectedCategory: (_: string) => {},
  refreshCategories: (): Promise<void> => Promise.resolve(),
  updateCategoryOrders: (_: CategoryData[]): Promise<void> => Promise.resolve(),
});
