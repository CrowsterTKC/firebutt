import { Routes as ReactRouterRoutes, Route } from 'react-router-dom';

import PhraseManagement from '../pages/phrase-management';

export function Routes() {
  return (
    <ReactRouterRoutes>
      <Route path='/' element={<PhraseManagement />} />
      <Route path=':id' element={<PhraseManagement />} />
    </ReactRouterRoutes>
  );
}
