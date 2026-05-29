import Product, { ProductType } from '../../model/Product.js';

class ProductService {
  private id: number;

  constructor(private productRepository: any) {
    this.id = 1;
  }

  getProducts() {
    return this.productRepository.get();
  }

  addProduct({ name, price, quantity, imgUrl }: Omit<ProductType, 'id'>) {
    const newProduct = new Product(this.id++, name, price, quantity, imgUrl);
    this.productRepository.add(newProduct);

    return newProduct.toJson().id;
  }

  deleteProduct(id: number) {
    this.productRepository.delete(id);
  }
}

export default ProductService;
