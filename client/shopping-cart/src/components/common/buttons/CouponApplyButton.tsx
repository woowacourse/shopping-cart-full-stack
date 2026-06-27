import { css } from '@emotion/react';

type Props = {
  onClick: () => void;
};

const CouponApplyButton = ({ onClick }: Props) => {
  return (
    <button
      type="button"
      onClick={onClick}
      css={css`
        display: inline-flex;
        width: 100%;
        height: 48px;
        flex-shrink: 0;
        align-items: center;
        justify-content: center;
        border-radius: 5px;
        border: 1px solid #33333340;
        background-color: var(--color-white);
        cursor: pointer;
        transition: background-color 0.2s ease;

        &:hover {
          background-color: #f0f0f0;
        }
      `}
    >
      <p
        css={css`
          font: var(--text-button);
          color: #333333bf;
        `}
      >
        쿠폰 적용
      </p>
    </button>
  );
};

export default CouponApplyButton;
