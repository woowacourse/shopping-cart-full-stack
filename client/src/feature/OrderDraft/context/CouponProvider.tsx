import { createContext, useContext, type PropsWithChildren } from 'react';
import { useCoupons } from '../hooks/useCoupons';

type CouponsContextValue = ReturnType<typeof useCoupons>;

const CouponsContext = createContext<CouponsContextValue | null>(null);

export const useCouponsContext = () => {
  const context = useContext(CouponsContext);

  if (!context) {
    throw new Error(
      'useCouponsContext는 CouponsProvider안에서 사용해야 합니다.',
    );
  }

  return context;
};

type CouponsProviderProps = PropsWithChildren<{
  orderId: string;
  appliedCouponIds: string[];
}>;

export const CouponsProvider = ({
  orderId,
  appliedCouponIds,
  children,
}: CouponsProviderProps) => {
  const coupons = useCoupons(orderId, appliedCouponIds);

  return (
    <CouponsContext.Provider value={coupons}>
      {children}
    </CouponsContext.Provider>
  );
};
