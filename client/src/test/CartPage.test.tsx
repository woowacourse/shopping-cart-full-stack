import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { describe, it, expect } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "./setup";
import { createHandlers } from "../msw/handlers";
import { MyQueryProvider } from "../lib/myQuery/MyQueryProvider";
import CartPage from "../pages/CartPage";

function renderCartPage() {
  return render(
    <MyQueryProvider>
      <MemoryRouter>
        <CartPage />
      </MemoryRouter>
    </MyQueryProvider>,
  );
}

describe("장바구니 상품 데이터 렌더링", () => {
  it("상품 목록이 렌더링된다", async () => {
    renderCartPage();
    expect(await screen.findByText("상품 A")).toBeInTheDocument();
    expect(await screen.findByText("상품 B")).toBeInTheDocument();
  });

  it("로딩 중에는 스켈레톤이 표시된다", () => {
    server.use(http.get("http://localhost:3000/cart", () => new Promise(() => {})));
    renderCartPage();
    expect(screen.getByTestId("skeleton-list")).toBeInTheDocument();
  });

  it("API 에러 시 에러 UI가 표시된다", async () => {
    server.use(
      http.get("http://localhost:3000/cart", () =>
        HttpResponse.json({ error: "SERVER_ERROR", message: "서버 오류" }, { status: 500 }),
      ),
    );
    renderCartPage();
    expect(await screen.findByText("오류가 발생했습니다. 잠시 후 다시 시도해 주세요.")).toBeInTheDocument();
  });
});

describe("상품 선택 상태 유지", () => {
  it("localStorage에 저장된 값이 없으면 상품은 기본적으로 선택 상태다", async () => {
    renderCartPage();
    const checkboxes = await screen.findAllByRole("checkbox");
    checkboxes.slice(1).forEach((cb) => expect(cb).toBeChecked());
  });

  it("체크박스를 누르면 localStorage에 저장되고 새로고침 후에도 유지된다", async () => {
    const user = userEvent.setup();
    renderCartPage();

    const checkboxes = await screen.findAllByRole("checkbox");
    await user.click(checkboxes[1]); // 상품 A 선택 해제
    expect(checkboxes[1]).not.toBeChecked();

    // 새로고침 시뮬레이션
    renderCartPage();
    const recheckboxes = await screen.findAllByRole("checkbox");
    expect(recheckboxes[1]).not.toBeChecked();
  });

  it("선택 해제된 상품을 삭제 후 다시 추가하면 기본 선택 상태로 추가된다", async () => {
    const user = userEvent.setup();
    renderCartPage();

    await screen.findByText("상품 A");
    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[1]); // 상품 A 선택 해제 → localStorage에 false 저장

    // 상품 A 삭제 → removeItemSelectionFromStorage 호출됨
    await user.click(screen.getAllByRole("button", { name: "삭제" })[0]);
    expect(screen.queryByText("상품 A")).not.toBeInTheDocument();

    // 상품 A가 다시 장바구니에 추가된 상태로 핸들러 오버라이드 후 새로고침
    server.use(...createHandlers());
    renderCartPage();

    // localStorage에서 제거됐으므로 기본값 true로 선택 상태
    const newCheckboxes = await screen.findAllByRole("checkbox");
    expect(newCheckboxes[1]).toBeChecked();
  });
});

describe("선택/해제 → 결제 금액 변동", () => {
  it("상품 선택 해제 시 결제 금액이 줄어든다", async () => {
    const user = userEvent.setup();
    renderCartPage();

    await screen.findByText("상품 A");
    // 기본 상태: 상품 A(35000 * 2) + 상품 B(25000 * 1) + 재고 부족 상품(15000 * 1) = 110,000원 → 배송비 무료
    expect(within(screen.getByTestId("total-amount")).getByText("110,000원")).toBeInTheDocument();

    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[1]); // 상품 A 해제
    expect(within(screen.getByTestId("total-amount")).getByText("43,000원")).toBeInTheDocument();
  });

  it("결제 금액 10만원 미만이면 배송비가 붙는다", async () => {
    const user = userEvent.setup();
    renderCartPage();

    await screen.findByText("상품 A");
    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[1]); // 상품 A 해제 → 40,000원

    expect(screen.getByText("3,000원")).toBeInTheDocument();
  });

  it("결제 금액 10만원 이상이면 배송비가 무료다", async () => {
    renderCartPage();
    await screen.findByText("상품 A");
    expect(screen.getByText("0원")).toBeInTheDocument();
  });
});

