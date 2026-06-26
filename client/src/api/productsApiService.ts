import { cartFetcher } from './cartFetcher';
import type { Product } from './apiTypes';

export const productsApiService = {
    getProducts: () => cartFetcher<{ status: number; data: { products: Product[] } }>('/products'),

    createProduct: (body: Omit<Product, 'id'>) =>
        cartFetcher<{ status: number; data: Product }>('/products', {
            method: 'POST',
            body: JSON.stringify(body),
        }),

    deleteProduct: (productId: string) =>
        cartFetcher<{ status: number; data: { id: string } }>(`/products/${productId}`, {
            method: 'DELETE',
        }),
};
