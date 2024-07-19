import { useNavigate } from 'react-router-dom';
import styles from './style.module.scss';

const url = new URL('/header/logo.svg', import.meta.url).href;

export function Header() {
  const navigate = useNavigate();
  const onClickHeader = () => {
    navigate('/to-text-html');
  };
  return (
    <div className={styles.header} onClick={onClickHeader}>
      <img className="logo" src={url} alt="" />
      <span className="title">Ease Tools</span>
    </div>
  );
}
