import { cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router";
import { describe, it, expect, vi } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "./setup";
import { createHandlers, type MockCartItem, type MockProduct } from "../msw/handlers";
import { MyQueryProvider } from "../lib/myQuery/MyQueryProvider";
import CheckoutPage from "../pages/CheckoutPage";
import OrderSuccessPage from "../pages/OrderSuccessPage";
import CartPage from "../pages/CartPage";

const BASE_URL = "http://localhost:3000";

/**
 * /checkout/:checkoutId 진입을 흉내내기 위해 라우트를 함께 구성한다.
 * 결제/이탈 흐름 검증을 위해 /cart, /order-success 라우트도 같이 등록한다.
 * CheckoutPage가 useBlocker를 쓰므로 데이터 라우터(createMemoryRouter)로 구성한다.
 */
function renderCheckoutPage(checkoutId = 1) {
  const router = createMemoryRouter(
    [
      { path: "/cart", element: <CartPage /> },
      { path: "/checkout/:checkoutId", element: <CheckoutPage /> },
      { path: "/order-success", element: <OrderSuccessPage /> },
    ],
    { initialEntries: [`/checkout/${checkoutId}`] },
  );

  return render(
    <MyQueryProvider>
      <RouterProvider router={router} />
    </MyQueryProvider>,
  );
}

/** Summary.Item은 label/value를 별도 span으로 렌더한다. label이 속한 row(부모 div)를 반환한다. */
function getSummaryRow(label: string) {
  return screen.getByText(label).parentElement!;
}

/** 도서산간 체크박스는 페이지 내 유일한 체크박스다(상품에는 체크박스가 없음). */
function getRemoteAreaCheckbox() {
  return screen.getByRole("checkbox");
}

function openCouponModal(user: ReturnType<typeof userEvent.setup>) {
  return user.click(screen.getByRole("button", { name: /쿠폰 적용/ }));
}

/** 쿠폰 모달 컨테이너. 헤더 텍스트로 잡는다. */
function getCouponModal() {
  return screen.getByText("쿠폰을 선택해 주세요").closest("div")!.parentElement!;
}

/**
 * 쿠폰 토글. 쿠폰 이름 span은 pointer-events:none이므로 클릭은 onClick이 달린
 * CouponItem 루트(aria-disabled 컨테이너)에 해야 한다.
 */
function clickCoupon(user: ReturnType<typeof userEvent.setup>, couponName: string) {
  const modal = getCouponModal();
  const couponRoot = within(modal).getByText(couponName).closest("[aria-disabled]") as HTMLElement;
  return user.click(couponRoot);
}

/** 모달 안에서 특정 쿠폰 행의 체크박스를 찾는다. */
function getCouponCheckbox(couponName: string) {
  const modal = getCouponModal();
  const couponRoot = within(modal).getByText(couponName).closest("[aria-disabled]") as HTMLElement;
  return within(couponRoot).getByRole("checkbox");
}

describe("주문 확인 페이지 렌더링", () => {
  it("진입 시 주문 상품 목록과 종류/개수 안내가 표시된다", async () => {
    renderCheckoutPage();

    expect(await screen.findByText("상품 A")).toBeInTheDocument();
    expect(screen.getByText("상품 B")).toBeInTheDocument();
    expect(screen.getByText("재고 부족 상품")).toBeInTheDocument();
    // 3종류, 총 4개(2+1+1)
    expect(screen.getByText(/총 3종류의 상품 4개를 주문합니다/)).toBeInTheDocument();
  });

  it("로딩 중에는 스켈레톤이 표시된다", () => {
    server.use(http.get(`${BASE_URL}/checkouts/:checkoutId`, () => new Promise(() => {})));
    renderCheckoutPage();
    expect(screen.getByTestId("skeleton-list")).toBeInTheDocument();
  });

  it("주문 조회 API 에러 시 에러 UI가 표시되고, 재시도하면 다시 조회한다", async () => {
    let shouldFail = true;
    server.use(
      http.get(`${BASE_URL}/checkouts/:checkoutId`, () => {
        if (shouldFail) {
          return HttpResponse.json({ error: "SERVER_ERROR", message: "서버 오류" }, { status: 500 });
        }
        return HttpResponse.json({
          checkout_id: 1,
          items: [{ product_id: 1, name: "복구된 상품", price: 1000, quantity: 1, image_url: "x" }],
          coupons: [],
          remote_area: false,
          checkout_amount: 1000,
          coupon_discount: 0,
          shipping_fee: 3000,
          total_amount: 4000,
        });
      }),
    );
    renderCheckoutPage();

    expect(await screen.findByText("오류가 발생했습니다. 잠시 후 다시 시도해 주세요.")).toBeInTheDocument();

    shouldFail = false;
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: /다시 시도/ }));

    expect(await screen.findByText("복구된 상품")).toBeInTheDocument();
  });

  it("존재하지 않는 checkoutId로 진입하면 에러 UI가 표시된다", async () => {
    renderCheckoutPage(999);
    expect(await screen.findByText("오류가 발생했습니다. 잠시 후 다시 시도해 주세요.")).toBeInTheDocument();
  });

  it("주문금액·쿠폰할인·배송비·총결제금액이 서버 계산값으로 표시된다", async () => {
    renderCheckoutPage();
    await screen.findByText("상품 A");

    // checkout_amount = 110,000 / 시드 쿠폰[1] 5,000원 할인 / 10만 이상이라 배송비 0
    expect(within(getSummaryRow("주문 금액")).getByText("110,000원")).toBeInTheDocument();
    expect(within(getSummaryRow("쿠폰 할인 금액")).getByText("-5,000원")).toBeInTheDocument();
    expect(within(getSummaryRow("배송비")).getByText("0원")).toBeInTheDocument();
    expect(within(getSummaryRow("총 결제 금액")).getByText("105,000원")).toBeInTheDocument();
  });

  it("진입 시 최대 혜택 쿠폰이 선택되어 쿠폰 할인 금액에 반영된다", async () => {
    renderCheckoutPage();
    await screen.findByText("상품 A");

    expect(within(getSummaryRow("쿠폰 할인 금액")).getByText("-5,000원")).toBeInTheDocument();
  });
});

