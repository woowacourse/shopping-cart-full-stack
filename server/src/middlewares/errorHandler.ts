import {ErrorRequestHandler} from 'express';

export class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    message = ''
  ) {
    super(message);
  }
}

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (!(error instanceof HttpError)) {
    return res.status(500).send();
  }

  if (!error.message) {
    return res.status(error.statusCode).send();
  }

  res.status(error.statusCode).json({
    body: {
      message: error.message,
    },
  });
};
