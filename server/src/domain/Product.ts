import type { ProductData } from "../types/type.ts";
import { BadRequestError } from "../error.ts";

export default class Product {
  private name: string;
  private price: number;
  private image?: string | null;
  private id: string;

  constructor({ name, price, image, productId }: ProductData) {
    this.#validatorName(name);
    this.#validatorPrice(price);
    this.name = name;
    this.price = price;
    this.image = image;
    this.id = productId;
  }

  #validatorName(name: string) {
    if (typeof name !== "string") {
      throw new BadRequestError({
        code: "INVALID_TYPE",
        message: "유효하지 않은 형식입니다.",
        field: "productName",
      });
    }

    if (name.length === 0)
      throw new BadRequestError({
        code: "INVALID_NAME",
        message: "상품명이 공백입니다.",
        field: "productName",
      });

    if (name.length > 100)
      throw new BadRequestError({
        code: "INVALID_NAME",
        message: "상품명이 100자를 초과합니다.",
        field: "productName",
      });
  }

  #validatorPrice(price: number) {
    if (typeof price !== "number" || Number.isNaN(price)) {
      throw new BadRequestError({
        code: "INVALID_TYPE",
        message: "가격은 숫자여야 합니다.",
        field: "productPrice",
      });
    }

    if (price <= 0) {
      throw new BadRequestError({
        code: "INVALID_PRICE",
        message: "가격은 1원 이상입니다.",
        field: "productPrice",
      });
    }
  }

  getProduct() {
    return this.name;
  }
}
