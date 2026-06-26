import styled from "@emotion/styled";
import UnChecked from "../images/un-checked.svg?react";
import Checked from "../images/checked.svg?react";

type CheckboxProps = React.ComponentPropsWithoutRef<"input"> & {
  labelText?: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Checkbox({
  labelText,
  checked,
  onChange,
  ...props
}: CheckboxProps) {
  return (
    <CheckboxLabel>
      <input type="checkbox" {...props} onChange={onChange} checked={checked} />
      {checked ? <Checked /> : <UnChecked />}
      {labelText && <span>{labelText}</span>}
    </CheckboxLabel>
  );
}

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  input {
    display: none;
  }

  span {
    font-weight: 500;
    font-size: 12px;
  }
`;
