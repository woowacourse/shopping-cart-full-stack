import { COLOR_PALETTE } from "@/styles/colorPalette";
import { css } from "@emotion/react";
import styled from "@emotion/styled";

const TYPOGRAPHY = {
  heading1: css`
    font-weight: 700;
    font-size: 24px;
    line-height: 100%;
  `,
  heading2: css`
    font-weight: 700;
    font-size: 18px;
    line-height: 100%;
  `,
  body1: css`
    font-weight: 700;
    font-size: 16px;
    line-height: 100%;
  `,
  body2: css`
    font-weight: 700;
    font-size: 15px;
    line-height: 100%;
  `,
  caption: css`
    font-weight: 500;
    font-size: 12px;
    line-height: 150%;
  `,
} as const;

export type TypographyVariant = keyof typeof TYPOGRAPHY;

interface TextStyleProps {
  typograph?: TypographyVariant;
  color?: keyof typeof COLOR_PALETTE | (string & {});
}

const Text = styled.span<TextStyleProps>`
  ${({ typograph = "body1" }) => TYPOGRAPHY[typograph]}
  color: ${({ color = "black" }) => COLOR_PALETTE[color as keyof typeof COLOR_PALETTE] || color};
  vertical-align: middle;
`;

export default Text;
