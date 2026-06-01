import AppError from "../../errors/AppError.js";

export type ProductType = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imgUrl?: string;
};

class Product {
  constructor(
    private id: number,
    private name: string,
    private price: number,
    private quantity: number,
    private imgUrl?: string,
  ) {
    this.validateProductName(name);
    this.validateProductPrice(price);
    this.validateProductQuantity(quantity);
  }

  toJson() {
    return {
      id: this.id,
      name: this.name,
      price: this.price,
      quantity: this.quantity,
      imgUrl: this.imgUrl,
    };
  }

  isSameId(id: number) {
    return this.id === id;
  }

  hasEnoughStock(itemCount: number) {
    return this.quantity >= itemCount;
  }

  private validateProductName(name: string) {
    if (!name || name.trim().length === 0) {
      throw new AppError("EMPTY_PRODUCT_NAME");
    }
    if (name.length > 100) {
      throw new AppError("PRODUCT_NAME_LENGTH_EXCEEDED");
    }
  }

  private validateProductPrice(price: number) {
    // price가 null이나 undefined일 때만 필드 누락으로 간주
    if (!price && price !== 0) {
      throw new AppError("EMPTY_PRODUCT_PRICE");
    }
    if (price <= 0 || typeof price === "string") {
      throw new AppError("INVALID_PRODUCT_PRICE_TYPE");
    }
  }

  private validateProductQuantity(quantity: number) {
    if (!quantity && quantity !== 0) {
      throw new AppError("EMPTY_PRODUCT_QUANTITY");
    }
    if (typeof quantity === "string" || quantity < 1 || quantity > 99) {
      throw new AppError("INVALID_PRODUCT_QUANTITY_RANGE");
    }
  }
}

export default Product;
