import Product from '../domain/Product.ts';
import ShoppingCart from '../domain/ShoppingCart.ts';
import Order from '../domain/Order.ts';
import type { ProductId, Coupon, OrderId } from '../types/type.ts';

export const products = new Map<ProductId, Product>();
export const shoppingCart = new ShoppingCart();
export const orders = new Map<OrderId, Order>();
export const coupons: Coupon[] = [
  {
    code: 'FIXED5000',
    name: '5,000원 할인 쿠폰',
    expiresAt: '2026-11-30',
    minOrderAmount: 100000,
    discountAmount: 5000,
  },
  {
    code: 'BOGO',
    name: '2개 구매 시 1개 무료 쿠폰',
    expiresAt: '2026-06-30',
    minCount: 3,
    freeCount: 1,
  },
  {
    code: 'FREESHIPPING',
    name: '5만원 이상 구매 시 무료 배송 쿠폰',
    expiresAt: '2026-08-31',
    minOrderAmount: 50000,
    discountAmount: 3000,
    remoteAreaFee: 3000,
  },
  {
    code: 'MIRACLESALE',
    name: '미라클모닝 30% 할인 쿠폰',
    expiresAt: '2026-07-31',
    discountRate: 30,
    startTime: '04:00',
    endTime: '07:00',
  },
];

const getServerBaseUrl = () => {
  if (process.env.SERVER_BASE_URL) {
    return process.env.SERVER_BASE_URL;
  }

  if (process.env.RAILWAY_PUBLIC_DOMAIN) {
    return `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
  }

  return 'http://localhost:3000';
};

const createImageUrl = (fileName: string) => {
  return `${getServerBaseUrl()}/images/${fileName}`;
};

const seedProducts = [
  new Product({
    name: '상품이름A',
    price: 35000,
    image: createImageUrl('productA.svg'),
  }),
  new Product({
    name: '상품이름B',
    price: 25000,
    image: createImageUrl('productB.svg'),
  }),
];

seedProducts.forEach((product) => {
  const productId = product.getProduct().id;

  products.set(productId, product);
  shoppingCart.add({
    productId,
    quantity: 2,
  });
});
