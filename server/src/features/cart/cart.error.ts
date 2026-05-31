import { NotFoundError } from "../../errors/http-error.js";

export class CartNotFoundError extends NotFoundError {
  constructor() {
    super("해당하는 장바구니 항목이 없습니다.");
  }
}
