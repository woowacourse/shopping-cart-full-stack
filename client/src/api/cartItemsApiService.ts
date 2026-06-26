import { cartFetcher } from './cartFetcher';
import type { Cart, CartItem, CartPayInfo, CartWithPayInfo } from './apiTypes';

export const cartItemsApiService = {
    addCartItem: (productId: string, quantity: number) =>
        cartFetcher<{ status: number; data: CartItem }>('/cart', {
            method: 'POST',
            body: JSON.stringify({ productId, quantity }),
        }),

    getCart: () => cartFetcher<{ status: number; data: CartWithPayInfo }>('/cart'),

    getCartPayInfo: () => cartFetcher<{ status: number; data: CartPayInfo }>('/cart/pay-info'),

    selectCartItem: (productId: string, checkStatus: boolean) =>
        cartFetcher<{ status: number; data: { isAllSelected: boolean; cartItem: CartItem } }>(
            `/carts/select/product/${productId}`,
            { method: 'PATCH', body: JSON.stringify({ checkStatus }) }
        ),

    selectAllCartItems: (checkStatus: boolean) =>
        cartFetcher<{ status: number; data: Cart }>('/carts/select', {
            method: 'PATCH',
            body: JSON.stringify({ checkStatus }),
        }),

    updateCartItemQuantity: (productId: string, quantity: number) =>
        cartFetcher<{ status: number; data: CartItem }>(`/carts/products/${productId}`, {
            method: 'PATCH',
            body: JSON.stringify({ quantity }),
        }),

    deleteCartItem: (productId: string) =>
        cartFetcher<{ status: number; data: { deletedProductId: string } }>(`/cart/product/${productId}`, {
            method: 'DELETE',
        }),
};
