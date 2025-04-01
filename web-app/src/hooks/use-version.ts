import { useContext } from 'react';

import { VersionContext } from '../providers/context/version-context';

export function useVersion() {
  return useContext(VersionContext);
}
