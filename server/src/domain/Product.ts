import type { ProductData } from "../types/type.ts";
import { BadRequestError } from "../error.ts";

export default class Product {
  private name: string;
  private price: number;
  private image?: string | null;
  private id: string;

  constructor({ name, price, image }: ProductData) {
    this.#validatorName(name);
    this.#validatorPrice(price);
    this.name = name;
    this.price = price;
    this.image = image;
    this.id = crypto.randomUUID();
  }

  #validatorName(name: string) {
    if (typeof name !== "string") {
      throw new BadRequestError({
        message: "유효하지 않은 형식입니다.",
        field: "productName",
      });
    }

    if (name.length === 0)
      throw new BadRequestError({
        message: "상품명이 공백입니다.",
        field: "productName",
      });

    if (name.length > 100)
      throw new BadRequestError({
        message: "상품명이 100자를 초과합니다.",
        field: "productName",
      });
  }

  #validatorPrice(price: number) {
    if (typeof price !== "number" || Number.isNaN(price)) {
      throw new BadRequestError({
        message: "가격은 숫자여야 합니다.",
        field: "productPrice",
      });
    }

    if (price <= 0) {
      throw new BadRequestError({
        message: "가격은 1원 이상입니다.",
        field: "productPrice",
      });
    }
  }

  getProduct(): ProductData & { id: string } {
    return {
      name: this.name,
      price: this.price,
      image: this.image,
      id: this.id,
    };
  }
}