describe("배송 정보", () => {
  /** 단일 상품 40,000원(10만원 미만). 시드 쿠폰[1]은 정액 5,000원 할인. */
  const products: MockProduct[] = [
    { id: 1, name: "단품", price: 40000, imageUrl: "https://placehold.co/80x80", stock: 10 },
  ];
  const cartItems: MockCartItem[] = [{ id: 1, productId: 1, quantity: 1 }];

  it("10만원 미만 주문에서 도서산간 체크 시 배송비가 6,000원으로 갱신된다", async () => {
    const user = userEvent.setup();
    server.use(...createHandlers(products, cartItems));
    renderCheckoutPage();

    await screen.findByText("단품");
    expect(within(getSummaryRow("배송비")).getByText("3,000원")).toBeInTheDocument();

    await user.click(getRemoteAreaCheckbox());
    expect(await within(getSummaryRow("배송비")).findByText("6,000원")).toBeInTheDocument();
  });

  it("도서산간 토글 후 다시 해제하면 배송비가 원복된다", async () => {
    const user = userEvent.setup();
    server.use(...createHandlers(products, cartItems));
    renderCheckoutPage();

    await screen.findByText("단품");
    const checkbox = getRemoteAreaCheckbox();

    await user.click(checkbox);
    expect(await within(getSummaryRow("배송비")).findByText("6,000원")).toBeInTheDocument();

    await user.click(getRemoteAreaCheckbox());
    expect(await within(getSummaryRow("배송비")).findByText("3,000원")).toBeInTheDocument();
  });

  it("10만원 이상 주문은 도서산간이어도 배송비가 무료다", async () => {
    const user = userEvent.setup();
    renderCheckoutPage(); // 시드 110,000원
    await screen.findByText("상품 A");

    expect(within(getSummaryRow("배송비")).getByText("0원")).toBeInTheDocument();
    await user.click(getRemoteAreaCheckbox());

    expect(await within(getSummaryRow("배송비")).findByText("0원")).toBeInTheDocument();
  });

  it("배송 정보 갱신 요청 중에는 체크박스와 쿠폰 적용 버튼이 비활성화된다", async () => {
    const user = userEvent.setup();
    let resolvePatch!: () => void;
    server.use(
      http.patch(
        `${BASE_URL}/checkouts/:checkoutId/address`,
        () =>
          new Promise<Response>((resolve) => {
            resolvePatch = () => resolve(new HttpResponse(null, { status: 204 }));
          }),
      ),
    );
    renderCheckoutPage();
    await screen.findByText("상품 A");

    const checkbox = getRemoteAreaCheckbox();
    const couponButton = screen.getByRole("button", { name: /쿠폰 적용/ });
    await user.click(checkbox);

    // 갱신 요청이 진행 중인 동안 두 컨트롤 모두 잠긴다.
    expect(checkbox).toBeDisabled();
    expect(couponButton).toBeDisabled();

    resolvePatch();
  });

  it("무료배송 쿠폰은 배송비와 동일한 금액을 쿠폰 할인으로 상쇄한다", async () => {
    const user = userEvent.setup();
    server.use(...createHandlers(products, cartItems)); // 단품 40,000원(10만원 미만)
    renderCheckoutPage();
    await screen.findByText("단품");

    // 도서산간 체크 → 배송비 6,000원
    await user.click(getRemoteAreaCheckbox());
    expect(await within(getSummaryRow("배송비")).findByText("6,000원")).toBeInTheDocument();

    // 시드 쿠폰(5,000원 할인) 해제하고 무료배송 쿠폰만 적용
    await openCouponModal(user);
    await screen.findByText("쿠폰을 선택해 주세요");
    await clickCoupon(user, "5,000원 할인 쿠폰"); // 해제
    await clickCoupon(user, "5만원 이상 구매 시 무료 배송 쿠폰"); // 선택
    await user.click(within(getCouponModal()).getByRole("button", { name: /사용하기/ }));

    // 배송비는 6,000원 그대로 부과되고, 쿠폰 할인 6,000원으로 상쇄 → total 40,000원
    expect(await within(getSummaryRow("쿠폰 할인 금액")).findByText("-6,000원")).toBeInTheDocument();
    expect(within(getSummaryRow("배송비")).getByText("6,000원")).toBeInTheDocument();
    expect(within(getSummaryRow("총 결제 금액")).getByText("40,000원")).toBeInTheDocument();
  });
});

