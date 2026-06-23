import type { ReactNode } from 'react';

type RowProps = {
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
};

export default function Row({ left, center, right }: RowProps) {
  return (
    <div
      css={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto',
        columnGap: '24px',
        width: '100%',
      }}
    >
      {left && <div css={{ gridColumn: 1 }}>{left}</div>}
      {center && (
        <div css={{ gridColumn: 2, alignItems: 'center', display: 'flex' }}>
          {center}
        </div>
      )}
      {right && <div css={{ gridColumn: 3 }}>{right}</div>}
    </div>
  );
}
