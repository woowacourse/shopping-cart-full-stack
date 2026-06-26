import { useCallback, useState } from "react";

export const useFlush = () => {
  const [dummyKey, setFlush] = useState(0);

  const flush = useCallback(() => {
    setFlush((prev) => prev + 1);
  }, [setFlush]);

  return { flush, dummyKey };
};
