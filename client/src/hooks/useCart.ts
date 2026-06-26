import { useEffect, useState } from 'react';
import type { ApiStatus } from '../types';
import { optimisticUpdate } from '../optimisticUpdate';
import {
    toggleCheck,
    toggleAllCheck,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    isAllChecked as getIsAllChecked,
} from '../utils/cartItemUtils';
import { cartItemsApiService } from '../api/cartItemsApiService';
import type { CartItem, CartPayInfo, Product } from '../api/apiTypes';

export const useCart = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [payInfo, setPayInfo] = useState<CartPayInfo>({ orderPrice: 0, deliveryFee: 0, totalOrderAmount: 0 });
    const [apiStatus, setApiStatus] = useState<ApiStatus>('idle');

    // 낙관적 업데이트용 -> 주문 금액 정보에는 낙관적 업데이트 적용하지 않으려고 했는데 만들어둔게 있어서 재활용
    const refreshPayInfo = () => {
        cartItemsApiService
            .getCartPayInfo()
            .then((res) => setPayInfo(res.data))
            .catch(() => {});
    };

    useEffect(() => {
        const fetchCart = async () => {
            setApiStatus('loading');
            try {
                const data = await cartItemsApiService.getCart();
                setCartItems(data.data.cartItems.map((item) => ({ ...item })));
                setPayInfo(data.data.payInfo);
                setApiStatus('success');
            } catch {
                setApiStatus('error');
            }
        };

        fetchCart();
    }, []);

    const handleIncrease = (productId: string) => {
        const { quantity } = cartItems.find((item) => item.product.id === productId)!;
        optimisticUpdate({
            apiCallFn: () => cartItemsApiService.updateCartItemQuantity(productId, quantity + 1),
            onSuccess: () => setCartItems((prev) => increaseQuantity(prev, productId)),
            onError: () => setCartItems((prev) => decreaseQuantity(prev, productId)),
            afterApiSuccess: refreshPayInfo,
        });
    };

    const handleDecrease = (productId: string) => {
        const { quantity } = cartItems.find((item) => item.product.id === productId)!;
        optimisticUpdate({
            apiCallFn: () => cartItemsApiService.updateCartItemQuantity(productId, quantity - 1),
            onSuccess: () => setCartItems((prev) => decreaseQuantity(prev, productId)),
            onError: () => setCartItems((prev) => increaseQuantity(prev, productId)),
            afterApiSuccess: refreshPayInfo,
        });
    };

    const handleToggle = (productId: string) => {
        const newCheckStatus = !cartItems.find((item) => item.product.id === productId)!.checkStatus;

        optimisticUpdate({
            apiCallFn: () => cartItemsApiService.selectCartItem(productId, newCheckStatus),
            onSuccess: () => setCartItems((prev) => toggleCheck(prev, productId)),
            onError: () => setCartItems((prev) => toggleCheck(prev, productId)),
            afterApiSuccess: refreshPayInfo,
        });
    };

    const handleToggleAll = () => {
        const prevItems = cartItems;
        const newCheckStatus = !cartItems.every((item) => item.checkStatus);

        optimisticUpdate({
            apiCallFn: () => cartItemsApiService.selectAllCartItems(newCheckStatus),
            onSuccess: () => setCartItems((prev) => toggleAllCheck(prev)),
            onError: () => setCartItems(prevItems),
            afterApiSuccess: refreshPayInfo,
        });
    };

    const remove = async (productId: string) => {
        try {
            await cartItemsApiService.deleteCartItem(productId);
        } catch {
            return;
        }
        setCartItems((prev) => removeItem(prev, productId));
        refreshPayInfo();
    };

    const products: Product[] = cartItems.map(({ product, quantity }) => ({
        id: product.id,
        price: product.price,
        name: product.name,
        imgUrl: product.imgUrl,
        quantity,
    }));
    const quantityStatus = cartItems.map((item) => item.quantity);
    const checkStatus = cartItems.map((item) => item.checkStatus);
    const isAllChecked = getIsAllChecked(cartItems);

    return {
        products,
        quantityStatus,
        checkStatus,
        isAllChecked,
        payInfo,
        apiStatus,
        handleIncrease,
        handleDecrease,
        handleToggle,
        handleToggleAll,
        remove,
    };
};
