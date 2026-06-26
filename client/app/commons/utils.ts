export function formatToKoreanPrice(price: number) {
  return `${price.toLocaleString("ko-KR")}원`;
}

export async function mutate({
  api,
  onMutate,
  onSuccess,
  onError,
}: {
  api: () => Promise<void>;
  onMutate?: () => (() => void) | void;
  onSuccess?: () => void;
  onError?: (err: unknown) => void;
}): Promise<{ success: boolean; error?: unknown }> {
  const rollback = onMutate?.();
  try {
    await api();
    onSuccess?.();
    return { success: true };
  } catch (err) {
    rollback?.();
    onError?.(err);
    return { success: false, error: err };
  }
}
