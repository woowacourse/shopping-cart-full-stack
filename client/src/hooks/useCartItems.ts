import { useState } from "react";
import type { CartItemsResponseDto } from "../apis/cart.api.dto";
import type { CartItemModel, UseCartItemsReturn } from "./useCartItems.types";
import { getSelectedItems, saveSelectedItems } from "../storage/cart.storage";
import type { UseCartDataReturn } from "./useCartData.types";

interface Props {
  cartItemsList: CartItemsResponseDto;
  deleteItem: UseCartDataReturn["deleteItem"];
}

const useCartItems = ({
  cartItemsList,
  deleteItem,
}: Props): UseCartItemsReturn => {
  const [selectedItemIds, setSelectedItemIds] = useState<number[]>(() => {
    const stored = getSelectedItems();
    if (stored !== null) {
      return stored;
    }

    const nextIds = cartItemsList.map((item) => item.id);
    saveSelectedItems(nextIds);
    return nextIds;
  });

  const items: CartItemModel[] = cartItemsList.map((cartItem) => ({
    ...cartItem,
    isSelected: selectedItemIds.includes(cartItem.id),
  }));

  const handleDeleteItem = async (id: number) => {
    try {
      await deleteItem(id);
    } catch {
      return;
    }

    setSelectedItemIds((prevIds) => {
      const nextIds = prevIds.filter((itemId) => itemId !== id);

      saveSelectedItems(nextIds);
      return nextIds;
    });
  };

  const toggleSelection = (id: number) => {
    setSelectedItemIds((prevIds) => {
      const nextIds = prevIds.includes(id)
        ? prevIds.filter((itemId) => itemId !== id)
        : [...prevIds, id];

      saveSelectedItems(nextIds);
      return nextIds;
    });
  };

  const toggleAllSelection = () => {
    setSelectedItemIds(() => {
      const hasUnselectedItem = items.some((item) => !item.isSelected);
      const nextIds = hasUnselectedItem ? items.map((item) => item.id) : [];

      saveSelectedItems(nextIds);
      return nextIds;
    });
  };

  const actions = {
    handleDeleteItem,
    toggleSelection,
    toggleAllSelection,
  };

  const isAllSelected = items.every((item) => item.isSelected);

  return {
    items,
    isAllSelected,
    actions,
  };
};

export default useCartItems;
