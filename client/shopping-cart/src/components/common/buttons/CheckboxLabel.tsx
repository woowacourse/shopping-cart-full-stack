import { css } from '@emotion/react';
import Checkbox from './Checkbox';

type Props = {
  isSelected: boolean;
  onToggle: () => void;
  label: string;
  disabled?: boolean;
};

const CheckboxLabel = ({ isSelected, onToggle, label, disabled }: Props) => {
  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        gap: 8px;
      `}
    >
      <Checkbox isSelected={isSelected} onToggle={onToggle} disabled={disabled} />
      <p
        css={css`
          font: var(--text-label);
        `}
      >
        {label}
      </p>
    </div>
  );
};

export default CheckboxLabel;
