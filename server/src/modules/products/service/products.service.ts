import ERROR_CODES from "@/ERROR_CODE";
import createAppError from "@/errors/AppError";
import type { Product } from "../types";
import { validateProductRules } from "./products.validator";
import { ProductRepository } from "../repository/products.repository";
import { CartsService } from "@/modules/carts/service/carts.service";

export class ProductsService {
  constructor(
    private productRepository: ProductRepository,
    private cartsService: CartsService,
  ) {}

  getAllProducts() {
    return this.productRepository.getAllProducts();
  }

  addProduct(arg: Omit<Product, "id">) {
    validateProductRules(arg);

    const existingProduct = this.productRepository.getProductByName(arg.name);
    if (existingProduct) {
      throw createAppError(ERROR_CODES.DUPLICATE_PRODUCT_NAME);
    }

    return this.productRepository.addProduct(arg);
  }

  deleteProduct(id: Product["id"]) {
    // 존재하지 않는 상품인지 확인
    const existingProduct = this.productRepository.getProductById(id);
    if (!existingProduct) {
      throw createAppError(ERROR_CODES.NOT_EXIST_PRODUCT);
    }

    this.productRepository.deleteProduct(id);

    // 연관 장바구니 항목 정리는 carts 모듈의 공개 API(service)에 위임한다.
    this.cartsService.removeCartItemByProductId(id);

    return id;
  }

  getProductById(id: Product["id"]) {
    const product = this.productRepository.getProductById(id);
    if (!product) {
      throw createAppError(ERROR_CODES.NOT_EXIST_PRODUCT);
    }

    return product;
  }
}