describe("쿠폰", () => {
  it("'쿠폰 적용' 버튼을 누르면 모달이 열리고 쿠폰 목록이 보인다", async () => {
    const user = userEvent.setup();
    renderCheckoutPage();
    await screen.findByText("상품 A");

    await openCouponModal(user);

    expect(await screen.findByText("쿠폰을 선택해 주세요")).toBeInTheDocument();
    expect(screen.getByText("5,000원 할인 쿠폰")).toBeInTheDocument();
    expect(screen.getByText("2개 구매 시 1개 무료 쿠폰")).toBeInTheDocument();
    expect(screen.getByText("미라클모닝 30% 할인 쿠폰")).toBeInTheDocument();
  });

  it("최대 2개까지만 선택할 수 있고, 초과 선택 대상은 비활성화된다", async () => {
    const user = userEvent.setup();
    renderCheckoutPage(); // 시드: 5,000원 쿠폰 1개 이미 선택
    await screen.findByText("상품 A");
    await openCouponModal(user);
    await screen.findByText("쿠폰을 선택해 주세요");

    const modal = getCouponModal();
    // 무료배송 쿠폰 추가 선택 → 2개
    await clickCoupon(user, "5만원 이상 구매 시 무료 배송 쿠폰");

    // 선택되지 않은 다른 쿠폰은 비활성화(aria-disabled=true)
    const btgoRow = within(modal).getByText("2개 구매 시 1개 무료 쿠폰").closest("[aria-disabled]")!;
    expect(btgoRow).toHaveAttribute("aria-disabled", "true");
  });

  it("쿠폰 적용 버튼에 현재 선택 조합의 예상 할인액이 표시된다", async () => {
    const user = userEvent.setup();
    renderCheckoutPage();
    await screen.findByText("상품 A");
    await openCouponModal(user);
    await screen.findByText("쿠폰을 선택해 주세요");

    const modal = getCouponModal();
    // 시드 선택은 5,000원 할인
    expect(await within(modal).findByText(/총 5,000원 할인 쿠폰 사용하기/)).toBeInTheDocument();
  });

  it("선택 조합을 바꾸면 예상 할인액이 재조회되어 갱신된다", async () => {
    // 할인액 '값' 자체(서버/목 계산)는 검증 대상이 아니다.
    // 조합 변경 → 새 조합으로 재요청 → 버튼 표시가 갱신된다는 '프론트 동작'만 검증한다.
    const user = userEvent.setup();
    renderCheckoutPage();
    await screen.findByText("상품 A");
    await openCouponModal(user);
    await screen.findByText("쿠폰을 선택해 주세요");

    const modal = getCouponModal();
    const beforeButton = within(modal).getByRole("button", { name: /사용하기/ }).textContent;

    // 쿠폰 조합 변경 (5,000원 해제 → BTGO 선택)
    await clickCoupon(user, "5,000원 할인 쿠폰");
    await clickCoupon(user, "2개 구매 시 1개 무료 쿠폰");

    // 버튼 텍스트(예상 할인액)가 이전과 달라질 때까지 대기
    await within(modal).findByRole("button", {
      name: (name) => /사용하기/.test(name) && name !== beforeButton,
    });
  });

  it("조합을 바꿔 예상 할인액을 조회하는 동안 적용 버튼이 비활성화되고 로더가 표시된다", async () => {
    const user = userEvent.setup();

    // 조합 변경 후의 discount-preview 응답을 보류시켜 '조회 중' 상태를 유지한다.
    let resolvePreview!: () => void;
    server.use(
      http.get(
        `${BASE_URL}/checkouts/:checkoutId/coupons/discount-preview`,
        () =>
          new Promise<Response>((resolve) => {
            resolvePreview = () => resolve(HttpResponse.json({ coupon_discount: 0 }));
          }),
      ),
    );

    renderCheckoutPage();
    await screen.findByText("상품 A");
    await openCouponModal(user);
    await screen.findByText("쿠폰을 선택해 주세요");
    const modal = getCouponModal();

    // 조합 변경 → 새 조합 미리보기 요청이 보류되어 조회 중 상태
    await clickCoupon(user, "5,000원 할인 쿠폰");

    const applyButton = await within(modal).findByRole("button", { name: "로딩 중" });
    expect(applyButton).toBeDisabled();
    expect(within(applyButton).getByRole("status")).toBeInTheDocument();

    // 조회가 끝나면 버튼이 다시 활성화되고 할인액 텍스트로 복귀
    resolvePreview();
    expect(await within(modal).findByText(/할인 쿠폰 사용하기/)).toBeInTheDocument();
  });

  it("'사용하기'를 누르면 모달이 닫힌다", async () => {
    const user = userEvent.setup();
    renderCheckoutPage();
    await screen.findByText("상품 A");
    await openCouponModal(user);
    await screen.findByText("쿠폰을 선택해 주세요");

    const modal = getCouponModal();
    // 조합을 바꿔 isDirty=true로 만들어 적용 버튼 활성화
    await clickCoupon(user, "5,000원 할인 쿠폰"); // 해제
    await clickCoupon(user, "2개 구매 시 1개 무료 쿠폰"); // 선택

    await user.click(within(modal).getByRole("button", { name: /사용하기/ }));

    expect(screen.queryByText("쿠폰을 선택해 주세요")).not.toBeInTheDocument();
  });

  it("'사용하기'를 누르지 않고 닫으면 서버에 저장된 쿠폰 상태로 복구된다", async () => {
    const user = userEvent.setup();
    renderCheckoutPage();
    await screen.findByText("상품 A");

    expect(within(getSummaryRow("쿠폰 할인 금액")).getByText("-5,000원")).toBeInTheDocument();

    await openCouponModal(user);
    await screen.findByText("쿠폰을 선택해 주세요");
    let modal = getCouponModal();

    // 쿠폰 선택을 바꿔보고
    await clickCoupon(user, "5,000원 할인 쿠폰"); // 해제

    // 닫기 버튼으로 모달 닫기(사용하기 안 누름)
    await user.click(within(modal).getByRole("button", { name: "닫기" }));
    expect(screen.queryByText("쿠폰을 선택해 주세요")).not.toBeInTheDocument();

    // 다시 열면 서버 상태(5,000원 선택)로 복구되어 버튼에 5,000원
    await openCouponModal(user);
    await screen.findByText("쿠폰을 선택해 주세요");
    modal = getCouponModal();
    expect(within(modal).getByText(/총 5,000원 할인 쿠폰 사용하기/)).toBeInTheDocument();
  });

  it("서버가 disabled로 내려준 쿠폰은 비활성화 상태로 보인다", async () => {
    const user = userEvent.setup();
    server.use(
      http.get(`${BASE_URL}/checkouts/:checkoutId`, () =>
        HttpResponse.json({
          checkout_id: 1,
          items: [{ product_id: 1, name: "상품", price: 40000, quantity: 1, image_url: "x" }],
          coupons: [
            { coupon_id: 1, name: "사용 가능 쿠폰", is_selected: false, disabled: false },
            { coupon_id: 2, name: "사용 불가 쿠폰", is_selected: false, disabled: true },
          ],
          remote_area: false,
          checkout_amount: 40000,
          coupon_discount: 0,
          shipping_fee: 3000,
          total_amount: 43000,
        }),
      ),
    );
    renderCheckoutPage();
    await screen.findByText("상품");
    await openCouponModal(user);
    await screen.findByText("쿠폰을 선택해 주세요");

    const modal = getCouponModal();
    const disabledRow = within(modal).getByText("사용 불가 쿠폰").closest("[aria-disabled]")!;
    expect(disabledRow).toHaveAttribute("aria-disabled", "true");
  });

  it("같은 조합으로 되돌아온 미리보기 요청이 경합해도, 늦게 온 옛 응답이 최신 값을 덮어쓰지 않는다", async () => {
    const user = userEvent.setup();

    // [1] → [] → [1] 로 토글하면 '[1]' 조합의 미리보기 요청이 두 번 나간다(같은 queryKey).
    // 같은 키 경합은 구독 전환으로 막히지 않으므로, MyQueryClient의 시퀀스 가드만이
    // "늦게 도착한 옛 응답이 최신 응답을 덮어쓰는 것"을 막을 수 있다. 그 동작을 검증한다.
    //
    // 같은 couponIds로 들어온 요청들을 도착 순서대로 보관해 두고 수동으로 응답시킨다.
    const requestsByCoupon: Record<string, ((discount: number) => void)[]> = {};
    server.use(
      http.get(`${BASE_URL}/checkouts/:checkoutId/coupons/discount-preview`, ({ request }) => {
        const url = new URL(request.url);
        const couponIds = url.searchParams.getAll("couponIds").join(",");
        return new Promise<Response>((resolve) => {
          (requestsByCoupon[couponIds] ??= []).push((discount) =>
            resolve(HttpResponse.json({ coupon_discount: discount })),
          );
        });
      }),
    );

    renderCheckoutPage();
    await screen.findByText("상품 A");
    await openCouponModal(user);
    await screen.findByText("쿠폰을 선택해 주세요");
    const modal = getCouponModal();

    // 모달 진입 시 시드 [1] 미리보기가 1회 나간다(req-A). 그 요청이 in-flight가 될 때까지 대기.
    await vi.waitFor(() => expect(requestsByCoupon["1"]?.length).toBe(1));

    // [1] 해제 → [] , 다시 [1] 선택 → '[1]' 조합으로 두 번째 요청(req-B)이 나간다.
    await clickCoupon(user, "5,000원 할인 쿠폰"); // []
    await clickCoupon(user, "5,000원 할인 쿠폰"); // [1] 다시 선택

    // '[1]' 요청이 총 2개(req-A, req-B) in-flight 상태가 될 때까지 대기.
    await vi.waitFor(() => expect(requestsByCoupon["1"]?.length).toBe(2));

    // 최신 요청(req-B)을 먼저 10,000원으로 응답 → 화면 10,000원
    requestsByCoupon["1"][1](10000);
    expect(await within(modal).findByText(/총 10,000원 할인 쿠폰 사용하기/)).toBeInTheDocument();

    // 옛 요청(req-A)을 뒤늦게 0원으로 응답 → 시퀀스 가드가 폐기해야 한다.
    requestsByCoupon["1"][0](0);

    // 최신 값(10,000원)이 유지되고, 옛 값(0원)으로 덮이지 않아야 한다.
    await expect(within(modal).findByText(/총 0원 할인 쿠폰 사용하기/, {}, { timeout: 200 })).rejects.toThrow();
    expect(within(modal).getByText(/총 10,000원 할인 쿠폰 사용하기/)).toBeInTheDocument();
  });

  it("사용 시간이 지난 쿠폰을 적용하면 적용이 실패하고, 모달이 닫히지 않은 채 해당 쿠폰이 비활성으로 다시 표시된다", async () => {
    const user = userEvent.setup();

    // 시나리오: 미라클모닝 쿠폰(사용 가능 04:00~07:00)을 06:59에 선택(미리보기는 성공)했다가,
    // 07:01에 '사용하기'를 누른다. 시간이 지나 서버가 적용을 거절(409)하는 상황을 흉내낸다.
    // PATCH /coupons만 실패시키고, 미리보기(discount-preview)는 정상 응답하게 둔다.
    //
    // checkout GET은 호출 시점으로 시간을 가른다.
    //  - 첫 조회(모달 진입, 06:59): 미라클모닝 쿠폰 선택 가능(disabled:false)
    //  - 적용 실패 후 재조회(07:01): 사용 시간이 지나 disabled:true
    let checkoutFetchCount = 0;
    const buildCheckout = (miracleDisabled: boolean) => ({
      checkout_id: 1,
      items: [{ product_id: 1, name: "상품 A", price: 110000, quantity: 1, image_url: "x" }],
      coupons: [
        { coupon_id: 1, name: "5,000원 할인 쿠폰", is_selected: true, disabled: false },
        {
          coupon_id: 4,
          name: "미라클모닝 30% 할인 쿠폰",
          usable_start_at: "04:00",
          usable_end_at: "07:00",
          is_selected: false,
          disabled: miracleDisabled,
        },
      ],
      remote_area: false,
      checkout_amount: 110000,
      coupon_discount: 5000,
      shipping_fee: 0,
      total_amount: 105000,
    });

    server.use(
      http.patch(`${BASE_URL}/checkouts/:checkoutId/coupons`, () =>
        HttpResponse.json(
          { error: "COUPON_NOT_USABLE", message: "사용 가능 시간이 지난 쿠폰입니다." },
          { status: 409 },
        ),
      ),
      http.get(`${BASE_URL}/checkouts/:checkoutId`, () => {
        checkoutFetchCount += 1;
        return HttpResponse.json(buildCheckout(checkoutFetchCount > 1));
      }),
      http.get(`${BASE_URL}/checkouts/:checkoutId/coupons/discount-preview`, () =>
        HttpResponse.json({ coupon_discount: 33000 }),
      ),
    );

    renderCheckoutPage();
    await screen.findByText("상품 A");
    await openCouponModal(user);
    await screen.findByText("쿠폰을 선택해 주세요");

    // 06:59 시점: 미라클모닝 쿠폰 선택(미리보기 성공). 시드 5,000원 + 미라클모닝 = 2개로 정책 내.
    await clickCoupon(user, "미라클모닝 30% 할인 쿠폰");
    expect(getCouponCheckbox("미라클모닝 30% 할인 쿠폰")).toBeChecked();

    // 07:01 시점: '사용하기' → PATCH 409 실패 → invalidate → checkout 재조회
    await user.click(within(getCouponModal()).getByRole("button", { name: /사용하기/ }));

    // 모달은 닫히지 않고 그대로 열려 있어야 한다.
    expect(screen.getByText("쿠폰을 선택해 주세요")).toBeInTheDocument();

    // 갱신된 목록이 반영되어 미라클모닝 쿠폰이 비활성(aria-disabled)으로 다시 표시된다.
    await waitFor(() => {
      const miracleRow = within(getCouponModal()).getByText("미라클모닝 30% 할인 쿠폰").closest("[aria-disabled]")!;
      expect(miracleRow).toHaveAttribute("aria-disabled", "true");
    });
  });
});

