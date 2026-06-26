import { test, expect } from "@playwright/test";
import { resetDb } from "../reset-db.js";

// client production build(msw off)가 실제 server + PostgreSQL과 통신하는 전 구간 e2e.
// server는 시작 시 products/cart/coupon을 seed하므로 장바구니에 기본 상품이 있다.

test.describe("장바구니 → 결제 전체 흐름", () => {
  // 결제 테스트가 장바구니 상품을 소비하므로, 각 테스트는 깨끗한 seed 상태에서 시작한다.
  test.beforeEach(() => {
    resetDb();
  });
  test("장바구니 페이지에 seed된 상품이 보인다", async ({ page }) => {
    await page.goto("/cart");
    await expect(page.getByRole("heading", { name: "장바구니" })).toBeVisible();
    await expect(page.getByText("상품 A")).toBeVisible();
  });

  // 초기 상태는 전체 선택이며, 재고 초과 상품이 포함돼 구매가 막힌다.
  // 전체선택을 해제해 모두 비운 뒤, 구매 가능한 "상품 A"(index 1)만 선택한다.
  async function selectAvailableItem(page: import("@playwright/test").Page) {
    const selectAll = page.getByRole("checkbox", { name: "전체선택" });
    if (await selectAll.isChecked()) {
      await selectAll.uncheck();
    }
    await page.getByRole("checkbox").nth(1).check();
  }

  test("상품을 선택하고 주문 확인하면 결제 페이지로 이동한다", async ({ page }) => {
    await page.goto("/cart");
    await selectAvailableItem(page);

    const confirmButton = page.getByRole("button", { name: "주문 확인" });
    await expect(confirmButton).toBeEnabled();
    await confirmButton.click();

    await expect(page).toHaveURL(/\/checkout\/\d+/);
    await expect(page.getByRole("heading", { name: "주문 확인" })).toBeVisible();
  });

  // 장바구니에서 구매 가능한 상품을 선택해 결제 페이지로 진입한다.
  async function goToCheckout(page: import("@playwright/test").Page) {
    await page.goto("/cart");
    await selectAvailableItem(page);
    await page.getByRole("button", { name: "주문 확인" }).click();
    await expect(page).toHaveURL(/\/checkout\/\d+/);
    await expect(page.getByRole("heading", { name: "주문 확인" })).toBeVisible();
  }

  test("결제하기를 누르면 주문 완료 페이지로 이동한다", async ({ page }) => {
    await goToCheckout(page);

    const payButton = page.getByRole("button", { name: "결제하기" });
    await expect(payButton).toBeEnabled();
    await payButton.click();

    await expect(page).toHaveURL(/\/order-success/);
    await expect(page.getByRole("heading", { name: "결제 확인" })).toBeVisible();

    // 상품 A x2 결제 결과: 1종류 2개, 무료배송 쿠폰(-3,000)+배송비(3,000) → 총 70,000원.
    await expect(page.getByText("총 1종류의 상품 2개를 주문했습니다.")).toBeVisible();
    await expect(page.getByText("총 결제 금액")).toBeVisible();
    await expect(page.getByText("70,000원")).toBeVisible();
  });

  test("도서산간을 체크하면 배송비와 무료배송 쿠폰 할인액이 함께 오르고 총액은 유지된다", async ({ page }) => {
    await goToCheckout(page);

    // 라벨 행으로 한정해 값 span을 확인한다("3,000원"은 여러 행에 나오므로 범위를 좁힌다).
    const rowByLabel = (label: string) =>
      page
        .locator("div")
        .filter({ has: page.getByText(label, { exact: true }) })
        .last();
    const shippingRow = rowByLabel("배송비");
    const discountRow = rowByLabel("쿠폰 할인 금액");
    const totalRow = rowByLabel("총 결제 금액");

    // 무료배송 쿠폰이 자동 선택된 상태: 배송비 3,000원, 쿠폰 할인 -3,000원, 총액 70,000원.
    await expect(shippingRow).toContainText("3,000원");
    await expect(discountRow).toContainText("3,000원");
    await expect(totalRow).toContainText("70,000원");

    // controlled input은 PATCH 응답 후 상태가 반영되므로 click 후 toBeChecked로 재시도 대기한다.
    const remoteAreaCheckbox = page.getByRole("checkbox", { name: "제주도 및 도서 산간 지역" });
    await remoteAreaCheckbox.click();
    await expect(remoteAreaCheckbox).toBeChecked();

    // 도서산간 추가 3,000원 → 배송비 6,000원, 무료배송 쿠폰 할인도 6,000원으로 따라 오르고 총액은 그대로다.
    await expect(shippingRow).toContainText("6,000원");
    await expect(discountRow).toContainText("6,000원");
    await expect(totalRow).toContainText("70,000원");
  });

  test("쿠폰을 선택하면 사용하기 버튼에 예상 할인액이 표시되고, 적용하면 반영된다", async ({ page }) => {
    await goToCheckout(page);

    await page.getByRole("button", { name: "쿠폰 적용" }).click();
    await expect(page.getByRole("heading", { name: "쿠폰을 선택해 주세요" })).toBeVisible();

    // 70,000원(상품 A x2) 기준 무료배송 쿠폰(min 50,000)이 사용 가능(aria-disabled=false)한지 확인한다.
    const freeShippingRow = page.locator("[aria-disabled]", { hasText: "5만원 이상 구매 시 무료 배송 쿠폰" });
    await expect(freeShippingRow).toHaveAttribute("aria-disabled", "false");

    const applyButton = page.getByRole("button", { name: /쿠폰 사용하기/ });
    // 서버가 무료배송 쿠폰을 자동 선택해 둔 상태 → 버튼에 예상 할인액(배송비 3,000원)이 표시된다.
    await expect(applyButton).toContainText("3,000원");

    // 해제하면 예상 할인액이 0원으로 바뀐다(discount-preview 연동 확인).
    await freeShippingRow.click();
    await expect(applyButton).toContainText("0원");

    // 초기 선택(무료배송)과 달라졌으므로 적용 가능. 적용하면 모달이 닫히고 할인이 0원으로 반영된다.
    await applyButton.click();
    await expect(page.getByRole("heading", { name: "쿠폰을 선택해 주세요" })).toBeHidden();
    await expect(page.getByRole("heading", { name: "주문 확인" })).toBeVisible();

    // 쿠폰 할인 금액 행이 0원으로 갱신된다.
    const discountRow = page
      .locator("div")
      .filter({ has: page.getByText("쿠폰 할인 금액", { exact: true }) })
      .last();
    await expect(discountRow).toContainText("0원");
  });

  test("조건을 만족하지 못하는 쿠폰은 비활성화되어 선택할 수 없다", async ({ page }) => {
    await goToCheckout(page);

    await page.getByRole("button", { name: "쿠폰 적용" }).click();
    await expect(page.getByRole("heading", { name: "쿠폰을 선택해 주세요" })).toBeVisible();

    // 70,000원/수량 2 기준, 시각과 무관하게 항상 비활성화되는 쿠폰들:
    // - 5,000원 할인(FIXED, 최소 주문 100,000원 미달)
    // - 2개 구매 시 1개 무료(BTGO, 수량 3개 미만)
    const fixedRow = page.locator("[aria-disabled]", { hasText: "5,000원 할인 쿠폰" });
    const btgoRow = page.locator("[aria-disabled]", { hasText: "2개 구매 시 1개 무료 쿠폰" });
    await expect(fixedRow).toHaveAttribute("aria-disabled", "true");
    await expect(btgoRow).toHaveAttribute("aria-disabled", "true");

    // 미라클모닝(RATE)은 사용 시간(04~07시)에 의존하므로 e2e에서 단정하지 않는다.
    // 시간창 검증은 server 단위테스트(validateCouponCondition, now 주입)가 담당한다.
  });

  test("쿠폰 모달을 닫으면 적용 없이 결제 페이지로 돌아온다", async ({ page }) => {
    await goToCheckout(page);

    await page.getByRole("button", { name: "쿠폰 적용" }).click();
    await expect(page.getByRole("heading", { name: "쿠폰을 선택해 주세요" })).toBeVisible();

    await page.getByRole("button", { name: "닫기" }).click();
    await expect(page.getByRole("heading", { name: "쿠폰을 선택해 주세요" })).toBeHidden();
  });
});
