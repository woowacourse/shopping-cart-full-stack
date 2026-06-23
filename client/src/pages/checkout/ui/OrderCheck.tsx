import { useLocation } from 'react-router-dom';
import type { CheckoutState } from '../../../entities/order/types';
import Flex from '../../../shared/layout/Flex';
import Txt from '../../../shared/ui/Txt';

export default function OrderCheck() {
  const location = useLocation();
  const state = location.state as CheckoutState | null;

  const productTypeCount = state?.productTypeCount ?? 0;
  const productCount = state?.productCount ?? 0;
  const totalAmount = state?.totalAmount ?? 0;

  return (
    <Flex
      as="section"
      direction="column"
      gap={24}
      align="center"
      justify="center"
      styles={{
        height: '90vh',
      }}
    >
      <Txt variant="title" color="text">
        결제 확인
      </Txt>
      <Txt variant="label" color="text" styles={{ textAlign: 'center' }}>
        총 {productTypeCount}종류의 상품 {productCount}개를 주문했습니다.{' '}
        <br />
        최종 결제 금액을 확인해 주세요.
      </Txt>
      <Flex direction="column" gap={12} align="center">
        <Txt variant="button" color="text">
          총 결제 금액
        </Txt>
        <Txt variant="title" color="text">
          {totalAmount.toLocaleString()}원
        </Txt>
      </Flex>
    </Flex>
  );
}
