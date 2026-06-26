import { createElement } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import CartListItem from ".";
import { MyQueryProvider } from "../../lib/myQuery/MyQueryProvider";
import { CART_ITEM_STATUS } from "../../domain/cart";
import type { CartItemView } from "../../hooks/useCartList";

const selectedItem: CartItemView = {
  id: 1,
  name: "상품 A",
  imageUrl: "https://placehold.co/112x112",
  price: 35000,
  quantity: 2,
  stock: 10,
  status: CART_ITEM_STATUS.AVAILABLE,
  isSelected: true,
};

const onSelect = () => undefined;

const meta = {
  title: "Components/CartListItem",
  component: CartListItem,
  args: {
    cartItem: selectedItem,
    onSelect,
  },
  decorators: [
    (Story) =>
      createElement(MyQueryProvider, null, createElement("div", { style: { width: 430 } }, createElement(Story))),
  ],
} satisfies Meta<typeof CartListItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () =>
    createElement(
      "div",
      { style: { display: "flex", flexDirection: "column", gap: 8 } },
      createElement(CartListItem, {
        cartItem: selectedItem,
        onSelect,
      }),
      createElement(CartListItem, {
        cartItem: { ...selectedItem, id: 2, name: "선택하지 않은 상품", isSelected: false },
        onSelect,
      }),
      createElement(CartListItem, {
        cartItem: {
          ...selectedItem,
          id: 3,
          name: "구매 불가능한 상품",
          status: CART_ITEM_STATUS.OUT_OF_STOCK,
          errorMsg: "품절된 상품입니다.",
        },
        onSelect,
      }),
      createElement(CartListItem, {
        cartItem: {
          ...selectedItem,
          id: 4,
          name: "수량 에러 상품",
          status: CART_ITEM_STATUS.QUANTITY_EXCEEDED,
          errorMsg: "최대 구매 가능 수량이 10개 입니다.",
        },
        onSelect,
      }),
    ),
};

export const Selected: Story = {};

export const Unselected: Story = {
  args: {
    cartItem: { ...selectedItem, isSelected: false },
  },
};

export const Unavailable: Story = {
  args: {
    cartItem: { ...selectedItem, status: CART_ITEM_STATUS.OUT_OF_STOCK, errorMsg: "품절된 상품입니다." },
  },
};

export const QuantityError: Story = {
  args: {
    cartItem: {
      ...selectedItem,
      status: CART_ITEM_STATUS.QUANTITY_EXCEEDED,
      errorMsg: "최대 구매 가능 수량이 10개 입니다.",
    },
  },
};
