import express, { Request, Response } from 'express';
import request from 'supertest';
import { TestDB } from './testDB';

const app = express();
app.use(express.json());

const initialCart = TestDB.Cart!.map((product) => ({ ...product }));

beforeEach(() => {
  TestDB.Cart = initialCart.map((p) => ({ ...p }));
});

// GET API
app.get('/cart', (req: Request, res: Response) => {
  if (!TestDB.Cart) {
    return res.status(500).json({ errorMessage: '서버에 일시적인 오류가 발생했습니다.' });
  }
  res.status(200).json(TestDB.Cart);
});

describe('GET /cart', function () {
  it('응답 body의 json의 길이는 1이며, 응답 코드는 200 OK 이다.', async function () {
    const response = await request(app).get('/cart').set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
  });

  it('CART 테이블에 존재하지 않으면 500 에러', async function () {
    TestDB.Cart = undefined;

    const response = await request(app).get('/cart').set('Accept', 'application/json');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ errorMessage: '서버에 일시적인 오류가 발생했습니다.' });
  });
});
