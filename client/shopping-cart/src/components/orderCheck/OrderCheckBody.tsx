import { css } from '@emotion/react';
import type { ReactNode } from 'react';
import SectionHeader from '../common/SectionHeader';
import OrderCheckItemList from './OrderCheckItemList';
import OrderSummary from '../common/OrderSummary';
import type { OrderCheck } from '../../types';

type Props = {
  order: OrderCheck;
  couponSection: ReactNode;
  remoteAreaSection: ReactNode;
};

const OrderCheckBody = ({ order, couponSection, remoteAreaSection }: Props) => {
  const totalQuantity = order.products.reduce((acc, product) => acc + product.quantity, 0);

  return (
    <>
      <SectionHeader title="주문 확인">
        <p
          css={css`
            font: var(--text-label);
          `}
        >
          총 {order.products.length}종류의 상품 {totalQuantity}개를 주문합니다. <br /> 최종 결제
          금액을 확인해주세요.
        </p>
      </SectionHeader>

      <OrderCheckItemList products={order.products} />

      {couponSection}

      {remoteAreaSection}

      <OrderSummary data={order.payInfo} />
    </>
  );
};

export default OrderCheckBody;
