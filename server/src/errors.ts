export class AppError extends Error {
  constructor(
    public statusCode: number,
    public data: Record<string, string>,
  ) {
    super();
  }
}

export class BadRequestError extends AppError {
  constructor(data: Record<string, string>) {
    super(400, data);
    this.name = 'BadRequestError';
  }
}

export class NotFoundError extends AppError {
  constructor(data: Record<string, string>) {
    super(404, data);
    this.name = 'NotFoundError';
  }
}
