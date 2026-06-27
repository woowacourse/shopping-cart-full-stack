import { css } from '@emotion/react';

type Props = {
  text: string;
  onClick: () => void;
  isDisabled?: boolean;
};

const PrimaryButton = ({ text, onClick, isDisabled = false }: Props) => {
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      css={css`
        display: flex;
        align-items: center;
        justify-content: center;
        height: 64px;
        width: 100%;
        background-color: ${isDisabled ? `var(--color-button-disabled)` : `var(--color-main)`};
        border: none;
        color: var(--color-white);
        font: var(--text-subheading);
        cursor: ${isDisabled ? `not-allowed` : `pointer`};
        ${!isDisabled && `&:hover { background-color: #555555; }`}
      `}
    >
      {text}
    </button>
  );
};

export default PrimaryButton;
