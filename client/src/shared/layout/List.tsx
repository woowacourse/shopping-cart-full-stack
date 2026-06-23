import type { ReactNode } from 'react';

type ListProps = {
  children: ReactNode;
};

export default function List({ children }: ListProps) {
  return (
    <ul
      css={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {children}
    </ul>
  );
}
