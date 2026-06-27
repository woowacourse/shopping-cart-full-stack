import { NetworkError } from "./cart.api";
import type { ErrorResponseDto } from "./cart.api.dto";
import type { CouponRequestDto, CouponResponseDto } from "./coupon.api.dto";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export async function getCoupons(
  requestDto: CouponRequestDto,
): Promise<CouponResponseDto> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/coupon`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestDto),
    });
  } catch {
    throw new NetworkError();
  }

  if (!response.ok) {
    const error: ErrorResponseDto = await response.json();
    throw new Error(error.message);
  }

  return response.json();
}
