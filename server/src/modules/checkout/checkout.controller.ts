import { NextFunction, Request, Response } from "express";
import CheckoutService from "./checkout.service.js";

class CheckoutController {
  constructor(private checkoutService: CheckoutService) {}

  addCheckout = (req: Request, res: Response, next: NextFunction) => {
    const { cartId, selectedProductIds } = req.body;

    try {
      const newCheckoutId = this.checkoutService.createCheckout(
        cartId,
        selectedProductIds,
      );

      res.status(201).json({
        code: 201,
        message: "성공적으로 생성되었습니다.",
        result: { checkoutId: newCheckoutId },
      });
    } catch (error) {
      next(error);
    }
  };

  getCheckout = (req: Request, res: Response, next: NextFunction) => {
    const { checkoutId } = req.params;

    try {
      const newCheckoutId = this.checkoutService.getCheckoutContent(
        Number(checkoutId),
      );

      res.status(201).json({
        code: 201,
        message: "성공적으로 생성되었습니다.",
        result: { ...newCheckoutId },
      });
    } catch (error) {
      next(error);
    }
  };

  getCheckoutCoupons = (req: Request, res: Response, next: NextFunction) => {
    const { checkoutId } = req.params;

    const requestedAt = new Date(); // TODO: 백엔드한테 요청이 온 시간 기준
    try {
      const checkoutCoupons = this.checkoutService.getCheckoutCoupons(
        Number(checkoutId),
        requestedAt,
      );
      const recommendedCouponIds =
        this.checkoutService.getCheckoutRecommendedCouponIds(
          Number(checkoutId),
          requestedAt,
        );

      res.status(200).json({
        code: 200,
        message: "요청에 성공했습니다.",
        result: {
          coupons: checkoutCoupons,
          recommendedCouponIds: recommendedCouponIds,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  applyCheckoutCoupons = (req: Request, res: Response, next: NextFunction) => {
    const { checkoutId } = req.params;
    const { couponIds } = req.body;

    const requestedAt = new Date(); // TODO: 백엔드한테 요청이 온 시간 기준

    try {
      this.checkoutService.applyCoupon(
        Number(checkoutId),
        couponIds,
        requestedAt,
      );
      const checkoutContent = this.checkoutService.getCheckoutContent(
        Number(checkoutId),
      );

      res.status(200).json({
        code: 200,
        message: "쿠폰이 적용되었습니다.",
        result: {
          appliedCouponIds: checkoutContent.appliedCouponIds,
          couponDiscountPrice: checkoutContent.couponDiscountPrice,
          deliveryFee: checkoutContent.deliveryFee,
          totalPrice: checkoutContent.totalPrice,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  updateRemoteArea = (req: Request, res: Response, next: NextFunction) => {
    const { checkoutId } = req.params;
    const { remoteArea } = req.body;

    try {
      this.checkoutService.updateRemoteArea(Number(checkoutId), remoteArea);

      const checkoutContent = this.checkoutService.getCheckoutContent(
        Number(checkoutId),
      );

      res.status(200).json({
        code: 200,
        message: "요청에 성공했습니다.",
        result: {
          remoteArea: checkoutContent.remoteArea,
          couponDiscountPrice: checkoutContent.couponDiscountPrice,
          deliveryFee: checkoutContent.deliveryFee,
          totalPrice: checkoutContent.totalPrice,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  validateAppliedCoupons = (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const { checkoutId } = req.params;

    try {
      const { appliedCouponIds } = this.checkoutService.getCheckoutContent(
        Number(checkoutId),
      );

      const requestedAt = new Date();
      this.checkoutService.validateCoupons(
        Number(checkoutId),
        appliedCouponIds,
        requestedAt,
      );

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

export default CheckoutController;