describe("전체선택/해제", () => {
  it("전체선택 해제 시 모든 상품이 해제된다", async () => {
    const user = userEvent.setup();
    renderCartPage();

    const checkboxes = await screen.findAllByRole("checkbox");
    const allSelectCheckbox = checkboxes[0];
    await user.click(allSelectCheckbox);

    const updated = screen.getAllByRole("checkbox");
    updated.slice(1).forEach((cb) => expect(cb).not.toBeChecked());
  });

  it("전체해제 후 전체선택 클릭 시 모두 선택된다", async () => {
    const user = userEvent.setup();
    renderCartPage();

    const checkboxes = await screen.findAllByRole("checkbox");
    await user.click(checkboxes[0]); // 전체해제
    await user.click(checkboxes[0]); // 전체선택

    const updated = screen.getAllByRole("checkbox");
    updated.forEach((cb) => expect(cb).toBeChecked());
  });

  it("전체해제 후 새로고침해도 모든 상품이 해제 상태다", async () => {
    const user = userEvent.setup();
    renderCartPage();

    const checkboxes = await screen.findAllByRole("checkbox");
    await user.click(checkboxes[0]); // 전체해제

    renderCartPage();
    const recheckboxes = await screen.findAllByRole("checkbox");
    recheckboxes.slice(1).forEach((cb) => expect(cb).not.toBeChecked());
  });

  it("전체선택 후 새로고침해도 모든 상품이 선택 상태다", async () => {
    const user = userEvent.setup();
    renderCartPage();

    const checkboxes = await screen.findAllByRole("checkbox");
    await user.click(checkboxes[0]); // 전체해제
    await user.click(checkboxes[0]); // 전체선택

    renderCartPage();
    const recheckboxes = await screen.findAllByRole("checkbox");
    recheckboxes.forEach((cb) => expect(cb).toBeChecked());
  });
});

