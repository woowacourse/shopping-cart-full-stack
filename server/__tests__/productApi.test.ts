import express, { Request, Response } from 'express';
import request from 'supertest';
import { BodyForTest, TestDB } from './testDB';
import { Validator } from '../src/validation';

const app = express();
app.use(express.json());

const initialProducts = TestDB.Products!.map((product) => ({ ...product }));

beforeEach(() => {
  TestDB.Products = initialProducts.map((p) => ({ ...p }));
});

// GET API
app.get('/products', (req: Request, res: Response) => {
  if (!TestDB.Products) {
    return res.status(500).json({ errorMessage: '서버에 일시적인 오류가 발생했습니다.' });
  }
  res.status(200).json(TestDB.Products);
});

describe('GET /products', function () {
  it('응답 body의 json의 길이는 2이며, 응답 상태코드는 200 OK 이다.', async function () {
    const response = await request(app).get('/products').set('Accept', 'application/json');
    expect(response.status).toBe(200);
    expect(response.body.length).toEqual(2);
  });

  it('PRODUCTS 테이블에 존재하지 않으면 500 에러', async function () {
    TestDB.Products = undefined;

    const response = await request(app).get('/products').set('Accept', 'application/json');
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ errorMessage: '서버에 일시적인 오류가 발생했습니다.' });
  });
});

const newProduct: BodyForTest = {
  imageUrl: 'https://example.com/testItem.jpg',
  name: 'Test Item',
  price: 10000,
  quantity: 5,
};

// POST API
app.post('/products', (req: Request, res: Response) => {
  if (!TestDB.Products) {
    return res.status(500).json({ errorMessage: '서버에 일시적인 오류가 발생했습니다.' });
  }

  const { imageUrl, name, price, quantity } = req.body;
  const newProduct = {
    id: TestDB.Products.length + 1,
    imageUrl,
    name,
    price,
    quantity,
  };
  TestDB.Products.push(newProduct);

  try {
    Validator.validateRequestBody(req.body);
    res.status(201).json({ message: '상품이 성공적으로 생성되었습니다.' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ errorMessage: error.message });
    }
  }
});

describe('POST /products', function () {
  it('새로운 상품이 등록되고, 응답 상태코드는 201 Created 이다.', async function () {
    const response = await request(app)
      .post('/products')
      .send(newProduct)
      .set('Accept', 'application/json');

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: '상품이 성공적으로 생성되었습니다.' });
  });

  it('PRODUCTS 테이블이 존재하지 않으면 500 에러', async function () {
    TestDB.Products = undefined;

    const response = await request(app)
      .post('/products')
      .send(newProduct)
      .set('Accept', 'application/json');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ errorMessage: '서버에 일시적인 오류가 발생했습니다.' });
  });

  it('잘못된 요청이 들어오면 400 에러', async function () {
    const invalidProduct = { ...newProduct };
    invalidProduct.quantity = 0;
    const response = await request(app)
      .post('/products')
      .send(invalidProduct)
      .set('Accept', 'application/json');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ errorMessage: 'quantity는 1 이상 99 이하의 정수여야 합니다.' });
  });
});

// DELETE API
app.delete('/products/:id', (req: Request, res: Response) => {
  const requestedId = Number(req.params.id);
  if (!TestDB.Products) {
    return res.status(500).json({ errorMessage: '서버에 일시적인 오류가 발생했습니다.' });
  }
  const isIdExist = TestDB.Products.find((product) => product.id === requestedId);
  if (!isIdExist) {
    return res.status(404).send({ errorMessage: '상품을 찾을 수 없습니다.' });
  }
  TestDB.Products = TestDB.Products.filter((product) => product.id !== requestedId);
  TestDB.Cart = TestDB.Cart!.filter((product) => product.id !== requestedId);

  res.status(204).send();
});

describe('DELETE /products/:id', function () {
  it('상품이 삭제되면, 응답 상태코드는 204 OK 이며 장바구니에 해당 상품이 있을 때 같이 삭제된다.', async function () {
    const response = await request(app).delete('/products/1').set('Accept', 'application/json');
    expect(TestDB.Products!.length).toBe(1);
    expect(TestDB.Cart!.length).toBe(0);
    expect(response.status).toBe(204);
  });

  it('해당 id가 DB에 존재하지 않는다면 404 에러', async function () {
    const response = await request(app).delete('/products/3').set('Accept', 'application/json');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ errorMessage: '상품을 찾을 수 없습니다.' });
  });
});
