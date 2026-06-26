import { useState, useEffect } from 'react';
import { optimisticUpdate } from '../optimisticUpdate';
import { orderCheckApiService } from '../api/orderCheckApiService';
import { FREE_DELIVERY_THRESHOLD } from '../utils/orderSummary';
import type { OrderCheckProduct, OrderCheckPayInfo } from '../api/apiTypes';
import type { ApiStatus } from '../types';

export const useOrderCheck = () => {
    const [products, setProducts] = useState<OrderCheckProduct[]>([]);
    const [payInfo, setPayInfo] = useState<OrderCheckPayInfo>({
        orderPrice: 0,
        deliveryFee: 0,
        totalOrderAmount: 0,
        couponDiscountAmount: 0,
    });
    const [remoteAreaChecked, setRemoteAreaChecked] = useState(false);
    const [apiStatus, setApiStatus] = useState<ApiStatus>('loading');

    const refreshPayInfo = async () => {
        const { data } = await orderCheckApiService.getOrderCheckPayInfo();
        setPayInfo(data);
    };

    useEffect(() => {
        const init = async () => {
            try {
                await orderCheckApiService.createOrderCheck();
                const { data } = await orderCheckApiService.getOrderCheck();
                setProducts(data.products);
                setPayInfo(data.payInfo);
                setApiStatus('success');
            } catch {
                setApiStatus('error');
            }
        };
        init();
    }, []);

    const handleRemoteAreaToggle = () => {
        const newStatus = !remoteAreaChecked;
        optimisticUpdate({
            apiCallFn: () => orderCheckApiService.selectRemoteArea(newStatus),
            onSuccess: () => setRemoteAreaChecked(newStatus),
            onError: () => setRemoteAreaChecked(!newStatus),
            afterApiSuccess: refreshPayInfo,
        });
    };

    const productCount = products.length;
    const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);
    const orderInfos = [
        { summaryType: '주문 금액', summaryAmount: payInfo.orderPrice },
        { summaryType: '쿠폰 할인 금액', summaryAmount: -payInfo.couponDiscountAmount },
        { summaryType: '배송비', summaryAmount: payInfo.deliveryFee },
    ];

    return {
        products,
        payInfo,
        remoteAreaChecked,
        apiStatus,
        productCount,
        totalQuantity,
        orderInfos,
        freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
        handleRemoteAreaToggle,
        refreshPayInfo,
    };
};
