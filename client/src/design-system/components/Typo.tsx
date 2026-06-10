import styled from '@emotion/styled';
import type {ElementType, HTMLAttributes, ReactNode} from 'react';

import {theme} from '../foundation/theme.js';
import {fontWeights, typography, type FontWeight, type TypographyVariant} from '../foundation/typography.js';

type ColorToken = keyof typeof theme.colors;

type TypoProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType;
  children: ReactNode;
  color?: ColorToken;
  variant?: TypographyVariant;
  weight?: FontWeight;
};

export const Typo = ({
  as = 'span',
  children,
  color = 'textPrimary',
  variant = 'body',
  weight = 'regular',
  ...props
}: TypoProps) => {
  return (
    <StyledText as={as} $color={color} $variant={variant} $weight={weight} {...props}>
      {children}
    </StyledText>
  );
};

const StyledText = styled.span<{
  $color: ColorToken;
  $variant: TypographyVariant;
  $weight: FontWeight;
}>`
  margin: 0;

  color: ${({$color}) => theme.colors[$color]};
  font-size: ${({$variant}) => typography[$variant].fontSize};
  font-weight: ${({$weight}) => fontWeights[$weight]};
  line-height: ${({$variant}) => typography[$variant].lineHeight};
`;
