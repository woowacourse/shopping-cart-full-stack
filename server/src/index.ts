import InMemoryStorage from './storages/InMemoryStorage.js';
import { createApp } from './app.js';
import { DEFAULT_USER_ID } from './constants/user.js';
import { createCartController } from './controllers/cartController.js';
import { createProductController } from './controllers/productController.js';
import Cart from './models/Cart.js';
import Product from './models/Product.js';
import { createOrderSheetController } from './controllers/orderSheetController.js';
import { createCouponController } from './controllers/couponController.js';
import BuyNGetMCoupon from './models/coupons/BuyNGetMCoupon.js';
import FixedAmountCoupon from './models/coupons/FixedAmountCoupon.js';
import FreeShippingCoupon from './models/coupons/FreeShippingCoupon.js';
import RateCoupon from './models/coupons/RateCoupon.js';

const PORT = process.env.PORT ?? 3000;

const storage = new InMemoryStorage();
const cart = storage.getItemById('cart', DEFAULT_USER_ID) as Cart;

// 동작 확인을 위한 초기 데이터 추가
const initialCartItems = [
  {
    product: new Product(
      '운동화',
      129_000,
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop',
    ),
    quantity: 1,
  },
  {
    product: new Product(
      '노트북',
      1_590_000,
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=200&fit=crop',
    ),
    quantity: 99,
  },
  {
    product: new Product(
      '헤드폰',
      189_000,
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop',
    ),
    quantity: 2,
  },
  {
    product: new Product(
      '시계',
      249_000,
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop',
    ),
    quantity: 3,
  },
  {
    product: new Product(
      '향수',
      89_000,
      'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?w=200&h=200&fit=crop',
    ),
    quantity: 5,
  },
];

initialCartItems.forEach(({ product, quantity }) => {
  const productId = product.getId();

  storage.addItemById('products', productId, product);
  cart.updateItemByProductId(productId, quantity);
});

const initialCoupons = [
  new FixedAmountCoupon({
    code: 'FIXED5000',
    name: '5,000원 할인 쿠폰',
    amount: 5000,
    expiresAt: new Date('2026-11-30'),
    conditions: {
      minimumOrderAmount: 100000,
    },
  }),
  new BuyNGetMCoupon({
    code: 'BOGO',
    name: '2+1 쿠폰',
    buyQuantity: 2,
    freeQuantity: 1,
    expiresAt: new Date('2026-06-30'),
  }),
  new FreeShippingCoupon({
    code: 'FREESHIPPING',
    name: '무료 배송 쿠폰',
    expiresAt: new Date('2026-08-31'),
    conditions: {
      minimumOrderAmount: 50000,
    },
  }),
  new RateCoupon({
    code: 'MIRACLESALE',
    name: '30% 시간제 할인 쿠폰',
    rate: 30,
    expiresAt: new Date('2026-07-31'),
    conditions: {
      availableTimeRange: {
        startsAt: '04:00',
        endsAt: '07:00',
      },
    },
  }),
];

initialCoupons.forEach((coupon) => {
  storage.addItemById('coupons', coupon.getId(), coupon);
});

const productController = createProductController(storage);
const cartController = createCartController(storage);
const orderSheetController = createOrderSheetController(storage);
const couponController = createCouponController(storage);
const app = createApp({
  productController,
  cartController,
  orderSheetController,
  couponController,
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
