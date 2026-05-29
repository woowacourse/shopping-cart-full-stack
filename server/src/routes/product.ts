import express, { Request, Response } from 'express';
import { DB } from '../database';
import { Validator } from '../validation';

const productRouter = express.Router();
productRouter.use(express.json());

// Product API
// GET
productRouter.get('/', (req: Request, res: Response) => {
  if (!DB.Products) {
    return res.status(500).json({ errorMessage: '서버에 일시적인 오류가 발생했습니다.' });
  }
  res.status(200).json(DB.Products);
});

// POST
productRouter.post('/', (req: Request, res: Response) => {
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

  try {
    Validator.validateRequestBody(req.body);
    DB.Products.push(newProduct);
    res.status(201).json({ message: '상품이 성공적으로 생성되었습니다.' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ errorMessage: error.message });
    }
  }
});

// DELETE
productRouter.delete('/:id', (req: Request, res: Response) => {
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

export default productRouter;
