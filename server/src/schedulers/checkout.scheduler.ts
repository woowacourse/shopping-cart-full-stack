import { deleteExpiredCheckouts } from "../services/checkout/index.js";

export const CHECKOUT_CLEANUP_INTERVAL_MS = 10 * 60 * 1000;

const state: { intervalId: ReturnType<typeof setInterval> | undefined } = { intervalId: undefined };

/**
 * 결제 전 임시 주문 cleanup 배치를 주기적으로 실행한다.
 * Express request/response 흐름과 분리된 Node.js 프로세스 내 scheduler다.
 */
export function startCheckoutCleanupScheduler(): void {
  if (state.intervalId !== undefined) {
    return;
  }
  state.intervalId = setInterval(() => {
    void deleteExpiredCheckouts();
  }, CHECKOUT_CLEANUP_INTERVAL_MS);
}

export function stopCheckoutCleanupScheduler(): void {
  if (state.intervalId === undefined) {
    return;
  }
  clearInterval(state.intervalId);
  state.intervalId = undefined;
}
