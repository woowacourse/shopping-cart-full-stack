import { FieldError, productErrors, ValidationError } from "../errors/productErrors.js";
import { isImgUrl } from "../utils/validator.js";

export interface ProductType {
  name: string;
  price: number;
  imgUrl?: string;
}

export default class Product {
  static MAX_NAME_LENGTH = 100;

  private readonly name: string;
  private readonly price: number;
  private readonly imgUrl: string;

  constructor({ name, price, imgUrl = "default" }: ProductType) {
    this.validate({ name, price, imgUrl });

    this.name = name;
    this.imgUrl = imgUrl;
    this.price = price;
  }

  private validate = (productData: ProductType) => {
    const { name, price, imgUrl } = productData;
    const errors: FieldError[] = [];
    if (name.length === 0 || Product.MAX_NAME_LENGTH < name.length) {
      errors.push(productErrors.name);
    }
    if (price <= 0) {
      errors.push(productErrors.price);
    }
    if (imgUrl && isImgUrl(imgUrl)) {
      errors.push(productErrors.imgUrl);
    }

    if (errors.length !== 0) {
      throw new ValidationError(errors);
    }
  };

  getProduct() {
    return {
      name: this.name,
      price: this.price,
      imgUrl: this.imgUrl,
    };
  }
}
