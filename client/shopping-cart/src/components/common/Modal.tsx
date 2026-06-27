import { css } from '@emotion/react';
import { useEffect } from 'react';
import type { ReactNode } from 'react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
};

const ModalLayout = ({ isOpen, onClose, title, children }: Props) => {
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      css={css`
        position: fixed;
        inset: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        background: rgba(0, 0, 0, 0.4);
        z-index: 100;
      `}
      onClick={onClose}
    >
      <div
        css={css`
          display: flex;
          flex-direction: column;
          width: 100%;
          max-width: 382px;
          max-height: 70vh;
          margin: 0 24px;
          padding: 24px;
          border-radius: 8px;
          background: var(--color-white);
        `}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          css={css`
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-shrink: 0;
            margin-bottom: 32px;
          `}
        >
          {title && (
            <h2
              css={css`
                font: var(--text-subheading);
              `}
            >
              {title}
            </h2>
          )}
          <button
            css={css`
              background: none;
              border: none;
              cursor: pointer;
              font: var(--text-subheading);
            `}
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div
          css={css`
            display: flex;
            flex-direction: column;
            flex: 1;
            min-height: 0;
          `}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default ModalLayout;
