import { createHashRouter } from 'react-router-dom';
import App from '../App';
import ErrorPage from '../error-page';
import React from 'react';

const FileAnalyze = React.lazy(() => import('../pages/file-analyze'));
const GeneratePicture = React.lazy(() => import('../pages/generate-picture'));
const SlicePicture = React.lazy(() => import('../pages/slice-picture'));
const DetailPicture = React.lazy(() => import('../pages/detail-picture'));

const router = createHashRouter([
  {
    path: '/:id?',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'file-analyze',
        element: <FileAnalyze />
      },
      {
        path: 'generate-picture',
        element: <GeneratePicture />
      },
      {
        path: 'detail-picture',
        element: <DetailPicture />
      },
      {
        path: 'slice-picture',
        element: <SlicePicture />
      }
    ]
  }
]);

export { router };
