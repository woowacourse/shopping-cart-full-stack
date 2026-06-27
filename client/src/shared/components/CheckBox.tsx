import styled from "@emotion/styled";
import type { InputHTMLAttributes } from "react";
import { CheckIcon } from "../../assets/icons/CheckIcon";
import { MinusIcon } from "../../assets/icons/MinusIcon";

interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label?: string;
  indeterminate?: boolean;
}

export function Checkbox({
  label,
  indeterminate = false,
  checked = false,
  ...rest
}: CheckboxProps) {
  return (
    <Wrapper>
      <HiddenInput
        type="checkbox"
        checked={checked}
        aria-checked={indeterminate ? "mixed" : !!checked}
        {...rest}
      />
      <CheckboxBox $checked={!!checked} $indeterminate={indeterminate}>
        {indeterminate ? (
          <MinusIcon color="#fff" width={14} height={2} />
        ) : (
          <CheckIcon color={checked ? "#fff" : "rgba(0, 0, 0, 0.1)"} />
        )}
      </CheckboxBox>
      {label && <Label>{label}</Label>}
    </Wrapper>
  );
}

const Wrapper = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`;

const HiddenInput = styled.input`
  position: absolute;
  opacity: 0;
  pointer-events: none;
  &:focus-visible + span {
    outline: 2px solid #000;
    outline-offset: 2px;
    border-radius: 8px;
  }
`;

const CheckboxBox = styled.span<{
  $checked: boolean;
  $indeterminate: boolean;
}>`
  display: inline-grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 8px;
  background: ${({ $checked, $indeterminate }) =>
    $checked || $indeterminate ? "#000" : "#fff"};
  border: 1px solid
    ${({ $checked, $indeterminate }) =>
      $checked || $indeterminate ? "#000" : "rgba(0, 0, 0, 0.1)"};
  transition: all 0.15s;
`;

const Label = styled.span`
  font-size: 12px;
`;
