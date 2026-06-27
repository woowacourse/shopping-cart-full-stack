import { css } from '@emotion/react';
import infoIcon from '../../assets/info_icon.svg';

type Props = {
  text: string;
};

const InfoNotice = ({ text }: Props) => {
  return (
    <span
      css={css`
        display: flex;
        flex-direction: row;
        gap: 4px;
        align-items: center;
      `}
    >
      <img src={infoIcon} />
      <p
        css={css`
          font: var(--text-label);
        `}
      >
        {text}
      </p>
    </span>
  );
};

export default InfoNotice;
