import { createHashRouter } from 'react-router-dom';
import App from '../App';
import ErrorPage from '../error-page';
import { FileAnalyze } from '../pages/file-analyze';
import { GeneratePicture } from '../pages/generate-picture';

const router = createHashRouter(
  [
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
        }
      ]
    }
  ],
  {
    // basename: '/ease-tools'
  }
);

export { router };
