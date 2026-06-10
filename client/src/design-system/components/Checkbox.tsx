import styled from '@emotion/styled';
import type {InputHTMLAttributes, ReactNode} from 'react';

import {Typo} from './Typo.js';
import {theme} from '../foundation/theme.js';

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: ReactNode;
};

export const Checkbox = ({label, ...props}: CheckboxProps) => {
  return (
    <Label>
      <Input type='checkbox' {...props} />
      <Box aria-hidden='true' />
      {label && (
        <Typo variant='caption' weight='medium'>
          {label}
        </Typo>
      )}
    </Label>
  );
};

const Label = styled.label`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`;

const Input = styled.input`
  position: absolute;
  width: 20px;
  height: 20px;
  margin: 0;
  opacity: 0;

  &:checked + span {
    border-color: ${theme.colors.black};
    background: ${theme.colors.black};
  }

  &:checked + span::after {
    border-right-color: ${theme.colors.white};
    border-bottom-color: ${theme.colors.white};
  }

  &:focus-visible + span {
    outline: 2px solid ${theme.colors.textPrimary};
    outline-offset: 2px;
  }
`;

const Box = styled.span`
  position: relative;
  width: 24px;
  height: 24px;
  border: 1px solid ${theme.colors.blackAlpha10};
  border-radius: ${theme.radius[8]};
  background: ${theme.colors.white};

  &::after {
    position: absolute;
    top: 3px;
    left: 8px;

    display: block;
    width: 8px;
    height: 14px;

    border-right: 2px solid ${theme.colors.blackAlpha10};
    border-bottom: 2px solid ${theme.colors.blackAlpha10};
    content: '';
    transform: rotate(45deg);
  }
`;
