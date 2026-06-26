import { screen, waitFor, within } from "@testing-library/react";
import {
  cartErrorHandler,
  makeCart,
  makeDelayedCartHandler,
  seedCarts,
  server,
} from "./setup/server";
import { renderCartsApp } from "./setup/renderCartsApp";

/**
 * 장바구니 통합 테스트 (RTL + MSW + Jest)
 *
 * 대상: CartsSection / OrderConfirmSection 을 실제 라우팅 위에서 통합 검증한다.
 * 명세: CART_TEST_CASES.md
 */

const PRODUCT = {
  headphone: "무선 헤드폰",
  shoes: "러닝화",
} as const;

const EMPTY_TEXT = "장바구니에 담은 상품이 없습니다.";

// ---------------------------------------------------------------------------
// 조회 헬퍼
// ---------------------------------------------------------------------------

const getSelectAllCheckbox = () =>
  screen.getByRole("checkbox", { name: "전체선택" });

const getConfirmButton = () =>
  screen.getByRole("button", { name: "주문 확인" });

/** 상품명이 포함된 `<li>`(CartItem) 행을 반환한다. */
const getItemRow = (name: string) => {
  const row = screen.getByText(name).closest("li");
  if (!row) throw new Error(`'${name}' 상품 행을 찾을 수 없습니다.`);
  return row as HTMLElement;
};

const getItemCheckbox = (name: string) =>
  within(getItemRow(name)).getByRole("checkbox");

const getDeleteButton = (name: string) =>
  within(getItemRow(name)).getByRole("button", { name: "삭제" });

/** 수량 +/- 버튼 (텍스트가 없으므로 '삭제' 버튼을 제외한 나머지로 식별) */
const getQuantityControls = (name: string) => {
  const [minus, plus] = within(getItemRow(name))
    .getAllByRole("button")
    .filter((button) => button.textContent !== "삭제");
  return { minus, plus };
};

/** "총 주문 금액"/"배송비"/"총 결제 금액" 라벨에 대응하는 금액 텍스트를 읽는다. */
const getAmountByLabel = (label: string) => {
  const row = screen.getByText(label).parentElement as HTMLElement;
  return within(row).getByText(/원$/).textContent;
};

/** 장바구니 데이터(스켈레톤 → 목록)가 로드될 때까지 대기한다. */
const waitForCartLoaded = () => screen.findByText(PRODUCT.headphone);

// ===========================================================================

describe("진입 / 선택 상태", () => {
  it("진입 시 전체 선택되어 있다 (localStorage가 비어 있을 때)", async () => {
    renderCartsApp();
    await waitForCartLoaded();

    expect(getSelectAllCheckbox()).toBeChecked();
    expect(getItemCheckbox(PRODUCT.headphone)).toBeChecked();
    expect(getItemCheckbox(PRODUCT.shoes)).toBeChecked();
  });

  it("일부 선택 후 새로고침하면 그 선택이 유지된다", async () => {
    const { user, unmount } = renderCartsApp();
    await waitForCartLoaded();

    await user.click(getItemCheckbox(PRODUCT.shoes)); // 러닝화 해제
    expect(getItemCheckbox(PRODUCT.shoes)).not.toBeChecked();

    // 새로고침 시뮬레이션 (localStorage 는 유지)
    unmount();
    renderCartsApp();
    await waitForCartLoaded();

    expect(getItemCheckbox(PRODUCT.headphone)).toBeChecked();
    expect(getItemCheckbox(PRODUCT.shoes)).not.toBeChecked();
  });

  it("전체 해제 후 새로고침하면 전체 선택으로 복귀한다", async () => {
    const { user, unmount } = renderCartsApp();
    await waitForCartLoaded();

    await user.click(getSelectAllCheckbox()); // 전체 해제 → localStorage 비움
    expect(getSelectAllCheckbox()).not.toBeChecked();

    unmount();
    renderCartsApp();
    await waitForCartLoaded();

    expect(getSelectAllCheckbox()).toBeChecked();
  });

  it("전체 선택을 토글하면 선택/해제가 전환된다", async () => {
    const { user } = renderCartsApp();
    await waitForCartLoaded();
    expect(getSelectAllCheckbox()).toBeChecked();

    await user.click(getSelectAllCheckbox());
    expect(getSelectAllCheckbox()).not.toBeChecked();
    expect(getItemCheckbox(PRODUCT.headphone)).not.toBeChecked();

    await user.click(getSelectAllCheckbox());
    expect(getSelectAllCheckbox()).toBeChecked();
    expect(getItemCheckbox(PRODUCT.headphone)).toBeChecked();
  });

  it("일부 선택 상태에서 전체 선택을 누르면 전체 선택된다", async () => {
    const { user } = renderCartsApp();
    await waitForCartLoaded();

    await user.click(getItemCheckbox(PRODUCT.shoes)); // 일부만 선택된 상태
    expect(getSelectAllCheckbox()).not.toBeChecked();

    await user.click(getSelectAllCheckbox());
    expect(getSelectAllCheckbox()).toBeChecked();
    expect(getItemCheckbox(PRODUCT.headphone)).toBeChecked();
    expect(getItemCheckbox(PRODUCT.shoes)).toBeChecked();
  });

  it("모든 아이템을 개별 선택하면 전체선택 체크박스가 checked된다", async () => {
    const { user } = renderCartsApp();
    await waitForCartLoaded();

    await user.click(getSelectAllCheckbox()); // 전체 해제로 시작
    expect(getSelectAllCheckbox()).not.toBeChecked();

    await user.click(getItemCheckbox(PRODUCT.headphone));
    expect(getSelectAllCheckbox()).not.toBeChecked();

    await user.click(getItemCheckbox(PRODUCT.shoes));
    expect(getSelectAllCheckbox()).toBeChecked();
  });
});

