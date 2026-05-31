import { InMemoryDB } from "../../db/in-memory-db.js";
import type { ProductEntity } from "./product.entity.js";

export interface ProductRepository {
  save: (product: Omit<ProductEntity, "id">) => Promise<ProductEntity>;
  findAll: () => Promise<ProductEntity[]>;
  findById: (productId: number) => Promise<ProductEntity | undefined>;
  remove: (prodictId: number) => Promise<void>;
}

export default class InMemoryProductRepository implements ProductRepository {
  index: number;
  constructor(private db: InMemoryDB) {
    this.index = 0;
  }

  async save(product: Omit<ProductEntity, "id">) {
    const newProduct = { id: this.index++, ...product };
    this.db.PRODUCT_TABLE.push(newProduct);
    return newProduct;
  }

  async findAll() {
    const products = this.db.PRODUCT_TABLE.map((productData) => {
      return {
        id: productData.id,
        name: productData.name,
        price: productData.price,
        imgUrl: productData.imgUrl,
      };
    });
    return products;
  }

  async findById(productId: number) {
    const product = this.db.PRODUCT_TABLE.find((item) => item.id === productId);
    return product;
  }

  async remove(productId: number) {
    this.db.PRODUCT_TABLE = this.db.PRODUCT_TABLE.filter((p) => p.id !== productId);
  }
}
