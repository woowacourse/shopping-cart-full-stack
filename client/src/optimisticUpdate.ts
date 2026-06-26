interface OptimisticUpdateProps {
    apiCallFn: () => Promise<unknown>;
    onSuccess: () => void;
    onError: () => void;
    afterApiSuccess?: () => void;
}

export const optimisticUpdate = async ({ apiCallFn, onSuccess, onError, afterApiSuccess }: OptimisticUpdateProps) => {
    onSuccess();
    try {
        await apiCallFn();
        afterApiSuccess?.();
    } catch {
        onError();
    }
};
