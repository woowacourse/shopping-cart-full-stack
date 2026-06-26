import { useState, useEffect } from 'react';
import { orderCheckApiService } from '../api/orderCheckApiService';
import type { Coupon } from '../api/apiTypes';
import type { ApiStatus } from '../types';

const MAX_COUPON_COUNT = 2;

export const useCoupon = (close: () => void) => {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [discountAmount, setDiscountAmount] = useState<number>(0);
    const [apiStatus, setApiStatus] = useState<ApiStatus>('loading');

    useEffect(() => {
        const init = async () => {
            try {
                const { data } = await orderCheckApiService.getCoupons();
                setCoupons(data.coupons);
                setSelectedIds(data.selectedCoupons);
                if (data.selectedCoupons.length > 0) {
                    const { data: discountData } = await orderCheckApiService.calculateCouponDiscount(
                        data.selectedCoupons
                    );
                    setDiscountAmount(discountData.discountAmount);
                }
                setApiStatus('success');
            } catch {
                setApiStatus('error');
            }
        };
        init();
    }, []);

    const isCouponDisabled = (coupon: Coupon) =>
        coupon.disabled || (selectedIds.length >= MAX_COUPON_COUNT && !selectedIds.includes(coupon.couponId));

    const toggle = async (coupon: Coupon) => {
        if (isCouponDisabled(coupon)) return;

        const prevIds = selectedIds;
        const isSelected = selectedIds.includes(coupon.couponId);
        const next = isSelected
            ? selectedIds.filter((id) => id !== coupon.couponId)
            : [...selectedIds, coupon.couponId];

        setSelectedIds(next);
        try {
            const { data } = await orderCheckApiService.calculateCouponDiscount(next);
            setDiscountAmount(data.discountAmount);
        } catch {
            setSelectedIds(prevIds);
        }
    };

    const handleConfirm = async () => {
        try {
            await orderCheckApiService.selectCoupons(selectedIds);
            close();
        } catch {
            close();
        }
    };

    return { coupons, selectedIds, discountAmount, apiStatus, isCouponDisabled, toggle, handleConfirm };
};
