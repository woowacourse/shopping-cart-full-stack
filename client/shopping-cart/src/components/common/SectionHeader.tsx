import { css } from '@emotion/react';
import type { ReactNode } from 'react';

type Props = {
  title: string;
  children: ReactNode;
};
const SectionHeader = ({ title, children }: Props) => {
  return (
    <section
      css={css`
        display: flex;
        flex-direction: column;
        gap: 12px;
      `}
    >
      <h2
        css={css`
          font: var(--text-heading);
        `}
      >
        {title}
      </h2>
      {children}
    </section>
  );
};

export default SectionHeader;
