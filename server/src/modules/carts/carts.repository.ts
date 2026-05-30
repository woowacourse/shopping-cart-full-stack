import { rawCarts } from '../../raw/raw.carts.ts';
import { rawProducts } from '../../raw/raw.products.ts';

import { Product } from '../products/products.model.ts';
import { Cart, ProductInCart } from './carts.model.ts';

export const findById = (id: number) => {
    const cart = rawCarts.find((cart) => cart.id === id);
    if (!cart) return undefined;

    return new Cart({
        id: cart.id,
        products: cart.products.map((cartProduct) => {
            const productData = rawProducts.find((rawProduct) => rawProduct.id === cartProduct.id)!;

            return new ProductInCart({
                product: new Product(productData),
                quantity: cartProduct.quantity,
            });
        }),
    });
};

export const updateProductQuantity = (cartId: number, productId: number, quantity: number): boolean => {
    const cart = rawCarts.find((cart) => cart.id === cartId);
    const product = cart?.products.find((product) => product.id === productId);

    if (!product) return false;

    product.quantity = quantity;

    return true;
};

export const deleteProductInCart = (cartId: number, productId: number) => {
    const cart = rawCarts.find((cart) => cart.id === cartId);
    if (!cart) return;

    const productIndex = cart.products.findIndex((product) => product.id === productId);
    if (productIndex === -1) return;

    cart.products.splice(productIndex, 1);
};

export const findProductInCart = (cartId: number, productId: number) => {
    const cart = rawCarts.find((cart) => cart.id === cartId);
    if (!cart) return undefined;

    const cartProduct = cart.products.find((product) => product.id === productId);
    if (!cartProduct) return undefined;

    const productData = rawProducts.find((rawProduct) => rawProduct.id === cartProduct.id)!;

    return new ProductInCart({
        product: new Product(productData),
        quantity: cartProduct.quantity,
    });
};
