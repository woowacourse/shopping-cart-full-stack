import { NotFoundError, BadRequestError } from '../errors.js';
import * as cartItemsRepository from '../repositories/CartItemsRepository.js';
import * as productsRepository from '../repositories/ProductsRepository.js';
import { CartItem } from '../models/CartItem.js';
import type { Product } from '../models/Product.js';
import type { Cart, CartPayInfo, CartWithPayInfo } from '../dto/cart.dto.js';
import type { FieldError } from '../response.js';

const DELIVERY_FEE = 3000;
const FREE_DELIVERY_THRESHOLD = 100000;
const REQUIRED_CART_ITEM_FIELDS = ['productId', 'quantity'] as const;

const findProductOrThrow = async (productId: string) => {
  const product = await productsRepository.getById(productId);

  if (!product) {
    throw new NotFoundError({
      errorCode: 'ROUTE_NOT_FOUND',
      errorMessage: '존재하지 않는 상품입니다.',
    });
  }

  return product;
};

const findCartItemRecordOrThrow = async (userId: string, productId: string) => {
  const record = await cartItemsRepository.getByProductId(userId, productId);

  if (!record) {
    throw new NotFoundError({
      errorCode: 'ROUTE_NOT_FOUND',
      errorMessage: '존재하지 않는 상품입니다.',
    });
  }

  return record;
};

export const buildCartItems = async (userId: string): Promise<CartItem[]> => {
  const records = await cartItemsRepository.getAll(userId);
  const products = await productsRepository.getAll();
  const productById = new Map(products.map((product) => [product.id, product]));

  return records
    .filter((record) => productById.has(record.productId))
    .map(
      (record) =>
        new CartItem(
          productById.get(record.productId) as Product,
          record.quantity,
          record.checkStatus,
        ),
    );
};

export const calculateDeliveryFee = (orderPrice: number): number => {
  if (orderPrice === 0) return 0;
  if (orderPrice >= FREE_DELIVERY_THRESHOLD) return 0;
  return DELIVERY_FEE;
};

// quantity의 모양(존재 여부, 타입)만 검증한다. 도메인 유효성(1~99 범위)은 CartItem 생성자가 검증한다.
const validateQuantityShape = (quantity: unknown) => {
  if (quantity === undefined) {
    throw new BadRequestError({
      errorCode: 'MISSING_FIELD',
      errorMessage: '수량은 필수입니다.',
      data: [{ type: 'quantity', errorCode: 'REQUIRED' }],
    });
  }

  if (typeof quantity !== 'number') {
    throw new BadRequestError({
      errorCode: 'TYPE_MISSMATCH',
      errorMessage: '수량은 숫자여야 합니다.',
    });
  }
};

const findMissingCartItemFields = (cartItem: {
  productId?: unknown;
  quantity?: unknown;
}): FieldError[] => {
  return REQUIRED_CART_ITEM_FIELDS.filter((field) => cartItem[field] === undefined).map((field) => ({
    type: field,
    errorCode: 'REQUIRED',
  }));
};

const validateAddCartItemShape = (cartItem: { productId?: unknown; quantity?: unknown }) => {
  const missingFields = findMissingCartItemFields(cartItem);

  if (missingFields.length > 0) {
    throw new BadRequestError({
      errorCode: 'MISSING_FIELD',
      errorMessage: '필수 필드가 누락되었습니다.',
      data: missingFields,
    });
  }

  if (typeof cartItem.productId !== 'string') {
    throw new BadRequestError({
      errorCode: 'TYPE_MISSMATCH',
      errorMessage: '상품 ID는 문자열이어야 합니다.',
    });
  }

  if (typeof cartItem.quantity !== 'number') {
    throw new BadRequestError({
      errorCode: 'TYPE_MISSMATCH',
      errorMessage: '수량은 숫자여야 합니다.',
    });
  }
};

const validateProductId = (productId: string) => {
  if (productId.length > 0) return;

  throw new BadRequestError({
    errorCode: 'INVALID',
    errorMessage: '상품 ID는 빈 문자열일 수 없습니다.',
    data: [{ type: 'productId', errorCode: 'INVALID_LENGTH' }],
  });
};

const buildCart = async (userId: string): Promise<Cart> => {
  const items = await buildCartItems(userId);
  const isAllSelected = items.length > 0 && items.every((item) => item.checkStatus);

  return { isAllSelected, cartItems: items };
};

export const getCartPayInfo = async (userId: string): Promise<CartPayInfo> => {
  const items = await buildCartItems(userId);
  const orderPrice = items
    .filter((item) => item.checkStatus)
    .reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = calculateDeliveryFee(orderPrice);

  return { orderPrice, deliveryFee, totalOrderAmount: orderPrice + deliveryFee };
};

export const getCart = async (userId: string): Promise<CartWithPayInfo> => {
  const cart = await buildCart(userId);
  const payInfo = await getCartPayInfo(userId);

  return { ...cart, payInfo };
};

export const addCartItem = async (
  userId: string,
  cartItem: { productId?: unknown; quantity?: unknown },
): Promise<CartItem> => {
  validateAddCartItemShape(cartItem);
  validateProductId(cartItem.productId as string);
  validateQuantityShape(cartItem.quantity);

  const productId = cartItem.productId as string;
  const quantity = cartItem.quantity as number;
  const existingRecord = await cartItemsRepository.getByProductId(userId, productId);

  if (existingRecord) {
    throw new BadRequestError({
      errorCode: 'INVALID',
      errorMessage: '이미 장바구니에 담긴 상품입니다.',
      data: [{ type: 'productId', errorCode: 'DUPLICATED' }],
    });
  }

  const product = await findProductOrThrow(productId);
  const newCartItem = new CartItem(product, quantity, true);

  await cartItemsRepository.upsert(userId, {
    productId,
    quantity: newCartItem.quantity,
    checkStatus: newCartItem.checkStatus,
  });

  return newCartItem;
};

export const selectCartItem = async (userId: string, productId: string, checkStatus: boolean) => {
  const record = await findCartItemRecordOrThrow(userId, productId);
  const product = await findProductOrThrow(productId);
  const cartItem = new CartItem(product, record.quantity, checkStatus);

  await cartItemsRepository.upsert(userId, {
    productId,
    quantity: cartItem.quantity,
    checkStatus: cartItem.checkStatus,
  });

  const items = await buildCartItems(userId);
  const isAllSelected = items.length > 0 && items.every((item) => item.checkStatus);

  return { isAllSelected, cartItem };
};

export const selectAllCartItems = async (userId: string, checkStatus: boolean): Promise<Cart> => {
  await cartItemsRepository.setAllCheckStatus(userId, checkStatus);
  return await buildCart(userId);
};

export const updateCartItemQuantity = async (
  userId: string,
  productId: string,
  quantity: unknown,
): Promise<CartItem> => {
  validateQuantityShape(quantity);

  const record = await findCartItemRecordOrThrow(userId, productId);
  const product = await findProductOrThrow(productId);
  const cartItem = new CartItem(product, quantity as number, record.checkStatus);

  await cartItemsRepository.upsert(userId, {
    productId,
    quantity: cartItem.quantity,
    checkStatus: cartItem.checkStatus,
  });

  return cartItem;
};

export const deleteCartItem = async (userId: string, productId: string) => {
  const deleted = await cartItemsRepository.deleteByProductId(userId, productId);

  if (!deleted) {
    throw new NotFoundError({
      errorCode: 'ROUTE_NOT_FOUND',
      errorMessage: '존재하지 않는 상품입니다.',
    });
  }

  return { deletedProductId: deleted.productId };
};
