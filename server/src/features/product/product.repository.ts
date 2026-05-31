import { InMemoryDB } from "../../db/in-memory-db.js";
import type { ProductEntity } from "./product.entity.js";

export interface ProductRepository {
  save: (product: Omit<ProductEntity, "id">) => Promise<ProductEntity>;
  findAll: () => Promise<ProductEntity[]>;
  findById: (productId: number) => Promise<ProductEntity>;
  remove: (prodictId: number) => Promise<void>;
}

export default class InMemoryProductRepository implements ProductRepository {
  index: number;
  constructor(private db: InMemoryDB) {
    this.index = 0;
  }

  async save(product: Omit<ProductEntity, "id">) {
    const newProduct = { id: this.index++, ...product };
    this.db.PRODUCT_TABLE.set(newProduct.id, newProduct);
    return newProduct;
  }

  async findAll() {
    const products = Array.from(this.db.PRODUCT_TABLE.values());
    return products;
  }

  async findById(productId: number) {
    const product = this.db.PRODUCT_TABLE.get(productId);
    if (!product) {
      throw new Error("해당하는 상품이 없습니다.");
    }
    return product;
  }

  async remove(productId: number) {
    this.db.PRODUCT_TABLE.delete(productId);
  }
}
