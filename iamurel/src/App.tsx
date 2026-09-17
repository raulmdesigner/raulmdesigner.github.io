/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';

export default function App() {
  const base = import.meta.env.BASE_URL;
  const basename = base && base !== '/' ? base.replace(/\/$/, '') : undefined;

  return (
    <BrowserRouter basename={basename}>
      <AppRoutes />
    </BrowserRouter>
  );
}
