import type { Product } from '../api/apiTypes';

export const FREE_DELIVERY_THRESHOLD = 100000;
const DELIVERY_FEE = 3000;

export const getOrderSummary = (products: Product[], quantityStatus: number[], checkStatus: boolean[]) => {
    const orderAmount = products.reduce(
        (sum, product, index) => sum + (checkStatus[index] ? product.price * quantityStatus[index] : 0),
        0
    );
    const deliveryFee = orderAmount >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
    const totalAmount = orderAmount + deliveryFee;
    const totalQuantity = products.reduce((sum, _, index) => sum + (checkStatus[index] ? quantityStatus[index] : 0), 0);

    return { orderAmount, deliveryFee, totalAmount, totalQuantity };
};
