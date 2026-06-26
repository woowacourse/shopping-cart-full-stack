import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router";

import OrderCheckPage from "./OrderCheckPage";

const meta: Meta = {
  title: "shopping-cart/OrderCheckPage",
  component: OrderCheckPage,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={["/cart/check/1"]}>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: () => {
    const props = { params: { id: "1" } } as Parameters<typeof OrderCheckPage>[0];
    return <OrderCheckPage {...props} />;
  },
};
