import {preorderCache} from '../caches/PreorderCache.js';
import {cartItems} from '../repositories/index.js';
import {HttpError} from '../middlewares/errorHandler.js';
import type {CreatePreorderRequestBody, Preorder} from '../types/preorder.js';

const isValidCreatePreorderBody = (body: unknown): body is CreatePreorderRequestBody => {
  if (!body || typeof body !== 'object') {
    return false;
  }

  const {selectedCartIds} = body as CreatePreorderRequestBody;

  return (
    Array.isArray(selectedCartIds) &&
    selectedCartIds.length > 0 &&
    selectedCartIds.every((cartId) => typeof cartId === 'string')
  );
};

const findCartItem = (cartId: string) => {
  const cartItem = cartItems.findById(cartId);

  if (!cartItem) {
    throw new HttpError(404, '선택한 장바구니 항목을 찾을 수 없습니다.');
  }

  return cartItem;
};

const createPreorderItem = (cartId: string) => {
  const cartItem = findCartItem(cartId);
  const {productInfo} = cartItem;

  return {
    cartItemId: cartItem.id,
    productId: productInfo.id,
    name: productInfo.name,
    price: productInfo.price,
    imageUrl: productInfo.imageUrl,
    quantity: cartItem.getQuantity(),
  };
};

export const preorderService = {
  getPreorder(preorderId: string): Preorder {
    const preorderItems = preorderCache.findById(preorderId);

    if (!preorderItems) {
      throw new HttpError(404, '주문 확인 정보를 찾을 수 없습니다.');
    }

    return {
      preorderId,
      items: preorderItems.items.map(({productId, price, name, imageUrl, quantity}) => ({
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
    const preorderItems = selectedCartIds.map(createPreorderItem);

    return preorderCache.save(preorderItems);
  },
};
