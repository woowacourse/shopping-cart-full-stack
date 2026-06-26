import { findAll } from "../repositories/cart.repository.js";
import { resetDatabase } from "../db/seed.js";
import { AppError } from "../errors/AppError.js";

// 장바구니가 완전히 비어 있을 때만 데모 DB를 시드 상태로 되돌린다.
export async function resetDemoData(): Promise<void> {
  const cartItems = await findAll();
  if (cartItems.length > 0) {
    throw new AppError("CART_NOT_EMPTY", 409);
  }

  await resetDatabase();
}
