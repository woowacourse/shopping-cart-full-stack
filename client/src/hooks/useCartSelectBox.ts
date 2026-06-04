interface Props {
  selectedItems: Map<number, boolean>;
  setSelectedItems: (map: Map<number, boolean>) => void;
}

export default function useCartSelectBox({
  selectedItems,
  setSelectedItems,
}: Props) {
  const onToggle = (cartItemId: number) => {
    const newMap = new Map(selectedItems);
    newMap.set(cartItemId, !selectedItems.get(cartItemId));
    setSelectedItems(newMap);
    localStorage.setItem("storedCartItems", JSON.stringify([...newMap]));
  };

  const onToggleAll = () => {
    if ([...selectedItems.values()].every((value) => value === true)) {
      const newMap = new Map(selectedItems);
      newMap.forEach((_, key) => {
        newMap.set(key, false);
      });
      setSelectedItems(newMap);
      localStorage.setItem("storedCartItems", JSON.stringify([...newMap]));
    } else {
      const newMap = new Map(selectedItems);
      newMap.forEach((_, key) => {
        newMap.set(key, true);
      });
      setSelectedItems(newMap);
      localStorage.setItem("storedCartItems", JSON.stringify([...newMap]));
    }
  };
  return { onToggle, onToggleAll };
}
