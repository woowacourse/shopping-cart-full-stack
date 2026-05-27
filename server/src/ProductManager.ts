export type Product = {
  name: string;
  price: number;
  quantity: number;
  imgUrl?: string;
};

class ProductManager {
  private products: Map<number, Product>;
  private id: number;

  constructor() {
    this.products = new Map<number, Product>();
    this.id = 1;
  }

  private validateProductName(name: string) {
    if (!name || name.trim().length === 0) {
      throw new Error('상품명 필드가 누락되었습니다.');
    }
    if (name.length > 100) {
      throw new Error('상품명은 100자를 초과할 수 없습니다.');
    }
  }

  private validateProductPrice(price: number) {
    // price가 null이나 undefined일 때만 필드 누락으로 간주
    if (!price && price !== 0) {
      throw new Error('가격 필드가 누락되었습니다.');
    }
    if (price <= 0 || typeof price === 'string') {
      throw new Error('가격은 0보다 큰 숫자여야 합니다.');
    }
  }

  private validateProductQuantity(quantity: number) {
    if (!quantity && quantity !== 0) {
      throw new Error('재고 필드가 누락되었습니다.');
    }
    if (typeof quantity === 'string' || quantity < 1 || quantity > 99) {
      throw new Error('상품 재고는 1이상 99이하의 정수이어야 합니다.');
    }
  }

  addProduct(product: Product) {
    this.validateProductQuantity(product.quantity);
    this.validateProductName(product.name);
    this.validateProductPrice(product.price);
    this.products.set(this.id++, product);
  }

  deleteProduct(id: number) {
    if (!this.products.has(id)) {
      throw new Error('삭제하려는 상품이 존재하지 않습니다.');
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
}

export default ProductManager;
