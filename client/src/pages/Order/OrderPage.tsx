import Flex from '../../shared/layout/Flex';
import Header from '../../shared/ui/Header';
import Image from '../../shared/ui/Image';
import back from '../../assets/back.svg';
import OrderSection from './ui/OrderSection';
import OrderList from './ui/OrderList';
import Modal from './ui/Modal';
import { BottomButton, CouponButton } from '../../shared/ui/Button';
import OrderSummary from './ui/OrderSummary';
import Area from './ui/Area';
import Spinner from '../../shared/ui/Spinner';
import Txt from '../../shared/ui/Txt';

import { colors } from '../../shared/styles/theme';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useOrder } from './hooks/useOrder';
import { useCouponActions } from './hooks/useCouponActions';
import { useRemoteAreaActions } from './hooks/useRemoteAreaActions';
import { useOrderMutationError } from './hooks/useOrderMutationError';
import { getOrderProductCount } from '../../entities/order/selector';

export default function OrderPage() {
  const navigate = useNavigate();
  const {
    order,
    isPending,
    error,
    isModalOpen,
  } = useOrder();
  const { openCouponModal, closeCouponModal } = useCouponActions();
  const { changeRemoteArea } = useRemoteAreaActions();
  const mutationError = useOrderMutationError();

  useEffect(() => {
    if (!mutationError) return;

    alert(mutationError.message);
  }, [mutationError]);

  if (isPending) {
    return (
      <Flex
        align="center"
        justify="center"
        styles={{
          backgroundColor: colors.white,
          width: '430px',
          minHeight: '100vh',
          margin: '0 auto',
        }}
      >
        <Spinner />
      </Flex>
    );
  }

  if (error || !order) {
    return (
      <Flex
        align="center"
        justify="center"
        styles={{
          backgroundColor: colors.white,
          width: '430px',
          minHeight: '100vh',
          margin: '0 auto',
        }}
      >
        <Txt variant="label" color="error">
          {error?.message ?? '주문서를 불러오지 못했습니다.'}
        </Txt>
      </Flex>
    );
  }

  const productCount = getOrderProductCount(order);

  return (
    <Flex
      direction="column"
      gap={36}
      align="center"
      styles={{
        backgroundColor: colors.white,
        width: '430px',
        height: '100dvh',
        margin: '0 auto',
        position: 'relative',
      }}
    >
      <Header>
        <Image
          alt="뒤로가기"
          src={back}
          width={32}
          height={32}
          onClick={() => navigate('/')}
          styles={{ cursor: 'pointer' }}
        />
      </Header>
      <OrderSection
        productTypeCount={order.products.length}
        productCount={productCount}
      >
        <OrderList products={order.products} />
        <CouponButton isInModal={false} onClick={openCouponModal}>
          쿠폰 적용
        </CouponButton>
        <Area
          isRemoteArea={order.isRemoteArea}
          onChange={changeRemoteArea}
        />
        <OrderSummary amount={order.amount} />
      </OrderSection>

      <BottomButton
        onClick={() =>
          navigate('/payment-checkout', {
            state: {
              productTypeCount: order.products.length,
              productCount,
              totalAmount: order.amount.totalAmount,
            },
          })
        }
      >
        결제하기
      </BottomButton>

      {/* 모달 */}
      {isModalOpen && (
        <>
          <div
            css={{
              position: 'absolute',
              inset: 0,
              backgroundColor: '#00000059',
              zIndex: 1,
            }}
          />
          <Modal onClose={closeCouponModal} />
        </>
      )}
    </Flex>
  );
}
