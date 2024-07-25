import { useNavigate } from 'react-router-dom';
import styles from './style.module.scss';

const url = new URL('/header/1F4A9_color.png', import.meta.url).href;

export function Header() {
  const navigate = useNavigate();
  const onClickHeader = () => {
    navigate('/file-analyze');
  };
  return (
    <div className={styles.header} onClick={onClickHeader}>
      <img className="logo" src={url} alt="" />
      <span className="title">B - Tools</span>
    </div>
  );
}
