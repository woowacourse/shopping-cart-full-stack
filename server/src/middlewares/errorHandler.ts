import {ErrorRequestHandler} from 'express';

export const errorHandler: ErrorRequestHandler = (_error, _req, res, _next) => {
  res.status(500).send();
};
