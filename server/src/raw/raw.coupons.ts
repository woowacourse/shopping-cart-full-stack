export interface RawCoupon {
	id: number;
	name: string;
	expirationDate: string;
	minOrderAmount?: number;
	availableHours?: string;
}

export const rawCoupons: RawCoupon[] = [
	{
		id: 1,
		name: '5,000원 할인 쿠폰',
		expirationDate: '2026-11-30T23:59:59Z',
		minOrderAmount: 100000,
	},
	{
		id: 2,
		name: '2개 구매 시 1개 무료 쿠폰',
		expirationDate: '2026-05-30T23:59:59Z',
	},
	{
		id: 3,
		name: '5만원 이상 구매 시 무료 배송 쿠폰',
		expirationDate: '2026-08-31T23:59:59Z',
		minOrderAmount: 50000,
	},
	{
		id: 4,
		name: '미라클모닝 30% 할인 쿠폰',
		expirationDate: '2026-07-31T23:59:59Z',
		availableHours: '04:00-07:00',
	},
];

let snapshot: RawCoupon[] = [];

export const transaction = () => {
	snapshot = JSON.parse(JSON.stringify(rawCoupons));
};

export const rollback = () => {
	rawCoupons.splice(0, rawCoupons.length, ...snapshot);
};
