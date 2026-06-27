import { screen, within, waitFor } from "@testing-library/react";
import { renderCartsApp } from "./setup/renderCartsApp";
import { ROUTES } from "@constants/routes";
import { server } from "@/mocks/server";
import { ordersScenarios } from "@/mocks/scenarios/orders";
import { seedOrders } from "@/mocks/datas/orders";

// TODO: 대상 요소를 변수로 선언할 건지 인라인으로 넘길 건지 통일

const renderOrderFormApp = () => renderCartsApp({ pathname: ROUTES.ORDER_FORM, state: { orderId: 1 } });

describe("OrderFormPage", () => {
  beforeEach(() => {
    seedOrders([
      {
        orderId: 1,
        products: [],
        coupons: [],
        isRemoteArea: false,
        deliveryFee: 3000,
      },
    ]);
  });

  describe("쿠폰 모달", () => {
    it("쿠폰 적용 버튼 클릭 시 쿠폰 모달이 렌더링된다", async () => {
      const { user } = renderOrderFormApp();

      const couponButton = await screen.findByRole("button", { name: /쿠폰 적용/ });
      await user.click(couponButton);

      expect(await screen.findByRole("dialog", { name: /쿠폰/ })).toBeVisible();
    });

    it("쿠폰 아이템 클릭 시 checked 상태가 변경된다", async () => {
      const { user } = renderOrderFormApp();
      await user.click(await screen.findByRole("button", { name: /쿠폰 적용/ }));

      const couponList = await screen.findByRole("list", { name: /쿠폰 리스트/ });
      const couponCheckbox = within(couponList).getAllByRole("checkbox")[0];

      await user.click(couponCheckbox);
      await waitFor(() => expect(couponCheckbox).toBeChecked());

      await user.click(couponCheckbox);
      await waitFor(() => expect(couponCheckbox).not.toBeChecked());
    });

    it("쿠폰 아이템이 2개 checked된 경우 다른 checkbox는 disabled된다", async () => {
      const { user } = renderOrderFormApp();
      await user.click(await screen.findByRole("button", { name: /쿠폰 적용/ }));

      const couponList = await screen.findByRole("list", { name: /쿠폰 리스트/ });
      const checkboxes = within(couponList).getAllByRole("checkbox") as HTMLInputElement[];
      const enabledCheckboxes = checkboxes.filter((c) => !c.disabled);

      if (enabledCheckboxes.length >= 2) {
        await user.click(enabledCheckboxes[0]);
        await user.click(enabledCheckboxes[1]);

        await waitFor(() => {
          enabledCheckboxes.forEach((checkbox) => {
            if (!checkbox.checked) {
              expect(checkbox).toBeDisabled();
            }
          });
        });
      }
    });

    it("쿠폰 사용 버튼 클릭 시 쿠폰 모달이 닫힌다", async () => {
      const { user } = renderOrderFormApp();
      await user.click(await screen.findByRole("button", { name: /쿠폰 적용/ }));

      const dialog = await screen.findByRole("dialog", { name: /쿠폰/ });
      const useButton = within(dialog).getByRole("button", { name: /쿠폰 사용/ });
      await user.click(useButton);

      expect(dialog).not.toBeVisible();
    });

    it("모달 내 x 버튼 클릭 시 모달이 닫힌다", async () => {
      const { user } = renderOrderFormApp();
      await user.click(await screen.findByRole("button", { name: /쿠폰 적용/ }));

      const dialog = await screen.findByRole("dialog", { name: /쿠폰/ });
      const closeButton = within(dialog).getByRole("button", { name: /닫기/ });
      await user.click(closeButton);

      expect(dialog).not.toBeVisible();
    });

    it("esc 입력 시 모달이 닫힌다", async () => {
      const { user } = renderOrderFormApp();
      await user.click(await screen.findByRole("button", { name: /쿠폰 적용/ }));

      const dialog = await screen.findByRole("dialog", { name: /쿠폰/ });
      await user.keyboard("{Escape}");

      expect(dialog).not.toBeVisible();
    });

    it("모달 외부 클릭 시 모달이 닫힌다", async () => {
      const { user } = renderOrderFormApp();
      await user.click(await screen.findByRole("button", { name: /쿠폰 적용/ }));

      const dialog = await screen.findByRole("dialog", { name: /쿠폰/ });
      await user.click(dialog);

      expect(dialog).not.toBeVisible();
    });
  });

  describe("배송 정보", () => {
    it("도서 산간 지역 클릭 시 checked 상태가 변경된다", async () => {
      const { user } = renderOrderFormApp();

      const checkbox = await screen.findByRole("checkbox", {
        name: /도서 산간 지역/,
      });

      await user.click(checkbox);
      await waitFor(() => expect(checkbox).toBeChecked());

      await user.click(checkbox);
      await waitFor(() => expect(checkbox).not.toBeChecked());
    });
  });

  describe("결제", () => {
    it("결제하기 클릭 시 결제 확인 페이지로 리다이렉트된다", async () => {
      server.use(ordersScenarios.postSuccess);
      const { user } = renderOrderFormApp();

      const payButton = await screen.findByRole("button", { name: /결제/ });
      await user.click(payButton);

      expect(await screen.findByText(/결제 확인/)).toBeInTheDocument();
    });
  });
});
