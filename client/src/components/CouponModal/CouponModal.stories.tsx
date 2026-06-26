import type { Meta, StoryObj } from "@storybook/react-vite";
import { http } from "msw";
import { userEvent, within } from "storybook/test";
import CouponModal from ".";
import { MyQueryProvider } from "../../lib/myQuery/MyQueryProvider";
import { worker } from "../../msw/browser";
import type { Coupon } from "../../domain/coupon";

const DISCOUNT_PREVIEW_URL = "http://localhost:3000/checkouts/:checkoutId/coupons/discount-preview";

/** 모달 안에서 쿠폰 이름으로 해당 행을 클릭해 선택을 토글한다. */
async function toggleCoupon(canvasElement: HTMLElement, couponName: string) {
  const canvas = within(canvasElement);
  const row = (await canvas.findByText(couponName)).closest("[aria-disabled]") as HTMLElement;
  await userEvent.click(row);
}

const couponList: Coupon[] = [
  {
    id: 1,
    name: "5,000원 할인 쿠폰",
    expiredDate: new Date(2026, 10, 30),
    minOrderAmount: 100000,
    isSelected: true,
    disabled: false,
  },
  {
    id: 2,
    name: "2개 구매 시 1개 무료 쿠폰",
    expiredDate: new Date(2026, 4, 30),
    isSelected: false,
    disabled: false,
  },
  {
    id: 3,
    name: "5만원 이상 구매 시 무료 배송 쿠폰",
    expiredDate: new Date(2026, 7, 31),
    minOrderAmount: 50000,
    isSelected: false,
    disabled: false,
  },
  {
    id: 4,
    name: "미라클모닝 30% 할인 쿠폰",
    expiredDate: new Date(2026, 6, 31),
    usableStartAt: "04:00",
    usableEndAt: "07:00",
    isSelected: false,
    disabled: true,
  },
];

const meta = {
  title: "Components/CouponModal",
  component: CouponModal,
  parameters: { layout: "fullscreen" },
  args: {
    checkoutId: 1,
    couponList,
    initialCouponDiscount: 5000,
    onApplyCoupon: async () => {},
    onClose: () => undefined,
  },
  decorators: [
    (Story) => (
      <MyQueryProvider>
        {/* 모달이 position:absolute로 채워질 기준 컨테이너 */}
        <div style={{ position: "relative", width: 430, height: 740 }}>
          <Story />
        </div>
      </MyQueryProvider>
    ),
  ],
} satisfies Meta<typeof CouponModal>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 상태 1: 진입 직후. 변경한 쿠폰이 없어(!isDirty) 적용 버튼이 비활성이고 초기 할인액을 보여준다. */
export const Default: Story = {};

/** 상태 2: 쿠폰 조합을 바꿔 예상 할인액을 조회하는 중(isPending). 버튼이 비활성이고 로더가 표시된다. */
export const Loading: Story = {
  beforeEach: () => {
    // 할인 미리보기 응답을 보류시켜 조회 중(isPending) 상태를 유지한다.
    worker.use(http.get(DISCOUNT_PREVIEW_URL, () => new Promise<Response>(() => {})));
    return () => worker.resetHandlers();
  },
  play: async ({ canvasElement }) => {
    // 조합 변경 → isDirty + 응답 보류로 isPending 유지 → 로더 표시
    await toggleCoupon(canvasElement, "2개 구매 시 1개 무료 쿠폰");
  },
};

/** 상태 3: 쿠폰 조합을 바꾸고 조회가 끝난 상태(isDirty && !isPending). 적용 버튼이 활성화된다. */
export const Applicable: Story = {
  play: async ({ canvasElement }) => {
    await toggleCoupon(canvasElement, "2개 구매 시 1개 무료 쿠폰");
  },
};
