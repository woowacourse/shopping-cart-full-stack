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
    return;
  }
  if (err instanceof NotFoundError) {
    res.status(err.statusCode).send({
      code: err.code,
      message: err.message,
    });
    return;
  }
  const internalErr = new InternalServerError();
  res.status(internalErr.statusCode).send({
    code: internalErr.code,
    message: internalErr.message,
  });
}

export class APIError extends Error {
  statusCode: number;
  code: string;

  constructor({
    statusCode,
    code,
    message,
  }: {
    statusCode: number;
    code: string;
    message: string;
  }) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

export class NotFoundError extends APIError {
  constructor({
    code = "RESOURCE_NOT_FOUND",
    message = "요청한 리소스를 찾을 수 없습니다.",
  } = {}) {
    super({ statusCode: 404, code: code, message: message });
  }
}

export class InternalServerError extends APIError {
  constructor({
    code = "INTERNAL_SERVER_ERROR",
    message = "예기치 못한 오류가 발생했습니다.",
  } = {}) {
    super({ statusCode: 500, code: code, message: message });
  }
}

export class BadRequestError extends APIError {
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
    super({ statusCode: 400, code: code, message: message });
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
