import request from 'supertest';
import app from '../app';
import { cartItems } from '../repositories/CartItemsRepository';
import { products } from '../repositories/ProductsRepository';

describe('장바구니', () => {
  beforeEach(() => {
    products.clear();
    cartItems.clear();
  });

  it('장바구니 목록을 조회할 수 있다.', async () => {
    products.set('1', {
      productId: '1',
      name: '상품이름A',
      price: 35000,
      image: '이미지',
      stock: 1,
    });

    cartItems.set('1', {
      cartItemId: '1',
      productId: '1',
      quantity: 1,
    });

    await request(app).get('/cart').expect(200);
  });

  it('장바구니에 상품을 추가 할 수 있다.', async () => {
    products.set('1', {
      productId: '1',
      name: '상품이름A',
      price: 35000,
      image: '이미지',
      stock: 1,
    });

    await request(app)
      .post('/cart')
      .send({
        productId: '1',
        quantity: 1,
      })
      .expect(201);
  });

  it('장바구니에 담긴 상품의 수량을 변경할 수 있다.', async () => {
    products.set('1', {
      productId: '1',
      name: '상품이름A',
      price: 35000,
      image: '이미지',
      stock: 1,
    });

    cartItems.set('1', {
      cartItemId: '1',
      productId: '1',
      quantity: 1,
    });

    await request(app)
      .patch('/cart/1')
      .send({
        quantity: 2,
      })
      .expect(200);
  });

  it('장바구니에 담긴 상품을 삭제할 수 있다.', async () => {
    products.set('1', {
      isDeleted: false,
      productId: '1',
      name: '상품이름A',
      price: 35000,
      image: '이미지',
      stock: 1,
    });

    cartItems.set('1', {
      cartItemId: '1',
      productId: '1',
      quantity: 1,
    });

    await request(app).delete('/cart/1').expect(200);
  });
});
