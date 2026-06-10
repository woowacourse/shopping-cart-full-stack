import styled from '@emotion/styled';
import type {ButtonHTMLAttributes, ReactNode} from 'react';

import {theme} from '../foundation/theme.js';
import {fontWeights, typography} from '../foundation/typography.js';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export const Button = ({children, type = 'button', ...props}: ButtonProps) => {
  return (
    <StyledButton type={type} {...props}>
      {children}
    </StyledButton>
  );
};

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  height: 100%;
  min-height: 48px;

  padding: 0 16px;

  border: 0;

  background: ${theme.colors.black};

  color: ${theme.colors.white};
  font-size: ${typography.body.fontSize};
  font-weight: ${fontWeights.bold};
  line-height: ${typography.body.lineHeight};

  cursor: pointer;

  &:disabled {
    background: ${theme.colors.gray300};
    color: ${theme.colors.white};
    cursor: not-allowed;
  }
`;
