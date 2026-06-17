import {preorderCache} from '../caches/PreorderCache.js';
import {cartItems} from '../db.js';
import {HttpError} from '../middlewares/errorHandler.js';
import type {CreatePreorderRequestBody} from '../type.js';

export const isCreatePreorderRequestBody = (body: unknown): body is CreatePreorderRequestBody => {
  return typeof body === 'object' && body !== null;
};

export const isValidCreatePreorderBody = (body: unknown): body is CreatePreorderRequestBody => {
  if (!isCreatePreorderRequestBody(body)) {
    return false;
  }

  return (
    Array.isArray(body.selectedCartIds) &&
    body.selectedCartIds.length > 0 &&
    body.selectedCartIds.every((cartId) => typeof cartId === 'string')
  );
};

export const preorderService = {
  getPreorder(preorderId: string) {
    const preorderItems = preorderCache.findById(preorderId);

    if (!preorderItems) {
      throw new HttpError(404, '주문 확인 정보를 찾을 수 없습니다.');
    }

    return {
      preorderId,
      items: preorderItems.map(({productId, price, name, imageUrl, quantity}) => ({
        productId,
        price,
        name,
        imageUrl,
        quantity,
      })),
    };
  },

  createPreorder(body: unknown) {
    if (!isValidCreatePreorderBody(body)) {
      throw new HttpError(400, 'selectedCartIds를 올바르게 입력해주세요.');
    }

    const {selectedCartIds} = body;
    const preorderItems = selectedCartIds.map((cartId) => {
      const cartItem = cartItems.findById(cartId);

      if (!cartItem) {
        throw new HttpError(404, '선택한 장바구니 항목을 찾을 수 없습니다.');
      }

      const {productInfo} = cartItem;

      return {
        cartItemId: cartItem.id,
        productId: productInfo.id,
        name: productInfo.name,
        price: productInfo.price,
        imageUrl: productInfo.imageUrl,
        quantity: cartItem.getQuantity(),
      };
    });

    return preorderCache.save(preorderItems);
  },
};
