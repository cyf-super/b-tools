import React from 'react';
import styles from './index.module.scss';

export default function PreviewModal({
  open,
  src,
  setOpen,
  footer,
  children
}: {
  open: boolean;
  src: string;
  setOpen: (falg: boolean) => void;
  footer: React.ReactElement;
  children: React.ReactElement;
}) {
  const onClickMask = (e: any) => {
    e.stopPropagation();
    setOpen(false);
  };
  return (
    <div
      className={styles.modal}
      onClick={onClickMask}
      style={open ? {} : { display: 'none' }}
    >
      <main
        className={styles.content}
        onClick={e => {
          e.stopPropagation();
        }}
      >
        <span className={styles.icon} onClick={() => setOpen(false)}></span>
        <header>图片预览</header>
        <section>
          <div className={styles.left}>
            {src ? (
              <img src={src} alt="" />
            ) : (
              <div className={styles.loading}>图片加载中...</div>
            )}
          </div>
          {children}
        </section>
        {footer}
      </main>
    </div>
  );
}
