import express, { Request, Response } from 'express';
import { DB } from '../database';
import { Validator } from '../validation';

const cartRouter = express.Router();
cartRouter.use(express.json());

// Cart API
// GET
cartRouter.get('/', (req: Request, res: Response) => {
  if (!DB.Cart) {
    return res.status(500).json({ errorMessage: '서버에 일시적인 오류가 발생했습니다.' });
  }
  res.status(200).json(DB.Cart);
});

// POST
cartRouter.post('/:id', function (req: Request, res: Response) {
  const requestId = Number(req.params.id);

  if (!DB.Cart) {
    return res.status(500).json({ errorMessage: '서버에 일시적인 오류가 발생했습니다.' });
  }
  const pickedProduct = DB.Products!.filter((product) => product.id === requestId)[0];
  DB.Cart.push(pickedProduct);
  res.status(201).json({ message: '상품이 장바구니에 추가되었습니다.' });
});

// PUT
cartRouter.put('/', function (req: Request, res: Response) {
  if (!DB.Cart) {
    return res.status(500).json({ errorMessage: '서버에 일시적인 오류가 발생했습니다.' });
  }

  try {
    Validator.validateRequestBody(req.body);
    const { id } = req.body;

    const toBeUpdatedIndex = DB.Cart.findIndex((product) => product.id === id);
    if (toBeUpdatedIndex === -1) {
      return res.status(404).json({ errorMessage: '상품을 찾을 수 없습니다.' });
    }

    DB.Cart[toBeUpdatedIndex] = req.body;
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ errorMessage: error.message });
    }
  }
});

// DELETE
cartRouter.delete('/:id', (req: Request, res: Response) => {
  const requestId = Number(req.params.id);
  if (!DB.Cart) {
    return res.status(500).json({ errorMessage: '서버에 일시적인 오류가 발생했습니다.' });
  }
  const isIdExist = DB.Cart.find((product) => product.id === requestId);
  if (!isIdExist) {
    return res.status(404).send({ errorMessage: '상품을 찾을 수 없습니다.' });
  }
  DB.Cart = DB.Cart.filter((product) => product.id !== requestId);

  res.status(204).send();
});

export default cartRouter;
