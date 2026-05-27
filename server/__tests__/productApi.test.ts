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

app.get('/products', (req: Request, res: Response) => {
  if (!DB.Products) {
    return res.status(500).json({ error: '잘못된 서버 요청입니다.' });
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
    const OriginalProducts = DB.Products;
    DB.Products = undefined;

    const response = await request(app).get('/products').set('Accept', 'application/json');
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: '잘못된 서버 요청입니다.' });

    DB.Products = OriginalProducts;
  });
});

const newProduct: BodyForTest = {
  imageUrl: 'https://example.com/testItem.jpg',
  name: 'Test Item',
  price: 10000,
  quantity: 5,
};

app.post('/products', (req: Request, res: Response) => {
  if (!DB.Products) {
    return res.status(500).json({ error: '잘못된 서버 요청입니다.' });
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
    const OriginalProducts = DB.Products;
    DB.Products = undefined;

    const response = await request(app)
      .post('/products')
      .send(newProduct)
      .set('Accept', 'application/json');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: '잘못된 서버 요청입니다.' });

    DB.Products = OriginalProducts;
  });
});
