import type { Product } from "../types";

export interface ProductRepository {
  getAllProducts(): Product[];
  addProduct(product: Omit<Product, "id">): Product;
  getProductByName(name: string): Product | undefined;
  getProductById(id: Product["id"]): Product | undefined;
  deleteProduct(id: Product["id"]): Product["id"];
}

export class InMemoryProductRepository {
  private productDB = new Map<Product["id"], Product>();

  constructor() {
    const seedProducts: Product[] = [
      {
        id: "0",
        name: "스타벅스 아메리카노",
        price: 4500,
        image:
          "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300",
      },
      {
        id: "1",
        name: "블루보틀 라떼",
        price: 6000,
        image:
          "https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=300",
      },
      {
        id: "2",
        name: "이디야 카페모카",
        price: 4800,
        image:
          "https://images.unsplash.com/photo-1542990253-0b8be9d10f51?w=300",
      },
      {
        id: "3",
        name: "투썸 케이크",
        price: 7500,
        image:
          "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=300",
      },
    ];

    seedProducts.forEach((product) => this.productDB.set(product.id, product));
  }

  private createId() {
    return crypto.randomUUID();
  }

  getAllProducts() {
    const products = [...this.productDB.values()];

    return products;
  }

  addProduct(product: Omit<Product, "id">) {
    const id = this.createId();
    const newProducts: Product = {
      id,
      ...product,
    };

    this.productDB.set(id, newProducts);

    return newProducts;
  }

  getProductByName(name: string) {
    const product = [...this.productDB.values()].find(
      (product) => product.name === name,
    );

    return product;
  }

  getProductById(id: Product["id"]) {
    const product = this.productDB.get(id);

    return product;
  }

  deleteProduct(id: Product["id"]) {
    this.productDB.delete(id);

    return id;
  }

  clear() {
    this.productDB.clear();
  }
}
