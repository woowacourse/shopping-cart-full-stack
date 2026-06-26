import type { CartItem } from '../api/apiTypes';

export const toggleCheck = (items: CartItem[], productId: string): CartItem[] =>
    items.map((item) => (item.product.id === productId ? { ...item, checkStatus: !item.checkStatus } : item));

export const toggleAllCheck = (items: CartItem[]): CartItem[] => {
    const allChecked = items.every((item) => item.checkStatus);
    return items.map((item) => ({ ...item, checkStatus: !allChecked }));
};

export const increaseQuantity = (items: CartItem[], productId: string): CartItem[] =>
    items.map((item) =>
        item.product.id === productId ? { ...item, quantity: Math.min(item.quantity + 1, 99) } : item
    );

export const decreaseQuantity = (items: CartItem[], productId: string): CartItem[] =>
    items.map((item) => (item.product.id === productId ? { ...item, quantity: Math.max(item.quantity - 1, 0) } : item));

export const removeItem = (items: CartItem[], productId: string): CartItem[] =>
    items.filter((item) => item.product.id !== productId);

export const isAllChecked = (items: CartItem[]): boolean => items.length > 0 && items.every((item) => item.checkStatus);
