export const fontWeights = {
  regular: 400,
  medium: 500,
  bold: 700,
} as const;

export const typography = {
  display: {
    fontSize: '24px',
    lineHeight: '100%',
  },
  headline: {
    fontSize: '20px',
    lineHeight: '28px',
  },
  body: {
    fontSize: '16px',
    lineHeight: '24px',
  },
  caption: {
    fontSize: '12px',
    lineHeight: '15px',
  },
} as const;

export type FontWeight = keyof typeof fontWeights;
export type TypographyVariant = keyof typeof typography;
