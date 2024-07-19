import './App.scss';
import { useEffect } from 'react';
import { Header } from './pages/header';
import { Toaster } from 'sonner';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import clsx from 'clsx';

const textHtmlUrl = new URL('/sider/textHtml.svg', import.meta.url).href;

function App() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (pathname === '/') {
      navigate('/file-analyze');
    }
  }, [pathname, navigate]);

  return (
    <>
      <Header />
      <div id="sidebar" className="sidebar">
        <nav className="nav">
          <ul>
            <li>
              <Link
                to={`/file-analyze`}
                className={clsx(pathname === '/file-analyze' && 'active')}
              >
                <img className="nav-img" src={textHtmlUrl} alt="" />
                <span>File Path</span>
              </Link>
            </li>
          </ul>
        </nav>
        <div className="sidebar-detail">
          <Outlet />
        </div>
      </div>

      <Toaster position="top-right" duration={1500} className="toaster" />
    </>
  );
}

export default App;
