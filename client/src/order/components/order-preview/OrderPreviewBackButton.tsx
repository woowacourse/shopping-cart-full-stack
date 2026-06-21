import styled from '@emotion/styled';

import {backArrowIconUrl} from '../../../design-system/assets/icons/index.js';

interface OrderPreviewBackButtonProps {
  onClick: () => void;
}

export const OrderPreviewBackButton = ({onClick}: OrderPreviewBackButtonProps) => {
  return (
    <Button onClick={onClick} type='button'>
      <Icon alt='뒤로가기' src={backArrowIconUrl} />
    </Button>
  );
};

const Button = styled.button`
  display: inline-flex;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
`;

const Icon = styled.img`
  width: 21px;
  height: 21px;
  object-fit: contain;
`;
