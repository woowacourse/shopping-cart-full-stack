import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import styled from '@emotion/styled';

import {Button, Typo, theme} from '../../../design-system/index.js';
import {createPreorder} from '../../../order/api/orderApi.js';
import {getTotalPrice} from '../../domain/cartSelectors.js';
import {useCart} from '../../hooks/useCart.js';

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;

  return '주문 확인 정보를 생성하지 못했습니다.';
}

export const CartOrderAction = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const {cartItemsState, selectedIds} = useCart();
  const totalPrice = getTotalPrice({items: cartItemsState.items, selectedIds});
  const isPaymentButtonDisabled = totalPrice === 0 || isSubmitting;

  const goToOrderPreview = async () => {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const {preorderId} = await createPreorder(selectedIds);

      navigate(`/order-preview/${preorderId}`);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {errorMessage && (
        <ErrorMessage as='p' color='gray900' variant='caption' weight='medium'>
          {errorMessage}
        </ErrorMessage>
      )}
      <Button disabled={isPaymentButtonDisabled} onClick={goToOrderPreview}>
        {isSubmitting ? '처리 중' : '주문 확인'}
      </Button>
    </>
  );
};

const ErrorMessage = styled(Typo)`
  position: absolute;
  right: 24px;
  bottom: 72px;
  left: 24px;

  padding: 8px 12px;
  border: 1px solid ${theme.colors.gray300};
  border-radius: ${theme.radius[4]};
  background: ${theme.colors.white};
  text-align: center;
`;
