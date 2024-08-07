import './App.scss';
import { useEffect } from 'react';
import { Header } from './pages/header';
import { Toaster } from 'sonner';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import fileAnalyzeSrc from '/sider/textHtml.svg';

const linkList = [
  {
    name: 'File Analyze',
    image: fileAnalyzeSrc,
    router: '/file-analyze'
  },
  {
    name: 'Generate Picture',
    image: fileAnalyzeSrc,
    router: '/generate-picture'
  },
  {
    name: 'Detail Picture',
    image: fileAnalyzeSrc,
    router: '/detail-picture'
  },
  {
    name: 'Slice Picture',
    image: fileAnalyzeSrc,
    router: '/slice-picture'
  }
];

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
              {linkList.map(item => (
                <Link
                  to={item.router}
                  className={clsx(pathname === item.router && 'active')}
                >
                  <img className="nav-img" src={item.image} alt="" />
                  <span>{item.name}</span>
                </Link>
              ))}
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
