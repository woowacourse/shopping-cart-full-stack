export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message?: string,
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class InvalidInputError extends HttpError {
  constructor(message = "Invalid Input") {
    super(400, message);
  }
}

export class NotFoundError extends HttpError {
  constructor(message = "Resource not found") {
    super(404, message);
  }
}

export class DuplicateNameError extends HttpError {
  constructor(message = "Duplicate name") {
    super(409, message);
  }
}
