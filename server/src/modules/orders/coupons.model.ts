import {RawCoupon} from '../../raw/raw.coupons.ts';

export abstract class Coupon {
	id: number;
	name: string;
	expirationDate: string;
	minOrderAmount?: number;
	availableHours?: string;

	constructor(raw: RawCoupon) {
		this.id = raw.id;
		this.name = raw.name;
		this.expirationDate = raw.expirationDate;
		this.minOrderAmount = raw.minOrderAmount;
		this.availableHours = raw.availableHours;
	}

	// Calculate discount amount given the context
	// returns { discount, remainingTotal }
	abstract calculateDiscount(remainingTotal: number, originalTotal: number, deliveryFee: number): { discount: number; remainingTotal: number };

	// Check if coupon is valid for this order
	isValid(totalAmount: number, bogoTargetId: number | null, currentHour: number, deliveryFee: number): boolean {
		if (this.minOrderAmount !== undefined && totalAmount < this.minOrderAmount) {
			return false;
		}
		if (this.availableHours) {
			const [startStr, endStr] = this.availableHours.split('-');
			const startHour = parseInt(startStr.split(':')[0], 10);
			const endHour = parseInt(endStr.split(':')[0], 10);
			if (currentHour < startHour || currentHour >= endHour) {
				return false;
			}
		}
		return true;
	}
}

export class FixedDiscountCoupon extends Coupon {
	discountAmount: number;

	constructor(raw: RawCoupon, discountAmount: number) {
		super(raw);
		this.discountAmount = discountAmount;
	}

	calculateDiscount(remainingTotal: number, originalTotal: number, deliveryFee: number) {
		return {
			discount: this.discountAmount,
			remainingTotal: Math.max(0, remainingTotal - this.discountAmount),
		};
	}
}

export class RateDiscountCoupon extends Coupon {
	discountRate: number;

	constructor(raw: RawCoupon, discountRate: number) {
		super(raw);
		this.discountRate = discountRate;
	}

	calculateDiscount(remainingTotal: number, originalTotal: number, deliveryFee: number) {
		const discount = remainingTotal * this.discountRate;
		return {
			discount,
			remainingTotal: Math.max(0, remainingTotal - discount),
		};
	}
}

export class BogoCoupon extends Coupon {
	constructor(raw: RawCoupon) {
		super(raw);
	}

	calculateDiscount(remainingTotal: number, originalTotal: number, deliveryFee: number) {
		return {discount: 0, remainingTotal}; // BOGO discount is not included in numeric discountAmount
	}

	isValid(totalAmount: number, bogoTargetId: number | null, currentHour: number, deliveryFee: number): boolean {
		if (bogoTargetId === null) return false;
		return super.isValid(totalAmount, bogoTargetId, currentHour, deliveryFee);
	}
}

export class FreeShippingCoupon extends Coupon {
	constructor(raw: RawCoupon) {
		super(raw);
	}

	calculateDiscount(remainingTotal: number, originalTotal: number, deliveryFee: number) {
		return { discount: deliveryFee, remainingTotal };
	}

	isValid(totalAmount: number, bogoTargetId: number | null, currentHour: number, deliveryFee: number): boolean {
		if (deliveryFee === 0) return false;
		return super.isValid(totalAmount, bogoTargetId, currentHour, deliveryFee);
	}
}

export const createCoupon = (raw: RawCoupon): Coupon => {
	if (raw.id === 1) return new FixedDiscountCoupon(raw, 5000);
	if (raw.id === 2) return new BogoCoupon(raw);
	if (raw.id === 3) return new FreeShippingCoupon(raw);
	if (raw.id === 4) return new RateDiscountCoupon(raw, 0.3);
	throw new Error(`Unknown coupon id: ${raw.id}`);
};
