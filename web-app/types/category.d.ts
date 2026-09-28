interface CategoryData {
  id: string;
  name: string;
  isEnabled: boolean;
  order: number;
  insertedAt: Date;
  updatedAt: Date;
}

interface CategoryProviderValue {
  categories: CategoryData[];
  refreshCategories: () => Promise<void>;
  selectedCategory: string;
  setSelectedCategory: (id: string) => void;
  updateCategoryOrders: (orderedCategories: CategoryData[]) => Promise<void>;
}
