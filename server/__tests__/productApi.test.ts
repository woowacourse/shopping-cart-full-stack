import express, { Request, Response } from 'express';
import request from 'supertest';

const app = express();
app.use(express.json());

const MOCK_RESPONSEBODY_DATA = [
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
];

app.get('/products', (req: Request, res: Response) => {
  res.status(200).json(MOCK_RESPONSEBODY_DATA);
});

request(app)
  .get('/products')
  .expect('Content-Type', /json/)
  .expect(200)
  .end(function (err, res) {
    if (err) throw err;
  });

describe('GET /products', function () {
  it('응답 body의 json의 길이는 2이다.', async function () {
    const response = await request(app).get('/products').set('Accept', 'application/json');
    expect(response.status).toBe(200);
    expect(response.body.length).toEqual(2);
  });
});
