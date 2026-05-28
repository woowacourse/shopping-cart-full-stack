import {jest} from '@jest/globals';
import request from 'supertest';

const loadApp = async () => {
  jest.resetModules();
  jest.unstable_unmockModule('../src/services/ProductService.js');
  jest.unstable_unmockModule('../src/services/CartService.js');

  const {default: app} = await import('../src/app.js');

  return app;
};

const loadAppWithProductServiceError = async () => {
  jest.resetModules();
  jest.unstable_unmockModule('../src/services/CartService.js');
  jest.unstable_mockModule('../src/services/ProductService.js', () => ({
    productService: {
      getProducts() {
        throw new Error('product service error');
      },
      createProduct: jest.fn(),
      deleteProduct: jest.fn(),
    },
  }));

  const {default: app} = await import('../src/app.js');

  return app;
};

describe('Product API', () => {
  test('GET /products는 상품 목록을 응답한다', async () => {
    const app = await loadApp();
    const response = await request(app).get('/products').expect(200);

    expect(response.body.body).toHaveLength(5);
    expect(response.body.body[0]).toMatchObject({
      id: '1',
      name: 'EASTER',
      price: 100000000000,
      imageUrl: '/testURL1',
    });
  });

  test('GET /products는 서버 오류가 발생하면 500을 응답한다', async () => {
    const app = await loadAppWithProductServiceError();

    await request(app).get('/products').expect(500);
  });

  test('POST /products는 상품을 생성하고 id를 응답한다', async () => {
    const app = await loadApp();
    const response = await request(app)
      .post('/products')
      .send({name: '새 상품', price: 1000, imageUrl: '/new.png'})
      .expect(201);

    expect(response.body).toEqual({
      body: {
        id: '6',
      },
    });
  });

  test('POST /products는 유효하지 않은 요청이면 400을 응답한다', async () => {
    const app = await loadApp();

    await request(app).post('/products').send({name: '', price: 1000, imageUrl: '/new.png'}).expect(400);
  });

  test('POST /products는 중복 상품명이면 409를 응답한다', async () => {
    const app = await loadApp();

    await request(app).post('/products').send({name: 'EASTER', price: 1000, imageUrl: '/new.png'}).expect(409);
  });

  test('DELETE /products/:id는 상품을 삭제한다', async () => {
    const app = await loadApp();

    await request(app).delete('/products/1').expect(204);
  });

  test('DELETE /products/:id는 없는 상품이면 404를 응답한다', async () => {
    const app = await loadApp();

    await request(app).delete('/products/999').expect(404);
  });
});
