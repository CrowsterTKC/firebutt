import { useContext } from 'react';

import { CategoryContext } from '../providers/context/category-context';

export function useCategory() {
  return useContext(CategoryContext);
}