describe("수량 변경", () => {
  it("+ 버튼 클릭 시 수량이 증가한다", async () => {
    const user = userEvent.setup();
    renderCartPage();

    await screen.findByText("상품 A");
    const itemA = screen.getByText("상품 A").closest("div")!.parentElement!;
    const increaseButton = within(itemA).getAllByRole("button").at(-1)!;
    await user.click(increaseButton);

    expect(within(itemA).getByText("3")).toBeInTheDocument();
  });

  it("수량이 1일 때 - 버튼이 비활성화된다", async () => {
    renderCartPage();
    await screen.findByText("상품 B");

    const itemB = screen.getByText("상품 B").closest("div")!.parentElement!;
    const decreaseButton = within(itemB).getAllByRole("button")[0];
    expect(decreaseButton).toBeDisabled();
  });

  it("수량 변경 API 요청 중에는 + 버튼이 비활성화된다", async () => {
    const user = userEvent.setup();
    let resolveUpdate!: () => void;
    server.use(
      ...createHandlers(undefined, undefined, {
        wait: () => new Promise<void>((resolve) => (resolveUpdate = resolve)),
      }),
    );
    renderCartPage();

    await screen.findByText("상품 A");
    const itemA = screen.getByText("상품 A").closest("div")!.parentElement!;
    const increaseButton = within(itemA).getAllByRole("button").at(-1)!;

    await user.click(increaseButton); // 요청 전송, pending 상태
    expect(increaseButton).toBeDisabled();

    resolveUpdate(); // 요청 완료
    await screen.findByText("3"); // 수량 업데이트 완료 대기
    expect(increaseButton).not.toBeDisabled();
  });

  it("재고 초과 수량 요청은 실패하고 수량이 그대로 유지된다", async () => {
    const user = userEvent.setup();
    // 재고 부족 상품: stock 1, quantity 1 → + 누르면 409
    renderCartPage();
    await screen.findByText("재고 부족 상품");

    const item = screen.getByText("재고 부족 상품").closest("div")!.parentElement!;
    const increaseButton = within(item).getAllByRole("button").at(-1)!;
    await user.click(increaseButton);

    await screen.findByText("재고 부족 상품");
    expect(within(item).getByText("1")).toBeInTheDocument();
    expect(within(item).getByText("재고가 얼마 남지 않았습니다. (구매 가능 수량 1개)")).toBeInTheDocument();
  });

  it("수량 증가로 재고가 얼마 남지 않으면 안내 메시지가 나타나고, 다시 감소하면 사라진다", async () => {
    const user = userEvent.setup();
    const products = [{ id: 1, name: "재고 임박 상품", price: 10000, imageUrl: "https://placehold.co/80x80", stock: 6 }];
    const cartItems = [{ id: 1, productId: 1, quantity: 2 }];
    server.use(...createHandlers(products, cartItems));
    renderCartPage();

    await screen.findByText("재고 임박 상품");
    const item = getItemContainer("재고 임박 상품");
    const [, , increaseButton] = within(item).getAllByRole("button");

    expect(screen.queryByText(/재고가 얼마 남지 않았습니다/)).not.toBeInTheDocument();

    await user.click(increaseButton);
    await screen.findByText("3");

    await user.click(increaseButton);
    await screen.findByText("4");
    expect(screen.getByText("재고가 얼마 남지 않았습니다. (구매 가능 수량 6개)")).toBeInTheDocument();

    const [, decreaseButton] = within(getItemContainer("재고 임박 상품")).getAllByRole("button");
    await user.click(decreaseButton);
    await screen.findByText("3");

    await user.click(decreaseButton);
    await screen.findByText("2");
    expect(screen.queryByText(/재고가 얼마 남지 않았습니다/)).not.toBeInTheDocument();
  });
});

