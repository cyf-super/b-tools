import { forwardRef, Ref, PropsWithChildren } from 'react';
import clsx from 'clsx';
import { BaseProps } from '../../type';

export const Button = forwardRef(
  (
    {
      className,
      active,
      reversed,
      ...props
    }: PropsWithChildren<
      {
        active: boolean;
        reversed: boolean;
      } & BaseProps
    >,
    ref: Ref<HTMLSpanElement>
  ) => (
    <span
      {...props}
      ref={ref}
      className={clsx(className)}
      style={{
        background: reversed
          ? active
            ? 'white'
            : '#aaa'
          : active
          ? 'black'
          : '#ccc'
      }}
    />
  )
);
