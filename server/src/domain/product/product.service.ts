import AppError from "../../errors/AppError.js";
import Product, { ProductType } from "../../model/Product.js";
import { ProductRepository } from "./product.repository.js";

class ProductService {
  constructor(private productRepository: ProductRepository) {}

  getProducts() {
    return this.productRepository.get();
  }

  addProduct({ name, price, quantity, imgUrl }: Omit<ProductType, "id">) {
    const id = this.productRepository.nextId();
    const newProduct = new Product(id, name, price, quantity, imgUrl);
    this.productRepository.add(newProduct);

    return newProduct.toJson().id;
  }

  deleteProduct(id: number) {
    const targetProduct = this.productRepository.findById(id);
    if (!targetProduct) {
      throw new AppError("PRODUCT_NOT_EXIST");
    }
    this.productRepository.delete(id);
  }

  reset() {
    this.productRepository.reset();
  }
}

export default ProductService;
