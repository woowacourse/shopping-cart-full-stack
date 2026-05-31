interface ErrorParams {
  code: string;
  message: string;
  field: string;
}

export class BadRequestError extends Error {
  code: string;
  field: string;

  constructor({ code, message, field }: ErrorParams) {
    super(message);
    this.code = code;
    this.message = message;
    this.field = field;
  }
}

export class NotFoundError extends Error {
  code: string;
  field: string;

  constructor({ code, message, field }: ErrorParams) {
    super(message);
    this.code = code;
    this.message = message;
    this.field = field;
  }
}

export class RequestTimeoutError extends Error {
  code: string;
  field: string;

  constructor({ code, message, field }: ErrorParams) {
    super(message);
    this.code = code;
    this.message = message;
    this.field = field;
  }
}

export class InternalServerError extends Error {
  code: string;
  field: string;

  constructor({ code, message, field }: ErrorParams) {
    super(message);
    this.code = code;
    this.message = message;
    this.field = field;
  }
}

export class NotImplementedError extends Error {
  code: string;
  field: string;

  constructor({ code, message, field }: ErrorParams) {
    super(message);
    this.code = code;
    this.message = message;
    this.field = field;
  }
}
