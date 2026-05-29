import AppError from '../errors/AppError.js';

class ProductManager {
  private products: Map<number, Product>;
  private id: number;

  constructor() {
    this.products = new Map<number, Product>();
    this.id = 1;
  }

  private validateProductName(name: string) {
    if (!name || name.trim().length === 0) {
      throw new AppError('EMPTY_PRODUCT_NAME');
    }
    if (name.length > 100) {
      throw new AppError('PRODUCT_NAME_LENGTH_EXCEEDED');
    }
  }

  private validateProductPrice(price: number) {
    // price가 null이나 undefined일 때만 필드 누락으로 간주
    if (!price && price !== 0) {
      throw new AppError('EMPTY_PRODUCT_PRICE');
    }
    if (price <= 0 || typeof price === 'string') {
      throw new AppError('INVALID_PRODUCT_PRICE_TYPE');
    }
  }

  private validateProductQuantity(quantity: number) {
    if (!quantity && quantity !== 0) {
      throw new AppError('EMPTY_PRODUCT_QUANTITY');
    }
    if (typeof quantity === 'string' || quantity < 1 || quantity > 99) {
      throw new AppError('INVALID_PRODUCT_QUANTITY_RANGE');
    }
  }

  // 생성된 상품의 id를 반환하여, 컨트롤러가 응답 본문에 담을 수 있도록 한다.
  addProduct(product: Product): number {
    this.validateProductQuantity(product.quantity);
    this.validateProductName(product.name);
    this.validateProductPrice(product.price);

    const newId = this.id;
    this.products.set(this.id++, product);
    return newId;
  }

  deleteProduct(id: number) {
    if (!this.products.has(id)) {
      throw new AppError('PRODUCT_NOT_EXIST');
    }

    this.products.delete(id);
  }

  getProducts() {
    let result: Array<Product & { id: number }> = [];

    this.products.forEach((product, id) => {
      result.push({ id, ...product });
    });

    return result;
  }

  reset() {
    this.products.clear();
    this.id = 1;
  }
}

export default ProductManager;
