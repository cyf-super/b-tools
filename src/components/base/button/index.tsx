import { BaseProps } from '@/components/type';
import { PropsWithChildren } from 'react';
import styles from './style.module.scss';
import clsx from 'clsx';

type ButtonType = PropsWithChildren<{
  disabled?: boolean;
  primary?: boolean;
}> &
  BaseProps;

export const BaseButton = function ({
  className,
  disabled,
  primary = false,
  ...props
}: ButtonType) {
  return (
    <button
      {...props}
      className={clsx(
        styles.button,
        className,
        disabled && styles.disabled,
        primary && styles.primary
      )}
      style={{}}
    ></button>
  );
};
