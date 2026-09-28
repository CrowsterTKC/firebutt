import { useEffect, useState } from 'react';

import { LoadingSpinner } from '../components/LoadingSpinner';
import { version } from '../../package.json';
import { VersionContext } from './context/version-context';
import { WEB } from '../constants/app';
import { useValue } from '../hooks/use-value';

interface VersionProviderProps {
  children: React.ReactNode;
}

export function VersionProvider({ children }: VersionProviderProps) {
  const [scriptVersion, setScriptVersion] = useState<string>();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const apiUrl = `${WEB.BASE_ORIGIN}${WEB.API_ROUTE}/get-script-version`;
      const { scriptVersion } = (await (await fetch(apiUrl)).json()) as {
        scriptVersion: string;
      };
      setScriptVersion(scriptVersion);
      setIsLoaded(true);
    })();
  }, [setScriptVersion, setIsLoaded]);

  const values = useValue({
    scriptVersion: scriptVersion ?? '1.0.0',
    webAppVersion: version,
  });

  if (!isLoaded) {
    return <LoadingSpinner />;
  }

  return (
    <VersionContext.Provider value={{ ...values }}>
      {children}
    </VersionContext.Provider>
  );
}
