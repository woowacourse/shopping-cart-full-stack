import express from "express";

export function handleErrors(res: express.Response, err: Error) {
  if (err instanceof NotFoundError) {
    res.status(err.statusCode).send({
      code: err.code,
      message: err.message,
    });
  } else {
    const err = new InternalServerError();
    res.status(err.statusCode).send({
      code: err.code,
      message: err.message,
    });
  }
}

export class NotFoundError extends Error {
  statusCode: number;
  code: string;

  constructor(
    code = "RESOURCE_NOT_FOUND",
    message = "요청한 리소스를 찾을 수 없습니다.",
  ) {
    super(message);
    this.statusCode = 404;
    this.code = code;
  }
}

export class InternalServerError extends Error {
  statusCode: number;
  code: string;

  constructor(
    code = "INTERNAL_SERVER_ERROR",
    message = "예기치 못한 오류가 발생했습니다.",
  ) {
    super(message);
    this.statusCode = 500;
    this.code = code;
  }
}
