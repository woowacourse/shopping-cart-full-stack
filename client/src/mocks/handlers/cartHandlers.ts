import { http, HttpResponse } from 'msw';
import {
  getCartItem,
  getCartItems,
  removeCartItem,
} from '../data/cartData';

export const cartHandlers = [
  http.get('/api/cart/', () => {
    return HttpResponse.json({
      items: getCartItems(),
    });
  }),

  http.delete('/api/cart/items/:productId/', ({ params }) => {
    const productId = params.productId as string;

    removeCartItem(productId);

    return new HttpResponse(null, {
      status: 204,
    });
  }),

  http.patch('/api/cart/items/:productId/', async ({ params, request }) => {
    const productId = params.productId as string;
    const { quantity } = (await request.json()) as { quantity?: number };
    const cartItem = getCartItem(productId);

    if (quantity === undefined || quantity < 1 || quantity > 99) {
      return HttpResponse.json(
        {
          errors: {
            quantity: ['수량은 1 이상 99 이하여야 합니다.'],
          },
        },
        { status: 400 },
      );
    }

    if (!cartItem) {
      return HttpResponse.json(
        {
          code: 'RESOURCE_NOT_FOUND',
          message: '요청한 리소스를 찾을 수 없습니다.',
        },
        { status: 404 },
      );
    }

    cartItem.quantity = quantity;

    return HttpResponse.json({
      product_id: productId,
      quantity: cartItem.quantity,
    });
  }),
];

