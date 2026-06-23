import { useParams } from 'react-router-dom';

import {
  fetchOrder,
  updateOrderRemoteArea,
} from '../../entities/order/api/orderApi';
import {
  calculateCouponDiscount,
  fetchOrderCoupons,
  updateOrderCoupons,
} from '../../entities/coupon/api/couponApi';
import OrderPage from './OrderPage';
import OrderProvider from './providers/OrderProvider';

export default function OrderRoute() {
  const { id = '' } = useParams();

  return (
    <OrderProvider
      orderId={id}
      fetchOrder={fetchOrder}
      updateRemoteArea={updateOrderRemoteArea}
      fetchCoupons={fetchOrderCoupons}
      calculateDiscount={calculateCouponDiscount}
      updateCoupons={updateOrderCoupons}
    >
      <OrderPage />
    </OrderProvider>
  );
}
