import request from 'supertest';
import app from '../app';
import { products } from '../repositories/ProductsRepository';
import { cartItems } from '../repositories/CartItemsRepository';

describe('상품', () => {
  beforeEach(() => {
    products.clear();
    cartItems.clear();
  });

  it('상품 목록을 조회할 수 있다.', async () => {
    products.set('1', {
      productId: '1',
      name: '상품이름A',
      price: 35000,
      image: '이미지',
      stock: 1,
    });

    await request(app).get('/products').expect(200);
  });

  it('상품을 추가할 수 있다.', async () => {
    await request(app)
      .post('/products')
      .send({
        name: '상품이름A',
        price: 35000,
        image: '이미지',
        stock: 1,
      })
      .expect(201);
  });

  it('잘못된 상품 추가 요청의 경우 400 에러가 발생한다', async () => {
    await request(app)
      .post('/products')
      .send({
        name: '상품이름A',
      })
      .expect(400);
  });

  it('상품을 삭제할 수 있다.', async () => {
    products.set('1', {
      productId: '1',
      name: '상품이름A',
      price: 35000,
      image: '이미지',
      stock: 1,
    });

    await request(app).delete('/products/1').expect(200);
  });

  it('상품을 삭제시, 장바구니에서도 해당 상품이 삭제된다.', async () => {
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

    await request(app).delete('/products/1');
    const cartResponse = await request(app).get('/cart').expect(200);

    expect(cartResponse.body.data).toEqual(
      expect.not.arrayContaining([
        expect.objectContaining({
          productId: '1',
        }),
      ]),
    );
  });
});
