import AppError from "../../errors/AppError.js";
import { ProductType } from "./Product.js";
import { CartRepository } from "../cart/cart.repository.js";
import { ProductRepository } from "./product.repository.js";

class ProductService {
  constructor(
    private productRepository: ProductRepository,
    private cartRepository: CartRepository,
  ) {}

  getProducts() {
    return this.productRepository.get().map((product) => product.toJson());
  }

  addProduct({ name, price, quantity, imgUrl }: Omit<ProductType, "id">) {
    const newProduct = this.productRepository.add({
      name,
      price,
      quantity,
      imgUrl,
    });

    return newProduct.toJson().id;
  }

  deleteProduct(id: number) {
    const targetProduct = this.productRepository.findById(id);
    if (!targetProduct) {
      throw new AppError("PRODUCT_NOT_EXIST");
    }

    this.cartRepository.removeProductFromAllCarts(id);
    this.productRepository.delete(id);
  }
}

export default ProductService;
