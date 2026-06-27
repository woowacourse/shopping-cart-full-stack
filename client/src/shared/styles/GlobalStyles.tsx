import { Global, css } from "@emotion/react";
import { colors, fonts } from "./tokens";

const globalStyles = css`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html,
  body {
    margin: 0;
    padding: 0;
  }

  body {
    background: ${colors.background};
    color: ${colors.textPrimary};
    font-family: ${fonts.body.fontFamily};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  button {
    background: none;
    border: none;
    padding: 0;
    font: inherit;
    color: inherit;
    cursor: pointer;
  }

  input,
  textarea,
  select {
    font: inherit;
  }

  img,
  picture,
  video {
    display: block;
    max-width: 100%;
  }

  ul,
  ol {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  :focus-visible {
    outline: 2px solid ${colors.ctaActive}; /* #000 — 체크박스와 동일 */
    outline-offset: 2px;
  }
`;

export function GlobalStyles() {
  return <Global styles={globalStyles} />;
}
