import { createHashRouter } from 'react-router-dom';
import App from '../App';
import ErrorPage from '../error-page';
import { FilePath } from '../pages/file-path';

const router = createHashRouter(
  [
    {
      path: '/:id?',
      element: <App />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: 'file-path',
          element: <FilePath />
        }
      ]
    }
  ],
  {
    // basename: '/ease-tools'
  }
);

export { router };
