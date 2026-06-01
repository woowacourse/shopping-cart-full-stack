export class NotFoundError extends Error {
  code: string;
  status: number;

  constructor(code: string, message: string) {
    super(message);
    this.name = "NotFoundError";
    this.status = 404;
    this.code = code;
  }
}

export class InvalidError extends Error {
  status: number;
  code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "InvalidError";
    this.status = 400;
    this.code = code;
  }
}
