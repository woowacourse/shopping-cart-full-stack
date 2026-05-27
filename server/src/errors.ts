export class NotFoundError extends Error {
  resource;

  constructor(resource: string) {
    super(`${resource}을(를) 찾을 수 없습니다`);
    this.resource = resource;
  }
}
