import styled from '@emotion/styled';
import {useNavigate} from 'react-router-dom';

import {backArrowIconUrl} from '../../design-system/assets/icons/index.js';
import {AsyncStateView, Button, FixedBottomAction, fontWeights, theme, typography} from '../../design-system/index.js';

import {CartErrorView} from '../components/cart-page/CartErrorView.js';
import {CartLoadingView} from '../components/cart-page/CartLoadingView.js';
import {useCart} from '../hooks/useCart.js';
import {getSelectedItemCount, getSelectedQuantity, getTotalPrice} from '../domain/cartSelectors.js';
import {formatPrice} from '../domain/priceFormatter.js';

export const OrderConfirmPage = () => {
  const navigate = useNavigate();
  const {cartItemsState, loadCartItems, selectedIds} = useCart();
  const cartSelection = {items: cartItemsState.items, selectedIds};

  const selectedItemCount = getSelectedItemCount(cartSelection);
  const selectedQuantity = getSelectedQuantity(cartSelection);
  const totalPrice = getTotalPrice(cartSelection);

  return (
    <>
      <Header>
        <BackButton aria-label='장바구니로 돌아가기' onClick={() => navigate('/cart')} type='button'>
          <BackIcon alt='' aria-hidden='true' src={backArrowIconUrl} />
        </BackButton>
      </Header>
      <Main>
        <AsyncStateView
          errorFallback={<CartErrorView errorMessage={cartItemsState.errorMessage} onRetry={loadCartItems} />}
          loadingFallback={<CartLoadingView />}
          status={cartItemsState.status}
        >
          <Summary>
            <Title>주문 확인</Title>
            <Description>
              총 {selectedItemCount}종류의 상품 {selectedQuantity}개를 주문합니다.
              <br />
              최종 결제 금액을 확인해 주세요.
            </Description>
            <TotalLabel>총 결제 금액</TotalLabel>
            <TotalPrice>{formatPrice(totalPrice)}원</TotalPrice>
          </Summary>
        </AsyncStateView>
        <FixedBottomAction>
          <Button disabled>결제하기</Button>
        </FixedBottomAction>
      </Main>
    </>
  );
};

const Header = styled.header`
  display: flex;
  min-height: 64px;
  align-items: center;
  padding: 0 24px;
  background: ${theme.colors.black};
`;

const BackButton = styled.button`
  display: inline-flex;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  background: transparent;
  color: ${theme.colors.white};
  font-size: 32px;
  line-height: 1;
  cursor: pointer;
`;

const BackIcon = styled.img`
  width: 21px;
  height: 21px;
  object-fit: contain;
`;

const Main = styled.main`
  display: flex;
  min-height: calc(100dvh - 64px);
  box-sizing: border-box;
  flex-direction: column;
  padding: 0 24px;
  padding-bottom: 64px;
`;

const Summary = styled.section`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 56px;
  text-align: center;
`;

const Title = styled.h1`
  margin: 0;
  color: ${theme.colors.black};
  font-size: ${typography.display.fontSize};
  font-weight: ${fontWeights.bold};
  line-height: ${typography.display.lineHeight};
`;

const Description = styled.p`
  margin: 27px 0 0;
  color: ${theme.colors.textPrimary};
  font-size: ${typography.caption.fontSize};
  font-weight: ${fontWeights.medium};
  line-height: 150%;
  text-align: center;
`;

const TotalLabel = styled.strong`
  margin-top: 24px;
  color: ${theme.colors.textPrimary};
  font-size: ${typography.body.fontSize};
  font-weight: ${fontWeights.bold};
  line-height: 16px;
  text-align: center;
`;

const TotalPrice = styled.strong`
  margin-top: 12px;
  color: ${theme.colors.black};
  font-size: ${typography.display.fontSize};
  font-weight: ${fontWeights.bold};
  line-height: ${typography.display.lineHeight};
  text-align: center;
`;
