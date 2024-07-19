import { createHashRouter } from 'react-router-dom';
import App from '../App';
import ErrorPage from '../error-page';
import { FileAnalyze } from '../pages/file-analyze';

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
        }
      ]
    }
  ],
  {
    // basename: '/ease-tools'
  }
);

export { router };
