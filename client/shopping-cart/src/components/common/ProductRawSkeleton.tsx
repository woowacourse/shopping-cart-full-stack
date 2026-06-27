import { css, keyframes } from '@emotion/react';

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: 200px 0; }
`;

const skeletonStyle = (width: string, height: string) => css`
  width: ${width};
  height: ${height};
  border-radius: 4px;
  background: linear-gradient(90deg, #e8e8e8 25%, #f5f5f5 50%, #e8e8e8 75%);
  background-size: 400px 100%;
  animation: ${shimmer} 1.2s infinite linear;
`;

const ProductRawSkeleton = () => {
  return (
    <li
      css={css`
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 12px 0 20px;
        border-top: 1px solid var(--color-line);
      `}
    >
      <div
        css={css`
          display: flex;
          justify-content: space-between;
        `}
      >
        <div css={skeletonStyle('24px', '24px')} />
        <div css={skeletonStyle('43px', '24px')} />
      </div>
      <div
        css={css`
          display: flex;
          flex-direction: row;
          gap: 24px;
        `}
      >
        <div css={skeletonStyle('112px', '112px')} />
        <div
          css={css`
            display: flex;
            flex-direction: column;
            gap: 24px;
            flex: 1;
          `}
        >
          <div
            css={css`
              display: flex;
              flex-direction: column;
              gap: 4px;
            `}
          >
            <div css={skeletonStyle('60%', '15px')} />
            <div css={skeletonStyle('40%', '24px')} />
          </div>
          <div css={skeletonStyle('80px', '24px')} />
        </div>
      </div>
    </li>
  );
};

export default ProductRawSkeleton;
