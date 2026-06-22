import { createContext } from 'react';

export const VersionContext = createContext<Version>({
  scriptVersion: '0.0.0',
  webAppVersion: '0.0.0',
});
