import { useCallback, useEffect, useMemo, useState } from 'react';
import semver from 'semver';

import { WEB } from '../constants/app';
import { useValue } from '../hooks/use-value';
import { useVersion } from '../hooks/use-version';
import { YearlyRecapContext } from './context/yearly-recap-context';

interface YearlyRecapProviderProps {
  children: React.ReactNode;
}

export function YearlyRecapProvider({ children }: YearlyRecapProviderProps) {
  const [availableAt, setAvailableAt] = useState<Date>(
    new Date(new Date().getFullYear(), 11, 1)
  );
  const [availableUntil, setAvailableUntil] = useState<Date>(
    new Date(new Date().getFullYear(), 11, 31, 23, 59, 59, 999)
  );
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const { scriptVersion } = useVersion() as { scriptVersion: string };

  const getAvailabilityByNotification = useCallback(async () => {
    const apiUrl = `${WEB.BASE_ORIGIN}${WEB.API_ROUTE}/notifications`;
    const response = await fetch(apiUrl);
    const data = (await response.json()).notifications as Notification[];

    const recapNotification = data
      .sort((a, b) => {
        const aPostedDate = new Date(
          (a.metadata?.postedDate as string) || '2025-04-01T00:00:00Z'
        );
        const bPostedDate = new Date(
          (b.metadata?.postedDate as string) || '2025-04-01T00:00:00Z'
        );
        return bPostedDate.getTime() - aPostedDate.getTime();
      })
      .find((notification) => {
        const rawAvailableAt = notification.metadata?.recapAvailableAt;
        const rawRecapYear = notification.metadata?.recapYear;
        return Boolean(
          rawAvailableAt && rawRecapYear === String(new Date().getFullYear())
        );
      });

    if (recapNotification) {
      const availableAt =
        (recapNotification.metadata?.recapAvailableAt as string) ||
        new Date(new Date().getFullYear(), 11, 15).toISOString();
      setAvailableAt(new Date(availableAt));

      const availableUntil =
        (recapNotification.metadata?.recapAvailableUntil as string) ||
        new Date(new Date().getFullYear(), 11, 31).toISOString();
      setAvailableUntil(new Date(availableUntil));

      const recapYear =
        recapNotification.metadata?.recapYear || new Date().getFullYear();
      setYear(Number(recapYear));
    }
  }, []);

  useEffect(() => {
    switch (true) {
      case semver.satisfies(scriptVersion, '<=1.0.0'):
        // No-op for versions <= 1.0.0. Using default availability and year dates.
        break;
      case semver.satisfies(scriptVersion, '>1.0.0'):
        (async () => await getAvailabilityByNotification())();
        break;
    }
  }, [getAvailabilityByNotification, scriptVersion]);

  const isAvailable = useMemo(() => {
    const now = new Date();
    return now >= availableAt && now <= availableUntil;
  }, [availableAt, availableUntil]);

  const values = useValue({
    availableAt,
    availableUntil,
    isAvailable,
    year,
  });

  return (
    <YearlyRecapContext.Provider value={{ ...values }}>
      {children}
    </YearlyRecapContext.Provider>
  );
}
