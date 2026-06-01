import {RequestHandler} from 'express';

export const asyncHandler = <Params>(handler: RequestHandler<Params>): RequestHandler<Params> => {
  return async (req, res, next) => {
    try {
      await Promise.resolve(handler(req, res, next));
    } catch (error) {
      next(error);
    }
  };
};
