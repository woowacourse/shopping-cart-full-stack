import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { NotFoundError } from '../errors';

const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ZodError) {
    const { fieldErrors } = err.flatten();
    res.status(400).json({ status: 'fail', data: fieldErrors });
    return;
  }

  if (err instanceof NotFoundError) {
    res.status(404).json({ status: 'fail', data: { [err.resource]: err.message } });
    return;
  }

  res.status(500).json({ status: 'error', data: '서버 에러가 발생했습니다.' });
};

export default errorHandler;