describe("상품 삭제", () => {
  it("삭제 버튼 클릭 시 상품이 목록에서 사라진다", async () => {
    const user = userEvent.setup();
    renderCartPage();

    await screen.findByText("상품 A");
    const deleteButtons = screen.getAllByRole("button", { name: "삭제" });
    await user.click(deleteButtons[0]);

    expect(screen.queryByText("상품 A")).not.toBeInTheDocument();
  });

  it("삭제 API 실패 시 아이템이 복원된다", async () => {
    const user = userEvent.setup();
    server.use(
      http.delete("http://localhost:3000/cart/:id", () =>
        HttpResponse.json({ error: "SERVER_ERROR", message: "서버 오류" }, { status: 500 }),
      ),
    );
    renderCartPage();

    await screen.findByText("상품 A");
    const deleteButtons = screen.getAllByRole("button", { name: "삭제" });
    await user.click(deleteButtons[0]);

    // 낙관적 업데이트로 일단 사라졌다가 실패 후 복원
    expect(await screen.findByText("상품 A")).toBeInTheDocument();
  });

  it("두 아이템을 삭제했을 때 나중 삭제가 먼저 실패하고 처음 삭제가 나중에 실패해도 각각 복원된다", async () => {
    const user = userEvent.setup();
    const resolvers: Record<number, () => void> = {};
    server.use(
      http.delete("http://localhost:3000/cart/:id", ({ params }) => {
        const id = Number(params.id);
        return new Promise<Response>((resolve) => {
          resolvers[id] = () =>
            resolve(HttpResponse.json({ error: "SERVER_ERROR", message: "서버 오류" }, { status: 500 }));
        });
      }),
    );
    renderCartPage();

    await screen.findByText("상품 A");

    // 상품 A(id=1) 삭제 요청
    const firstDeleteButtons = screen.getAllByRole("button", { name: "삭제" });
    await user.click(firstDeleteButtons[0]);
    expect(screen.queryByText("상품 A")).not.toBeInTheDocument();

    // 상품 A가 사라진 후 상품 B(id=2) 삭제 요청
    await screen.findByText("상품 B");
    const secondDeleteButtons = screen.getAllByRole("button", { name: "삭제" });
    await user.click(secondDeleteButtons[0]);
    expect(screen.queryByText("상품 B")).not.toBeInTheDocument();

    // 나중에 삭제한 상품 B(id=2)가 먼저 실패 응답
    resolvers[2]();
    expect(await screen.findByText("상품 B")).toBeInTheDocument();
    expect(screen.queryByText("상품 A")).not.toBeInTheDocument(); // A는 아직 pending

    // 먼저 삭제한 상품 A(id=1)가 나중에 실패 응답
    resolvers[1]();
    expect(await screen.findByText("상품 A")).toBeInTheDocument();
    expect(screen.getByText("상품 B")).toBeInTheDocument(); // B도 그대로 유지
  });

  it("삭제 요청 중 다른 아이템 수량 변경이 일어나도 삭제 롤백 시 해당 아이템만 복원된다", async () => {
    const user = userEvent.setup();
    let resolveDelete!: () => void;
    server.use(
      http.delete(
        "http://localhost:3000/cart/:id",
        () =>
          new Promise<Response>((resolve) => {
            resolveDelete = () =>
              resolve(HttpResponse.json({ error: "SERVER_ERROR", message: "서버 오류" }, { status: 500 }));
          }),
      ),
    );
    renderCartPage();

    await screen.findByText("상품 A");

    // 상품 A 삭제 요청 (pending 상태로 유지)
    const deleteButtons = screen.getAllByRole("button", { name: "삭제" });
    await user.click(deleteButtons[0]);
    expect(screen.queryByText("상품 A")).not.toBeInTheDocument(); // 낙관적 업데이트

    // 삭제 요청 중에 상품 B 선택 해제
    const getItemContainer = (text: string) =>
      screen.getByText(text).closest("div")!.parentElement!.parentElement!.parentElement!;

    const checkboxB = within(getItemContainer("상품 B")).getByRole("checkbox");
    await user.click(checkboxB);
    expect(checkboxB).not.toBeChecked();

    // 삭제 실패 → 상품 A만 복원, 상품 B 선택 상태는 유지
    resolveDelete();
    expect(await screen.findByText("상품 A")).toBeInTheDocument();
    expect(within(getItemContainer("상품 B")).getByRole("checkbox")).not.toBeChecked(); // 상품 B 선택 해제 유지
  });
});

