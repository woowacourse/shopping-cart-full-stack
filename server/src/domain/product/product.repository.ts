import { ProductType } from '../../model/Product.js';

export interface ProductRepository {
  get: () => void;
  add: ({ name, price, quantity, imgUrl }: Omit<ProductType, 'id'>) => void;
  delete: (id: number) => void;
}

export class InMemoryProductRepository implements ProductRepository {
  constructor() {}

  get() {}

  add() {}

  delete() {}
}
