import { css } from '@emotion/react';
import CheckboxLabel from '../common/buttons/CheckboxLabel';

type Props = {
  isSelected: boolean;
  onToggle: () => void;
};

const RemoteAreaSelect = ({ isSelected, onToggle }: Props) => {
  return (
    <section
      css={css`
        display: flex;
        flex-direction: column;
        gap: 16px;
      `}
    >
      <p
        css={css`
          font: var(--text-subheading);
          color: #0a0d13;
        `}
      >
        배송 정보
      </p>
      <CheckboxLabel isSelected={isSelected} onToggle={onToggle} label="제주도 및 도서 산간 지역" />
    </section>
  );
};

export default RemoteAreaSelect;
