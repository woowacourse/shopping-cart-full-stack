import { Product } from './products.model.ts';
import { rawProducts } from '../../raw/raw.products.ts';
import type { ProductRequest } from './products.dto.ts';

export const findAll = () => {
    return rawProducts.map((product) => new Product(product));
};

export const findById = (id: number) => {
    const product = rawProducts.find((product) => product.id === id);

    return product ? new Product(product) : undefined;
};

export const create = (product: ProductRequest) => {
    const id = (rawProducts.at(-1)?.id ?? 0) + 1;
    const newProduct = {
        ...product,
        id,
    };

    rawProducts.push(newProduct);

    return newProduct;
};

export const deleteById = (id: number) => {
    const productIndex = rawProducts.findIndex((product) => product.id === id);

    if (productIndex === -1) return;

    rawProducts.splice(productIndex, 1);
};
