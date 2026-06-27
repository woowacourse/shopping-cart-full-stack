import { Product } from '../../models/Product.js';
import type { CreateProductInput, ProductRepository } from '../ProductRepository.js';
import { createSeedProducts } from './seed.js';

export class InMemoryProductRepository implements ProductRepository {
  private products: Product[];

  constructor(initial: Product[] = createSeedProducts()) {
    this.products = [...initial];
  }

  async findAll(): Promise<Product[]> {
    return [...this.products];
  }

  async findById(id: string): Promise<Product | null> {
    return this.products.find((product) => product.id === id) ?? null;
  }

  async existsByName(name: string): Promise<boolean> {
    return this.products.some((product) => product.hasName(name));
  }

  async create({ name, price, imageUrl }: CreateProductInput): Promise<Product> {
    const product = new Product(this.nextId(), name, price, imageUrl);
    this.products.push(product);
    return product;
  }

  async deleteById(id: string): Promise<boolean> {
    const targetIndex = this.products.findIndex((product) => product.id === id);

    if (targetIndex === -1) {
      return false;
    }

    this.products.splice(targetIndex, 1);
    return true;
  }

  private nextId(): string {
    const maxId = this.products.reduce((max, product) => Math.max(max, Number(product.id)), 0);
    return `${maxId + 1}`;
  }
}
