import express from "express";

export interface ErrorResponse {
  message: string;
  code: string;
}

export function handleErrors(res: express.Response, err: Error) {
  if (err instanceof BadRequestError) {
    res.status(err.statusCode).send({
      code: err.code,
      message: err.message,
      errors: err.errors,
    });
  }
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

export class BadRequestError extends Error {
  statusCode: number;
  code: string;
  errors: Record<string, ErrorResponse>;

  constructor({
    code = "BAD_REQUEST",
    message = "요청 데이터가 유효하지 않습니다.",
    errors,
  }: {
    code?: string;
    message?: string;
    errors: Record<string, ErrorResponse>;
  }) {
    super(message);
    this.statusCode = 400;
    this.code = code;
    this.errors = errors;
  }
}

export class FieldError extends Error {
  code: string;

  constructor({ code, message }: { code: string; message: string }) {
    super(message);
    this.code = code;
  }
}