describe("가격 동기화", () => {
  it("아이템 선택/해제 시 주문 금액과 총 결제 금액이 갱신된다", async () => {
    const { user } = renderCartsApp();
    await waitForCartLoaded();

    // 전체 선택: 129,000×1 + 89,000×2 = 307,000
    expect(getAmountByLabel("총 주문 금액")).toBe("307,000원");
    expect(getAmountByLabel("총 결제 금액")).toBe("307,000원");

    await user.click(getItemCheckbox(PRODUCT.shoes)); // 러닝화 해제 → 129,000
    expect(getAmountByLabel("총 주문 금액")).toBe("129,000원");
    expect(getAmountByLabel("총 결제 금액")).toBe("129,000원");
  });

  it("수량 변경(+) 시 주문 금액과 총 결제 금액이 갱신된다", async () => {
    const { user } = renderCartsApp();
    await waitForCartLoaded();
    expect(getAmountByLabel("총 주문 금액")).toBe("307,000원");

    const { plus } = getQuantityControls(PRODUCT.headphone);
    await user.click(plus); // 헤드폰 1 → 2 (서버 반영 후 재조회)

    // 서버 반영 → invalidate → 재조회 → 리렌더가 끝날 때까지 단언을 대기한다.
    await waitFor(() => {
      expect(
        within(getItemRow(PRODUCT.headphone)).getByText("2"),
      ).toBeInTheDocument();
      // 129,000×2 + 89,000×2 = 436,000
      expect(getAmountByLabel("총 주문 금액")).toBe("436,000원");
      expect(getAmountByLabel("총 결제 금액")).toBe("436,000원");
    });
  });

  it("수량 변경(-) 시 주문 금액과 총 결제 금액이 갱신된다", async () => {
    const { user } = renderCartsApp();
    await waitForCartLoaded();
    expect(getAmountByLabel("총 주문 금액")).toBe("307,000원");

    const { minus } = getQuantityControls(PRODUCT.shoes);
    await user.click(minus); // 러닝화 2 → 1 (서버 반영 후 재조회)

    await waitFor(() => {
      expect(
        within(getItemRow(PRODUCT.shoes)).getByText("1"),
      ).toBeInTheDocument();
      // 129,000×1 + 89,000×1 = 218,000
      expect(getAmountByLabel("총 주문 금액")).toBe("218,000원");
      expect(getAmountByLabel("총 결제 금액")).toBe("218,000원");
    });
  });

  it("선택 금액이 100,000원 이상이면 배송비 0원, 미만이면 3,000원이다", async () => {
    seedCarts([
      makeCart("10", "상품A", 50000, 1),
      makeCart("11", "상품B", 60000, 1),
    ]);
    const { user } = renderCartsApp();
    await screen.findByText("상품A");

    // 전체 선택: 50,000 + 60,000 = 110,000 → 배송비 0원
    expect(getAmountByLabel("배송비")).toBe("0원");
    expect(getAmountByLabel("총 결제 금액")).toBe("110,000원");

    // 상품B 해제: 50,000 < 100,000 → 배송비 3,000원
    await user.click(getItemCheckbox("상품B"));
    expect(getAmountByLabel("배송비")).toBe("3,000원");
    expect(getAmountByLabel("총 결제 금액")).toBe("53,000원");
  });
});

