import { BadRequestError, NotFoundError } from "../../errors/http-error.js";

export class CartNotFoundError extends NotFoundError {
  constructor() {
    super("해당하는 장바구니 항목이 없습니다.");
  }
}

export class CartValidationError extends BadRequestError {
  constructor() {
    super("수량이 유효하지 않습니다.");
  }
}
