export interface Cart {
    cartItemId: number;
    quantity: number;
    data: {
        productId: number;
        name: string;
        price: number;
        thumbnailUrl: string;
    };
}
