import type { ReactNode } from 'react';
import checkedIcon from '../../assets/active-check.svg';
import uncheckedIcon from '../../assets/inactive-check.svg';
import Image from './Image';

type CheckboxProps = {
  checked: boolean;
  children?: ReactNode;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
};

export default function Checkbox({
  checked,
  children,
  disabled = false,
  onChange,
}: CheckboxProps) {
  return (
    <label
      css={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        css={{
          position: 'absolute',
          opacity: '0',
          pointerEvents: 'none',
        }}
      />
      <Image
        src={checked ? checkedIcon : uncheckedIcon}
        alt=""
        ariaHidden
        width={24}
        height={24}
      />
      {children}
    </label>
  );
}
