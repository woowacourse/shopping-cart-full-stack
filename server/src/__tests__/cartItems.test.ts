import request from 'supertest';
import app from '../app';

describe('장바구니', () => {
    
  it('장바구니 목록을 조회할 수 있다.', async () => {
    await request(app).get('/cart').expect(200);
  });

  it('장바구니에 상품을 추가 할 수 있다.', async () => {
    const createRes = await request(app).post('/products').send({
      name: '상품이름A',
      price: 35000,
      image: '이미지',
      stock: 1,
    });

    await request(app)
      .post('/cart')
      .send({
        productId: createRes.body.data.productId,
        quantity: 1,
      })
      .expect(201);
  });
});
