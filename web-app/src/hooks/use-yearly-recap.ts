import { useContext } from 'react';

import { YearlyRecapContext } from '../providers/context/yearly-recap-context';

export function useYearlyRecap() {
  return useContext(YearlyRecapContext);
}
