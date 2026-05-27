import express, { Request, Response } from 'express';
import request from 'supertest';

const app = express();
app.use(express.json());

interface BodyForTest {
  id?: number;
  imageUrl: string;
  name: string;
  price: number;
  quantity: number;
}

interface TestDB {
  Products: BodyForTest[] | undefined;
  Cart: BodyForTest[] | undefined;
}

const DB: TestDB = {
  Products: [
    {
      id: 1,
      imageUrl: 'https://example.com/nike.jpg',
      name: 'Nike Air Max',
      price: 1200000,
      quantity: 2,
    },
    {
      id: 2,
      imageUrl: 'https://example.com/uniqlo.jpg',
      name: 'Uniqlo Backpack',
      price: 50000,
      quantity: 1,
    },
  ],
  Cart: [
    {
      id: 1,
      imageUrl: 'https://example.com/nike.jpg',
      name: 'Nike Air Max',
      price: 1200000,
      quantity: 2,
    },
  ],
};

const initialProducts = DB.Products!.map((product) => ({ ...product }));

beforeEach(() => {
  DB.Products = initialProducts.map((p) => ({ ...p }));
});

// GET API
app.get('/products', (req: Request, res: Response) => {
  if (!DB.Products) {
    return res.status(500).json({ errorMessage: '서버에 일시적인 오류가 발생했습니다.' });
  }
  res.status(200).json(DB.Products);
});

describe('GET /products', function () {
  it('응답 body의 json의 길이는 2이며, 응답 상태코드는 200 OK 이다.', async function () {
    const response = await request(app).get('/products').set('Accept', 'application/json');
    expect(response.status).toBe(200);
    expect(response.body.length).toEqual(2);
  });

  it('PRODUCTS DB가 존재하지 않으면 500 에러', async function () {
    DB.Products = undefined;

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
  if (!DB.Products) {
    return res.status(500).json({ errorMessage: '서버에 일시적인 오류가 발생했습니다.' });
  }
  const { imageUrl, name, price, quantity } = req.body;
  const newProduct = {
    id: DB.Products.length + 1,
    imageUrl,
    name,
    price,
    quantity,
  };
  DB.Products.push(newProduct);
  res.status(201).json({ message: '상품이 성공적으로 생성되었습니다.' });
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

  it('PRODUCTS DB가 존재하지 않으면 500 에러', async function () {
    DB.Products = undefined;

    const response = await request(app)
      .post('/products')
      .send(newProduct)
      .set('Accept', 'application/json');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ errorMessage: '서버에 일시적인 오류가 발생했습니다.' });
  });
});

// DELETE API
app.delete('/products/:id', (req: Request, res: Response) => {
  const requestedId = Number(req.params.id);
  if (!DB.Products) {
    return res.status(500).json({ errorMessage: '서버에 일시적인 오류가 발생했습니다.' });
  }
  const isIdExist = DB.Products.find((product) => product.id === requestedId);
  if (!isIdExist) {
    return res.status(404).send({ errorMessage: '상품을 찾을 수 없습니다.' });
  }
  DB.Products = DB.Products.filter((product) => product.id !== requestedId);
  DB.Cart = DB.Cart!.filter((product) => product.id !== requestedId);

  res.status(204).send();
});

describe('DELETE /products/:id', function () {
  it('상품이 삭제되면, 응답 상태코드는 204 OK 이며 장바구니에 해당 상품이 있을 때 같이 삭제된다.', async function () {
    const response = await request(app).delete('/products/1').set('Accept', 'application/json');
    expect(DB.Products!.length).toBe(1);
    expect(DB.Cart!.length).toBe(0);
    expect(response.status).toBe(204);
  });

  it('해당 id가 DB에 존재하지 않는다면 404 에러', async function () {
    const response = await request(app).delete('/products/3').set('Accept', 'application/json');
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ errorMessage: '상품을 찾을 수 없습니다.' });
  });
});
