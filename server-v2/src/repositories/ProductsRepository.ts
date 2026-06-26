import { Product } from '../models/Product.js';

export const products = new Map<string, Product>();

const dummyProducts: Product[] = [
    new Product('1', { name: '망고', price: 5000, imgUrl: 'https://example.com/images/mango.png' }),
    new Product('2', { name: '바나나', price: 3000, imgUrl: 'https://example.com/images/banana.png' }),
    new Product('3', { name: '딸기', price: 8000, imgUrl: 'https://example.com/images/strawberry.png' }),
];

dummyProducts.forEach((product) => products.set(product.id, product));

export const generateId = (): string => {
    const id = crypto.randomUUID();
    return products.has(id) ? generateId() : id;
};

export const getAll = async () => {
    return Array.from(products.values());
};

export const insert = async (product: Product) => {
    products.set(product.id, product);
    return product;
};

export const getById = async (productId: Product['id']) => {
    return products.get(productId);
};

export const deleteById = async (productId: Product['id']) => {
    const product = products.get(productId);

    if (!product) return null;

    products.delete(productId);
    return product;
};
