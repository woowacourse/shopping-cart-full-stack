export class ModelError extends Error {
  code;

  constructor(code: string, message: string) {
    super(message);
    this.code = code;
  }
}
