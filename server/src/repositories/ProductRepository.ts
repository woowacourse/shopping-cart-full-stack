import type { Product } from '../models/Product.js';

export interface CreateProductInput {
  name: string;
  price: number;
  imageUrl: string;
}

export interface ProductRepository {
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  existsByName(name: string): Promise<boolean>;
  create(input: CreateProductInput): Promise<Product>;
  deleteById(id: string): Promise<boolean>;
}
