import { css } from '@emotion/react';
import type { ReactNode } from 'react';

type Props = {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  children: ReactNode;
};

const IconButton = ({ onClick, isActive = false, disabled, children }: Props) => {
  return (
    <button
      type="button"
      aria-pressed={isActive}
      disabled={disabled}
      onClick={onClick}
      css={css`
        display: inline-flex;
        width: 24px;
        height: 24px;
        padding: 0;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        border: 1px solid var(--color-line);
        background-color: ${isActive ? `var(--color-main)` : `var(--color-white)`};
        color: ${isActive ? `var(--color-white)` : `var(--color-text)`};
        cursor: pointer;
        transition:
          background-color 0.2s ease,
          color 0.2s ease;

        &:hover {
          background-color: ${isActive ? `var(--color-main)` : `#f0f0f0`};
        }

        ${disabled &&
        css`
          cursor: not-allowed;
          opacity: 0.4;
        `}
      `}
    >
      {children}
    </button>
  );
};

export default IconButton;
