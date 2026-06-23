import type { CSSObject } from '@emotion/react';
import type { ElementType, ReactNode } from 'react';

type FlexProps = {
  as?: ElementType;
  direction?: 'row' | 'column';
  gap?: number;
  align?: CSSObject['alignItems'];
  justify?: CSSObject['justifyContent'];
  styles?: CSSObject;
  children: ReactNode;
};

export default function Flex({
  as: Component = 'div',
  direction = 'row',
  gap = 0,
  align,
  justify,
  styles,
  children,
}: FlexProps) {
  return (
    <Component
      css={{
        display: 'flex',
        flexDirection: direction,
        gap: `${gap}px`,
        alignItems: align,
        justifyContent: justify,
        ...styles,
      }}
    >
      {children}
    </Component>
  );
}
