import { useEffect } from 'react';

import { useVersion } from '../hooks/use-version';
import { useYearlyRecap } from '../hooks/use-yearly-recap';

export default function YearlyRecap() {
  const { scriptVersion } = useVersion();
  const { availableAt, availableUntil, isAvailable, year } = useYearlyRecap();

  useEffect(() => {
    if (!isAvailable) {
      window.location.href = '/';
    }
  }, [isAvailable, year]);

  return (
    <>
      <title>Firebutt — {year} Recap</title>
      {isAvailable && (
        <>
          <div>Yearly Recap Page - Script Version: {scriptVersion}</div>
          <div>Available At: {availableAt?.toString()}</div>
          <div>Available Until: {availableUntil?.toString()}</div>
          <div>Is Available: {isAvailable ? 'Yes' : 'No'}</div>
          <div>Year: {year}</div>
        </>
      )}
    </>
  );
}
