import { useState } from "react";

export const useCheckBox = (itemIds: number[]) => {
  const [checks, setChecks] = useState<number[]>(() => {
    const saved = localStorage.getItem("checked");
    return saved ? JSON.parse(saved) : [];
  });

  const isFirstLoad = localStorage.getItem("checked") === null;

  if (checks.length === 0 && isFirstLoad && itemIds.length > 0) {
    setChecks(itemIds);
    localStorage.setItem("checked", JSON.stringify(itemIds));
  }

  const currentChecks = isFirstLoad ? itemIds : checks.filter((id) => itemIds.includes(id));

  const save = (next: number[]) => {
    localStorage.setItem("checked", JSON.stringify(next));
  };

  const toggleSelect = (id: number) => {
    const next = currentChecks.includes(id)
      ? currentChecks.filter((check) => check !== id)
      : [...currentChecks, id];
    setChecks(next);
    save(next);
  };

  const toggleAll = () => {
    const next = currentChecks.length === itemIds.length ? [] : itemIds;
    setChecks(next);
    save(next);
  };

  return { checks: currentChecks, toggleSelect, toggleAll };
};
