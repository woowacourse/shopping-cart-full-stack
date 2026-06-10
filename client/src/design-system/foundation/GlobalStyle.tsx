import {Global, css} from '@emotion/react';

export const GlobalStyle = () => {
  return (
    <Global
      styles={css`
        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }

        html,
        body,
        #root {
          min-height: 100%;
        }

        body {
          margin: 0;
          font-family: 'Noto Sans KR', sans-serif;
        }

        button {
          font-family: inherit;
        }
      `}
    />
  );
};