describe("삭제", () => {
  it("아이템 삭제 시 목록에서 사라진다", async () => {
    const { user } = renderCartsApp();
    await waitForCartLoaded();

    await user.click(getDeleteButton(PRODUCT.shoes));

    await waitFor(() => {
      expect(screen.queryByText(PRODUCT.shoes)).not.toBeInTheDocument();
    });
    expect(screen.getByText(PRODUCT.headphone)).toBeInTheDocument();
  });

  it("선택된 아이템 삭제 후 전체선택 체크 상태와 가격이 동기화된다", async () => {
    const { user } = renderCartsApp();
    await waitForCartLoaded();
    expect(getSelectAllCheckbox()).toBeChecked();

    // 선택된 헤드폰 삭제 → 러닝화만 남고 여전히 전체 선택 상태여야 한다
    await user.click(getDeleteButton(PRODUCT.headphone));

    // 삭제(재조회)와 체크박스 동기화가 모두 반영될 때까지 함께 대기한다.
    await waitFor(() => {
      expect(screen.queryByText(PRODUCT.headphone)).not.toBeInTheDocument();
      expect(getSelectAllCheckbox()).toBeChecked();
      expect(getItemCheckbox(PRODUCT.shoes)).toBeChecked();
    });
    // 러닝화 89,000×2 = 178,000
    expect(getAmountByLabel("총 주문 금액")).toBe("178,000원");
  });
});

describe("주문 확인 버튼", () => {
  it("아무것도 선택하지 않으면 주문 확인 버튼이 비활성화된다", async () => {
    const { user } = renderCartsApp();
    await waitForCartLoaded();

    await user.click(getSelectAllCheckbox()); // 전체 해제
    expect(getConfirmButton()).toBeDisabled();
  });

  it("장바구니가 비어 있으면 주문 확인 버튼이 비활성화된다", async () => {
    seedCarts([]);
    renderCartsApp();
    await screen.findByText(EMPTY_TEXT);

    expect(getConfirmButton()).toBeDisabled();
  });

  it("주문 확인 클릭 시 선택한 상품 종류 수/총 수량/총 금액 문구가 표시된다", async () => {
    const { user } = renderCartsApp();
    await waitForCartLoaded(); // 전체 선택 상태

    await user.click(getConfirmButton());

    // 헤드폰 1개 + 러닝화 2개 = 2종류 3개
    expect(
      await screen.findByText("총 2종류의 상품 3개를 주문합니다."),
    ).toBeInTheDocument();
    // 배송비 0원(10만원 이상) → 총 결제 금액 307,000원
    expect(getAmountByLabel("총 결제 금액")).toBe("307,000원");
  });

  it('주문 확인 페이지에 "결제하기" 버튼이 표시된다', async () => {
    const { user } = renderCartsApp();
    await waitForCartLoaded();

    await user.click(getConfirmButton());

    expect(
      await screen.findByRole("button", { name: "결제하기" }),
    ).toBeEnabled();
  });
});

describe("상태별 화면", () => {
  it(`장바구니가 비어 있으면 "${EMPTY_TEXT}" 문구가 표시된다`, async () => {
    seedCarts([]);
    renderCartsApp();

    expect(await screen.findByText(EMPTY_TEXT)).toBeInTheDocument();
  });

  it("에러 발생 시 에러 폴백 문구가 표시된다", async () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    server.use(cartErrorHandler); // GET /api/carts → 500

    renderCartsApp();

    expect(await screen.findByText("문제가 발생했습니다.")).toBeInTheDocument();
    expect(screen.getByText("잠시 후 다시 시도해 주세요.")).toBeInTheDocument();

    errorSpy.mockRestore();
  });

  it("로딩 중에는 스켈레톤이 노출된다", async () => {
    // 응답을 지연시켜 로딩(Suspense fallback) 구간을 결정적으로 만든다.
    server.use(makeDelayedCartHandler(100));
    renderCartsApp();

    // 첫 렌더에서 쿼리가 pending → Suspense fallback(스켈레톤)이 동기적으로 노출된다.
    expect(screen.getByTestId("cart-list-skeleton")).toBeInTheDocument();

    // 데이터 로드 후 사라진다
    await waitForCartLoaded();
    expect(screen.queryByTestId("cart-list-skeleton")).not.toBeInTheDocument();
  });
});

describe("기타", () => {
  it("CartHeading에 담긴 상품 종류 수가 표시된다", async () => {
    renderCartsApp();

    expect(
      await screen.findByText("총 2종류의 상품이 담겨있습니다."),
    ).toBeInTheDocument();
  });

  it("'/' 진입 시 장바구니 경로로 리다이렉트된다", async () => {
    renderCartsApp("/");

    expect(await screen.findByText("장바구니")).toBeInTheDocument();
    expect(getConfirmButton()).toBeInTheDocument();
  });
});
