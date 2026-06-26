import { http, HttpResponse } from 'msw';
import type { Product } from '../../apis/cart';
import { getCartItem, getProduct } from '../data/cartData';
import { couponIds, coupons } from '../data/couponData';

interface OrderSheetRequestItem {
  productId: string;
  quantity: number;
}

interface CreateOrderSheetRequest {
  items: OrderSheetRequestItem[];
}

interface UpdateShippingAreaRequest {
  isRemoteShippingArea: boolean;
}

interface CouponDiscountPreviewRequest {
  selectedCouponIds: string[];
}

interface UpdateCouponsRequest {
  selectedCouponIds: string[];
}

interface OrderSheetItem {
  product: Product;
  quantity: number;
}

interface OrderSheet {
  id: string;
  items: OrderSheetItem[];
  selectedCouponIds: string[];
  isRemoteShippingArea: boolean;
}

const orderSheets = new Map<string, OrderSheet>();

const getCouponDiscountAmount = (
  orderSheet: OrderSheet,
  selectedCouponIds: string[],
  shippingFee: number,
) => {
  const orderAmount = orderSheet.items.reduce(
    (total, { product, quantity }) => total + product.price * quantity,
    0,
  );
  let discountAmount = 0;

  if (selectedCouponIds.includes(couponIds.fixedAmount)) {
    discountAmount += 5_000;
  }

  if (selectedCouponIds.includes(couponIds.buyOneGetOne)) {
    discountAmount += Math.max(
      ...orderSheet.items.map(({ product }) => product.price),
      0,
    );
  }

  if (selectedCouponIds.includes(couponIds.freeShipping)) {
    discountAmount += shippingFee;
  }

  if (selectedCouponIds.includes(couponIds.miracleSale)) {
    discountAmount += Math.floor((orderAmount - discountAmount) * 0.3);
  }

  return Math.min(discountAmount, orderAmount + shippingFee);
};

const getPricing = (orderSheet: OrderSheet) => {
  const orderAmount = orderSheet.items.reduce(
    (total, { product, quantity }) => total + product.price * quantity,
    0,
  );
  const shippingFee =
    orderAmount >= 100_000
      ? 0
      : 3_000 + (orderSheet.isRemoteShippingArea ? 3_000 : 0);
  const discountAmount = getCouponDiscountAmount(
    orderSheet,
    orderSheet.selectedCouponIds,
    shippingFee,
  );

  return {
    orderAmount,
    shippingFee,
    discountAmount,
    totalPaymentAmount: orderAmount + shippingFee - discountAmount,
  };
};

export const orderSheetHandlers = [
  http.post('/api/order-sheets/', async ({ request }) => {
    const { items } = (await request.json()) as CreateOrderSheetRequest;
    const hasInvalidOrderItem = items.some(
      ({ productId }) => !getProduct(productId) || !getCartItem(productId),
    );

    if (hasInvalidOrderItem) {
      return HttpResponse.json(
        {
          code: 'RESOURCE_NOT_FOUND',
          message: '요청한 리소스를 찾을 수 없습니다.',
        },
        { status: 404 },
      );
    }

    const orderItems = items.map(({ productId, quantity }) => ({
      product: getProduct(productId) as Product,
      quantity,
    }));
    const id = crypto.randomUUID();
    orderSheets.set(id, {
      id,
      items: orderItems,
      selectedCouponIds: [couponIds.freeShipping],
      isRemoteShippingArea: false,
    });

    return HttpResponse.json({ id }, { status: 201 });
  }),

  http.get('/api/order-sheets/:orderSheetId/pricing/', ({ params }) => {
    const orderSheetId = params.orderSheetId as string;
    const orderSheet = orderSheets.get(orderSheetId);

    if (!orderSheet) {
      return HttpResponse.json(
        {
          code: 'RESOURCE_NOT_FOUND',
          message: '요청한 리소스를 찾을 수 없습니다.',
        },
        { status: 404 },
      );
    }

    return HttpResponse.json({ pricing: getPricing(orderSheet) });
  }),

  http.get('/api/order-sheets/:orderSheetId/coupons/', ({ params }) => {
    const orderSheetId = params.orderSheetId as string;
    const orderSheet = orderSheets.get(orderSheetId);

    if (!orderSheet) {
      return HttpResponse.json(
        {
          code: 'RESOURCE_NOT_FOUND',
          message: '요청한 리소스를 찾을 수 없습니다.',
        },
        { status: 404 },
      );
    }

    const availableCoupons = coupons
      .slice(0, 3)
      .map(({ id, code }) => ({ id, code }));

    return HttpResponse.json({ coupons: availableCoupons });
  }),

  http.patch(
    '/api/order-sheets/:orderSheetId/coupons/',
    async ({ params, request }) => {
      const orderSheetId = params.orderSheetId as string;
      const orderSheet = orderSheets.get(orderSheetId);

      if (!orderSheet) {
        return HttpResponse.json(
          {
            code: 'RESOURCE_NOT_FOUND',
            message: '요청한 리소스를 찾을 수 없습니다.',
          },
          { status: 404 },
        );
      }

      const { selectedCouponIds } =
        (await request.json()) as UpdateCouponsRequest;
      orderSheet.selectedCouponIds = selectedCouponIds;

      return new HttpResponse(null, { status: 204 });
    },
  ),

  http.post(
    '/api/order-sheets/:orderSheetId/discount-preview/',
    async ({ params, request }) => {
      const orderSheetId = params.orderSheetId as string;
      const orderSheet = orderSheets.get(orderSheetId);

      if (!orderSheet) {
        return HttpResponse.json(
          {
            code: 'RESOURCE_NOT_FOUND',
            message: '요청한 리소스를 찾을 수 없습니다.',
          },
          { status: 404 },
        );
      }

      const { selectedCouponIds } =
        (await request.json()) as CouponDiscountPreviewRequest;
      const { shippingFee } = getPricing(orderSheet);
      const discountAmount = getCouponDiscountAmount(
        orderSheet,
        selectedCouponIds,
        shippingFee,
      );

      return HttpResponse.json({ discountAmount });
    },
  ),

  http.patch(
    '/api/order-sheets/:orderSheetId/shipping-area/',
    async ({ params, request }) => {
      const orderSheetId = params.orderSheetId as string;
      const orderSheet = orderSheets.get(orderSheetId);

      if (!orderSheet) {
        return HttpResponse.json(
          {
            code: 'RESOURCE_NOT_FOUND',
            message: '요청한 리소스를 찾을 수 없습니다.',
          },
          { status: 404 },
        );
      }

      const { isRemoteShippingArea } =
        (await request.json()) as UpdateShippingAreaRequest;
      orderSheet.isRemoteShippingArea = isRemoteShippingArea;

      return new HttpResponse(null, { status: 204 });
    },
  ),

  http.get('/api/order-sheets/:orderSheetId/', ({ params }) => {
    const orderSheetId = params.orderSheetId as string;
    const orderSheet = orderSheets.get(orderSheetId);

    if (!orderSheet) {
      return HttpResponse.json(
        {
          code: 'RESOURCE_NOT_FOUND',
          message: '요청한 리소스를 찾을 수 없습니다.',
        },
        { status: 404 },
      );
    }

    return HttpResponse.json({ orderSheet });
  }),
];
