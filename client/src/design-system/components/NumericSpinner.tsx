import styled from '@emotion/styled';

import {theme} from '../foundation/theme.js';
import {fontWeights, typography} from '../foundation/typography.js';

type NumericSpinnerProps = {
  disabled?: boolean;
  max: number;
  min: number;
  onChange: (value: number) => void;
  value: number;
};

export const NumericSpinner = ({disabled = false, max, min, onChange, value}: NumericSpinnerProps) => {
  const isDecreaseDisabled = disabled || value <= min;
  const isIncreaseDisabled = disabled || value >= max;

  return (
    <Container>
      <ControlButton disabled={isDecreaseDisabled} onClick={() => onChange(value - 1)} type='button'>
        -
      </ControlButton>
      <ValueText>{value}</ValueText>
      <ControlButton disabled={isIncreaseDisabled} onClick={() => onChange(value + 1)} type='button'>
        +
      </ControlButton>
    </Container>
  );
};

const Container = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 12px;
`;

const ControlButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;

  border: 1px solid ${theme.colors.blackAlpha10};
  border-radius: ${theme.radius[8]};
  background: ${theme.colors.white};

  color: ${theme.colors.gray900};
  font-size: 21px;
  line-height: 1;

  cursor: pointer;

  &:disabled {
    color: ${theme.colors.gray300};
    cursor: not-allowed;
  }
`;

const ValueText = styled.span`
  color: ${theme.colors.textPrimary};
  font-size: ${typography.caption.fontSize};
  font-weight: ${fontWeights.medium};
  line-height: ${typography.caption.lineHeight};
  text-align: center;
`;
