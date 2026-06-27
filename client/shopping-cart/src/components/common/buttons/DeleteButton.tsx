import { css } from '@emotion/react';

type Props = {
  onClick: () => void;
};

const DeleteButton = ({ onClick }: Props) => {
  return (
    <button
      type="button"
      onClick={onClick}
      css={css`
        display: inline-flex;
        min-width: 43px;
        height: 24px;
        align-items: center;
        justify-content: center;
        padding: 0 8px;
        border-radius: 4px;
        border: 1px solid var(--color-line);
        background-color: var(--color-white);
        color: var(--color-text);
        cursor: pointer;
        white-space: nowrap;
        transition:
          background-color 0.2s ease,
          color 0.2s ease;

        &:hover {
          background-color: #f0f0f0;
        }
      `}
    >
      <p
        css={css`
          font: var(--text-label);
        `}
      >
        삭제
      </p>
    </button>
  );
};

export default DeleteButton;
