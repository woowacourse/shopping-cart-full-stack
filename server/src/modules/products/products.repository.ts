import { Product } from './products.model.ts';
import { rawProducts } from '../../raw/raw.products.ts';
import type { ProductRequest } from './products.dto.ts';

export interface ProductsRepository {
    findAll(): Product[];
    findById(id: number): Product | undefined;
    create(product: ProductRequest): Product;
    deleteById(id: number): void;
}

class InMemoryProductsRepository implements ProductsRepository {
    findAll() {
        return rawProducts.map((product) => new Product(product));
    }

    findById(id: number) {
        const product = rawProducts.find((product) => product.id === id);

        return product ? new Product(product) : undefined;
    }

    create(product: ProductRequest) {
        const id = Math.max(0, ...rawProducts.map((p) => p.id)) + 1;
        const newProduct = { ...product, id };

        rawProducts.push(newProduct);

        return new Product(newProduct);
    }

    deleteById(id: number) {
        const productIndex = rawProducts.findIndex((product) => product.id === id);

        if (productIndex === -1) return;

        rawProducts.splice(productIndex, 1);
    }
}

export const productsRepository: ProductsRepository = new InMemoryProductsRepository();