describe("주문 확인 버튼", () => {
  it("선택된 상품이 없으면 주문 확인 버튼이 비활성화된다", async () => {
    const user = userEvent.setup();
    renderCartPage();

    const checkboxes = await screen.findAllByRole("checkbox");
    await user.click(checkboxes[0]); // 전체해제

    expect(screen.getByRole("button", { name: "주문 확인" })).toBeDisabled();
  });

  it("선택된 상품이 있으면 주문 확인 버튼이 활성화된다", async () => {
    renderCartPage();
    await screen.findByText("상품 A");
    expect(screen.getByRole("button", { name: "주문 확인" })).not.toBeDisabled();
  });

  it("선택된 상품에 구매 불가 상품이 포함되어도 구매 가능한 상품이 있으면 주문 확인 버튼이 활성화된다", async () => {
    const products = [
      { id: 1, name: "상품 A", price: 35000, imageUrl: "https://placehold.co/80x80", stock: 10 },
      { id: 2, name: "재고 초과 상품", price: 20000, imageUrl: "https://placehold.co/80x80", stock: 2 },
    ];
    const cartItems = [
      { id: 1, productId: 1, quantity: 2 },
      { id: 2, productId: 2, quantity: 5 },
    ];

    server.use(...createHandlers(products, cartItems));
    renderCartPage();

    await screen.findByText("재고 초과 상품");
    expect(screen.getByText("최대 구매 가능 수량이 2개 입니다.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "주문 확인" })).not.toBeDisabled();
  });
});

const getItemContainer = (text: string) =>
  screen.getByText(text).closest("div")!.parentElement!.parentElement!.parentElement!;

describe("품절(outOfStock) 상품", () => {
  const products = [{ id: 1, name: "품절 상품", price: 10000, imageUrl: "https://placehold.co/80x80", stock: 0 }];
  const cartItems = [{ id: 1, productId: 1, quantity: 1 }];

  it("체크박스, 수량 증가/감소 버튼이 모두 비활성화되고 품절 메시지가 표시된다", async () => {
    server.use(...createHandlers(products, cartItems));
    renderCartPage();

    await screen.findByText("품절 상품");
    expect(screen.getByText("품절된 상품입니다.")).toBeInTheDocument();

    const item = getItemContainer("품절 상품");
    const checkbox = within(item).getByRole("checkbox");
    const [, decreaseButton, increaseButton] = within(item).getAllByRole("button");

    expect(checkbox).toBeDisabled();
    expect(decreaseButton).toBeDisabled();
    expect(increaseButton).toBeDisabled();
  });
});

describe("최대 구매 가능 수량 초과(quantityExceeded) 상품", () => {
  const products = [{ id: 1, name: "수량 초과 상품", price: 10000, imageUrl: "https://placehold.co/80x80", stock: 5 }];
  const cartItems = [{ id: 1, productId: 1, quantity: 8 }];

  it("체크박스와 수량 증가 버튼은 비활성화되고 감소 버튼은 활성화되며, 재고 수량이 포함된 안내 메시지가 표시된다", async () => {
    server.use(...createHandlers(products, cartItems));
    renderCartPage();

    await screen.findByText("수량 초과 상품");
    expect(screen.getByText("최대 구매 가능 수량이 5개 입니다.")).toBeInTheDocument();

    const item = getItemContainer("수량 초과 상품");
    const checkbox = within(item).getByRole("checkbox");
    const [, decreaseButton, increaseButton] = within(item).getAllByRole("button");

    expect(checkbox).toBeDisabled();
    expect(increaseButton).toBeDisabled();
    expect(decreaseButton).not.toBeDisabled();
  });

  it("감소 버튼을 눌러 재고 이내로 수량이 줄어들면 구매 가능 상태로 전환된다", async () => {
    const user = userEvent.setup();
    server.use(...createHandlers(products, cartItems));
    renderCartPage();

    await screen.findByText("수량 초과 상품");

    const item = getItemContainer("수량 초과 상품");
    const [, decreaseButton] = within(item).getAllByRole("button");

    for (let i = 0; i < 3; i += 1) {
      await user.click(decreaseButton);
    }

    await screen.findByText("5");
    expect(screen.queryByText("최대 구매 가능 수량이 5개 입니다.")).not.toBeInTheDocument();

    const updatedItem = getItemContainer("수량 초과 상품");
    expect(within(updatedItem).getByRole("checkbox")).not.toBeDisabled();
    const [, , increaseButton] = within(updatedItem).getAllByRole("button");
    expect(increaseButton).not.toBeDisabled();
  });

  it("선택되어 있어도 결제 금액 계산과 주문 확인 버튼에서 제외된다", async () => {
    server.use(...createHandlers(products, cartItems));
    renderCartPage();

    await screen.findByText("수량 초과 상품");
    expect(within(screen.getByTestId("total-amount")).getByText("3,000원")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "주문 확인" })).toBeDisabled();
  });
});

describe("최대 구매 가능 수량(99개) 도달", () => {
  const products = [
    { id: 1, name: "최대 수량 상품", price: 10000, imageUrl: "https://placehold.co/80x80", stock: 100 },
  ];
  const cartItems = [{ id: 1, productId: 1, quantity: 99 }];

  it("수량이 99개에 도달하면 증가 버튼이 비활성화된다", async () => {
    server.use(...createHandlers(products, cartItems));
    renderCartPage();

    await screen.findByText("최대 수량 상품");

    const item = getItemContainer("최대 수량 상품");
    const [, , increaseButton] = within(item).getAllByRole("button");

    expect(increaseButton).toBeDisabled();
  });
});
