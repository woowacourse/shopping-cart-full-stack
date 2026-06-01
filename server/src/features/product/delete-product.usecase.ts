import type ProductService from "./product.service.js";
import type CartService from "../cart/cart.service.js";

export default class DeleteProductUseCase {
  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  async execute(productId: number): Promise<void> {
    // 1. 상품 삭제 (Product 도메인)
    await this.productService.delete(productId);
    // 2. 장바구니에서 해당 상품 비우기 (Cart 도메인)
    await this.cartService.delete(productId);
  }
}
