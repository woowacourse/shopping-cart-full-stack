import { createApp } from '../app.js';
import InMemoryStorage from '../storages/InMemoryStorage.js';
import Product from '../models/Product.js';
import request from 'supertest';
import Cart from '../models/Cart.js';
import { createCartController } from '../controllers/cartController.js';
import { createProductController } from '../controllers/productController.js';
import { DEFAULT_USER_ID } from '../constants/user.js';
import { createOrderSheetController } from '../controllers/orderSheetController.js';
import { createCouponController } from '../controllers/couponController.js';

describe('카트 API 테스트', () => {
  const storage = new InMemoryStorage();
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
  const cart = storage.getItemById('cart', DEFAULT_USER_ID) as Cart;

  const product1 = new Product('수건', 10000, '/some_image2');
  const product2 = new Product('칫솔', 5000, '/some_image');

  beforeEach(() => {
    storage.addItemById('products', product1.getId(), product1);
    storage.addItemById('products', product2.getId(), product2);

    cart.updateItemByProductId(product1.getId(), 10);
    cart.updateItemByProductId(product2.getId(), 20);
  });

  afterEach(() => {
    storage.clearAllItems('products');
    cart.deleteItemByProductId(product1.getId());
    cart.deleteItemByProductId(product2.getId());
  });

  test('장바구니 내 아이템목록을 반환한다.', async () => {
    const res = await request(app).get('/api/cart/');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      items: [
        { product: product1.toObject(), quantity: 10 },
        { product: product2.toObject(), quantity: 20 },
      ],
    });
  });

  test('장바구니 내 아이템 수량을 수정한다.', async () => {
    const res = await request(app)
      .patch(`/api/cart/items/${product1.getId()}/`)
      .send({ quantity: 40 })
      .set('Accept', 'application/json');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ product_id: product1.getId(), quantity: 40 });
  });

  test('장바구니 내 아이템을 삭제한다.', async () => {
    const res = await request(app).delete(
      `/api/cart/items/${product1.getId()}`,
    );
    expect(res.status).toBe(204);
  });

  test('1 ~ 99개 사이가 아닌 수량을 수정하려 하면 400 에러가 발생한다.', async () => {
    const res = await request(app)
      .patch('/api/cart/items/123/')
      .send({ quantity: 101 })
      .set('Accept', 'application/json');
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      errors: { quantity: ['수량은 1 이상 99 이하여야 합니다.'] },
    });
  });

  test('존재하지 않는 장바구니 내 아이템 수량 변경하려고 하면 404에러가 발생한다.', async () => {
    const res = await request(app)
      .patch('/api/cart/items/unknown/')
      .send({ quantity: 5 })
      .set('Accept', 'application/json');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      code: 'RESOURCE_NOT_FOUND',
      message: '요청한 리소스를 찾을 수 없습니다.',
    });
  });

  test('존재하지 않은 장바구니 내 아이템을 제거하려고 하면 404에러가 발생한다.', async () => {
    const res = await request(app).del('/api/cart/items/unknown/');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      code: 'RESOURCE_NOT_FOUND',
      message: '요청한 리소스를 찾을 수 없습니다.',
    });
  });
});
