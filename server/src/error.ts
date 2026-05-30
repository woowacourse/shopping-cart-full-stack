interface ErrorParams {
  message: string;
  field: string;
}

export class BadRequestError extends Error {
  field: string;

  constructor({ message, field }: ErrorParams) {
    super(message);
    this.message = message;
    this.field = field;
  }
}

export class NotFoundError extends Error {
  field: string;

  constructor({ message, field }: ErrorParams) {
    super(message);
    this.message = message;
    this.field = field;
  }
}

export class RequestTimeoutError extends Error {
  field: string;

  constructor({ message, field }: ErrorParams) {
    super(message);
    this.message = message;
    this.field = field;
  }
}

export class NotImplementedError extends Error {
  field: string;

  constructor({ message, field }: ErrorParams) {
    super(message);
    this.message = message;
    this.field = field;
  }
}
