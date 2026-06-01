import { Product } from '../products/products.model.ts';

export class ProductInCart {
    product: Product;
    quantity: number;

    constructor({ product, quantity }: { product: Product; quantity: number }) {
        this.product = product;
        this.quantity = quantity;
    }
}

export class Cart {
    id: number;
    products: ProductInCart[];

    constructor({ id, products }: { id: number; products: ProductInCart[] }) {
        this.id = id;
        this.products = products;
    }
}
