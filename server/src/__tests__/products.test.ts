import request from 'supertest';
import app from '../app';

describe('상품', () => {
  it('상품 목록을 조회할 수 있다.', async () => {
    await request(app).get('/products').expect(200);
  });
});
