import express, { Request, Response } from 'express';
import request from 'supertest';
import { BodyForTest, TestDB } from './testDB';

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

// POST API
app.post('/cart/:id', function (req: Request, res: Response) {
  const requestId = Number(req.params.id);

  if (!TestDB.Cart) {
    return res.status(500).json({ errorMessage: '서버에 일시적인 오류가 발생했습니다.' });
  }
  const pickedProduct = TestDB.Products!.filter((product) => product.id === requestId)[0];
  TestDB.Cart.push(pickedProduct);
  res.status(201).json({ message: '상품이 장바구니에 추가되었습니다.' });
});

describe('POST /cart/:id', function () {
  it('새로운 상품이 등록되고, 응답 코드는 201 Created 이다.', async function () {
    const response = await request(app).post('/cart/1').set('Accept', 'application/json');

    expect(response.status).toBe(201);
  });

  it('CART 테이블에 존재하지 않으면 500 에러', async function () {
    TestDB.Cart = undefined;

    const response = await request(app).post('/cart/1').set('Accept', 'application/json');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ errorMessage: '서버에 일시적인 오류가 발생했습니다.' });
  });
});

// PUT API
app.put('/cart', function (req: Request, res: Response) {
  const { id } = req.body;

  if (!TestDB.Cart) {
    return res.status(500).json({ errorMessage: '서버에 일시적인 오류가 발생했습니다.' });
  }

  const toBeUpdatedIndex = TestDB.Cart.findIndex((product) => product.id === id);
  if (toBeUpdatedIndex === -1) {
    return res.status(404).json({ errorMessage: '상품을 찾을 수 없습니다.' });
  }

  TestDB.Cart[toBeUpdatedIndex] = req.body;
  res.status(204).send();
});

const productInCart: BodyForTest = {
  id: 1,
  imageUrl: 'https://example.com/nike.jpg',
  name: 'Nike Air Max',
  price: 1200000,
  quantity: 2,
};

const productToBeUpdated: BodyForTest = {
  id: productInCart.id,
  imageUrl: productInCart.imageUrl,
  name: productInCart.name,
  price: productInCart.price,
  quantity: 4,
};

describe('PUT /cart', function () {
  it('상품의 수량이 변경되고, 응답 코드는 204 OK 이다.', async function () {
    const response = await request(app)
      .put('/cart')
      .send(productToBeUpdated)
      .set('Accept', 'application/json');

    expect(response.status).toBe(204);
  });
  it('CART 테이블에 존재하지 않으면 500 에러', async function () {
    TestDB.Cart = undefined;

    const response = await request(app)
      .put('/cart')
      .send(productToBeUpdated)
      .set('Accept', 'application/json');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ errorMessage: '서버에 일시적인 오류가 발생했습니다.' });
  });
  it('해당 id가 DB에 존재하지 않는다면 404 에러', async function () {
    const idChangedProduct = { ...productToBeUpdated };
    idChangedProduct.id = 2;
    const response = await request(app)
      .put('/cart')
      .send(idChangedProduct)
      .set('Accept', 'application/json');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ errorMessage: '상품을 찾을 수 없습니다.' });
  });
});

// DELETE API
app.delete('/cart/:id', (req: Request, res: Response) => {
  const requestId = Number(req.params.id);
  if (!TestDB.Cart) {
    return res.status(500).json({ errorMessage: '서버에 일시적인 오류가 발생했습니다.' });
  }
  const isIdExist = TestDB.Cart.find((product) => product.id === requestId);
  if (!isIdExist) {
    return res.status(404).send({ errorMessage: '상품을 찾을 수 없습니다.' });
  }
  TestDB.Cart = TestDB.Cart.filter((product) => product.id === requestId);

  res.status(204).send();
});

describe('DELETE /cart/:id', function () {
  it('상품이 삭제되면, 응답 코드는 204 OK 이다.', async function () {
    const response = await request(app).delete('/cart/1').set('Accept', 'application/json');
    expect(response.status).toBe(204);
  });
  it('해당 id가 DB에 존재하지 않는다면 404 에러', async function () {
    const response = await request(app).delete('/cart/2').set('Accept', 'application/json');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ errorMessage: '상품을 찾을 수 없습니다.' });
  });
});
