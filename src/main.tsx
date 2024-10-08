import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import './index.css';
import '@cyf-super/reset-css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.Suspense fallback={<></>}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </React.Suspense>
);
