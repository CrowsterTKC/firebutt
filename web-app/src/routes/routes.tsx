import { Routes as ReactRouterRoutes, Route } from 'react-router-dom';

import PhraseManagement from '../pages/phrase-management';
import YearlyRecap from '../pages/yearly-recap';

export function Routes() {
  return (
    <ReactRouterRoutes>
      <Route path='/' element={<PhraseManagement />} />
      <Route path=':id' element={<PhraseManagement />} />
      <Route path='/recap' element={<YearlyRecap />} />
    </ReactRouterRoutes>
  );
}
