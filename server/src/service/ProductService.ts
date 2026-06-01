import { InvalidError, NotFoundError } from "../errors/CustomErrorClass";
import { ERROR_MESSAGE } from "../errors/ErrorMessage";
import { ProductData } from "../repositories/Product";
import { CartRepositoryInterface } from "../repositories/interfaces/CartRepositoryInterface";
import { ProductRepositoryInterface } from "../repositories/interfaces/ProductRepositoryInterface";
import { validateProductData } from "../util/Validator";

export default class ProductService {
  #productRepository: ProductRepositoryInterface;
  #cartRepository: CartRepositoryInterface;

  constructor(productRepository: ProductRepositoryInterface, cartRepository: CartRepositoryInterface) {
    this.#productRepository = productRepository;
    this.#cartRepository = cartRepository;
  }

  getProducts(): ProductData[] {
    return this.#productRepository.getProducts();
  };
  
  postProducts(newProducts: ProductData): ProductData {
    validateProductData(newProducts);
    return this.#productRepository.addProduct(newProducts);
  };
  
  deleteProducts(productId: number): void {
    if (!productId) throw new InvalidError(ERROR_MESSAGE.INVALID_PRODUCT_ID);
  
    const product = this.#productRepository.findById(productId);
    if (!product) throw new NotFoundError(ERROR_MESSAGE.NOT_FOUND_PRODUCT);
  
    this.#productRepository.deleteById(productId);
    this.#cartRepository.deleteByProductId(productId);
  };
}
