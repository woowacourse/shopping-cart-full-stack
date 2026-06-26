import styled from '@emotion/styled';
import CheckedIcon from '../Icons/CheckedIcon';
import UncheckedIcon from '../Icons/UncheckedIcon';

interface CheckBoxProps {
  ariaLabel?: string;
  checked: boolean;
  disabled?: boolean;
  label?: string;
  onToggle: () => void;
}

const CheckBox = ({
  ariaLabel,
  checked,
  disabled = false,
  label,
  onToggle,
}: CheckBoxProps) => {
  return (
    <Button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onToggle}
      $hasLabel={Boolean(label)}
    >
      {checked ? <CheckedIcon /> : <UncheckedIcon />}
      {label && <Label>{label}</Label>}
    </Button>
  );
};

const Button = styled.button<{ $hasLabel: boolean }>`
  width: ${({ $hasLabel }) => ($hasLabel ? 'auto' : '1.5rem')};
  height: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;

  &:disabled {
    cursor: default;
  }
`;

const Label = styled.span`
  font-weight: 500;
  font-size: 0.75rem;
`;

export default CheckBox;
