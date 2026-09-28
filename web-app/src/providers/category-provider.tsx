import { useCallback, useEffect, useState } from 'react';
import semver from 'semver';

import { CategoryContext } from './context/category-context';
import { WEB } from '../constants/app';
import { useValue } from '../hooks/use-value';
import { useVersion } from '../hooks/use-version';

interface CategoryProviderProps {
  children: React.ReactNode;
}

const defaultCategory: CategoryData = {
  id: '00000000-0000-0000-0000-000000000000',
  name: 'General Phrases',
  isEnabled: true,
  order: 0,
  insertedAt: new Date(),
  updatedAt: new Date(),
};

export function CategoryProvider({ children }: CategoryProviderProps) {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    '00000000-0000-0000-0000-000000000000'
  );
  const { scriptVersion } = useVersion();

  const refreshCategories = useCallback(async () => {
    if (semver.satisfies(scriptVersion, '>=2.0.0')) {
      const apiUrl = `${WEB.BASE_ORIGIN}${WEB.API_ROUTE}/categories`;
      const { categories } = (await (await fetch(apiUrl)).json()) as {
        categories: CategoryData[];
      };
      setCategories(categories);
    }
  }, [setCategories, scriptVersion]);

  const updateCategoryOrders = useCallback(
    async (orderedCategories: CategoryData[]) => {
      if (semver.satisfies(scriptVersion, '>=2.0.0')) {
        const apiUrl = `${WEB.BASE_ORIGIN}${WEB.API_ROUTE}/categories/reorder`;
        const { categories } = (await (
          await fetch(apiUrl, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ categories: orderedCategories }),
          })
        ).json()) as { categories: CategoryData[] };
        setCategories(categories);
      }
    },
    [setCategories, scriptVersion]
  );

  useEffect(() => {
    (async () => {
      await refreshCategories();
    })();
  }, [refreshCategories]);

  const values = useValue({
    categories: [defaultCategory, ...(categories ?? [])],
    refreshCategories,
    selectedCategory,
    setSelectedCategory,
    updateCategoryOrders,
  });

  return (
    <CategoryContext.Provider value={{ ...values }}>
      {children}
    </CategoryContext.Provider>
  );
}