describe("결제", () => {
  it("결제하기를 누르면 결제 성공 페이지로 이동하고 결제 정보가 표시된다", async () => {
    const user = userEvent.setup();
    renderCheckoutPage();
    await screen.findByText("상품 A");

    await user.click(screen.getByRole("button", { name: "결제하기" }));

    expect(await screen.findByText("결제 확인")).toBeInTheDocument();
    expect(screen.getByText(/총 3종류의 상품 4개를 주문했습니다/)).toBeInTheDocument();
    expect(screen.getByText("105,000원")).toBeInTheDocument();
  });

  it("로딩 중에는 결제하기 버튼이 비활성화된다", () => {
    server.use(http.get(`${BASE_URL}/checkouts/:checkoutId`, () => new Promise(() => {})));
    renderCheckoutPage();

    expect(screen.getByRole("button", { name: "결제하기" })).toBeDisabled();
  });
});

describe("데이터 복원", () => {
  it("새로고침해도 동일한 주문 데이터로 복원된다", async () => {
    renderCheckoutPage();
    await screen.findByText("상품 A");
    expect(within(getSummaryRow("총 결제 금액")).getByText("105,000원")).toBeInTheDocument();

    // 이전 렌더를 정리한 뒤 같은 checkoutId로 재렌더 = 새로고침 시뮬레이션
    cleanup();
    renderCheckoutPage();
    expect(await screen.findByText("상품 A")).toBeInTheDocument();
    expect(within(getSummaryRow("총 결제 금액")).getByText("105,000원")).toBeInTheDocument();
  });

  it("쿠폰을 변경해 적용한 뒤 새로고침해도 동일한 쿠폰이 선택되어 있다", async () => {
    const user = userEvent.setup();
    renderCheckoutPage();
    await screen.findByText("상품 A");

    // 시드 선택은 [1](5,000원 할인) → 무료배송 쿠폰으로 변경 후 적용(PATCH 저장)
    await openCouponModal(user);
    await screen.findByText("쿠폰을 선택해 주세요");
    await clickCoupon(user, "5,000원 할인 쿠폰"); // 해제 []
    await clickCoupon(user, "5만원 이상 구매 시 무료 배송 쿠폰"); // 선택 [3]

    const modal = getCouponModal();
    await user.click(within(modal).getByRole("button", { name: /사용하기/ }));
    expect(screen.queryByText("쿠폰을 선택해 주세요")).not.toBeInTheDocument();

    // 새로고침 시뮬레이션
    cleanup();
    renderCheckoutPage();
    await screen.findByText("상품 A");

    // 다시 모달을 열면 서버에 저장된 선택(무료배송)이 복원되어야 한다.
    await openCouponModal(user);
    await screen.findByText("쿠폰을 선택해 주세요");
    expect(getCouponCheckbox("5만원 이상 구매 시 무료 배송 쿠폰")).toBeChecked();
    expect(getCouponCheckbox("5,000원 할인 쿠폰")).not.toBeChecked();
  });
});

