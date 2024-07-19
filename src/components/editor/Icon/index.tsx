import { Ref, PropsWithChildren, forwardRef } from 'react';
import clsx from 'clsx';
import { BaseProps } from '../../type';
import styles from '../style.module.scss';

export const Icon = forwardRef(
  (
    {
      className,
      icon,
      reversed,
      active,
      ...props
    }: PropsWithChildren<BaseProps>,
    ref: Ref<HTMLImageElement>
  ) => {
    const src = new URL(`./icons/${icon}.svg`, import.meta.url).href;
    return (
      <span
        {...props}
        ref={ref}
        className={clsx('material-icons', className, styles.icon)}
        style={{
          WebkitMask: `url(${src}) center/100% no-repeat`,
          background: reversed
            ? active
              ? 'white'
              : '#aaa'
            : active
            ? 'black'
            : '#ccc'
        }}
      />
    );
  }
);
