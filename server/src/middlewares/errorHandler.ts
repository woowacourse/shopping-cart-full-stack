import { Request, Response, NextFunction } from 'express';
import * as z from 'zod';
import { BadRequestError, NotFoundError } from '../errors';

const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof z.ZodError) {
    const data = err.issues.reduce<Record<string, string>>((acc, issue) => {
      const key = issue.path[0];

      if (typeof key === 'string' && acc[key] === undefined) {
        acc[key] = issue.message;
      }

      return acc;
    }, {});

    res.status(400).json({ status: 'fail', data });
    return;
  }

  if (err instanceof NotFoundError) {
    res.status(404).json({ status: 'fail', data: err.data });
    return;
  }

  if (err instanceof BadRequestError) {
    res.status(400).json({ status: 'fail', data: err.data });
    return;
  }

  res.status(500).json({ status: 'error', message: '서버 에러가 발생했습니다.' });
};

export default errorHandler;