describe("페이지 이탈 시 임시 주문 정리", () => {
  /** DELETE /checkouts/:id 호출 여부를 기록하는 spy를 설치하고, 삭제된 id 목록을 반환한다. */
  function spyDeleteCheckout(): number[] {
    const deletedIds: number[] = [];
    server.use(
      http.delete(`${BASE_URL}/checkouts/:checkoutId`, ({ params }) => {
        deletedIds.push(Number(params.checkoutId));
        return new HttpResponse(null, { status: 204 });
      }),
    );
    return deletedIds;
  }

  /** /cart → /checkout/1 히스토리를 구성해, 뒤로가기로 이탈할 수 있게 한다. */
  function renderWithHistory() {
    const router = createMemoryRouter(
      [
        { path: "/cart", element: <CartPage /> },
        { path: "/checkout/:checkoutId", element: <CheckoutPage /> },
        { path: "/order-success", element: <OrderSuccessPage /> },
      ],
      { initialEntries: ["/cart", "/checkout/1"], initialIndex: 1 },
    );
    render(
      <MyQueryProvider>
        <RouterProvider router={router} />
      </MyQueryProvider>,
    );
  }

  it("뒤로가기로 페이지를 이탈하면 임시 주문이 삭제된다", async () => {
    const user = userEvent.setup();
    const deletedIds = spyDeleteCheckout();
    renderWithHistory();
    await screen.findByText("상품 A");

    // Header의 뒤로가기 버튼(navigate(-1)) → /cart로 이탈
    await user.click(screen.getByRole("button", { name: "뒤로 가기" }));

    await vi.waitFor(() => expect(deletedIds).toContain(1));
  });

  it("결제 성공으로 이동할 때는 임시 주문을 삭제하지 않는다", async () => {
    const user = userEvent.setup();
    const deletedIds = spyDeleteCheckout();
    renderCheckoutPage();
    await screen.findByText("상품 A");

    await user.click(screen.getByRole("button", { name: "결제하기" }));
    await screen.findByText("결제 확인"); // order-success로 이동 완료

    expect(deletedIds).not.toContain(1);
  });
});
