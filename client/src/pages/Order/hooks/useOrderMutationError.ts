import { useOrderContext } from '../contexts/OrderContext';

export function useOrderMutationError() {
  const { mutationError } = useOrderContext();

  return mutationError;
}
